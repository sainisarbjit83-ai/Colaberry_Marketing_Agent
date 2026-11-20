/*
 * Classification metrics. Pure functions over { expected, predicted } pairs; no I/O.
 *
 * Definitions (for a label L):
 *   TP = expected L and predicted L     FP = predicted L but expected something else
 *   FN = expected L but predicted something else (including a failed prediction)
 *   precision(L) = TP / (TP + FP)   "of the records called L, how many really were L"
 *   recall(L)    = TP / (TP + FN)   "of the records that really were L, how many were found"
 *   F1(L)        = 2TP / (2TP + FP + FN), the harmonic mean of precision and recall
 *   accuracy     = correct / total
 *   macro-average = the plain mean over labels, counting only labels where the metric is defined
 *
 * Zero denominators: the metric is reported as null (not 0) with a reason, because "undefined" and
 * "zero" mean different things. F1 is undefined only when L appears nowhere, in expected or
 * predicted; if L was never predicted but does occur, F1 is 0. A failed prediction (null) counts as
 * wrong and as a false negative for its expected label, and is shown in an "error" column.
 */
'use strict';

const ERROR = 'error';
const round = (x) => Math.round(x * 10000) / 10000;

/** { value, numerator, denominator }, or value null with the reason when the denominator is 0. */
function ratio(numerator, denominator, reason) {
  return denominator === 0 ? { value: null, numerator, denominator, reason } : { value: round(numerator / denominator), numerator, denominator };
}

const predictedOf = (p) => (p.predicted == null ? ERROR : p.predicted);

function accuracy(pairs) {
  return ratio(pairs.filter((p) => p.predicted === p.expected).length, pairs.length, 'The benchmark is empty.');
}

function perLabel(pairs, label) {
  let tp = 0, fp = 0, fn = 0;
  for (const p of pairs) {
    const pred = predictedOf(p);
    if (p.expected === label && pred === label) tp += 1;
    else if (pred === label) fp += 1;
    else if (p.expected === label) fn += 1;
  }
  return {
    tp, fp, fn, support: tp + fn,
    precision: ratio(tp, tp + fp, `No record was predicted as "${label}".`),
    recall: ratio(tp, tp + fn, `No benchmark record is expected to be "${label}".`),
    f1: ratio(2 * tp, 2 * tp + fp + fn, `"${label}" appears neither in the expected nor in the predicted labels.`),
  };
}

/** Rows are expected labels, columns predicted labels (plus "error" when any prediction failed). */
function confusionMatrix(pairs, labels) {
  const columns = pairs.some((p) => p.predicted == null) ? [...labels, ERROR] : [...labels];
  const matrix = Object.fromEntries(labels.map((e) => [e, Object.fromEntries(columns.map((c) => [c, 0]))]));
  for (const p of pairs) if (matrix[p.expected]) matrix[p.expected][predictedOf(p)] += 1;
  return { rows: [...labels], columns, matrix };
}

/** Mean of the defined values of one metric across labels. */
function macro(per, metric) {
  const values = Object.values(per).map((x) => x[metric].value).filter((v) => v !== null);
  return { value: values.length ? round(values.reduce((a, b) => a + b, 0) / values.length) : null, labelsIncluded: values.length, labelsTotal: Object.keys(per).length };
}

/** Every metric for a set of pairs over the given labels. */
function evaluatePairs(pairs, labels) {
  const per = Object.fromEntries(labels.map((l) => [l, perLabel(pairs, l)]));
  return {
    total: pairs.length,
    correct: pairs.filter((p) => p.predicted === p.expected).length,
    failed: pairs.filter((p) => p.predicted == null).length,
    accuracy: accuracy(pairs),
    perLabel: per,
    macro: { precision: macro(per, 'precision'), recall: macro(per, 'recall'), f1: macro(per, 'f1') },
    confusion: confusionMatrix(pairs, labels),
  };
}

module.exports = { ratio, accuracy, perLabel, confusionMatrix, macro, evaluatePairs, ERROR };
