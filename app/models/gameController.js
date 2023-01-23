import { player } from "./player.js";
import { computerPlayer } from "./computerPlayer.js";
import { HORIZONTAL } from "./utils.js";

function gameController() {
    const playerA = player("Wool");
    const playerB = computerPlayer("PC");
    const players = [playerA, playerB];
    
    let playerTurn = playerA;

    // Predefined coords
    playerB.gameboard.placeShip([9, 2], 5, HORIZONTAL);
    playerB.gameboard.placeShip([0, 6], 3, HORIZONTAL);
    playerB.gameboard.placeShip([6, 1], 4, HORIZONTAL);
    playerB.gameboard.placeShip([2, 1], 3, HORIZONTAL);
    playerB.gameboard.placeShip([5, 5], 2, HORIZONTAL);


    const getPlayers = () => players;

    const getCurrentPlayer = () => playerTurn;

    const playTurn = (coords) => {
        const currPlayer = getCurrentPlayer();
        const enemy = players.find(player => player.name !== currPlayer.name);
        const shipHit = currPlayer.attack(enemy.gameboard, coords);
        if (shipHit == null) return;
        
        // Before changing turn check if the curr player has won
        const isGameWon = checkWin(enemy.gameboard);
        if (!isGameWon) switchTurn();

        return {
            ...shipHit,
            isGameWon,
        };
    };

    const playComputerTurn = () => {
        const currPlayer = getCurrentPlayer();
        const enemy = players.find(player => player.name !== currPlayer.name);
        const shipHit = playerB.attack(playerA.gameboard);
        if (shipHit == null) return;

        const isGameWon = checkWin(enemy.gameboard);
        if (!isGameWon) switchTurn();

        return {
            ...shipHit,
            isGameWon,
        };
    };

    const switchTurn = () => {
        playerTurn = (playerTurn === players[0]) ?
            players[1] :
            players[0];
    };
    
    const checkWin = (gameboard) => gameboard.areAllShipsSunk();

    
    return {
        getPlayers,
        getCurrentPlayer,
        playTurn,
        playComputerTurn
    };
}

export {
    gameController
};
