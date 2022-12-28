import { player } from "./player.js";

function computerPlayer(name = "PC", gameboard) {
    let lastCoords;
    
    const attack = (enemyBoard) => {
        let coords;
        do {
            coords = getRandomCoords(9);
        } while (enemyBoard.isBoxAvailable(coords) === false);

        lastCoords = coords;
        return enemyBoard.receiveAttack(coords);
    };

    const getRandomCoords = (max) => {
        const coordY = Math.floor(Math.random() * (max - 0 + 1)) + 0;
        const coordX = Math.floor(Math.random() * (max - 0 + 1)) + 0;
        return [coordY, coordX];
    };

    // Inherit from player
    const newPlayer = player(name, gameboard);
    return {
        ...newPlayer,
        attack,
        get getLastCoords() {
            return lastCoords;
        }
    };
}

export {
    computerPlayer
};
