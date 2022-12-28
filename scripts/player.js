function player(name, gameboard) {
    const attack = (enemyBoard, coords) => {
        if (enemyBoard.isBoxAvailable(coords)) return enemyBoard.receiveAttack(coords);
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
