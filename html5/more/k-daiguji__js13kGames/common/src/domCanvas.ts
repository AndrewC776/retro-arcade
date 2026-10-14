import { createElement, querySelector } from "@/common/dom";

export const createCanvas = () =>
  querySelector("canvas") || createElement("canvas");
