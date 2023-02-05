import { gameScreen } from "./gameScreen.js";
import { placementScreen } from "./placementScreen.js";

function viewController(game, ships) {
    const players = game.getPlayers;
    const placement = placementScreen(players[0].board, ships);
    
    placement.handleGameStart(initGameScreen);

    function initGameScreen() {
        gameScreen(game, players);
    }
}

export {
    viewController,
};
