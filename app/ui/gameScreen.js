import { createPlayerBoard, renderShip, createLogo, createBoardUI } from "./helpers.js";

function gameScreen(game, players) {
    const MARKER = "●";
    const HIT_MARKER = "X";
    const boards = [];
    let currPlayer;

    render();

    const turn = document.getElementById("turnStatus");
    const winModal = document.getElementsByClassName("game_win-modal")[0];
    const winMessageModal = winModal.getElementsByClassName("win_msg")[0];
    const winMessageTitle = winMessageModal.getElementsByClassName("win_msg-title")[0];

    // Methods
    function render() {
        document.body.innerHTML = "";
        document.body.classList.add("body-flex");
        const gameSection = document.createElement("section");
        const gameHeader = document.createElement("div");
        const battleshipLogo = createLogo();
        gameSection.classList.add("game", "margin-auto-x");
        gameHeader.classList.add("game_header");

        gameSection.innerHTML += `
            <div class="game_status flash">
                <span class="accent-color">STATUS:</span>
                <p id="turnStatus"></p>
            </div>
            <div class="game_boards"></div>
            <div class="game_win-modal">
                <div class="dark-overlay"></div>
                <div class="win_msg">
                    <h2 class="win_msg-title"></h2>
                    <p>Want to play again?</p>
                    <button type="button" class="btn-primary">
                        RESTART GAME
                    </button>
                    
                    <img class="win_msg-img"
                        src="./images/deco-ship.png"
                        alt="A warship in the sea">
                </div>
            </div>
        `;

        gameHeader.append(battleshipLogo);
        gameSection.prepend(gameHeader);
        document.body.append(gameSection);
        const gameboardsSection = document.body.getElementsByClassName("game_boards")[0];
        renderBoards(gameboardsSection);
    }

    function renderBoards(container) {
        let boardIndex = 0;
        for (const player of players) {
            const playerBoard = player.board;
            let boardUI;

            if (boardIndex === 0) {
                boardUI = createPlayerBoard(playerBoard, false);
                boardUI.classList.add("board");
                boardUI.classList.add("zoomIn", "animated-fast");
            } else {
                boardUI = createEnemyBoard(playerBoard);
                boardUI.classList.add("board-enemy");
                boardUI.classList.add("zoomIn", "animated-fast");
            }

            setTimeout(board => {
                board.classList.remove("zoomIn", "animated-fast");
            }, 1000, boardUI);
            
            container.append(boardUI);
            boards.push(boardUI);

            boardIndex++;
        }
    }

    function createEnemyBoard(playerBoard) {
        const board = playerBoard.getBoard();
        return createBoardUI(board, ((container, box, coords) => {
            container.addEventListener("click", e => {
                const turn = game.playTurn(coords);
                if (!turn) return;
                
                handleTurnResult(turn, e.currentTarget, boards[1]);
                e.currentTarget.classList.add("not-available");
                if (turn.isGameWon) return showWinMessage();
                if (turn.shipHit) return;
                
                updateTurn();
                computerTurn();
            });
        }));
    }

    const computerTurn = () => {
        setTimeout(() => {
            const turn = game.playComputerTurn();
            const coords = players[1].getLastCoords;
            const box = boards[0].querySelector(`[data-row="${coords[0]}"][data-col="${coords[1]}"]`);
            handleTurnResult(turn, box, boards[0]);
            if (turn.isGameWon) return showWinMessage();
            if (turn.shipHit) {
                computerTurn();
                return;
            }

            updateTurn();
        }, 700);
    };

    const updateTurn = () => {
        currPlayer = game.getCurrentPlayer();
        if (game.isComputerTurn()) {
            turn.textContent = `${currPlayer.name}'s turn`;
            boards[0].classList.remove("not-playing");
            boards[1].classList.add("not-playing");
        } else {
            turn.textContent = `Your turn`;
            boards[0].classList.add("not-playing");
            boards[1].classList.remove("not-playing");
        }
    };

    const handleTurnResult = (turnResult, box, board) => {
        const markerBox = box.getElementsByClassName("board_box-marker")[0];

        if (turnResult.shipHit) {
            markerBox.textContent = HIT_MARKER;
            box.classList.add("hit");

            if (!turnResult.adjacentCoords) return;

            // When a ship is sunk mark as attacked all the adjacent boxes to it
            turnResult.adjacentCoords.forEach(coords => {
                const adjacentBox = board.querySelector(`[data-row="${coords[0]}"][data-col="${coords[1]}"]`);
                adjacentBox.textContent = MARKER;
                adjacentBox.classList.add("not-available");
            });

            const shipStartingBox = board.querySelector(
                `[data-row="${turnResult.beginningCoords[0]}"][data-col="${turnResult.beginningCoords[1]}"]`
            );

            // Reveal the enemy ship that was sunk (only used when the attack
            //  is directed to a computer player)
            const ship = shipStartingBox.getElementsByClassName("ship")[0];
            if (ship == null) {
                let shipUI = renderShip(turnResult.ship.length, turnResult.ship.axis);
                shipUI.classList.add("sunk");
                shipStartingBox.append(shipUI);
                return;
            }
            ship.classList.add("sunk");
        }
        else markerBox.textContent = MARKER;
    };

    const showWinMessage = () => {
        if (game.isComputerTurn()) {
            winMessageTitle.textContent = `${currPlayer.name} CONQUERED!`;
        } else {
            winMessageTitle.textContent = `You have CONQUERED!`;
        }

        winModal.classList.add("active");
        winMessageModal.classList.add("active");
    };

    updateTurn();
}

export {
    gameScreen
};
