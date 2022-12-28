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
    const boards = [];


    const renderBoards = () => {
        gameboards.innerHTML = "";

        let index = 0;
        for (const player of players) {
            const board = player.gameboard.getBoard();
            const boardUI = createBoardUI(board, index);
            gameboards.append(boardUI);
            boards.push(boardUI);
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
                    else if (players[boardIndex].gameboard.isBoxAvailable([rowIndex, colIndex]) === false) return;

                    isComputerTurn = true;

                    const turn = game.playTurn([rowIndex, colIndex]);
                    handleTurnResult(turn, e.currentTarget);
                    e.currentTarget.classList.add("not-available");

                    updateTurn();
                    computerTurn();
                });
                
                newBoard.append(box);
            });
        });

        return newBoard;
    };

    const updateTurn = () => turn.textContent = `${game.getCurrentPlayer().name}'s turn`;

    const computerTurn = () => {
        setTimeout(() => {
            const turn = game.playComputerTurn();

            const coords = players[1].getLastCoords;
            const boxNumber = coords[0] * 10 + coords[1];
            handleTurnResult(turn, boards[0].children[boxNumber]);
            
            updateTurn();
            isComputerTurn = false;
        }, 1500);
    };

    const handleTurnResult = (turnResult, box) => {
        box.textContent = MARKER;

        if (turnResult.shipHit) box.classList.add("hit");
        if (turnResult.isGameWon) return showWinMessage();
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
