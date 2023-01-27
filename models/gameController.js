import { player } from "./player.js";
import { computerPlayer } from "./computerPlayer.js";
import { HORIZONTAL } from "./utils.js";

function gameController() {
    const playerA = player("Wool");
    const playerB = computerPlayer("PC");
    const players = [playerA, playerB];
    
    let playerTurn = playerA;

    // Predefined coords
    playerB.board.placeShip([9, 2], 5, HORIZONTAL);
    playerB.board.placeShip([0, 6], 3, HORIZONTAL);
    playerB.board.placeShip([6, 1], 4, HORIZONTAL);
    playerB.board.placeShip([2, 1], 3, HORIZONTAL);
    playerB.board.placeShip([5, 5], 2, HORIZONTAL);


    const getPlayers = () => players;

    const getCurrentPlayer = () => playerTurn;

    const playTurn = (coords) => {
        const currPlayer = getCurrentPlayer();
        const enemy = players.find(player => player.name !== currPlayer.name);
        const attack = currPlayer.attack(enemy.board, coords);
        if (attack == null) return;
        
        // Before changing turn check if the curr player has won
        const isGameWon = checkWin(enemy.board);
        if (!isGameWon && attack.shipHit === false) switchTurn();

        return {
            ...attack,
            isGameWon,
        };
    };

    const playComputerTurn = () => {
        const currPlayer = getCurrentPlayer();
        const enemy = players.find(player => player.name !== currPlayer.name);
        const attack = playerB.attack(playerA.board);
        if (attack == null) return;

        const isGameWon = checkWin(enemy.board);
        if (!isGameWon && attack.shipHit === false) switchTurn();

        return {
            ...attack,
            isGameWon,
        };
    };

    const switchTurn = () => {
        playerTurn = (playerTurn === players[0]) ?
            players[1] :
            players[0];
    };
    
    const checkWin = (board) => board.areAllShipsSunk();

    
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
