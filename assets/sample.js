/*
 * SAMPLE DATA. Made up, so the page's shape can be seen on day one.
 * Nothing here describes this project. Every screen that shows it says SAMPLE.
 * It is kept in this one file so it can never leak into real mode.
 */
window.CC = window.CC || {};

CC.sampleData = function sampleData() {
  const story = (id, release, title, due, baseline) => ({
    id, release, title, due_on: due, due_baseline_on: baseline, owner_agent: 'Sample intake agent',
    narrative: `As a sample coordinator, I want ${title.toLowerCase()} so that the sample flow works.`,
    acceptance: [`Given a sample request, when ${title.toLowerCase()} runs, then the sample result is recorded.`],
    failure_paths: ['The sample service is unavailable.'],
  });
  return {
    plan: {
      schema_version: 2,
      project: { name: 'Sample project', descriptor: 'An example system, made up for the sample view.', plan_version: 1 },
      schedule: { build_start: '2026-09-01', build_end: '2026-12-15', demo_day: '2026-12-18', demo_release_key: 's2' },
      releases: [
        { key: 's1', name: 'Sample release one', starts_on: '2026-09-01', ends_on: '2026-10-15', story_ids: ['S-1', 'S-2', 'S-3'], is_demo_target: false },
        { key: 's2', name: 'Sample release two', starts_on: '2026-10-16', ends_on: '2026-12-15', story_ids: ['S-4', 'S-5'], is_demo_target: true },
      ],
      stories: [
        story('S-1', 's1', 'Capture a sample request', '2026-09-20', '2026-09-20'),
        story('S-2', 's1', 'Check a sample request', '2026-10-01', '2026-09-25'),
        story('S-3', 's1', 'Route a sample request', '2026-10-10', '2026-10-10'),
        story('S-4', 's2', 'Report on sample requests', '2026-11-20', '2026-11-15'),
        story('S-5', 's2', 'Never send a sample request twice', '2026-12-10', '2026-12-10'),
      ],
      requirements: [
        { id: 'SR-1', statement: 'Sample requests are captured.', kind: 'FEATURE', priority: 'must', cluster: 'Sample intake', fulfilled_by: ['S-1', 'S-2'] },
        { id: 'SR-2', statement: 'No sample request is sent twice.', kind: 'SAFE', priority: 'must', cluster: 'Sample intake', fulfilled_by: ['S-5'] },
        { id: 'SR-3', statement: 'Sample reports exist.', kind: 'FEATURE', priority: 'must', cluster: 'Sample reporting', fulfilled_by: [] },
      ],
      agents: [{
        name: 'Sample intake agent', purpose: 'Sorts sample requests.', trigger_type: 'event', trigger: 'A sample request arrives',
        inputs: ['sample request'], outputs: ['sample route'], autonomy_level: 'suggest', approval_gates: ['A person approves each route'],
        escalation_rules: ['Unknown requests go to a person'], skills: [], owns: ['S-1', 'S-2', 'S-3', 'S-4', 'S-5'],
      }],
      derived: {
        measures: [{ id: 'SM-1', statement: 'Sample requests routed within a day.' }],
        roles: ['sample coordinator'],
        guardrails: [{ id: 'SR-2', statement: 'No sample request is sent twice.' }],
        systems: ['Sample CRM', 'Sample email service'],
        counts: { agents_by_autonomy: { suggest: 1 } },
      },
    },
    progress: {
      schema_version: 2,
      totals: {
        stories_total: 5, stories_verified: 2, stories_submitted: 1, stories_in_progress: 1,
        stories_not_started: 1, criteria_total: 14, criteria_passed: 7, points_awarded: 20,
      },
      stories: [
        { id: 'S-1', criteria: [{ text: 'sample', passed: true }], verification: { state: 'verified' } },
        { id: 'S-2', criteria: [{ text: 'sample', passed: true }], verification: { state: 'verified' } },
        { id: 'S-3', criteria: [{ text: 'sample', passed: true }], verification: { state: 'submitted' } },
        { id: 'S-4', criteria: [{ text: 'sample', passed: false }], verification: { state: 'in_progress' } },
        { id: 'S-5', criteria: [{ text: 'sample', passed: false }], verification: { state: 'not_started' } },
      ],
    },
    manifest: { generated_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  };
};
