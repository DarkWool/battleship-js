import { player } from "./player.js";
import { gameboard } from "./gameboard.js";

function gameController() {
    const playerA = player("Wool", gameboard());
    const playerB = player("PC", gameboard());
    const players = [playerA, playerB];
    
    let playerTurn = playerA;

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

    const getPlayers = () => players;
    const getCurrentPlayer = () => playerTurn;

    const playTurn = (coords) => {
        const currPlayer = getCurrentPlayer();
        const playerToAttack = players.find(player => player.name !== currPlayer.name);

        switchTurn();
        
        const wasHit = currPlayer.attack(playerToAttack.gameboard, coords);
        return wasHit;
    };

    function switchTurn() {
        playerTurn = (playerTurn.name === players[0].name) ?
            players[1] :
            players[0];
    }

    return {
        getPlayers,
        getCurrentPlayer,
        playTurn
    };
}

export {
    gameController
};