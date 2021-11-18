import "./portal.scss";

const TOTAL_ANIMATION_FRAME = 12; //mert a portal kép 12 frame-ből áll. Ezeket a frame-ket váltogatjuk majd
export class Portal {
  x = 1;
  y = 1;
  #portalElement = document.createElement("div");
  constructor() {
    this.x = this.#getRandomIndex();
    this.y = this.#getRandomIndex();
  }
  render() {
    this.#portalElement.classList.add("portal", "portal-1");
    this.#portalElement.style.left = `${this.x * 50}px`;
    this.#portalElement.style.top = `${this.y * 50}px`;

    const rootElement = document.getElementById("root");

    rootElement.appendChild(this.#portalElement);
    this.#animate();
  }

  destroy() {
    this.#portalElement.remove();
  }

  #animate() {
    let frame = 1;

    const animate = () => {
      this.#portalElement.classList.remove(`portal-${frame}`);

      if (frame === TOTAL_ANIMATION_FRAME) {
        frame = 1;
      }

      frame++;
      this.#portalElement.classList.add(`portal-${frame}`);

      setTimeout(() => {
        window.requestAnimationFrame(() => animate());
      }, 100);
    };

    animate();
  }

  #getRandomIndex() {
    const minIndex = 1;
    const maxIndex = 11;

    const index = Math.random() * (maxIndex - minIndex) + 1;
    const roundedIndex = Math.floor(index);

    // ez azért kell, hogy sose legyen a HARD_WALL helyén
    if (roundedIndex % 2 === 0) {
      return roundedIndex + 1;
    }

    return roundedIndex;
  }
}
