import splashScreenJpg from "../../assets/splash-screen.jpg";
const MAX_FRAMES = 2;
const HALF_SECOND = 500;

export class SplashScreen {
  #intervalId = null;
  #splashElement = document.createElement("div");

  render() {
    const styleElement = document.createElement("style");

    styleElement.innerHTML = `
      .splash-screen{
            background: url(${splashScreenJpg}) no-repeat;
            width: 650px;
            height: 650px;
        }
        .splash-screen-1{
          background-position-x: 0px;
        }

       .splash-screen-2{
          background-position-x: -650px;
        }
    `;

    document.head.appendChild(styleElement);
    //class hozzáadása
    //itt van egy nagyobb kép és az a kép szét van választva(2 frame-ből áll). Amikor a splash-screen-1-et használjuk
    //akkor egy kicsit más képet kapunk mint amikor a splash-screen-2-őt
    this.#splashElement.classList.add("splash-screen", "splash-screen-1");

    // const body = document.body;
    // body.appendChild(splashElement);
    const rootElement = document.getElementById("root");
    rootElement.appendChild(this.#splashElement);

    this.#animate();
  }

  destroy() {
    this.#splashElement.remove();
    window.clearInterval(this.#intervalId);
  }

  #animate() {
    let frame = 1;

    const animate = () => {
      this.#splashElement.classList.remove(`splash-screen-${frame}`);
      if (frame >= MAX_FRAMES) {
        frame = 0;
      }

      frame++;
      this.#intervalId = this.#splashElement.classList.add(
        `splash-screen-${frame}`
      );
    };
    setInterval(animate, HALF_SECOND);
  }
}
