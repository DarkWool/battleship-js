import { gameController } from "./models/gameController.js";
import { viewController } from "./ui/ui-controller.js";

(() => {
    const ships = [3, 2, 5, 6, 2, 2, 1];
    const game = gameController(ships);
    const view = viewController(game, ships);
})();