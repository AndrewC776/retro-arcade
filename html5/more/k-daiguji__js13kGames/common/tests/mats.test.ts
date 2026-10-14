import { describe, expect, it } from "vitest";

import {
  average,
  max,
  min,
  standardDeviation,
  sum,
  unbiasedStandardDeviation,
} from "@/common/math";

describe("average", () => {
  it.each([
    [[-1, -2, -3], -2],
    [[-1, -2], -1.5],
    [[-1], -1],
    [[], 0],
    [[1], 1],
    [[1, 2], 1.5],
    [[1, 2, 3], 2],
    [[1 / 3, 2 / 3, 3 / 3], 2 / 3],
    [[NaN], NaN],
  ])("when given [%s], returns %s.", (inputs, expected) =>
    expect(average(inputs)).toBe(expected),
  );
});

describe("max", () => {
  it.each([
    [[-1, -2, -3], -1],
    [[-1, -2], -1],
    [[-1], -1],
    [[], -Infinity],
    [[1], 1],
    [[1, 2], 2],
    [[1, 2, 3], 3],
    [[1 / 3, 2 / 3, 3 / 3], 1],
    [[NaN], NaN],
  ])("when given [%s], returns %s.", (inputs, expected) =>
    expect(max(...inputs)).toBe(expected),
  );
});

describe("min", () => {
  it.each([
    [[-1, -2, -3], -3],
    [[-1, -2], -2],
    [[-1], -1],
    [[], Infinity],
    [[1], 1],
    [[1, 2], 1],
    [[1, 2, 3], 1],
    [[1 / 3, 2 / 3, 3 / 3], 1 / 3],
    [[NaN], NaN],
  ])("when given [%s], returns %s.", (inputs, expected) =>
    expect(min(...inputs)).toBe(expected),
  );
});

describe("standard deviation", () => {
  it.each([
    [[-1, -2, -3], 0.816496580927726],
    [[-1, -2], 0.5],
    [[-1], 0],
    [[], 0],
    [[1], 0],
    [[1, 2], 0.5],
    [[1, 2, 3], 0.816496580927726],
    [[1 / 3, 2 / 3, 3 / 3], 0.2721655269759087],
    [[NaN], NaN],
  ])("when given [%s], returns %s.", (inputs, expected) =>
    expect(standardDeviation(inputs)).toBe(expected),
  );
});

describe("sum", () => {
  it.each([
    [[-1, -2, -3], -6],
    [[-1, -2], -3],
    [[-1], -1],
    [[], 0],
    [[1], 1],
    [[1, 2], 3],
    [[1, 2, 3], 6],
    [[1 / 3, 2 / 3, 3 / 3], 2],
    [[NaN], NaN],
  ])("when given [%s], returns %s.", (inputs, expected) =>
    expect(sum(inputs)).toBe(expected),
  );
});

describe("unbiased standard deviation", () => {
  it.each([
    [[-1, -2, -3], 1],
    [[-1, -2], 0.7071067811865476],
    [[-1], 0],
    [[], 0],
    [[1], 0],
    [[1, 2], 0.7071067811865476],
    [[1, 2, 3], 1],
    [[1 / 3, 2 / 3, 3 / 3], 0.33333333333333337],
    [[NaN], NaN],
  ])("when given [%s], returns %s.", (inputs, expected) =>
    expect(unbiasedStandardDeviation(inputs)).toBe(expected),
  );
});
