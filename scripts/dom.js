import { gameController } from "./gameController.js";

function domController() {
    const MARKER = "●";
    const game = gameController();
    const players = game.getPlayers();

    const gameboards = document.getElementsByClassName("game_boards")[0];
    const turn = document.getElementsByClassName("game_turn")[0];

    
    const renderBoards = () => {
        gameboards.innerHTML = "";

        let index = 0;
        for (const player of players) {
            const board = player.gameboard.getBoard();
            const boardUI = createBoardUI(board, index);
            gameboards.append(boardUI);
            index++;
        }
    };

    const createBoardUI = (board, boardIndex) => {
        const newBoard = document.createElement("section");
        newBoard.classList.add("board");
        if (boardIndex !== 0) newBoard.classList.add("enemy");

        board.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                const box = document.createElement("div");
                box.textContent = col;

                if (col === "X" || col === "/") box.textContent = MARKER;
                (col === "X") ? box.classList.add("hit") : false;

                if (boardIndex !== 0) {
                    box.addEventListener("click", e => {
                        // console.log(`[${rowIndex}, ${colIndex}]`);

                        const result = game.playTurn([rowIndex, colIndex]);
                        if (result) e.currentTarget.classList.add("hit");
                        e.currentTarget.textContent = "●";

                        updateTurn();
                        computerTurn();
                    }, { once: true });
                }
                
                newBoard.append(box);
            });
        });

        return newBoard;
    };

    const updateTurn = () => turn.textContent = `${game.getCurrentPlayer().name}'s turn`;

    const computerTurn = () => {
        setTimeout(() => {
            game.playComputerTurn();
            updateTurn();
            renderBoards();
        }, 1500);
    };

    renderBoards();
    updateTurn();
}

domController();