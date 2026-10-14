var jsnes = {
  Controller: Controller,
  NES: NES,
};

if (typeof globalThis !== "undefined") {
  globalThis.jsnes = jsnes;
} else if (typeof window !== "undefined") {
  window.jsnes = jsnes;
}
