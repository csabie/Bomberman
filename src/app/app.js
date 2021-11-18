// import { Level } from "./core/level";
// import { Player } from "./core/player";
// import "./app.scss";

// window.addEventListener("DOMContentLoaded", () => {
//   const level = new Level();
//   level.render();

//   const player = new Player();
//   player.render();
// });

import "./app.scss";
import { Game } from "./core/game";

const game = new Game();
game.init();
