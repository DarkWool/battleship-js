import { gameController } from "./gameController.js";

function domController() {
    const game = gameController();
    let boards = game.getBoards();

    const playersBoards = document.querySelectorAll("[data-player]");
    const boardAContainer = playersBoards[0];
    const boardBContainer = playersBoards[1];

    const renderBoards = (boards) => {
        const boardA = createBoardUI(boards[0]);
        const boardB = createBoardUI(boards[1]);

        boardAContainer.innerHTML = "";
        boardBContainer.innerHTML = "";
        boardAContainer.append(boardA);
        boardBContainer.append(boardB);
    };

    const createBoardUI = (board) => {
        const fragment = document.createDocumentFragment();
        board.forEach(row => {
            row.forEach(col => {
                const box = document.createElement("div");
                box.textContent = col;

                fragment.append(box);
            });
        });

        return fragment;
    };

    renderBoards(boards);
}

domController();