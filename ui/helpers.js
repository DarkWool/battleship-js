import { HORIZONTAL, VERTICAL } from "../models/utils.js";

function createLogo() {
  const pre = document.createElement("pre");
  pre.classList.add("battleship-logo");
  pre.textContent = `
██████╗  █████╗ ████████╗████████╗██╗     ███████╗███████╗██╗  ██╗██╗██████╗ 
██╔══██╗██╔══██╗╚══██╔══╝╚══██╔══╝██║     ██╔════╝██╔════╝██║  ██║██║██╔══██╗
██████╔╝███████║   ██║      ██║   ██║     █████╗  ███████╗███████║██║██████╔╝
██╔══██╗██╔══██║   ██║      ██║   ██║     ██╔══╝  ╚════██║██╔══██║██║██╔═══╝ 
██████╔╝██║  ██║   ██║      ██║   ███████╗███████╗███████║██║  ██║██║██║     
╚═════╝ ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝     `;
  return pre;
}

function createBoardUI(board, callback) {
  const boardContainer = document.createElement("div");
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

      boardContainer.append(div);
    });
  });

  return boardContainer;
}

function createPlayerBoard(playerBoard, draggable = false) {
  const shipsRendered = [];
  const board = playerBoard.getBoard();
  const boardContainer = createBoardUI(board, (container, box) => {
    if (typeof box === "object" && shipsRendered.indexOf(box) === -1) {
      const ship = box.ship;
      const shipUI = renderShip(ship.length, ship.axis);
      if (draggable) attachShipListeners(shipUI, playerBoard);
      container.append(shipUI);
      shipsRendered.push(box);
    }
  });

  boardContainer.classList.add("board");
  return boardContainer;
}

function renderShip(shipLen, shipAxis) {
  const ship = document.createElement("div");
  ship.classList.add("ship");
  ship.dataset.length = shipLen;
  if (shipAxis === VERTICAL) ship.classList.add("vertical");

  for (let i = 0; i < shipLen; i++) {
    const shipSection = document.createElement("div");
    ship.append(shipSection);
  }

  return ship;
}

function attachShipListeners(shipUI, playerBoard) {
  shipUI.classList.add("draggable");
  shipUI.draggable = "true";

  let offset = 0,
    index = 0;
  for (const shipSection of shipUI.children) {
    shipSection.dataset.offset = index;
    shipSection.addEventListener("mousedown", (e) => {
      const boxOffset = e.target.dataset.offset;
      if (boxOffset) offset = boxOffset;
    });
    index++;
  }

  shipUI.addEventListener("dragstart", (e) => {
    e.currentTarget.classList.remove("shake", "animated-fast", "invalid-move");
    e.currentTarget.classList.add("dragging");

    const box = e.target.parentNode;
    e.dataTransfer.setData("sourceCoordY", box.dataset.row);
    e.dataTransfer.setData("sourceCoordX", box.dataset.col);

    // const shipObj = playerBoard.getBoxAt([box.dataset.row, box.dataset.col]).ship;
    // e.dataTransfer.setData("shipAxis", shipObj.axis);
    e.dataTransfer.setData("shipLen", index);
    e.currentTarget.classList.contains("vertical")
      ? e.dataTransfer.setData("shipAxis", VERTICAL)
      : e.dataTransfer.setData("shipAxis", HORIZONTAL);
    e.dataTransfer.setData("offset", offset);
    e.dataTransfer.effectAllowed = "move";
  });

  shipUI.addEventListener("dragend", (e) => {
    e.currentTarget.classList.remove("dragging");
  });

  shipUI.addEventListener("click", (e) => {
    if (!e.currentTarget.closest(".board")) return;

    const parent = e.currentTarget.parentNode;
    const coords = [+parent.dataset.row, +parent.dataset.col];

    const shipObj = playerBoard.getBoxAt(coords).ship;
    const shipLen = shipObj.length;
    const currAxis = shipObj.axis;
    const newAxis = currAxis === HORIZONTAL ? VERTICAL : HORIZONTAL;

    playerBoard.removeShip(coords);

    const canBePlaced = playerBoard.placeShip(coords, shipLen, newAxis);
    if (canBePlaced) {
      e.currentTarget.classList.toggle("vertical");
    } else {
      playerBoard.placeShip(coords, shipLen, currAxis);

      e.currentTarget.classList.add("shake", "animated-fast", "invalid-move");
      setTimeout(
        (target) => {
          target.classList.remove("shake", "animated-fast", "invalid-move");
        },
        500,
        e.currentTarget
      );
    }
  });
}

export {
  createLogo,
  createBoardUI,
  createPlayerBoard,
  renderShip,
  attachShipListeners,
};
