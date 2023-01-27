import { HORIZONTAL, VERTICAL, isNumber } from "../models/utils.js";
import { gameController } from "../models/gameController.js";

function screenController() {
    const game = gameController();
    const playerShips = [5, 4, 3, 3, 2];
    const players = game.getPlayers();
    const playerBoard = players[0].board;

    function createBoardUI(board, callback) {
        const fragment = document.createDocumentFragment();
        board.forEach((row, rowIndex) => {
            row.forEach((box, colIndex) => {
                const div = document.createElement("div");
                const markerBox = document.createElement("div");
                div.classList.add("board_box");
                markerBox.classList.add("board_box-marker");
                div.dataset.row = rowIndex;
                div.dataset.col = colIndex;
                div.append(markerBox);
        
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
                e.currentTarget.classList.remove("shake", "animated-fast", "invalid-move");
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
                if (canBePlaced) {
                    e.currentTarget.classList.toggle("vertical");
                } else {
                    e.currentTarget.classList.add("shake", "animated-fast", "invalid-move");
                    playerBoard.placeShip(coords, shipLen, currAxis);

                    const currTarget = e.currentTarget;
                    setTimeout(() => {
                        currTarget.classList.remove("shake", "animated-fast", "invalid-move");
                    }, 500);
                }
            });
        }

        return ship;
    }

    function createLogo() {
        const pre = document.createElement("pre");
        pre.classList.add("battleship-logo");
        pre.textContent = 
`██████╗  █████╗ ████████╗████████╗██╗     ███████╗███████╗██╗  ██╗██╗██████╗ 
██╔══██╗██╔══██╗╚══██╔══╝╚══██╔══╝██║     ██╔════╝██╔════╝██║  ██║██║██╔══██╗
██████╔╝███████║   ██║      ██║   ██║     █████╗  ███████╗███████║██║██████╔╝
██╔══██╗██╔══██║   ██║      ██║   ██║     ██╔══╝  ╚════██║██╔══██║██║██╔═══╝ 
██████╔╝██║  ██║   ██║      ██║   ███████╗███████╗███████║██║  ██║██║██║     
╚═════╝ ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝     `;
        return pre;
    }
        
    function placementScreen() {
        let axis = HORIZONTAL;

        render();

        const placementBoard = document.getElementsByClassName("placement_board")[0];
        const availableShips = document.getElementsByClassName("ships_available")[0];
        const startGameBtn = document.getElementsByClassName("btn-start")[0];


        function render() {
            document.body.innerHTML = "";
            const mainContainer = document.createElement("div");
            const placementSection = document.createElement("section");
            
            const instructionsContainer = document.createElement("div");
            const battleshipLogo = createLogo();
            const instructionsTitle = document.createElement("h2");

            const boardContainer = document.createElement("div");
            
            const shipsSection = document.createElement("div");
            const availableShipsTitle = document.createElement("h2");
            const shipsBtns = document.createElement("div");
            const changeAxisBtn = document.createElement("button");
            const randomizeBtn = document.createElement("button");
            const availableShips = document.createElement("div");

            const startGameSection = document.createElement("div");
            const startGameBtn = document.createElement("button");
            
            instructionsTitle.textContent = "How to play?";
            availableShipsTitle.textContent = "Available ships";
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

            mainContainer.classList.add("margin-auto-y");
            document.body.classList.add("body-flex", "content-margin");
            placementSection.classList.add("game_placement", "fadeInDown", "animated");
            battleshipLogo.classList.add("instructions_logo");
            boardContainer.classList.add("placement_board", "board");
            shipsSection.classList.add("placement_ships");
            shipsBtns.classList.add("ships_actions");
            availableShips.classList.add("ships_available");
            changeAxisBtn.classList.add("btn-primary");
            randomizeBtn.classList.add("btn-secondary-dark");
            startGameSection.classList.add("placement_start");
            startGameBtn.classList.add("btn-primary", "btn-start", "jackInTheBox", "animated");

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
            instructionsContainer.prepend(battleshipLogo, instructionsTitle);
            shipsBtns.append(changeAxisBtn, randomizeBtn);
            shipsSection.append(shipsBtns, availableShipsTitle, availableShips);
            startGameSection.append(startGameBtn);
            placementSection.append(instructionsContainer, boardContainer, shipsSection, startGameSection);
            mainContainer.append(placementSection);

            document.body.prepend(mainContainer);
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
            if (playerBoard.getPlacedShipsCount() === playerShips.length) {
                startGameBtn.removeAttribute("disabled");
                startGameBtn.classList.add("flash");
                return true;
            }
        }
    }

    function gameScreen() {
        const MARKER = "●";
        const HIT_MARKER = "X";
        const boards = [];
        let isComputerTurn = false;
        let currPlayer;

        render();

        const turn = document.getElementById("turnStatus");
        const winModal = document.getElementsByClassName("game_win-modal")[0];
        const winMessageModal = winModal.getElementsByClassName("win_msg")[0];
        const winMessageTitle = winMessageModal.getElementsByClassName("win_msg-title")[0];


        function render() {
            document.body.innerHTML = "";
            document.body.classList.add("body-flex");
            const gameSection = document.createElement("section");
            const gameHeader = document.createElement("div");
            const battleshipLogo = createLogo();
            gameSection.classList.add("game", "content-margin");
            gameHeader.classList.add("game_header");
            battleshipLogo.classList.add("game_header-logo");

            gameSection.innerHTML += `
                <div class="game_status">
                    <span class="accent-color flash">STATUS:</span>
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
        
        function renderBoards(boardsSection) {
            let boardIndex = 0;
            for (const player of players) {
                const board = player.board.getBoard();
                const boardUI = (boardIndex === 0) ?
                    createPlayerBoard(board, false) :
                    createEnemyBoard(board);
                
                const boardContainer = document.createElement("div");
                boardContainer.classList.add("board");
                if (boardIndex !== 0) {
                    boardContainer.classList.add("enemy");
                    boardContainer.classList.add("zoomIn", "animated-fast");
                } else {
                    boardContainer.classList.add("zoomIn", "animated-fast");
                }

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
                    
                    handleTurnResult(turn, e.currentTarget, boards[1]);
                    e.currentTarget.classList.add("not-available");
                    if (turn.isGameWon) return showWinMessage();
                    if (turn.shipHit) return;
                    isComputerTurn = true;
                    
                    updateTurn();
                    computerTurn();
                });
            }));
        }

        const updateTurn = () => {
            currPlayer = game.getCurrentPlayer();
            if (isComputerTurn) turn.textContent = `${currPlayer.name}'s turn`;
            else turn.textContent = `Your turn`;
        };

        const computerTurn = () => {
            setTimeout(() => {
                const turn = game.playComputerTurn();

                const coords = players[1].getLastCoords;
                const boxNumber = coords[0] * 10 + coords[1];
                handleTurnResult(turn, boards[0].children[boxNumber], boards[0]);
                if (turn.isGameWon) return showWinMessage();
                if (turn.shipHit) {
                    computerTurn();
                    return;
                }
                
                isComputerTurn = false;
                updateTurn();
            }, 1500);
        };

        const handleTurnResult = (turnResult, box, board) => {
            const markerBox = box.getElementsByClassName("board_box-marker")[0];

            if (turnResult.shipHit) {
                markerBox.textContent = HIT_MARKER;
                box.classList.add("hit");
            }
            else markerBox.textContent = MARKER;
            
            if (turnResult.adjacentCoords) {
                turnResult.adjacentCoords.forEach(coords => {
                    const box = board.querySelector(`[data-row="${coords[0]}"][data-col="${coords[1]}"]`);
                    box.textContent = MARKER;
                    box.classList.add("not-available");
                });

                const shipBox = board.querySelector(
                    `[data-row="${turnResult.beginningCoords[0]}"][data-col="${turnResult.beginningCoords[1]}"]`
                );
                const ship = shipBox.getElementsByClassName("ship")[0];
                if (ship == null) {
                    let shipUI = renderShip(turnResult.ship.length, turnResult.ship.axis, false);
                    shipUI.classList.add("sunk");
                    shipBox.append(shipUI);
                    return;
                }
                ship.classList.add("sunk");
            }
        };

        const showWinMessage = () => {
            if (isComputerTurn) {
                winMessageTitle.textContent = `${currPlayer.name} CONQUERED!`;
            } else {
                winMessageTitle.textContent = `You have CONQUERED!`;
            }

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
