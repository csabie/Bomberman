import { Level } from "./level";
import { Player } from "./player";
import { keyEventDirection, SPACE_KEY_FROM_EVENT } from "./constants";
import { Portal } from "./portal";
import { ExitScreen } from "./exit-screen";
import { SplashScreen } from "./splash-screen";
import { soundtrackAudio } from "../../assets/soundtrack.mp3";
import armBombAudio from "../../assets/arm-bomb.mp3";
export class Game {
  #level = new Level();
  #player = new Player();
  #portal = new Portal();
  #exitScreen = new ExitScreen();
  #splashScreen = new SplashScreen();
  #handleKeyDown = (event) => undefined;

  #audio = {
    game: {
      audioElement: document.createElement("audio"),
      sourceElement: document.createElement("source"),
    },
    bomb: {
      audioElement: document.createElement("audio"),
      sourceElement: document.createElement("source"),
    },
  };

  init() {
    this.#addKeyListener();

    this.#level.render();
    this.#player.render();
    this.#portal.render();
    this.#startSoundEffects();
    this.#audio.game.audioElement.play();
  }

  #startSoundEffects() {
    this.#audio.game.sourceElement.src = soundtrackAudio;
    this.#audio.game.sourceElement.type = "audio/mpeg";
    this.#audio.game.audioElement.setAttribute("loop", "");
    this.#audio.game.audioElement.setAttribute("autoplay", "");
    this.#audio.game.audioElement.appendChild(this.#audio.game.sourceElement);

    this.#audio.bomb.sourceElement.src = armBombAudio;
    this.#audio.bomb.sourceElement.type = "audio/mpeg";
    this.#audio.bomb.audioElement.appendChild(this.#audio.bomb.sourceElement);

    const rootElement = document.getElementById("root");
    rootElement.appendChild(this.#audio.game.audioElement);
  }
  #addKeyListener() {
    this.#handleKeyDown = (event) => {
      if (event.key === SPACE_KEY_FROM_EVENT) {
        this.#level.armBomb(this.#player.x, this.#player.y);
        this.#audio.bomb.sourceElement.src = armBombAudio;
        this.#audio.bomb.sourceElement.type = "audio/mpeg";

        this.#audio.bomb.audioElement.play();

        return;
      }

      //ez meggétolja, hogy a figuránk kimenjen a világból.
      const direction = keyEventDirection[event.key];
      const canMove = this.#level.canMove(
        direction,
        this.#player.x,
        this.#player.y
      );

      this.#player.move(direction, canMove);
      console.log(this.#player.x, this.#player.y);
      console.log(this.#portal.y, this.#portal.y);

      if (
        this.#player.x === this.#portal.x &&
        this.#player.y === this.#portal.y
      ) {
        this.#exitGame();
      }
    };
    document.addEventListener("keydown", this.#handleKeyDown);
  }

  #removeKeyListener() {
    document.removeEventListener("keydown", this.#handleKeyDown);
  }

  #exitGame() {
    this.#removeKeyListener();
    this.#level.destroy();
    this.#player.destroy;
    this.#portal.destroy();
    this.#exitScreen.render();
  }
}
