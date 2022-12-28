import { ship } from "./ship.js";

function gameboard() {
    const board = [];
    const ships = [];
    
    for (let i = 0; i < 10; i++) {
        const row = Array.from({ length: 10 }, (x) => "");
        board.push(row);
    }

    function placeShip(coords, length) {
        const [coordY, coordX] = coords;
        if (!board[coordY]) return false;

        // Check if the new ship coords are not yet taken by another ship or outside the board's bounds
        for (let i = 0; i < length; i++) {
            const box = board[coordY][coordX + i];
            if (typeof box === "number" || box == undefined) return false;
        }

        // Create and place the new ship
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
            
            return true;
        }
        
        // Record a missed shot on the board
        board[coordY][coordX] = "/";
        return false;
    }

    const areAllShipsSunk = () => ships.every(ship => ship.isSunk());
    
    const getBoard = () => board;

    function isBoxAvailable(coords) {
        const box = board[coords[0]][coords[1]];
        return (box !== "/" && box !== "X") ? true : false;
    }

    return {
        getBoard,
        placeShip,
        receiveAttack,
        areAllShipsSunk,
        isBoxAvailable,
    };
}

export {
    gameboard
};
