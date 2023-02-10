import { computerPlayer } from "../computerPlayer.js";
import { gameboard } from "../gameboard.js";
import * as utils from "../utils.js";

let enemyBoard = gameboard();
let player = computerPlayer();

describe("computerPlayer inherits properties from 'player'", () => {
  test("Should have a 'name' property", () => {
    expect(player).toHaveProperty("name");
  });

  test("Should have a 'board' property", () => {
    expect(player).toHaveProperty("board");
  });
});

describe("getLastCoords", () => {
  player.attack(enemyBoard);
  const board = enemyBoard.getBoard();

  test("Should return an array", () => {
    expect(player.getLastCoords).toBeInstanceOf(Array);
  });

  test("Returns an array of length 2", () => {
    expect(player.getLastCoords).toHaveLength(2);
  });

  test("Returns an array with numbers", () => {
    const coords = player.getLastCoords;
    for (const coord of coords) {
      expect(coord).not.toBeNaN();
      expect(coord).toEqual(expect.any(Number));
      expect(typeof coord).toBe("number");
    }
  });

  test("Returns the value of the last coords used by the computer player to attack the enemy board", () => {
    player.attack(enemyBoard);
    let coords = player.getLastCoords;
    expect(board[coords[0]][coords[1]]).toBe("/");

    player.attack(enemyBoard);
    coords = player.getLastCoords;
    expect(board[coords[0]][coords[1]]).toBe("/");
  });
});

describe("attack()", () => {
  let board = enemyBoard.getBoard();

  describe("Random attack", () => {
    test("Attacks a random position of the enemy board", () => {
      let randomCoords;

      player.attack(enemyBoard);
      randomCoords = player.getLastCoords;
      expect(board[randomCoords[0]][randomCoords[1]]).toBe("/");

      player.attack(enemyBoard);
      randomCoords = player.getLastCoords;
      expect(board[randomCoords[0]][randomCoords[1]]).toBe("/");

      player.attack(enemyBoard);
      randomCoords = player.getLastCoords;
      expect(board[randomCoords[0]][randomCoords[1]]).toBe("/");

      player.attack(enemyBoard);
      randomCoords = player.getLastCoords;
      expect(board[randomCoords[0]][randomCoords[1]]).toBe("/");
    });
  });

  describe("Ship attack", () => {
    beforeEach(() => {
      enemyBoard = gameboard();
      board = enemyBoard.getBoard();
      player = computerPlayer();
    });

    test("When a ship is hit, subsequent attacks are clockwise (up, right, down, left) starting from the coords where the ship was hit", () => {
      enemyBoard.placeShip([2, 0], 3, "horiz");
      const mockGetRandomCoords = jest.spyOn(utils, "getRandomCoords");
      mockGetRandomCoords.mockReturnValueOnce([2, 2]);

      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([2, 2]);

      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([1, 2]); // up

      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([2, 3]); // right

      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([3, 2]); // down

      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([2, 1]); // left
    });

    test("When doing clockwise attacks if one of the boxes has already been attacked it must continue with the next direction", () => {
      enemyBoard.placeShip([2, 0], 3, "horiz");
      const mockGetRandomCoords = jest.spyOn(utils, "getRandomCoords");
      mockGetRandomCoords
        .mockReturnValueOnce([2, 3])
        .mockReturnValueOnce([2, 2]);

      player.attack(enemyBoard); // 2,3
      player.attack(enemyBoard); // 2,2

      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([1, 2]); // up

      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([3, 2]); // down
    });

    test("When a new part of the ship is found the next attacks are in the same direction", () => {
      enemyBoard.placeShip([2, 2], 3, "horiz");
      const mockGetRandomCoords = jest.spyOn(utils, "getRandomCoords");
      mockGetRandomCoords.mockReturnValueOnce([2, 2]);

      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([2, 2]);

      player.attack(enemyBoard);

      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([2, 3]);

      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([2, 4]);
    });

    test("Attack direction changes to the opposite direction when the next box has been attacked before", () => {
      enemyBoard.placeShip([2, 2], 3, "horiz");
      const mockGetRandomCoords = jest.spyOn(utils, "getRandomCoords");
      mockGetRandomCoords
        .mockReturnValueOnce([2, 5])
        .mockReturnValueOnce([2, 3]);

      player.attack(enemyBoard);
      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([2, 3]);

      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([1, 3]);

      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([2, 4]);

      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([2, 2]);

      utils.getRandomCoords.mockRestore();
    });

    test("Attack direction changes to the opposite direction when no ship is hit", () => {
      enemyBoard.placeShip([2, 2], 3, "horiz");
      const mockGetRandomCoords = jest.spyOn(utils, "getRandomCoords");
      mockGetRandomCoords.mockReturnValueOnce([2, 3]);

      player.attack(enemyBoard);
      player.attack(enemyBoard);
      player.attack(enemyBoard);
      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([2, 5]);

      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([2, 2]);
    });

    test("After sinking a ship, next attack must be random", () => {
      enemyBoard.placeShip([2, 2], 2, "horiz");
      enemyBoard.placeShip([8, 8], 1, "horiz");
      const mockGetRandomCoords = jest.spyOn(utils, "getRandomCoords");
      mockGetRandomCoords
        .mockReturnValueOnce([2, 2])
        .mockReturnValueOnce([9, 6])
        .mockReturnValueOnce([8, 8])
        .mockReturnValueOnce([6, 9]);

      // First ship
      player.attack(enemyBoard);
      player.attack(enemyBoard);
      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([2, 3]);
      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([9, 6]);

      // Second ship
      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([8, 8]);
      player.attack(enemyBoard);
      expect(player.getLastCoords).toEqual([6, 9]);
    });
  });
});
