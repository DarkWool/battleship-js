import { gameController } from "./gameController.js";
import { gameboard } from "./gameboard.js";

const HORIZONTAL = "horiz";
const VERTICAL = "vert";

function placementScreen() {
    const playerBoard = gameboard();
    const playerShips = [5, 4, 3, 3, 2];
    let axis = HORIZONTAL;

    document.body.innerHTML = "";
    render();

    const placementBoard = document.getElementsByClassName("placement_board")[0];
    const availableShips = document.getElementsByClassName("ships_available")[0];


    function render() {
        const placementSection = document.createElement("section");

        const instructionsContainer = document.createElement("div");
        const instructionsTitle = document.createElement("h2");

        const boardContainer = document.createElement("div");

        const shipsSection = document.createElement("div");
        const shipsTitle = document.createElement("h2");
        const shipsBtns = document.createElement("div");
        const changeAxisBtn = document.createElement("button");
        const availableShips = document.createElement("div");

        instructionsTitle.textContent = "Instructions";
        shipsTitle.textContent = "Ships available";
        changeAxisBtn.textContent = "Change Axis";
        changeAxisBtn.type = "button";
        instructionsContainer.insertAdjacentHTML(
          "afterbegin",
          `<p>
                Suspendisse pharetra ipsum eu erat commodo, a faucibus elit volutpat. Nulla purus nibh, pretium et sapien quis, maximus
                fermentum ipsum. Donec sagittis dui tellus, at rhoncus lectus viverra finibus. In viverra ante nec nisl congue, nec
                tempus ex porta. Nam a diam sit amet turpis dignissim efficitur. Cras vitae pharetra ligula, ut faucibus nisl. Donec
                pellentesque elit a varius convallis. Maecenas in pulvinar erat, in porta lacus. Quisque sit amet urna pharetra,
                ullamcorper velit vitae, pretium mauris. Suspendisse mauris magna, auctor at ex at, pharetra rutrum nisl. Nam lobortis,
                ligula in lacinia maximus, eros dui maximus ante, id pellentesque dolor tellus non lorem. Sed justo nisl, varius non
                rhoncus in, commodo nec nibh. Quisque porttitor aliquet hendrerit. Praesent luctus purus eget auctor dignissim.
            </p>
            <p>
                In hac habitasse platea dictumst. In luctus non enim sodales venenatis. Integer faucibus libero ac quam placerat
                malesuada. Fusce gravida mauris id augue venenatis ullamcorper. Nam volutpat, ipsum vitae porttitor accumsan, magna
                metus sodales mi, vitae fermentum magna velit sed odio. Nam viverra pulvinar nisi vel sodales. Vivamus in ullamcorper
                risus. Nullam nec gravida felis. Suspendisse molestie sit amet libero ac pharetra. Fusce maximus nec ante at iaculis.
                Etiam leo nisl, ullamcorper dignissim elit nec, varius egestas risus. Nullam vel consequat est, quis faucibus ipsum.
                Proin auctor quam at molestie varius.
            </p>`
        );

        document.body.classList.add("body-flex");
        placementSection.classList.add("game_placement", "content-margin");
        boardContainer.classList.add("placement_board", "board");
        shipsSection.classList.add("placement_ships");
        shipsBtns.classList.add("ships_actions");
        availableShips.classList.add("ships_available");
        changeAxisBtn.classList.add("primary-btn");

        // Listeners
        changeAxisBtn.addEventListener("click", changeShipsAxis);
        attachBoardListeners(boardContainer);
        for (const shipLen of playerShips) {
            const ship = renderShip(shipLen);
            availableShips.append(ship);
        }

        boardContainer.append(renderPlacementBoard());
        instructionsContainer.prepend(instructionsTitle);
        shipsBtns.append(changeAxisBtn);
        shipsSection.append(shipsTitle, shipsBtns, availableShips);
        placementSection.append(instructionsContainer, boardContainer, shipsSection);

        document.body.prepend(placementSection);
    }

    function renderPlacementBoard() {
        const fragment = document.createDocumentFragment();
        const board = playerBoard.getBoard();
        const shipsRendered = [];

        board.forEach((row, rowIndex) => {
            row.forEach((box, colIndex) => {
                const div = document.createElement("div");
                div.classList.add("board_box");
                div.dataset.row = rowIndex;
                div.dataset.col = colIndex;
                div.textContent = box;

                fragment.append(div);
            });
        });
        
        return fragment;
    }

    function attachBoardListeners(board) {
        board.addEventListener("dragover", e => {
            e.preventDefault();
        });
        
        board.addEventListener("dragenter", e => {
            e.target.classList.add("selected");
        });

        board.addEventListener("dragleave", e => {
            e.target.classList.remove("selected");
        });
    } 

    function renderShip(shipLen, axis = HORIZONTAL) {
        const ship = document.createElement("div");
        ship.classList.add("ship", "draggable");
        ship.draggable = "true";
        ship.dataset.length = shipLen;

        if (axis === VERTICAL) ship.classList.add("vertical");
        
        for (let i = 0; i < shipLen; i++) {
            const shipSection = document.createElement("div");
            ship.append(shipSection);
        }

        ship.addEventListener("dragstart", e => {
            ship.classList.add("dragging");
            e.dataTransfer.setData("shipLen", shipLen);

            (e.currentTarget.classList.contains("vertical")) ?
                e.dataTransfer.setData("shipAxis", VERTICAL) :
                e.dataTransfer.setData("shipAxis", HORIZONTAL);
        });

        ship.addEventListener("dragend", () => {
            ship.classList.remove("dragging");
        });

        return ship;
    }

    function changeShipsAxis() {
        const ships = availableShips.getElementsByClassName("ship");

        if (axis === HORIZONTAL) {
            axis = VERTICAL;
            availableShips.classList.add("vertical");
            for (const ship of ships) {
                ship.classList.add("vertical");
            }
            
            return;
        }
        
        axis = HORIZONTAL;
        availableShips.classList.remove("vertical");
        for (const ship of ships) {
            ship.classList.remove("vertical");
        }
    }
}

placementScreen();


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
