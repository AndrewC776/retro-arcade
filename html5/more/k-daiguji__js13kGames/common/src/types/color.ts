export type PlainHsl = `hsl(${number} ${number} ${number})`;

export type MixedHsl = `color-mix(in hsl, ${PlainHsl}), ${PlainHsl})`;
