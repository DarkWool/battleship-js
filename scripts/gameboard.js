import { ship } from "./ship.js";

function gameboard() {
    const board = [];  // Stores the board in an array like-way
    const ships = [];  // Stores the ship objects that are on the gameboard

    // Create a board filled with arrays that contain an empty string
    for (let i = 0; i < 10; i++) {
        const row = Array.from({ length: 10 }, (x) => "");
        board.push(row);
    }

    function placeShip(coordX, coordY, length) {
        // Check if the coordinates are valid
        const finalPosX = coordX + length;
        if ((coordX < 0 || coordY < 0) || (finalPosX > 9 || coordY > 9)) return false;

        // Check if a ship is not already in the given coordinates
        for (let i = 0; i < length; i++) {
            if (typeof board[coordY][coordX + i] === "number") return false;
        }

        // Place the new ship
        const newShip = ship(length);
        const newShipIndex = ships.push(newShip) - 1;
        for (let i = 0; i < length; i++) {
            board[coordY][coordX + i] = newShipIndex;
        }
    }

    function receiveAttack(coords) {
        const [coordY, coordX] = coords;

        // If you find a number on the given coords then a ship will be hit!
        if (typeof board[coordY][coordX] === "number") {
            const index = board[coordY][coordX];
            ships[index].hit();
            
            board[coordY][coordX] = "X";
            return;
        }
        
        // Record a missed shot on the board
        board[coordY][coordX] = "/";
    }

    return {
        board,
        placeShip,
        receiveAttack
    }
}

export {
    gameboard
};