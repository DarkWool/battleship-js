import { player } from "./player.js";
import { computerPlayer } from "./computerPlayer.js";

function gameController(ships) {
  const players = [];
  let turn;

  function init() {
    turn = 0;
    const mainPlayer = player("DarkWool");
    const aiPlayer = computerPlayer("Cortana");
    aiPlayer.board.randomize(ships);

    players[0] = mainPlayer;
    players[1] = aiPlayer;
  }

  const getCurrentPlayer = () => players[turn];

  function playTurn(coords) {
    if (isComputerTurn()) return;

    const player = getCurrentPlayer();
    const enemy = turn === 0 ? players[1] : players[0];
    return handleAttack(player, enemy, coords);
  }

  function playComputerTurn() {
    const player = players[1];
    const enemy = players[0];
    return {
      ...handleAttack(player, enemy),
      coords: player.getLastCoords,
    };
  }

  function handleAttack(player, enemy, coords) {
    const attack = coords
      ? player.attack(enemy.board, coords)
      : player.attack(enemy.board);
    if (attack == null) return;

    const isGameWon = checkWin(enemy.board);
    if (!isGameWon && attack.shipHit === false) switchTurn();

    return {
      ...attack,
      isGameWon,
    };
  }

  const isComputerTurn = () => turn === 1;

  const switchTurn = () => (turn = turn === 0 ? 1 : 0);

  const checkWin = (board) => board.areAllShipsSunk();

  init();

  return {
    init,
    get getPlayers() {
      return players;
    },
    getCurrentPlayer,
    playTurn,
    playComputerTurn,
    isComputerTurn,
  };
}

export { gameController };
