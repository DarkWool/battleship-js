function player(name, gameboard) {
    const attack = (enemyBoard, coords) => {
        const board = enemyBoard.board;

        // If the coords have not been shot yet then attack
        if (board[coords[0]][coords[1]] !== "/") enemyBoard.receiveAttack(coords);
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
