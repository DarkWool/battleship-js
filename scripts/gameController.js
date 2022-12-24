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

    // Single player mode
    const playTurn = (coords) => {
        const currPlayer = getCurrentPlayer();
        const enemy = players.find(player => player.name !== currPlayer.name);
        const shipHit = currPlayer.attack(enemy.gameboard, coords);
        
        // Before changing turn check if the curr player has won
        const isGameWon = checkWin(enemy.gameboard);
        if (!isGameWon) switchTurn();

        return {
            shipHit,
            isGameWon,
        };
    };

    const playComputerTurn = () => {
        const coordY = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
        const coordX = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
        console.log(`COMPUTER COORDS => [${coordY}, ${coordX}]`);

        playerB.attack(playerA.gameboard, [coordY, coordX]);

        if (checkWin(playerA.gameboard) === true) return true;
        switchTurn();
    };

    const switchTurn = () => {
        playerTurn = (playerTurn.name === players[0].name) ?
            players[1] :
            players[0];
    };

    const checkWin = (gameboard) => gameboard.checkForLeftShips();


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