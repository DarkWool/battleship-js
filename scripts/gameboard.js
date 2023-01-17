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
        const isHorizontal = (axis === "horiz") ? true : false;
        if (canShipBePlaced(coords, length, isHorizontal) === false) return false;
        
        const newShip = ship(length);
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
    }

    function receiveAttack(coords) {
        const [coordY, coordX] = coords;

        if (typeof board[coordY][coordX] === "object") {
            const ship = board[coordY][coordX];
            ship.hit();
            board[coordY][coordX] = "X";
            
            return true;
        }
        
        // Record a missed shot on the board
        board[coordY][coordX] = "/";
        return false;
    }

    function randomize(ships) {
        reset();

        const boardLen = board.length;
        ships.forEach(shipLen => {
            let coordX, coordY, axis;

            do {
                coordY = Math.floor(Math.random() * (boardLen + 1));
                coordX = Math.floor(Math.random() * (boardLen + 1));
                axis = (Math.random() > 0.5) ? "horiz" : "vert";
            } while (placeShip([coordY, coordX], shipLen, axis) === false);
        });
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
