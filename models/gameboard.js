import { HORIZONTAL, getRandomCoords } from "./utils.js";
import { ship } from "./ship.js";


function gameboard() {
    const board = [];
    let ships = [];
    
    for (let i = 0; i < 10; i++) {
        const row = Array.from({ length: 10 }, (x) => "");
        board.push(row);
    }

    function reset() {
        ships = [];
        board.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                board[rowIndex][colIndex] = "";
            });
        });
    }

    function placeShip(coords, length, axis) {
        const isHorizontal = (axis === HORIZONTAL) ? true : false;
        if (canShipBePlaced(coords, length, isHorizontal) === false) return false;
        
        const newShip = {
            beginningCoords: coords,
            ship: ship(length, axis)
        };
        ships.push(newShip);
        
        // Place ship
        const [coordY, coordX] = coords;
        for (let i = 0; i < length; i++) {
            if (isHorizontal) {
                board[coordY][coordX + i] = newShip;
            } else {
                board[coordY + i][coordX] = newShip;
            }
        }

        return true;
    }

    function canShipBePlaced(coords, shipLen, isHorizontal) {
        const boardLen = board.length - 1;

        if (shipLen <= 0 ||
            (isHorizontal && (coords[1] + (shipLen - 1) > boardLen)) ||
            (!isHorizontal && (coords[0] + (shipLen - 1) > boardLen))) {
            return false;
        } else if (!coords.every(coord => coord >= 0 && coord <= boardLen)) return false;

        // Check if the new ship coords are not taken by another ship 
        // or are outside the board's bounds
        let y = coords[0] - 1;
        let x = coords[1] - 1;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < shipLen + 2; j++) {
                try {
                    const box = (isHorizontal) ?
                        board[y + i][x + j] :
                        board[y + j][x + i];
                    
                    if (typeof box === "object") return false;
                } catch {
                    continue;
                }
            }
        }
    }

    function removeShip(coords) {
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
            board[coordY][coordX] = "X";

            if (ship.isSunk()) {
                result.adjacentCoords = attackAdjacentTiles(box.beginningCoords, ship);
            }
            result.shipHit = true;
        } else {
            // Record a missed shot on the board
            board[coordY][coordX] = "/";
            result.shipHit = false;
        }
        
        return result;
    }

    function attackAdjacentTiles(beginningCoords, ship) {
        const boxesCoords = [];
        const shipLen = ship.length;
        const shipAxis = ship.axis;

        let y = beginningCoords[0] - 1;
        let x = beginningCoords[1] - 1;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < shipLen + 2; j++) {
                try {
                    const coords = (shipAxis === HORIZONTAL) ?
                        [y + i, x + j] :
                        [y + j, x + i];
                    
                    if (board[coords[0]][coords[1]] === "X" ||
                        board[coords[0]][coords[1]] == null) continue;

                    board[coords[0]][coords[1]] = "/";
                    boxesCoords.push(coords);
                } catch {
                    continue;
                }
            }
        }

        // console.table(boxesCoords);
        return boxesCoords;
    }

    function randomize(ships) {
        reset();

        const boardLen = board.length;
        ships.forEach(shipLen => {
            let coords, axis;

            do {
                coords = getRandomCoords(boardLen);
                axis = (Math.random() > 0.5) ? "horiz" : "vert";
            } while (placeShip(coords, shipLen, axis) === false);
        });
    }

    const areAllShipsSunk = () => ships.every(obj => obj.ship.isSunk());
    
    const getBoard = () => board;

    const getBoxAt = coords => board[coords[0]][coords[1]];

    function isBoxAttacked(coords) {
        const box = board[coords[0]][coords[1]];
        return (box === "/" || box === "X") ? true : false;
    }

    return {
        getBoard,
        getBoxAt,
        placeShip,
        canShipBePlaced,
        removeShip,
        receiveAttack,
        areAllShipsSunk,
        randomize,
        isBoxAttacked,
    };
}

export {
    gameboard
};
