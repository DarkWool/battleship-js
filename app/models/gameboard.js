import { HORIZONTAL, VERTICAL, getRandomCoords } from "./utils.js";
import { ship } from "./ship.js";


function gameboard() {
    const board = [];
    let ships = [];
    
    const HIT_MARK = "X";
    const MISSED_MARK = "/";
    
    for (let i = 0; i < 10; i++) {
        const row = Array.from({ length: 10 }, x => "");
        board.push(row);
    }

    const getBoard = () => board;

    function placeShip(coords, length, axis = HORIZONTAL) {
        if (canShipBePlaced(coords, length, axis) === false) return false;
        
        const newShip = {
            beginningCoords: coords,
            ship: ship(length, axis)
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
        const isHorizontal = (axis === HORIZONTAL) ? true : false;
        const boardLen = board.length - 1;

        if (shipLen <= 0 ||
            !areCoordsValid(coords) ||
            (isHorizontal && (coords[1] + (shipLen - 1) > boardLen)) ||
            (!isHorizontal && (coords[0] + (shipLen - 1) > boardLen))) {
            return false;
        } else {
            return forEachAdjacentAndShipBox(coords, shipLen, axis, (boxCoords) => {
                const box = board[boxCoords[0]][boxCoords[1]];
                if (typeof box === "object") return false;
            });
        }
    }

    function removeShip(coords) {
        if (!areCoordsValid(coords)) return null;

        const shipToRemove = board[coords[0]][coords[1]];
        board.forEach((row, rowIndex) => {
            row.forEach((box, boxIndex) => {
                if (box === shipToRemove) board[rowIndex][boxIndex] = "";
            });
        });

        ships.splice(ships.indexOf(shipToRemove), 1);
    }

    function receiveAttack(coords) {
        const [coordY, coordX] = coords;
        const result = { shipHit: null };

        if (typeof board[coordY][coordX] === "object") {
            const box = board[coordY][coordX];
            const ship = box.ship;
            ship.hit();
            board[coordY][coordX] = HIT_MARK;

            if (ship.isSunk()) {
                result.adjacentCoords =
                    getAndAttackAdjacentBoxes(box.beginningCoords, ship.length, ship.axis);
            }
            result.shipHit = true;
        } else {
            // Record a missed shot on the board
            board[coordY][coordX] = MISSED_MARK;
            result.shipHit = false;
        }
        
        return result;
    }

    function forEachAdjacentAndShipBox(coords, shipLen, shipAxis, callback) {
        let y = coords[0] - 1;
        let x = coords[1] - 1;
        const finalPos = shipLen + 2;
        if (shipAxis === HORIZONTAL) {
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

    function getAndAttackAdjacentBoxes(beginningCoords, shipLen, shipAxis) {
        const boxesCoords = [];
        forEachAdjacentAndShipBox(beginningCoords, shipLen, shipAxis, (coords) => {
            if (board[coords[0]][coords[1]] !== "") return;
            board[coords[0]][coords[1]] = MISSED_MARK;
            boxesCoords.push(coords);
        });

        return boxesCoords;
    }

    function randomize(shipsToPlace) {
        reset();

        const boardLen = board.length - 1;
        shipsToPlace.forEach(shipLen => {
            let coords, axis;
            do {
                coords = getRandomCoords(boardLen);
                axis = (Math.random() > 0.5) ? HORIZONTAL : VERTICAL;
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
        const box = board[coords[0]][coords[1]];
        return (box === MISSED_MARK || box === HIT_MARK) ? true : false;
    }

    function areCoordsValid(coords) {
        const boardLen = board.length - 1;
        return coords.every(coord => (
            typeof coord === "number" && coord >= 0 && coord <= boardLen
        ));
    }

    const getBoxAt = coords => board[coords[0]][coords[1]];

    const areAllShipsSunk = () => ships.every(obj => obj.ship.isSunk());

    return {
        getBoard,
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

export {
    gameboard
};
