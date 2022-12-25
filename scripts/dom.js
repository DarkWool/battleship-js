import { gameController } from "./gameController.js";

function domController() {
    const MARKER = "●";
    const game = gameController();
    const players = game.getPlayers();
    let isComputerTurn = false;


    // DOM cache
    const gameboards = document.getElementsByClassName("game_boards")[0];
    const turn = document.getElementsByClassName("game_turn")[0];
    const winModal = document.getElementsByClassName("game_win-modal")[0];
    const winMessageModal = winModal.getElementsByClassName("win_msg")[0];
    const winMessageTitle = winMessageModal.getElementsByClassName("win_msg-title")[0];
    

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

                if (boardIndex !== 0) box.addEventListener("click", e => {
                    if (isComputerTurn) return;
                    isComputerTurn = true;

                    e.currentTarget.textContent = MARKER;

                    const turn = game.playTurn([rowIndex, colIndex]);
                    if (turn.shipHit) e.currentTarget.classList.add("hit");
                    if (turn.isGameWon) return showWinMessage();

                    updateTurn();
                    computerTurn();
                }, { once: true });
                
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
            isComputerTurn = false;
        }, 1500);
    };

    const showWinMessage = () => {
        winMessageTitle.textContent = `${game.getCurrentPlayer().name} CONQUERED!`;
        winModal.classList.add("active");
        winMessageModal.classList.add("active");
    };

    renderBoards();
    updateTurn();
}

domController();