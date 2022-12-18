import { gameboard } from "../gameboard.js";

let board = gameboard();
let boardCopy = board.getBoard();


describe("Board", () => {
    test("Creates a 10x10 gameboard", () => {
        expect(boardCopy).toHaveLength(10);
    
        for (let row of boardCopy) {
            expect(row).toHaveLength(10);
        }
    });

    test("The entire board is filled with empty strings", () => {
        for (let row of boardCopy) {
            row.forEach(column => expect(column).toEqual(""));
        }
    });
});

describe("placeShip()", () => {
    test("Places a ship on the board", () => {
        board.placeShip([5, 2], 5);
        board.placeShip([1, 2], 4);
        board.placeShip([0, 0], 3);
    
        expect(boardCopy[5][2]).toEqual(0);
        expect(boardCopy[5][3]).toEqual(0);
        expect(boardCopy[5][4]).toEqual(0);
        expect(boardCopy[5][5]).toEqual(0);
        expect(boardCopy[5][6]).toEqual(0);
    
        expect(boardCopy[1][2]).toEqual(1);
        expect(boardCopy[1][3]).toEqual(1);
        expect(boardCopy[1][4]).toEqual(1);
    
        expect(boardCopy[0][0]).toEqual(2);
        expect(boardCopy[0][1]).toEqual(2);
        expect(boardCopy[0][2]).toEqual(2);
    });
    
    test("It shouldn't place a new ship when another one is already at the given coords", () => {
        expect(board.placeShip([0, 1], 3)).toEqual(false);
        expect(board.placeShip([0, 2], 3)).toEqual(false);
    
        expect(board.placeShip([1, 2], 2)).toEqual(false);
        expect(board.placeShip([1, 3], 2)).toEqual(false);
        expect(board.placeShip([1, 4], 2)).toEqual(false);
    
        expect(board.placeShip([5, 2], 2)).toEqual(false);
        expect(board.placeShip([5, 4], 2)).toEqual(false);
        expect(board.placeShip([5, 6], 2)).toEqual(false);
    });

    test("Doesn't place a new ship when the coords and length of it are greater than the board's length", () => {
        expect(board.placeShip([5, 7], 5)).toEqual(false);
        expect(board.placeShip([1, 9], 2)).toEqual(false);
        expect(board.placeShip([2, -1], 5)).toEqual(false);

        expect(boardCopy[5][7]).toEqual("");
        expect(boardCopy[5][9]).toEqual("");
        expect(boardCopy[1][9]).toEqual("");
        expect(boardCopy[5][10]).toBeUndefined();
        expect(boardCopy[1][10]).toBeUndefined();
        expect(boardCopy[2][-1]).toBeUndefined();
        expect(boardCopy[5]).toHaveLength(10);
        expect(boardCopy[1]).toHaveLength(10);
    });
});

describe("receiveAttack()", () => {
    test("Registers a missed shot", () => {
        board.receiveAttack([3, 3]);
        board.receiveAttack([8, 0]);
        board.receiveAttack([2, 7]);
        board.receiveAttack([4, 3]);
        board.receiveAttack([1, 6]);
    
        expect(boardCopy[3][3]).toBe("/");
        expect(boardCopy[8][0]).toBe("/");
        expect(boardCopy[2][7]).toBe("/");
        expect(boardCopy[4][3]).toBe("/");
        expect(boardCopy[1][6]).toBe("/");
    });
    
    test("Registers a shot to a ship", () => {
        board.receiveAttack([0, 0]);
        board.receiveAttack([1, 2]);
        board.receiveAttack([1, 3]);
        board.receiveAttack([5, 2]);
        board.receiveAttack([5, 4]);
        board.receiveAttack([5, 6]);
    
        expect(boardCopy[0][0]).toBe("X");
        expect(boardCopy[1][2]).toBe("X");
        expect(boardCopy[1][3]).toBe("X");
        expect(boardCopy[5][2]).toBe("X");
        expect(boardCopy[5][4]).toBe("X");
        expect(boardCopy[5][6]).toBe("X");
    });
});

describe("checkForLeftShips()", () => {
    beforeAll(() => {
        board = gameboard();
        board.placeShip([0, 0], 2);
    });
    
    test("Returns false when some ships are not sunk yet", () => {
        expect(board.checkForLeftShips()).toBe(false);
    });
    
    test("Returns true when all ships have been sunk", () => {
        board.receiveAttack([0, 0]);
        board.receiveAttack([0, 1]);
        
        expect(board.checkForLeftShips()).toBe(true);
    });
});
