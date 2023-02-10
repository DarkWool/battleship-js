import * as utils from "../utils.js";
import { gameController } from "../gameController.js";

let shipsToPlace = [3, 4];
let game, players;

function createNewController() {
  game = gameController(shipsToPlace);
  players = game.getPlayers;
}
createNewController();

describe("init()", () => {
  test("Must create two players", () => {
    game.init();
    expect(game.getPlayers).toHaveLength(2);
  });

  test("Sets the turn to the first player", () => {
    const mainPlayer = game.getPlayers[0];
    expect(game.getCurrentPlayer()).toMatchObject(mainPlayer);
  });

  test("Populates the computerPlayer's board with the passed in ships", () => {
    const board = players[1].board;
    expect(board.getPlacedShipsCount()).toEqual(shipsToPlace.length);
  });
});

describe("getPlayers", () => {
  test("Returns an array of length 2", () => {
    expect(players).toHaveLength(2);
  });
});

describe("getCurrentPlayer()", () => {
  test("Returns the current player", () => {
    expect(game.getCurrentPlayer()).toEqual(players[0]);
  });
});

describe("playTurn()", () => {
  beforeAll(() => (shipsToPlace = []));

  beforeEach(() => {
    createNewController();
    game.init();

    players[1].board.placeShip([0, 0], 2, "horiz");
  });

  test("Returns an object with expected properties (shipHit, isGameWon) when it's the player's turn and a valid move is made", () => {
    const turnResult = game.playTurn([0, 5]);
    expect(turnResult).toHaveProperty("shipHit");
    expect(turnResult).toHaveProperty("isGameWon");
  });

  test("Returns an object with 'isGameWon' prop set to true when the game has been won", () => {
    game.playTurn([0, 0]);
    expect(game.playTurn([0, 1]).isGameWon).toBe(true);
  });

  test("Returns a falsy value when it's the computer's turn", () => {
    game.playTurn([6, 6]);
    expect(game.playTurn([8, 8])).toBeFalsy();
  });

  test("Returns a falsy value when an invalid move is made", () => {
    expect(game.playTurn(250, 100)).toBeFalsy();
    expect(game.playTurn(-4, 100)).toBeFalsy();
    expect(game.playTurn([], [])).toBeFalsy();
    expect(game.playTurn(NaN, NaN)).toBeFalsy();
    expect(game.playTurn(true, 5)).toBeFalsy();
    expect(game.playTurn(6, false)).toBeFalsy();
  });

  test("Only passes turn if a player makes a valid move and an enemy ship is NOT hit", () => {
    const currPlayer = game.getCurrentPlayer();

    expect(game.playTurn([9, 8]).shipHit).toBe(false);
    expect(game.getCurrentPlayer()).not.toMatchObject(currPlayer);
  });

  describe("Doesn't passes turn", () => {
    test("When it's the computer's turn", () => {
      game.playTurn([7, 7]);
      const currPlayer = game.getCurrentPlayer();
      game.playTurn([7, 8]);

      expect(game.getCurrentPlayer()).toMatchObject(currPlayer);
    });

    test("When a ship is hit", () => {
      const currPlayer = game.getCurrentPlayer();
      game.playTurn([0, 0]);

      expect(game.getCurrentPlayer()).toMatchObject(currPlayer);
    });
  });

  test("Must call the 'attack' method of the current player", () => {
    const currPlayer = game.getCurrentPlayer();
    const attack = jest.spyOn(currPlayer, "attack");

    expect(attack).toHaveBeenCalledTimes(0);
    game.playTurn([5, 0]);
    expect(attack).toHaveBeenCalled();
    expect(attack).toHaveBeenCalledTimes(1);

    attack.mockRestore();
  });
});

describe("playComputerTurn()", () => {
  beforeAll(() => (shipsToPlace = [3]));

  beforeEach(() => {
    createNewController();
    game.init();
    game.playTurn([0, 0]);
    players[0].board.placeShip([0, 1], 2, "horiz");
  });

  test("Returns an object with expected properties (shipHit, isGameWon)", () => {
    const turnResult = game.playComputerTurn([5, 9]);
    expect(turnResult).toHaveProperty("shipHit");
    expect(turnResult).toHaveProperty("isGameWon");
  });

  test("Returns an object with 'isGameWon' prop set to true when the game has been won", () => {
    const mockGetRandomCoords = jest.spyOn(utils, "getRandomCoords");
    mockGetRandomCoords.mockReturnValueOnce([0, 1]).mockReturnValueOnce([0, 2]);

    game.playComputerTurn();
    expect(game.playComputerTurn().isGameWon).toBe(true);
  });

  test("Only passes turn if an enemy ship is NOT hit", () => {
    const computerPlayer = game.getCurrentPlayer();
    expect(game.playComputerTurn().shipHit).toBe(false);
    expect(game.getCurrentPlayer()).not.toMatchObject(computerPlayer);
  });

  describe("Doesn't passes turn", () => {
    test("When a ship is hit", () => {
      const mockGetRandomCoords = jest.spyOn(utils, "getRandomCoords");
      mockGetRandomCoords.mockReturnValueOnce([0, 1]);

      const currPlayer = game.getCurrentPlayer();
      game.playComputerTurn();
      expect(game.getCurrentPlayer()).toMatchObject(currPlayer);
    });

    test("When the game has been won", () => {
      const mockGetRandomCoords = jest.spyOn(utils, "getRandomCoords");
      mockGetRandomCoords
        .mockReturnValueOnce([0, 1])
        .mockReturnValueOnce([0, 2]);

      const currPlayer = game.getCurrentPlayer();

      game.playComputerTurn();
      expect(game.playComputerTurn().isGameWon).toBe(true);
      expect(game.getCurrentPlayer()).toMatchObject(currPlayer);
    });
  });

  test("Must call the 'attack' method of the computer player", () => {
    const attack = jest.spyOn(players[1], "attack");

    game.playComputerTurn();
    expect(attack).toHaveBeenCalled();
    expect(attack).toHaveBeenCalledTimes(1);
    attack.mockRestore();
  });
});

describe("isComputerTurn()", () => {
  beforeAll(() => createNewController());

  test("Returns false when it's the turn of a non-computer player", () => {
    expect(game.isComputerTurn()).toBe(false);
  });

  test("Returns true when it's the turn of the computer player", () => {
    game.playTurn([0, 0]);
    expect(game.isComputerTurn()).toBe(true);
  });
});
