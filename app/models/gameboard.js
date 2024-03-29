import { HORIZONTAL, VERTICAL, getRandomCoords } from "./utils.js";
import { ship } from "./ship.js";

function gameboard() {
  const board = [];
  let ships = [];

  const HIT_MARK = "X";
  const MISSED_MARK = "/";

  for (let i = 0; i < 10; i++) {
    const row = Array.from({ length: 10 }, (x) => "");
    board.push(row);
  }

  const getBoard = () => board;

  const getPlacedShipsCount = () => ships.length;

  const getBoxAt = (coords) => board[coords[0]][coords[1]];

  function placeShip(coords, length, axis = HORIZONTAL) {
    if (canShipBePlaced(coords, length, axis) === false) return false;

    const newShip = {
      beginningCoords: coords,
      ship: ship(length, axis),
    };
    ships.push(newShip);

    // Place ship
    const [coordY, coordX] = coords;
    if (axis === HORIZONTAL) {
      for (let i = 0; i < length; i++) {
        board[coordY][coordX + i] = newShip;
      }
    } else {
      for (let i = 0; i < length; i++) {
        board[coordY + i][coordX] = newShip;
      }
    }

    return true;
  }

  function canShipBePlaced(coords, shipLen, axis) {
    const isHorizontal = axis === HORIZONTAL ? true : false;
    const boardLen = board.length - 1;

    if (
      shipLen <= 0 ||
      !areCoordsValid(coords) ||
      (isHorizontal && coords[1] + (shipLen - 1) > boardLen) ||
      (!isHorizontal && coords[0] + (shipLen - 1) > boardLen)
    ) {
      return false;
    } else {
      const shipData = {
        coords,
        len: shipLen,
        axis,
      };

      return forEachAdjacentAndShipBox(shipData, (boxCoords) => {
        const box = board[boxCoords[0]][boxCoords[1]];
        if (typeof box === "object") return false;
      });
    }
  }

  function removeShip(coords) {
    if (!areCoordsValid(coords)) return null;

    const obj = board[coords[0]][coords[1]];
    const beginningCoords = obj.beginningCoords;
    const shipLen = obj.ship.length;

    if (obj.ship.axis === HORIZONTAL) {
      for (let i = 0; i < shipLen; i++) {
        board[beginningCoords[0]][beginningCoords[1] + i] = "";
      }
    } else {
      for (let i = 0; i < shipLen; i++) {
        board[beginningCoords[0] + i][beginningCoords[1]] = "";
      }
    }

    ships.splice(ships.indexOf(obj), 1);
  }

  function receiveAttack(coords) {
    if (isBoxAttacked(coords) === true) return null;

    const [coordY, coordX] = coords;
    const result = { shipHit: null };

    if (typeof board[coordY][coordX] === "object") {
      const box = board[coordY][coordX];
      const ship = box.ship;
      ship.hit();
      board[coordY][coordX] = HIT_MARK;

      if (ship.isSunk()) {
        result.beginningCoords = box.beginningCoords;
        result.ship = box.ship;
        result.adjacentCoords = getAndAttackAdjacentBoxes({
          coords: box.beginningCoords,
          len: ship.length,
          axis: ship.axis,
        });
      }
      result.shipHit = true;
    } else {
      // Record a missed shot on the board
      board[coordY][coordX] = MISSED_MARK;
      result.shipHit = false;
    }

    return result;
  }

  function forEachAdjacentAndShipBox(shipData, callback) {
    let y = shipData.coords[0] - 1;
    let x = shipData.coords[1] - 1;
    const finalPos = shipData.len + 2;
    if (shipData.axis === HORIZONTAL) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < finalPos; j++) {
          try {
            if (callback([y + i, x + j]) === false) return false;
          } catch {
            continue;
          }
        }
      }
    } else {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < finalPos; j++) {
          try {
            if (callback([y + j, x + i]) === false) return false;
          } catch {
            continue;
          }
        }
      }
    }

    return true;
  }

  function getAndAttackAdjacentBoxes(data) {
    const boxesCoords = [];
    forEachAdjacentAndShipBox(data, (coords) => {
      if (board[coords[0]][coords[1]] !== "") return;
      board[coords[0]][coords[1]] = MISSED_MARK;
      boxesCoords.push(coords);
    });

    return boxesCoords;
  }

  function randomize(shipsToPlace) {
    reset();

    const boardLen = board.length - 1;
    shipsToPlace.forEach((shipLen) => {
      let coords, axis;
      do {
        coords = getRandomCoords(boardLen);
        axis = Math.random() > 0.5 ? HORIZONTAL : VERTICAL;
      } while (placeShip(coords, shipLen, axis) === false);
    });
  }

  function reset() {
    ships = [];
    board.forEach((row, rowIndex) => {
      row.forEach((box, boxIndex) => {
        board[rowIndex][boxIndex] = "";
      });
    });
  }

  function isBoxAttacked(coords) {
    try {
      const box = board[coords[0]][coords[1]];
      return box === MISSED_MARK || box === HIT_MARK || box == null
        ? true
        : false;
    } catch {
      return true;
    }
  }

  function areCoordsValid(coords) {
    const boardLen = board.length - 1;
    return coords.every(
      (coord) => typeof coord === "number" && coord >= 0 && coord <= boardLen
    );
  }

  const areAllShipsSunk = () => ships.every((obj) => obj.ship.isSunk());

  return {
    getBoard,
    getPlacedShipsCount,
    placeShip,
    canShipBePlaced,
    removeShip,
    receiveAttack,
    randomize,
    getBoxAt,
    isBoxAttacked,
    areAllShipsSunk,
  };
}

export { gameboard };
