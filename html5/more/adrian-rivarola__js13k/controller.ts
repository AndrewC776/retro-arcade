import game from "./game";

const KEYBOARD: Record<string, { state: boolean; active: boolean }> = {};

onkeydown = onkeyup = (ev) => {
  const key = ev.key.toLowerCase();
  const newState = ev.type[3] === "d";

  if (newState !== KEYBOARD[key]?.state) {
    KEYBOARD[key] = {
      state: newState,
      active: newState,
    };
  }

  if (KEYBOARD["p"]?.active) {
    game.isPaused = !game.isPaused;
    KEYBOARD["p"].active = false;
  }
};

export class KeyboardController implements Controller {
  constructor(protected keys: string | string[]) {}

  get up() {
    return KEYBOARD[this.keys[0]]?.active;
  }
  get down() {
    return KEYBOARD[this.keys[1]]?.active;
  }
  get left() {
    return KEYBOARD[this.keys[2]]?.active;
  }
  get right() {
    return KEYBOARD[this.keys[3]]?.active;
  }
  get action() {
    return KEYBOARD[this.keys[4]]?.active;
  }
  get release() {
    return KEYBOARD[this.keys[5]]?.active;
  }
  set action(active: boolean) {
    KEYBOARD[this.keys[4]].active = active;
  }
}

export class VirtualController extends KeyboardController {
  constructor() {
    super(["VUP", "VDOWN", "VLEFT", "VRIGHT", "VACTION", "VDROP"]);
    this.init();
  }

  init() {
    const div = document.createElement("div");
    const buttons = (this.keys as string[]).map(() =>
      document.createElement("button")
    );

    buttons.forEach((button, i) => {
      button.ontouchstart = button.onmousedown = () => {
        KEYBOARD[this.keys[i]] = {
          state: true,
          active: true,
        };
      };
      button.onmouseout = button.ontouchend = button.onmouseup = () => {
        KEYBOARD[this.keys[i]] = {
          state: false,
          active: false,
        };
      };
      button.className = `vc ${this.keys[i]}`;
      button.innerText = this.keys[i][1];
      div.appendChild(button);
    });

    document.body.appendChild(div);
  }
}
