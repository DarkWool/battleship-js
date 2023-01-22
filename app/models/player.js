function player(name, gameboard) {
    const attack = (enemyBoard, coords) => {
        if (enemyBoard.isBoxAttacked(coords) === false) return enemyBoard.receiveAttack(coords);
    };

    return {
        name,
        gameboard,
        attack
    };
}

export {
    player
};
