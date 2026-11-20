/*
 * Tools (component 6): the registry every tool call goes through.
 *
 * For each call it: refuses unknown tools; checks the tool's permission against the guardrail
 * allow-list; validates the input against the tool's schema; runs the tool; validates the output;
 * and logs the call with its duration and outcome. A tool cannot be called any other way by the
 * agent, so these checks always apply.
 */
'use strict';

const { checkAction, GuardrailViolation } = require('../guardrails');

class SchemaError extends Error {
  constructor(message) { super(message); this.name = 'SchemaError'; }
}

/** A small, strict schema check: type, required properties, enums, items, string length. */
function validate(value, schema, where = 'value') {
  const t = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
  const want = schema.type;
  const ok = want === 'integer' ? Number.isInteger(value) : want === 'any' ? true : t === want;
  if (!ok) throw new SchemaError(`${where} must be ${want}, got ${t}.`);
  if (schema.enum && !schema.enum.includes(value)) throw new SchemaError(`${where} must be one of ${schema.enum.join(', ')}.`);
  if (want === 'string' && schema.maxLength && value.length > schema.maxLength) throw new SchemaError(`${where} is longer than ${schema.maxLength} characters.`);
  if (want === 'array') {
    if (schema.maxItems && value.length > schema.maxItems) throw new SchemaError(`${where} has more than ${schema.maxItems} items.`);
    if (schema.items) value.forEach((v, i) => validate(v, schema.items, `${where}[${i}]`));
  }
  if (want === 'object') {
    for (const k of schema.required || []) if (!(k in value)) throw new SchemaError(`${where}.${k} is required.`);
    for (const [k, s] of Object.entries(schema.properties || {})) if (k in value && value[k] !== undefined) validate(value[k], s, `${where}.${k}`);
  }
  return value;
}

function createRegistry({ logger, tools }) {
  const byName = new Map(tools.map((t) => [t.name, t]));

  /** The tools and their contracts, for display. */
  const list = () => tools.map(({ name, description, permission, input, output }) => ({ name, description, permission, input, output }));

  /** Call a tool by name. Throws GuardrailViolation, SchemaError or the tool's own error. */
  function invoke(name, input, deps = {}, runId = null) {
    const tool = byName.get(name);
    const meta = { runId, component: 'tools', event: `tool:${name}`, detail: { tool: name } };
    return logger.timed(meta, () => {
      if (!tool) throw new GuardrailViolation('unknown_tool', `Tool "${name}" does not exist and was refused.`);
      checkAction(tool.permission);
      validate(input, tool.input, `${name} input`);
      const output = tool.run(input, deps);
      validate(output, tool.output, `${name} output`);
      return output;
    });
  }

  return { invoke, list, get: (n) => byName.get(n) };
}

module.exports = { createRegistry, validate, SchemaError };
