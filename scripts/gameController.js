import { player } from "./player.js";
import { gameboard } from "./gameboard.js";

function gameController() {
    const playerA = player("Wool", gameboard());
    const playerB = player("PC", gameboard());
    
    let playerTurn = "A";

    // Predefined coords
    playerA.gameboard.placeShip([0, 0], 5);
    playerA.gameboard.placeShip([7, 6], 4);
    playerA.gameboard.placeShip([5, 2], 3);
    playerA.gameboard.placeShip([1, 7], 3);
    playerA.gameboard.placeShip([3, 0], 2);

    playerB.gameboard.placeShip([9, 2], 5);
    playerB.gameboard.placeShip([6, 1], 4);
    playerB.gameboard.placeShip([0, 6], 3);
    playerB.gameboard.placeShip([2, 1], 3);
    playerB.gameboard.placeShip([5, 5], 2);

    const getBoards = () => {
        return [
            playerA.gameboard.getBoard(),
            playerB.gameboard.getBoard(),
        ];
    };

    return {
        getBoards,
    };
}

export {
    gameController
};