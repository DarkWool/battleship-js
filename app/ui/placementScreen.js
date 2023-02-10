import {
  createPlayerBoard,
  renderShip,
  attachShipListeners,
  createLogo,
} from "./helpers.js";
import { HORIZONTAL, VERTICAL } from "../models/utils.js";

function placementScreen(playerBoard, ships) {
  let axisBtnState = HORIZONTAL;

  render();

  const placementBoard = document.getElementsByClassName("placement_board")[0];
  const availableShips = document.getElementsByClassName("ships_available")[0];
  const startGameBtn = document.getElementsByClassName("btn-start")[0];

  // Methods
  function render() {
    document.body.innerHTML = "";
    const mainContainer = document.createElement("div");
    const placementSection = document.createElement("section");

    const instructionsContainer = document.createElement("div");
    const logoContainer = document.createElement("div");

    const boardContainer = document.createElement("div");
    const boardUI = createPlayerBoard(playerBoard);

    const shipsSection = document.createElement("div");
    const shipsSectionTitle = document.createElement("h2");
    const availableShipsTitle = document.createElement("h2");
    const shipsBtns = document.createElement("div");
    const changeAxisBtn = document.createElement("button");
    const randomizeBtn = document.createElement("button");
    const availableShips = document.createElement("div");

    const startGameSection = document.createElement("div");
    const startGameBtn = document.createElement("button");

    shipsSectionTitle.textContent = "Ships";
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
      `<div>
        <h2>What is Battleship?</h2>
        <p>
          Battleship is a classic two-player strategy game played on a gameboard. The goal of the game is to sink all of your opponent's ships by correctly guessing their positions on the grid.<br>
          Each player takes turns firing shots at their opponent's grid, with the winner being the player who sinks all of their opponent's ships first, hence why you have to strategically place your ships in a way that makes them difficult to hit.
        </p>
        </div>
        <div>
        <h2>How to place your ships?</h2>
        <ul>
          <li>Drag and drop every ship on the board or press the <span class="txt-600">'Randomize'</span> button to place them quickly.</li>
          <li>A space of <span class="txt-600">1 box</span> must exist between every ship, otherwise you won't be able to place your ship.</li>
          <li>Before placing a ship you can change its orientation with the <span class="txt-600">'Change Axis'</span> button.</li>
          <li>To change the orientation of a ship that's already placed on the board, you can click on it, beware that if the ship turns red it means that it can't be rotated due to unsufficient space.</li>
        </ul>
        </div>
        <div class="instructions_about">
        <p>Made by <a href="https://github.com/DarkWool/battleship-js" target="_blank">DarkWool</a> with love ❤️ and patience!</p>
      </div>`
    );

    document.body.classList.add("body-flex");
    mainContainer.classList.add("margin-auto-y", "fadeInDown", "animated");
    logoContainer.classList.add("game_logo");
    placementSection.classList.add("game_placement");
    instructionsContainer.classList.add(
      "placement_instructions",
      "margin-auto-y"
    );
    boardContainer.classList.add("placement_board");
    shipsSection.classList.add("placement_ships");
    shipsBtns.classList.add("ships_actions");
    availableShipsTitle.classList.add("ships_available-title");
    availableShips.classList.add("ships_available");
    changeAxisBtn.classList.add("btn-primary");
    randomizeBtn.classList.add("btn-secondary-dark");
    startGameSection.classList.add("placement_start");
    startGameBtn.classList.add(
      "btn-primary",
      "btn-start",
      "jackInTheBox",
      "animated"
    );

    // Listeners
    attachBoardListeners(boardContainer);
    changeAxisBtn.addEventListener("click", changeShipsAxis);
    randomizeBtn.addEventListener("click", randomizeShipsPositions);
    startGameBtn.addEventListener("click", startGame);

    for (const shipLen of ships) {
      const shipUI = renderShip(shipLen, HORIZONTAL);
      attachShipListeners(shipUI, playerBoard);
      availableShips.append(shipUI);
    }

    boardContainer.append(boardUI);
    shipsBtns.append(changeAxisBtn, randomizeBtn);
    shipsSection.append(
      shipsSectionTitle,
      shipsBtns,
      availableShipsTitle,
      availableShips
    );
    startGameSection.append(startGameBtn);
    placementSection.append(
      instructionsContainer,
      boardContainer,
      shipsSection,
      startGameSection
    );
    logoContainer.append(createLogo());
    mainContainer.append(logoContainer, placementSection);

    document.body.prepend(mainContainer);
  }

  function attachBoardListeners(board) {
    board.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    board.addEventListener("dragenter", (e) => {
      e.target.classList.add("selected");
    });

    board.addEventListener("dragleave", (e) => {
      e.target.classList.remove("selected");
    });

    board.addEventListener("drop", (e) => {
      e.preventDefault();

      e.target.classList.remove("selected");
      if (e.target === e.currentTarget) return;

      const sourceCoords = [
        +e.dataTransfer.getData("sourceCoordY"),
        +e.dataTransfer.getData("sourceCoordX"),
      ];
      const shipLen = +e.dataTransfer.getData("shipLen");
      const shipAxis = e.dataTransfer.getData("shipAxis");
      const offset = +e.dataTransfer.getData("offset");
      const newCoords = [+e.target.dataset.row, +e.target.dataset.col];
      shipAxis === HORIZONTAL
        ? (newCoords[1] -= offset)
        : (newCoords[0] -= offset);

      playerBoard.removeShip(sourceCoords);

      const canBePlaced = playerBoard.placeShip(newCoords, shipLen, shipAxis);
      if (canBePlaced) {
        const newLocation = document.querySelector(
          `[data-row='${newCoords[0]}'][data-col='${newCoords[1]}']`
        );
        const draggable = document.getElementsByClassName("dragging")[0];
        newLocation.append(draggable);

        enableStartGameBtn();
        return;
      }

      // If the ship can't be placed in the new location place it again where it was
      playerBoard.placeShip(sourceCoords, shipLen, shipAxis);
    });
  }

  function randomizeShipsPositions() {
    playerBoard.randomize(ships);
    const newBoard = createPlayerBoard(playerBoard, true);
    enableStartGameBtn();

    availableShips.innerHTML = "";
    placementBoard.innerHTML = "";
    placementBoard.append(newBoard);
  }

  function changeShipsAxis() {
    const ships = availableShips.getElementsByClassName("ship");

    if (axisBtnState === HORIZONTAL) {
      axisBtnState = VERTICAL;
      availableShips.classList.add("vertical");
      for (const ship of ships) {
        ship.classList.add("vertical");
      }

      return;
    }

    axisBtnState = HORIZONTAL;
    availableShips.classList.remove("vertical");
    for (const ship of ships) {
      ship.classList.remove("vertical");
    }
  }

  const checkIfGameCanStart = () => {
    return playerBoard.getPlacedShipsCount() === ships.length;
  };

  function enableStartGameBtn() {
    if (checkIfGameCanStart()) {
      startGameBtn.removeAttribute("disabled");
      startGameBtn.classList.add("flash");
      return true;
    }
  }

  function startGame() {
    if (!checkIfGameCanStart()) return;

    PubSub.publish("START GAME SCREEN");
  }
}

export { placementScreen };
