import { gameboard } from "../gameboard.js";

const newBoard = gameboard();

test("Creates a 10x10 gameboard", () => {
    expect(newBoard.board).toHaveLength(10);

    for (let row of newBoard.board) {
        expect(row).toHaveLength(10);
    }
});

test("Places a ship on the board correctly", () => {
    newBoard.placeShip(2, 5, 5);
    newBoard.placeShip(2, 1, 4);
    newBoard.placeShip(0, 0, 3);

    expect(newBoard.board[5][2]).toEqual(0);
    expect(newBoard.board[5][3]).toEqual(0);
    expect(newBoard.board[5][4]).toEqual(0);
    expect(newBoard.board[5][5]).toEqual(0);
    expect(newBoard.board[5][6]).toEqual(0);

    expect(newBoard.board[1][2]).toEqual(1);
    expect(newBoard.board[1][3]).toEqual(1);
    expect(newBoard.board[1][4]).toEqual(1);

    expect(newBoard.board[0][0]).toEqual(2);
    expect(newBoard.board[0][1]).toEqual(2);
    expect(newBoard.board[0][2]).toEqual(2);
});

test("Doesn't place a ship when another one is already in the given coords", () => {
    expect(newBoard.placeShip(1, 0, 3)).toEqual(false);
    expect(newBoard.placeShip(2, 0, 3)).toEqual(false);

    expect(newBoard.placeShip(2, 1, 2)).toEqual(false);
    expect(newBoard.placeShip(3, 1, 2)).toEqual(false);
    expect(newBoard.placeShip(4, 1, 2)).toEqual(false);

    expect(newBoard.placeShip(2, 5, 2)).toEqual(false);
    expect(newBoard.placeShip(4, 5, 2)).toEqual(false);
    expect(newBoard.placeShip(6, 5, 2)).toEqual(false);
});

test("Doesn't place a new ship when coords are not valid (when they are outside of the board's bounds)", () => {
    newBoard.placeShip(9, 5, 5);
    newBoard.placeShip(-1, 2, 3);
    
    expect(newBoard.board[5][9]).toBe("");
    expect(newBoard.board[5][10]).toBeUndefined();
    expect(newBoard.board[5][11]).toBeUndefined();
    expect(newBoard.board[2][-1]).toBeUndefined();
    expect(newBoard.board[2][0]).toBe("");
    expect(newBoard.board[2][1]).toBe("");
    expect(newBoard.board[2][2]).toBe("");
});