import { gameController } from "./models/gameController.js";
import { placementScreen } from "./ui/placementScreen.js";
import { gameScreen } from "./ui/gameScreen.js";

(() => {
  const ships = [5, 3, 3, 2, 2, 1];
  const game = gameController(ships);

  const initPlacementScreen = () => {
    game.init();
    const mainPlayer = game.getPlayers[0];
    placementScreen(mainPlayer.board, ships);
  };

  const initGameScreen = () => {
    const players = game.getPlayers;
    const gameUI = gameScreen(game, players);
  };

  PubSub.subscribe("START GAME", initPlacementScreen);
  PubSub.subscribe("START GAME SCREEN", initGameScreen);
  PubSub.subscribe("RESTART GAME", initPlacementScreen);

  PubSub.publish("START GAME");
})();
