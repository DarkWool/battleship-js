import { gameboard } from "../gameboard.js";

let newBoard = gameboard();

describe("Board", () => {
    test("Creates a 10x10 gameboard", () => {
        expect(newBoard.board).toHaveLength(10);
    
        for (let row of newBoard.board) {
            expect(row).toHaveLength(10);
        }
    });
})

describe("placeShip()", () => {
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
});

describe("receiveAttack()", () => {
    test("Correctly registers a missed shot", () => {
        newBoard.receiveAttack([3, 3]);
        newBoard.receiveAttack([8, 0]);
        newBoard.receiveAttack([2, 7]);
        newBoard.receiveAttack([4, 3]);
        newBoard.receiveAttack([1, 6]);
    
        expect(newBoard.board[3][3]).toBe("/");
        expect(newBoard.board[8][0]).toBe("/");
        expect(newBoard.board[2][7]).toBe("/");
        expect(newBoard.board[4][3]).toBe("/");
        expect(newBoard.board[1][6]).toBe("/");
    });
    
    test("Determines whether or not the attack hit a ship", () => {
        newBoard.receiveAttack([0, 0]);
        newBoard.receiveAttack([1, 2]);
        newBoard.receiveAttack([1, 3]);
        newBoard.receiveAttack([5, 2]);
        newBoard.receiveAttack([5, 4]);
        newBoard.receiveAttack([5, 6]);
    
        expect(newBoard.board[0][0]).toBe("X");
        expect(newBoard.board[1][2]).toBe("X");
        expect(newBoard.board[1][3]).toBe("X");
        expect(newBoard.board[5][2]).toBe("X");
        expect(newBoard.board[5][4]).toBe("X");
        expect(newBoard.board[5][6]).toBe("X");
    });
});

describe("checkForLeftShips()", () => {
    beforeAll(() => {
        newBoard = gameboard();
        newBoard.placeShip(0, 0, 2);
    });
    
    test("Returns false when some ships are not sunk yet", () => {
        expect(newBoard.checkForLeftShips()).toBe(false);
    });
    
    test("Returns true when all ships have been sunk", () => {
        newBoard.receiveAttack([0, 0]);
        newBoard.receiveAttack([0, 1]);
        
        expect(newBoard.checkForLeftShips()).toBe(true);
    });
});
