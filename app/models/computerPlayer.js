import { player } from "./player.js";
import { getRandomCoords } from "./utils.js";

function computerPlayer(name = "PC") {
  const shipFound = new Map();
  const lastMove = {
    coords: null,
    shipHit: null,
  };
  const directions = {
    up: {
      transformCoords: (coords) => [coords[0] - 1, coords[1]],
      oppositeDirection: "down",
    },
    right: {
      transformCoords: (coords) => [coords[0], coords[1] + 1],
      oppositeDirection: "left",
    },
    down: {
      transformCoords: (coords) => [coords[0] + 1, coords[1]],
      oppositeDirection: "up",
    },
    left: {
      transformCoords: (coords) => [coords[0], coords[1] - 1],
      oppositeDirection: "right",
    },
  };

  function attack(enemyBoard) {
    if (shipFound.size === 0) {
      const attackRes = randomAttack(enemyBoard);
      if (attackRes.shipHit === true && !attackRes.adjacentCoords) {
        lastMove.shipHit = true;
        shipFound.set("startingCoords", lastMove.coords);
      }

      return attackRes;
    } else return attackShip(enemyBoard);
  }

  function randomAttack(enemyBoard) {
    const boardLen = enemyBoard.getBoard().length - 1;
    let coords;
    do {
      coords = getRandomCoords(boardLen);
    } while (enemyBoard.isBoxAttacked(coords) === true);

    lastMove.coords = coords;
    return enemyBoard.receiveAttack(coords);
  }

  function attackShip(enemyBoard) {
    // If you don't know the direction of the ship found you have to
    // attack each box following clockwise to get it
    let coords, attackRes;
    if (!shipFound.has("direction")) {
      const shipCoords = shipFound.get("startingCoords");
      for (const prop in directions) {
        coords = getCoordsByDirection(prop, shipCoords);
        attackRes = enemyBoard.receiveAttack(coords);
        if (!attackRes) continue;

        if (attackRes.shipHit) shipFound.set("direction", prop);
        break;
      }
    } else {
      // Get new coords based on the direction of the ship found
      const attackDir = shipFound.get("direction");
      coords = getCoordsByDirection(attackDir, lastMove.coords);

      // When the box has been attacked before OR
      // the last move didn't hit a ship you have to change the direction
      if (
        enemyBoard.isBoxAttacked(coords) === true ||
        lastMove.shipHit === false
      ) {
        changeAttackDirection();
        coords = getCoordsByDirection(
          shipFound.get("direction"),
          shipFound.get("startingCoords")
        );
      }

      attackRes = enemyBoard.receiveAttack(coords);
      lastMove.shipHit = attackRes.shipHit === true ? true : false;
    }

    // If the ship is sunk go back to attack a random position...
    if (attackRes.adjacentCoords) shipFound.clear();

    lastMove.coords = coords;
    return attackRes;
  }

  const changeAttackDirection = () => {
    const prevDir = shipFound.get("direction");
    shipFound.set("direction", directions[prevDir].oppositeDirection);
  };

  const getCoordsByDirection = (direction, coords) => {
    return directions[direction].transformCoords(coords);
  };

  // Inherit from player
  const newPlayer = player(name);
  return {
    ...newPlayer,
    attack,
    get getLastCoords() {
      return lastMove.coords;
    },
  };
}

export { computerPlayer };
