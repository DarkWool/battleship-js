import { gameboard } from "../gameboard.js";

let board = gameboard();
let testBoard = board.getBoard();


describe("getBoard()", () => {
    beforeEach(() => {
        testBoard = board.getBoard();
    });

    test("Should return an array", () => {
        expect(testBoard).toBeInstanceOf(Array);
    });
    
    test("Returns a 10x10 gameboard", () => {
        expect(testBoard).toHaveLength(10);
    
        for (let row of testBoard) {
            expect(row).toHaveLength(10);
        }
    });

    test("The entire board is filled with empty strings", () => {
        for (let row of testBoard) {
            row.forEach(column => expect(column).toEqual(""));
        }
    });
});

describe("placeShip()", () => {
    test("Places a ship on the board", () => {
        board.placeShip([5, 2], 5);
        board.placeShip([1, 2], 4);
    
        expect(testBoard[5][2]).toEqual(0);
        expect(testBoard[5][3]).toEqual(0);
        expect(testBoard[5][4]).toEqual(0);
        expect(testBoard[5][5]).toEqual(0);
        expect(testBoard[5][6]).toEqual(0);
    
        expect(testBoard[1][2]).toEqual(1);
        expect(testBoard[1][3]).toEqual(1);
        expect(testBoard[1][4]).toEqual(1);
    });

    test("Places a number on the board representing the index of the new ship", () => {
        board.placeShip([0, 0], 3);

        expect(typeof testBoard[0][0]).toBe("number");
        expect(typeof testBoard[0][1]).toBe("number");
        expect(typeof testBoard[0][2]).toBe("number");
        expect(testBoard[0][0]).toEqual(2);
        expect(testBoard[0][1]).toEqual(2);
        expect(testBoard[0][2]).toEqual(2);
    });
    
    test("Returns false when trying to place a new ship and another one is already placed at those coords", () => {
        expect(board.placeShip([0, 1], 3)).toEqual(false);
        expect(board.placeShip([0, 2], 3)).toEqual(false);
    
        expect(board.placeShip([1, 2], 2)).toEqual(false);
        expect(board.placeShip([1, 3], 2)).toEqual(false);
        expect(board.placeShip([1, 4], 2)).toEqual(false);
    
        expect(board.placeShip([5, 2], 2)).toEqual(false);
        expect(board.placeShip([5, 4], 2)).toEqual(false);
        expect(board.placeShip([5, 6], 2)).toEqual(false);
    });

    test("Returns false when the coords of the new ship are greater than the board's length", () => {
        expect(board.placeShip([2, 28], 5)).toEqual(false);
        expect(board.placeShip([50, 34], 2)).toEqual(false);
        expect(board.placeShip([-9, -1], 5)).toEqual(false);

        expect(testBoard[2][28]).toBeUndefined();
        expect(testBoard[50]).toBeUndefined();
        expect(testBoard[9][1]).toBe("");
    });
    
    test("Returns false when the length of the new ship exceeds the board limits", () => {
        expect(board.placeShip([5, 7], 5)).toEqual(false);
        expect(board.placeShip([1, 9], 2)).toEqual(false);
        expect(board.placeShip([2, -1], 5)).toEqual(false);

        expect(testBoard[5][7]).toEqual("");
        expect(testBoard[5][8]).toEqual("");
        expect(testBoard[5][9]).toEqual("");
        expect(testBoard[5][10]).toBeUndefined();
        expect(testBoard[5][11]).toBeUndefined();
        
        expect(testBoard[1][9]).toEqual("");
        expect(testBoard[1][10]).toBeUndefined();
        
        expect(testBoard[2][1]).toEqual("");
        expect(testBoard[2][-1]).toBeUndefined();
        
        expect(testBoard[5]).toHaveLength(10);
        expect(testBoard[1]).toHaveLength(10);
    });
});

describe("receiveAttack()", () => {
    test("Registers a missed shot", () => {
        board.receiveAttack([3, 3]);
        board.receiveAttack([8, 0]);
        board.receiveAttack([2, 7]);
        board.receiveAttack([4, 3]);
        board.receiveAttack([1, 6]);
    
        expect(testBoard[3][3]).toBe("/");
        expect(testBoard[8][0]).toBe("/");
        expect(testBoard[2][7]).toBe("/");
        expect(testBoard[4][3]).toBe("/");
        expect(testBoard[1][6]).toBe("/");
    });
    
    test("Registers a shot to a ship", () => {
        board.receiveAttack([0, 0]);
        board.receiveAttack([1, 2]);
        board.receiveAttack([1, 3]);
        board.receiveAttack([5, 2]);
        board.receiveAttack([5, 4]);
        board.receiveAttack([5, 6]);
    
        expect(testBoard[0][0]).toBe("X");
        expect(testBoard[1][2]).toBe("X");
        expect(testBoard[1][3]).toBe("X");
        expect(testBoard[5][2]).toBe("X");
        expect(testBoard[5][4]).toBe("X");
        expect(testBoard[5][6]).toBe("X");
    });

    test("Returns false for a miss shot", () => {
        expect(board.receiveAttack([6, 6])).toBe(false);
        expect(board.receiveAttack([2, 0])).toBe(false);
        expect(board.receiveAttack([1, 8])).toBe(false);
        expect(board.receiveAttack([8, 1])).toBe(false);
        expect(board.receiveAttack([9, 0])).toBe(false);
    });

    test("Returns true when a ship is successfully hit", () => {
        expect(board.receiveAttack([0, 1])).toBe(true);
        expect(board.receiveAttack([0, 2])).toBe(true);
        expect(board.receiveAttack([1, 4])).toBe(true);
        expect(board.receiveAttack([5, 3])).toBe(true);
    });
});

describe("isBoxAvailable()", () => {
    test("Returns false when the box at the specified coords has been attacked before", () => {
        expect(board.isBoxAvailable([5, 2])).toBe(false);
        expect(board.isBoxAvailable([5, 3])).toBe(false);
        expect(board.isBoxAvailable([1, 2])).toBe(false);
        expect(board.isBoxAvailable([0, 0])).toBe(false);
    });

    test("Returns true when the box has not been hit yet", () => {
        expect(board.isBoxAvailable([3, 4])).toBe(true);
        expect(board.isBoxAvailable([4, 5])).toBe(true);
        expect(board.isBoxAvailable([5, 7])).toBe(true);
        expect(board.isBoxAvailable([1, 9])).toBe(true);
    });
});

describe("areAllShipsSunk()", () => {
    beforeAll(() => {
        board = gameboard();
        board.placeShip([0, 0], 2);
    });
    
    test("Returns false when some ships are not sunk yet", () => {
        expect(board.areAllShipsSunk()).toBe(false);
    });
    
    test("Returns true when all ships have been sunk", () => {
        board.receiveAttack([0, 0]);
        board.receiveAttack([0, 1]);
        
        expect(board.areAllShipsSunk()).toBe(true);
    });
});
