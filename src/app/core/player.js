import "./player.scss";
import { direction } from "../core/constants";

const MAX_FRAME = 4;

export class Player {
  x = 1;
  y = 1;
  #direction = null;
  #playerElement = document.createElement("div");
  #frame = 1;

  render() {
    this.#playerElement.classList.add("player");
    this.#playerElement.style.transform = `translate(${this.x * 50}px, ${
      this.y * 50
    }px)`;

    const rootElement = document.getElementById("root");
    rootElement.appendChild(this.#playerElement);
  }

  destroy() {
    this.#playerElement.remove();
  }

  move(newDirection, canMove) {
    this.#direction = newDirection;

    if (!canMove) {
      window.requestAnimationFrame(() => this.#update());
      return;
    }

    switch (newDirection) {
      case direction.LEFT:
        this.x = this.x - 1;
        break;
      case direction.RIGHT:
        this.x = this.x + 1;

        break;
      case direction.UP:
        this.y = this.y - 1;
        break;
      case direction.DOWN:
        this.y = this.y + 1;

        break;
    }
    window.requestAnimationFrame(() => this.#update());
  }

  #update() {
    this.#frame++;

    if (this.#frame > MAX_FRAME) {
      this.#frame = 1;
    }
    this.#playerElement.className = "player";
    this.#playerElement.classList.add(`${this.#direction}-${this.#frame}`);

    this.#playerElement.style.transform = `translate(${this.x * 50}px, ${
      this.y * 50
    }px)`;
  }
}
