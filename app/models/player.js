import { gameboard } from "./gameboard.js";

function player(_name) {
    if (typeof _name !== "string" || _name === "") return null;

    const _gameboard = gameboard();
    const attack = (enemyBoard, coords) => {
        if (enemyBoard.isBoxAttacked(coords) === false)
            return enemyBoard.receiveAttack(coords);
    };

    return {
        get name() {
            return _name;
        },
        get gameboard() {
            return _gameboard;
        },
        attack
    };
}

export {
    player
};
