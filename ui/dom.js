import { HORIZONTAL, VERTICAL, isNumber } from "../models/utils.js";
import { gameController } from "../models/gameController.js";

function screenController() {
    const game = gameController();
    const playerShips = [5, 4, 3, 3, 2];
    const players = game.getPlayers();
    const playerBoard = players[0].board;
    let placedShips = 0;

    function createBoardUI(board, callback) {
        const fragment = document.createDocumentFragment();
        board.forEach((row, rowIndex) => {
            row.forEach((box, colIndex) => {
                const div = document.createElement("div");
                div.classList.add("board_box");
                div.dataset.row = rowIndex;
                div.dataset.col = colIndex;
        
                callback(div, box, [rowIndex, colIndex]);
        
                fragment.append(div);
            });
        });

        return fragment;
    }

    function createPlayerBoard(board, draggable = false) {
        const shipsRendered = [];
        return createBoardUI(board, ((container, box) => {
            if (typeof box === "object" && shipsRendered.indexOf(box) === -1) {
                const ship = box.ship;
                const shipUI = renderShip(ship.length, ship.axis, draggable);
                container.append(shipUI);
                shipsRendered.push(box);
                placedShips++;
            }
        }));
    }

    function renderShip(shipLen, axis, draggable) {
        const ship = document.createElement("div");
        ship.classList.add("ship");
        if (axis === VERTICAL) ship.classList.add("vertical");

        for (let i = 0; i < shipLen; i++) {
            const shipSection = document.createElement("div");
            ship.append(shipSection);
        }
        
        if (draggable === true) {
            ship.classList.add("draggable");
            ship.draggable = "true";
            ship.dataset.length = shipLen;

            let offset = 0, index = 0;
            for (const shipSection of ship.children) {
                shipSection.dataset.offset = index;
                shipSection.addEventListener("mousedown", e => {
                    const boxOffset = e.target.dataset.offset;
                    if (boxOffset) offset = boxOffset;
                });
                index++;
            }

            ship.addEventListener("dragstart", e => {
                ship.classList.add("dragging");

                const box = e.target.parentNode;
                e.dataTransfer.setData("sourceCoordY", box.dataset.row);
                e.dataTransfer.setData("sourceCoordX", box.dataset.col);
                e.dataTransfer.setData("shipLen", shipLen);
                (e.currentTarget.classList.contains("vertical")) ?
                    e.dataTransfer.setData("shipAxis", VERTICAL) :
                    e.dataTransfer.setData("shipAxis", HORIZONTAL);
                e.dataTransfer.setData("offset", offset);
                e.dataTransfer.effectAllowed = "move";
            });

            ship.addEventListener("dragend", () => {
                ship.classList.remove("dragging");
            });

            ship.addEventListener("dblclick", e => {
                if (!e.currentTarget.closest(".board")) return;

                const parent = e.currentTarget.parentNode;
                const coords = [+parent.dataset.row, +parent.dataset.col];
                
                const box = playerBoard.getBoxAt(coords);
                const shipLen = box.ship.length;
                const currAxis = box.ship.axis;
                const newAxis = (currAxis === HORIZONTAL) ? VERTICAL : HORIZONTAL;

                playerBoard.removeShip(coords);

                const canBePlaced = playerBoard.placeShip(coords, shipLen, newAxis);
                (!canBePlaced) ?
                    playerBoard.placeShip(coords, shipLen, currAxis) :
                    e.currentTarget.classList.toggle("vertical");
            });
        }

        return ship;
    }
        
    function placementScreen() {
        let axis = HORIZONTAL;

        render();

        const placementBoard = document.getElementsByClassName("placement_board")[0];
        const availableShips = document.getElementsByClassName("ships_available")[0];
        const startGameBtn = document.getElementsByClassName("start-btn")[0];


        function render() {
            document.body.innerHTML = "";

            const placementSection = document.createElement("section");
            const startGameSection = document.createElement("section");

            const instructionsContainer = document.createElement("div");
            const instructionsTitle = document.createElement("h2");

            const boardContainer = document.createElement("div");

            const shipsSection = document.createElement("div");
            const shipsTitle = document.createElement("h2");
            const shipsBtns = document.createElement("div");
            const changeAxisBtn = document.createElement("button");
            const randomizeBtn = document.createElement("button");
            const availableShips = document.createElement("div");
            const startGameBtn = document.createElement("button");

            instructionsTitle.textContent = "Instructions";
            shipsTitle.textContent = "Ships available";
            changeAxisBtn.textContent = "Change Axis";
            randomizeBtn.textContent = "Randomize";
            startGameBtn.textContent = "START GAME";
            changeAxisBtn.type = "button";
            randomizeBtn.type = "button";
            startGameBtn.type = "button";
            startGameBtn.setAttribute("disabled", "");
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

            document.body.classList.add("body-flex", "content-margin");
            placementSection.classList.add("game_placement");
            boardContainer.classList.add("placement_board", "board");
            shipsSection.classList.add("placement_ships");
            shipsBtns.classList.add("ships_actions");
            availableShips.classList.add("ships_available");
            changeAxisBtn.classList.add("primary-btn");
            randomizeBtn.classList.add("secondary-btn");
            startGameSection.classList.add("game_start");
            startGameBtn.classList.add("primary-btn", "start-btn");

            // Listeners
            attachBoardListeners(boardContainer);
            changeAxisBtn.addEventListener("click", changeShipsAxis);
            randomizeBtn.addEventListener("click", randomizeShipsPositions);
            startGameBtn.addEventListener("click", startGame);
            for (const shipLen of playerShips) {
                const ship = renderShip(shipLen, HORIZONTAL, true);
                availableShips.append(ship);
            };

            boardContainer.append(createPlayerBoard(playerBoard.getBoard(), true));
            instructionsContainer.prepend(instructionsTitle);
            shipsBtns.append(changeAxisBtn, randomizeBtn);
            shipsSection.append(shipsTitle, shipsBtns, availableShips);
            placementSection.append(instructionsContainer, boardContainer, shipsSection);
            startGameSection.append(startGameBtn);

            document.body.prepend(placementSection, startGameSection);
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

            board.addEventListener("drop", e => {
                e.preventDefault();

                e.target.classList.remove("selected");
                if (e.target === e.currentTarget) return;
                
                const sourceCoords = [
                    +e.dataTransfer.getData("sourceCoordY"),
                    +e.dataTransfer.getData("sourceCoordX")
                ];
                if (sourceCoords.every(coord => isNumber(coord))) playerBoard.removeShip(sourceCoords);
                
                const shipLen = +e.dataTransfer.getData("shipLen");
                const shipAxis = e.dataTransfer.getData("shipAxis");
                const offset = +e.dataTransfer.getData("offset");
                const newCoords = [+e.target.dataset.row, +e.target.dataset.col];
                (shipAxis === HORIZONTAL) ?
                    newCoords[1] -= offset :
                    newCoords[0] -= offset;
                
                const canBePlaced = playerBoard.placeShip(newCoords, shipLen, shipAxis);
                if (canBePlaced) {
                    const newLocation = document.querySelector(`[data-row='${newCoords[0]}'][data-col='${newCoords[1]}']`);
                    const draggable = document.getElementsByClassName("dragging")[0];
                    newLocation.append(draggable);
                    
                    placedShips++;
                    checkIfGameCanStart();
                    return;
                }

                // If the ship can't be placed in the new location place it again where it was
                playerBoard.placeShip(sourceCoords, shipLen, shipAxis);
            });
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

        function randomizeShipsPositions() {
            placedShips = 0;
            playerBoard.randomize(playerShips);
            const newBoard = createPlayerBoard(playerBoard.getBoard(), true);
            checkIfGameCanStart();

            availableShips.innerHTML = "";
            placementBoard.innerHTML = "";
            placementBoard.append(newBoard);
        }

        function startGame() {
            if (!checkIfGameCanStart()) return;

            gameScreen();
        }

        function checkIfGameCanStart() {
            if (placedShips >= playerShips.length) {
                startGameBtn.removeAttribute("disabled");
                return true;
            }
        }
    }

    function gameScreen() {
        const MARKER = "●";
        const boards = [];
        let isComputerTurn = false;
        let playerTurn;

        render();

        const turn = document.getElementsByClassName("game_turn")[0];
        const winModal = document.getElementsByClassName("game_win-modal")[0];
        const winMessageModal = winModal.getElementsByClassName("win_msg")[0];
        const winMessageTitle = winMessageModal.getElementsByClassName("win_msg-title")[0];


        function render() {
            document.body.innerHTML = "";
            document.body.classList.add("body-flex");
            document.body.insertAdjacentHTML("afterbegin", `
                <section class="game content-margin">
                    <div class="game_header">
                        <h1>Battleship Game</h1>
                    </div>
                    <div class="game_turn"></div>
                    <div class="game_boards"></div>
                    <div class="game_win-modal">
                        <div class="dark-overlay"></div>
                        <div class="win_msg">
                            <h2 class="win_msg-title"></h2>
                            <p>Want to play again?</p>
                            <button type="button" class="restart-btn">
                                RESTART
                            </button>
                            
                            <img class="win_msg-img"
                                src="./images/deco-ship.png"
                                alt="A warship in the sea">
                        </div>
                    </div>
                </section>
            `);

            const gameBoardsSection = document.body.getElementsByClassName("game_boards")[0];
            renderBoards(gameBoardsSection);
        }
        
        function renderBoards(boardsSection) {
            let boardIndex = 0;
            for (const player of players) {
                const board = player.board.getBoard();
                const boardUI = (boardIndex === 0) ?
                    createPlayerBoard(board, false) :
                    createEnemyBoard(board);
                
                const boardContainer = document.createElement("div");
                boardContainer.classList.add("board");
                boardContainer.append(boardUI);
                boardsSection.append(boardContainer);

                // Freeze the boards
                boards.push(boardContainer);

                boardIndex++;
            }
        }

        function createEnemyBoard(board) {
            return createBoardUI(board, ((container, box, coords) => {
                container.addEventListener("click", e => {
                    if (isComputerTurn) return;
                    
                    const turn = game.playTurn(coords);
                    if (!turn) return;
                    isComputerTurn = true;
                    
                    handleTurnResult(turn, e.currentTarget, boards[1]);
                    e.currentTarget.classList.add("not-available");
                    
                    updateTurn();
                    computerTurn();
                });
            }));
        }

        const updateTurn = () => {
            playerTurn = game.getCurrentPlayer();
            turn.textContent = `${playerTurn.name}'s turn`;
        };

        const computerTurn = () => {
            setTimeout(() => {
                const turn = game.playComputerTurn();

                const coords = players[1].getLastCoords;
                const boxNumber = coords[0] * 10 + coords[1];
                handleTurnResult(turn, boards[0].children[boxNumber], boards[0]);
                
                updateTurn();
                isComputerTurn = false;
            }, 1500);
        };

        const handleTurnResult = (turnResult, box, board) => {
            box.textContent = MARKER;

            if (turnResult.shipHit) {
                box.classList.add("hit");
                if (turnResult.adjacentCoords) {
                    turnResult.adjacentCoords.forEach(coords => {
                        const box = board.querySelector(`[data-row="${coords[0]}"][data-col="${coords[1]}"]`);
                        box.textContent = MARKER;
                        box.classList.add("not-available");
                    });
                }
            }
            if (turnResult.isGameWon) return showWinMessage();
        };

        const showWinMessage = () => {
            winMessageTitle.textContent = `${playerTurn.name} CONQUERED!`;
            winModal.classList.add("active");
            winMessageModal.classList.add("active");
        };

        updateTurn();
    }

    placementScreen();
};

export {
    screenController
};
