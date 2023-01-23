import { player } from "./player.js";
import { getRandomCoords } from "./utils.js";

function computerPlayer(name = "PC") {
    let lastCoords;
    
    const attack = (enemyBoard) => {
        let coords;
        do {
            coords = getRandomCoords(9);
        } while (enemyBoard.isBoxAttacked(coords) === true);

        lastCoords = coords;
        return enemyBoard.receiveAttack(coords);
    };

    // Inherit from player
    const newPlayer = player(name);
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
