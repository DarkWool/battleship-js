import { gameController } from "../gameController.js";

const game = gameController();

describe("getPlayers()", () => {
    test("Should return an array of players", () => {
        const players = game.getPlayers();
        expect(players).toBeInstanceOf(Array);
        expect(players[0]).toHaveProperty("name");
        expect(players[1]).toHaveProperty("name");
        expect(players[0]).toHaveProperty("gameboard");
        expect(players[1]).toHaveProperty("gameboard");
        expect(players[0]).toHaveProperty("attack");
        expect(players[1]).toHaveProperty("attack");
    });
    
    test("The returned array should have 2 players", () => {
        expect(game.getPlayers()).toHaveLength(2);
    });
});

describe("getCurrentPlayer()", () => {
    test("Should return the current player", () => {
        const currPlayer = game.getCurrentPlayer();
        expect(currPlayer).toHaveProperty("name");
        expect(currPlayer).toHaveProperty("gameboard");
        expect(currPlayer).toHaveProperty("attack");
    });
});

describe("playTurn()", () => {
    test("Should call the 'attack' method of the current player", () => {
        const currPlayer = game.getCurrentPlayer();
        const attack = jest.spyOn(currPlayer, "attack");

        game.playTurn([5, 0]);
        expect(attack).toHaveBeenCalled();
        expect(attack).toHaveBeenCalledTimes(1);
    });

    test("Returns an object with a 'shipHit' property that reports if the attack hit a ship or not", () => {
        const result = game.playTurn([1, 9]);
        expect(result).toHaveProperty("shipHit");
        expect(result.shipHit).toBe(false);
    });
    
    test("Returns an object with a 'isGameWon' property that reports whether or not the game has been won", () => {
        const result = game.playTurn([6, 4]);
        expect(result).toHaveProperty("isGameWon");
        expect(result.isGameWon).toBe(false);
    });
});
