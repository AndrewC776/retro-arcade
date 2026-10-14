const sum = (values: number[]) =>
  values.reduce((total, value) => total + value, 0);

const average = (values: number[]) =>
  values.length ? sum(values) / values.length : 0;

const max = (...values: number[]) => Math.max(...values);
// Equal: values.reduce((a, b) => a > b ? a : b, -Infinity);

const min = (...values: number[]) => Math.min(...values);
// Equal: values.reduce((a, b) => a < b ? a : b, Infinity);

// const round = (value: number) => Math.round(value);
const round = Math.round;

const sqrt = (value: number) => Math.sqrt(value);

const calculateVariance = (values: number[]) => {
  const avg = average(values);
  return values.map((value) => (value - avg) ** 2);
};

const standardDeviation = (values: number[]) =>
  sqrt(average(calculateVariance(values)));

const unbiasedStandardDeviation = (values: number[]) =>
  sqrt(sum(calculateVariance(values)) / max(1, values.length - 1));

const totalForce = (x: number, y: number) => Math.sqrt(x ** 2 + y ** 2);

const combination = <T>(values: T[]): [T, T][] => {
  const [value, ...args] = values;
  return value && args.length
    ? [...args.map((arg): [T, T] => [value, arg]), ...combination(args)]
    : [];
};

export {
  average,
  combination,
  max,
  min,
  round,
  sum,
  standardDeviation,
  totalForce,
  unbiasedStandardDeviation,
};
