import { ship } from "./ship.js";

function gameboard() {
    const board = [];
    const ships = [];
    
    for (let i = 0; i < 10; i++) {
        const row = Array.from({ length: 10 }, (x) => "");
        board.push(row);
    }

    function placeShip(coords, length, axis) {
        const isHorizontal = (axis === "horiz") ? true : false;
        if (canShipBePlaced(coords, length, isHorizontal) === false) return false;
        
        const [coordY, coordX] = coords;
        // Create and place the new ship
        const newShip = ship(length);
        const newShipIndex = ships.push(newShip) - 1;

        for (let i = 0; i < length; i++) {
            if (isHorizontal) {
                board[coordY][coordX + i] = newShipIndex;
            } else {
                board[coordY + i][coordX] = newShipIndex;
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
        } else if (coords.every(coord => (coord >= 0 && coord <= boardLen)) === false) return false;

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
                    
                    if (typeof box === "number") return false;
                } catch {
                    continue;
                }
            }
        }
    }

    function receiveAttack(coords) {
        const [coordY, coordX] = coords;

        // If you find a number on the given coords then a ship will be hit!
        if (typeof board[coordY][coordX] === "number") {
            const index = board[coordY][coordX];
            ships[index].hit();
            board[coordY][coordX] = "X";
            
            return true;
        }
        
        // Record a missed shot on the board
        board[coordY][coordX] = "/";
        return false;
    }

    const areAllShipsSunk = () => ships.every(ship => ship.isSunk());
    
    const getBoard = () => board;

    function isBoxAttacked(coords) {
        const box = board[coords[0]][coords[1]];
        return (box === "/" || box === "X") ? true : false;
    }

    return {
        getBoard,
        placeShip,
        canShipBePlaced,
        receiveAttack,
        areAllShipsSunk,
        isBoxAttacked,
    };
}

export {
    gameboard
};
