import { gameboard } from "./gameboard.js";

function player(_name) {
  if (typeof _name !== "string" || _name === "") return null;

  const _board = gameboard();
  const attack = (enemyBoard, coords) => enemyBoard.receiveAttack(coords);

  return {
    get name() {
      return _name;
    },
    get board() {
      return _board;
    },
    attack,
  };
}

export { player };
