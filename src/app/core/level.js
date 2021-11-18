import "./level.scss";
import { LevelItem } from "./level-item";
import { direction, levelItemType } from "./constants";
const LEVEL_WIDTH = 13;
const LEVEL_HEIGHT = 13;
const SOFT_WALL_RATIO = 0.3; //30%

const LAST_FRAME = 6;
export class Level {
  #columns = [];
  #levelElement = document.createElement("div");
  #rootElement = document.getElementById("root");

  //ez a lentebbi render egy hosszabb, de érthetőbb formája
  //   render() {
  //     //itt egy mátixot állítunk elő

  //     let columns = new Array(LEVEL_WIDTH);
  //     this.#columns = columns.fill(null).map((column) => {
  //       return new Array(LEVEL_HEIGHT).fill(null).map(() => {
  //         return levelItemType.EMPTY;
  //       });
  //     });

  //     this.#levelElement.classList.add("level");
  //     this.#rootElement.appendChild(this.#levelElement);
  //   }

  render() {
    const createLevelItem = () => {
      return new LevelItem();
    };
    //itt egy mátixot állítunk elő
    const createCellGroup = (column) => {
      return new Array(LEVEL_HEIGHT).fill(null).map(createLevelItem);
    };

    this.#columns = new Array(LEVEL_WIDTH).fill(null).map(createCellGroup);

    this.#initializeWalls();

    this.#columns.forEach((column, x) => {
      const columnElement = document.createElement("div");

      column.forEach((cell, y) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        // ez azért kell, hogy ha lerakunk egy bombát, akkor rá 2 másodpercre töröljük a falat. És fontos, hova raktuk a bombát, milyen koordinátákra
        cellElement.setAttribute("id", `${x},${y}`);

        switch (cell.type) {
          case levelItemType.SOFT_WALL: {
            cellElement.classList.add("soft-wall");
            break;
          }
          case levelItemType.OUTER_WALL: {
            cellElement.classList.add("outer-wall");
            break;
          }
          case levelItemType.HARD_WALL: {
            cellElement.classList.add("hard-wall");
            break;
          }
        }
        columnElement.appendChild(cellElement);
      });
      this.#levelElement.appendChild(columnElement);
    });

    this.#levelElement.classList.add("level");

    this.#rootElement.appendChild(this.#levelElement);

    this.#animate();
  }

  armBomb(x, y) {
    const bombElement = document.createElement("div");

    bombElement.style.left = `${x * 50}`;
    bombElement.style.top = `${y * 50}`;

    bombElement.classList.add("bomb");

    this.#rootElement.appendChild(bombElement);

    // setTimeout(() => {
    //   this.#removeSoftWalls(x, y);
    //   // itt a lerakott bombát is törölni kell robbanás után
    //   bombElement.remove();
    // }, 3000);
    let frame = 1;

    const animate = () => {
      bombElement.classList.remove(`bomb-${frame}`);
      frame++;

      bombElement.classList.add(`bomb-${frame}`);

      if (frame === 18) {
        bombElement.remove();
        this.#removeSoftWalls(x, y);
        return;
      }
      setTimeout(() => {
        window.requestAnimationFrame(() => animate());
      });
    };

    setTimeout(() => {
      animate();
    }, 2000);
  }

  //itt megnézi, hogy hol van öres terület
  canMove(desireDirection, x, y) {
    let cell = null;
    console.log(desireDirection);
    switch (desireDirection) {
      case direction.UP:
        cell = this.#columns[x][y - 1];
        break;
      case direction.DOWN:
        cell = this.#columns[x][y + 1];
        break;

      case direction.RIGHT:
        cell = this.#columns[x + 1][y];
        break;

      case direction.LEFT:
        cell = this.#columns[x - 1][y];
        break;
    }
    return cell.type === levelItemType.EMPTY;
  }

  destroy() {
    this.#levelElement.remove();
  }

  #initializeWalls() {
    this.#columns.forEach((column, columnIndex) => {
      const isFirstColumn = columnIndex === 0;
      const isLastColumn = columnIndex === LEVEL_WIDTH - 1;

      column.forEach((cell, cellIndex) => {
        if (cellIndex === 6 && columnIndex === 6) {
          // a mátrix közepére ne rakjon semmit
          return;
        }

        const isFirstRow = cellIndex === 0;
        const isLastRow = cellIndex === LEVEL_HEIGHT - 1;
        const isHardWall = cellIndex % 2 === 0 && columnIndex % 2 === 0;

        if (isFirstColumn || isLastColumn || isFirstRow || isLastRow) {
          cell.type = levelItemType.OUTER_WALL;
        } else if (isHardWall) {
          cell.type = levelItemType.HARD_WALL;
        } else if (Math.random() < SOFT_WALL_RATIO) {
          cell.type = levelItemType.SOFT_WALL;
        }
      });
    });
  }

  #removeSoftWalls(x, y) {
    const nodesToRemove = [];
    const right = this.#columns[x + 1][y];

    if (right && right.type === levelItemType.SOFT_WALL) {
      right.type = levelItemType.EMPTY;
      const node = document.getElementById(`${x + 1},${y}`);

      nodesToRemove.push(node);
    }

    const left = this.#columns[x - 1][y];

    if (left && left.type === levelItemType.SOFT_WALL) {
      left.type = levelItemType.EMPTY;
      const node = document.getElementById(`${x - 1},${y}`);

      nodesToRemove.push(node);
    }

    const up = this.#columns[x][y - 1];

    if (up && up.type === levelItemType.SOFT_WALL) {
      up.type = levelItemType.EMPTY;
      const node = document.getElementById(`${x},${y - 1}`);

      nodesToRemove.push(node);
    }

    const down = this.#columns[x][y + 1];

    if (down && down.type === levelItemType.SOFT_WALL) {
      down.type = levelItemType.EMPTY;
      const node = document.getElementById(`${x},${y + 1}`);

      nodesToRemove.push(node);
    }

    nodesToRemove.forEach((node) => {
      node.classList.remove("soft-wall");
    });
  }
  #animate() {
    let frame = 1;

    const animate = () => {
      this.#levelElement.classList.remove(
        `level-${frame}`,
        `hard-wall-${frame}`
      );
      frame++;
      if (frame > LAST_FRAME) {
        frame = 1;
      }
      this.#levelElement.classList.add(`level-${frame}`, `hard-wall-${frame}`);

      const timeout = frame === LAST_FRAME ? 500 : 100;
      setTimeout(() => {
        window.requestAnimationFrame(() => animate());
      }, timeout);
    };
    animate();
  }
}
