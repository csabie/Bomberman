import "./exit-screen.scss";
export class ExitScreen {
  render() {
    const exitScreemElement = document.createElement("div");
    exitScreemElement.classList.add("exit-screen");
    const rootElement = document.getElementById("root");

    rootElement.appendChild(exitScreemElement);
  }
}
