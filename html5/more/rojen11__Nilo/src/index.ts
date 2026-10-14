import Game from './game';
import Menu from './menu';
import './ZzFX.micro';

const game = new Game();
const menu = new Menu(game);
game.begin();
menu.show();
