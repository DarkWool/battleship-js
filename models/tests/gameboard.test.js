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
    beforeEach(() => {
        board = gameboard();
        testBoard = board.getBoard();
    });

    test("Places a ship on the board horizontally", () => {
        expect(board.placeShip([2, 3], 5, "horiz")).toBe(true);
        expect(board.placeShip([0, 8], 2, "horiz")).toBe(true);
        expect(board.placeShip([5, 6], 4, "horiz")).toBe(true);
        expect(board.placeShip([7, 7], 3, "horiz")).toBe(true);
        expect(board.placeShip([9, 8], 2, "horiz")).toBe(true);
    });

    test("Places a ship on the board vertically", () => {
        expect(board.placeShip([6, 1], 4, "vert")).toBe(true);
        expect(board.placeShip([5, 3], 5, "vert")).toBe(true);
        expect(board.placeShip([8, 7], 2, "vert")).toBe(true);
        expect(board.placeShip([0, 0], 3, "vert")).toBe(true);
        expect(board.placeShip([7, 9], 3, "vert")).toBe(true);
    });

    test("Places a ship object on the board coords", () => {
        board.placeShip([0, 0], 3, "horiz");
        board.placeShip([5, 4], 4, "vert");

        expect(typeof testBoard[0][0]).toBe("object");
        expect(typeof testBoard[0][1]).toBe("object");
        expect(typeof testBoard[0][2]).toBe("object");
        expect(typeof testBoard[5][4]).toBe("object");
        expect(typeof testBoard[6][4]).toBe("object");
        expect(typeof testBoard[7][4]).toBe("object");
        expect(typeof testBoard[8][4]).toBe("object");
    });
});

describe("canShipBePlaced()", () => {
    test("Returns false when ship's length is less than or equal to zero", () => {
        expect(board.canShipBePlaced([0, 0], 0, true)).toBe(false);
        expect(board.canShipBePlaced([4, 7], -5, true)).toBe(false);
        expect(board.canShipBePlaced([9, 9], -2, false)).toBe(false);
    });

    test("Returns false when axis are horizontal and the X coord plus ship's length is greater than the board length", () => {
        expect(board.canShipBePlaced([5, 8], 5, true)).toBe(false);
        expect(board.canShipBePlaced([9, 7], 4, true)).toBe(false);
        expect(board.canShipBePlaced([3, 6], 5, true)).toBe(false);
        expect(board.canShipBePlaced([8, 9], 2, true)).toBe(false);
    });

    test("Returns false when axis are vertical and the Y coord plus ship's length is greater than the board length", () => {
        expect(board.canShipBePlaced([9, 7], 3, false)).toBe(false);
        expect(board.canShipBePlaced([6, 3], 5, false)).toBe(false);
        expect(board.canShipBePlaced([7, 9], 4, false)).toBe(false);
        expect(board.canShipBePlaced([8, 5], 3, false)).toBe(false);
        expect(board.canShipBePlaced([9, 1], 2, false)).toBe(false);
    });

    test("Returns false if one of the coords is less than zero", () => {
        expect(board.canShipBePlaced([-2, 7], 3, false)).toBe(false);
        expect(board.canShipBePlaced([6, -3], 5, false)).toBe(false);
        expect(board.canShipBePlaced([-7, 9], 4, true)).toBe(false);
        expect(board.canShipBePlaced([-8, -5], 3, true)).toBe(false);
        expect(board.canShipBePlaced([-9, 1], 2, false)).toBe(false);
    });

    test("Returns false if one of the coords is greater than the board length", () => {
        expect(board.canShipBePlaced([9, 10], 3, false)).toBe(false);
        expect(board.canShipBePlaced([5, 15], 5, false)).toBe(false);
        expect(board.canShipBePlaced([11, 0], 4, true)).toBe(false);
        expect(board.canShipBePlaced([7, 19], 3, true)).toBe(false);
        expect(board.canShipBePlaced([10, 9], 2, true)).toBe(false);
    });

    test("Returns false when a ship is already placed at the given coords", () => {
        board.placeShip([2, 2], 5, "horiz");
        board.placeShip([0, 8], 2, "vert");
        board.placeShip([5, 6], 4, "horiz");

        expect(board.canShipBePlaced([2, 2], 3, true)).toEqual(false);
        expect(board.canShipBePlaced([2, 3], 3, true)).toEqual(false);
        expect(board.canShipBePlaced([2, 4], 2, true)).toEqual(false);
        expect(board.canShipBePlaced([2, 5], 2, true)).toEqual(false);
        expect(board.canShipBePlaced([2, 6], 2, true)).toEqual(false);
        expect(board.canShipBePlaced([0, 8], 2, false)).toEqual(false);
        expect(board.canShipBePlaced([1, 8], 2, false)).toEqual(false);
        expect(board.canShipBePlaced([5, 6], 2, true)).toEqual(false);
        expect(board.canShipBePlaced([5, 7], 2, true)).toEqual(false);
        expect(board.canShipBePlaced([5, 8], 2, true)).toEqual(false);
        expect(board.canShipBePlaced([5, 9], 2, true)).toEqual(false);
    });

    test("You can't place a new ship around another one, a space of 1 box is required between them", () => {
        expect(board.canShipBePlaced([1, 2], 1, true)).toBe(false);
        expect(board.canShipBePlaced([2, 2], 1, true)).toBe(false);
        expect(board.canShipBePlaced([2, 8], 1, true)).toBe(false);
        expect(board.canShipBePlaced([3, 5], 3, true)).toBe(false);

        expect(board.canShipBePlaced([0, 7], 1, true)).toBe(false); 
        expect(board.canShipBePlaced([0, 8], 1, true)).toBe(false);
        expect(board.canShipBePlaced([0, 9], 1, true)).toBe(false);
        expect(board.canShipBePlaced([1, 7], 1, false)).toBe(false);
        expect(board.canShipBePlaced([1, 8], 1, true)).toBe(false);
        expect(board.canShipBePlaced([1, 9], 1, false)).toBe(false);
    });
});

describe("receiveAttack()", () => {
    beforeAll(() => {
        board = gameboard();
        testBoard = board.getBoard();
        board.placeShip([3, 6], 4, "horiz");
        board.placeShip([0, 0], 2, "vert");
    });

    test("Registers a missed shot on the board", () => {
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
    
    test("Registers a shot to a ship on the board", () => {
        board.receiveAttack([3, 6]);
        board.receiveAttack([3, 7]);
        board.receiveAttack([3, 9]);
        board.receiveAttack([0, 0]);
        
        expect(testBoard[3][6]).toBe("X");
        expect(testBoard[3][7]).toBe("X");
        expect(testBoard[3][9]).toBe("X");
        expect(testBoard[0][0]).toBe("X");
    });
    
    test(`When the attack sunk a ship it registers a shot to each one 
    of the adjacent boxes to the ship`, () => {
        board.receiveAttack([3, 8]);
        board.receiveAttack([1, 0]);

        expect(testBoard[2][5]).toBe("/");
        expect(testBoard[2][6]).toBe("/");
        expect(testBoard[2][7]).toBe("/");
        expect(testBoard[2][8]).toBe("/");
        expect(testBoard[2][9]).toBe("/");
        expect(testBoard[3][5]).toBe("/");
        expect(testBoard[4][5]).toBe("/");
        expect(testBoard[4][6]).toBe("/");
        expect(testBoard[4][7]).toBe("/");
        expect(testBoard[4][8]).toBe("/");
        expect(testBoard[4][9]).toBe("/");

        expect(testBoard[0][1]).toBe("/");
        expect(testBoard[1][1]).toBe("/");
        expect(testBoard[2][0]).toBe("/");
        expect(testBoard[2][1]).toBe("/");
    });

    describe("Returns an object with the following properties", () => {
        beforeAll(() => {
            board = gameboard();
            testBoard = board.getBoard();
            board.placeShip([3, 6], 4, "horiz");
            board.placeShip([0, 0], 2, "vert");
        });

        test("'shipHit' prop value is false for a missed shot", () => {
            const response = { shipHit: false };
            expect(board.receiveAttack([6, 6])).toMatchObject(response);
            expect(board.receiveAttack([2, 0])).toMatchObject(response);
            expect(board.receiveAttack([1, 8])).toMatchObject(response);
            expect(board.receiveAttack([8, 1])).toMatchObject(response);
            expect(board.receiveAttack([9, 0])).toMatchObject(response);
        });
    
        test("'shipHit' prop value is true when a ship is hit", () => {
            const response = { shipHit: true };
            expect(board.receiveAttack([3, 6])).toMatchObject(response);
            expect(board.receiveAttack([3, 7])).toMatchObject(response);
            expect(board.receiveAttack([3, 9])).toMatchObject(response);
            expect(board.receiveAttack([0, 0])).toMatchObject(response);
            expect(board.receiveAttack([1, 0])).toMatchObject(response);
        });
    });
});

describe("getBoxAt()", () => {
    beforeEach(() => {
        board = gameboard();
        testBoard = board.getBoard();
    });

    test("Returns the value of the box at the input coords", () => {
        board.placeShip([4, 4], 2, "horiz");

        expect(board.getBoxAt([0, 1])).toBe("");
        expect(board.getBoxAt([0, 2])).toBe("");
        expect(board.getBoxAt([7, 3])).toBe("");
        expect(board.getBoxAt([8, 9])).toBe("");
        expect(typeof board.getBoxAt([4, 4])).toBe("object");
        expect(typeof board.getBoxAt([4, 5])).toBe("object");
    });
});

describe("removeShip()", () => {
    beforeAll(() => {
        board = gameboard();
        testBoard = board.getBoard();
        board.placeShip([0, 0], 5, "vert");
        board.placeShip([2, 6], 2, "vert");
        board.placeShip([7, 3], 5, "horiz");
    });
    
    test("Removes a ship from the board", () => {
        board.removeShip([0, 0]);
        board.removeShip([2, 6]);
        board.removeShip([7, 3]);

        expect(testBoard[0][0]).toBe("");
        expect(testBoard[0][1]).toBe("");
        expect(testBoard[0][2]).toBe("");
        expect(testBoard[0][3]).toBe("");
        expect(testBoard[0][4]).toBe("");
        
        expect(testBoard[2][6]).toBe("");
        expect(testBoard[3][6]).toBe("");

        expect(testBoard[7][3]).toBe("");
        expect(testBoard[7][4]).toBe("");
        expect(testBoard[7][5]).toBe("");
        expect(testBoard[7][6]).toBe("");
        expect(testBoard[7][7]).toBe("");
    });
});

describe("isBoxAttacked()", () => {
    beforeAll(() => {
        board = gameboard();
        testBoard = board.getBoard();
        board.placeShip([3, 6], 4, "horiz");
        board.placeShip([0, 0], 2, "vert");

        board.receiveAttack([3, 6]);
        board.receiveAttack([3, 7]);
        board.receiveAttack([3, 8]);
        board.receiveAttack([3, 9]);
        board.receiveAttack([0, 0]);
    });
    
    test("Returns false when the box at the specified coords has NOT been attacked before", () => {
        expect(board.isBoxAttacked([5, 2])).toBe(false);
        expect(board.isBoxAttacked([5, 3])).toBe(false);
        expect(board.isBoxAttacked([8, 6])).toBe(false);
        expect(board.isBoxAttacked([0, 1])).toBe(false);
        expect(board.isBoxAttacked([1, 0])).toBe(false);
        expect(board.isBoxAttacked([1, 1])).toBe(false);
        expect(board.isBoxAttacked([2, 0])).toBe(false);
        expect(board.isBoxAttacked([2, 1])).toBe(false);
    });

    test("Returns true when the box has been already hit", () => {
        expect(board.isBoxAttacked([0, 0])).toBe(true);
        expect(board.isBoxAttacked([3, 6])).toBe(true);
        expect(board.isBoxAttacked([3, 7])).toBe(true);
        expect(board.isBoxAttacked([3, 8])).toBe(true);
        expect(board.isBoxAttacked([3, 9])).toBe(true);
    });
});

describe("randomize()", () => {
    beforeAll(() => {
        board = gameboard();
        testBoard = board.getBoard();
    });

    test("Places a new ship on the board for every element in the array", () => {
        const shipsToPlace = [5, 4, 3, 3, 2];
        const shipsFound = [];
        board.randomize(shipsToPlace);

        for (const row of testBoard) {
            for (const box of row) {
                if (typeof box === "object" && shipsFound.indexOf(box) === -1) {
                    shipsFound.push(box);
                }
            }
        }

        expect(shipsFound).toHaveLength(shipsToPlace.length);
    });

    test("Places ships with lengths matching the elements in the input array", () => {
        const shipsToPlace = [5, 4, 3, 3, 2];
        const shipsFound = [];
        board.randomize(shipsToPlace);

        for (const row of testBoard) {
            for (const box of row) {
                if (typeof box === "object" && shipsFound.indexOf(box.ship) === -1) {
                    shipsFound.push(box.ship);
                }
            }
        }

        for (const ship of shipsFound) {
            const index = shipsToPlace.indexOf(ship.length);
            expect(index).not.toEqual(-1);

            shipsToPlace.splice(index, 1);
        }

        expect(shipsToPlace).toHaveLength(0);
    });
});

describe("areAllShipsSunk()", () => {
    beforeAll(() => {
        board = gameboard();
        board.placeShip([0, 0], 2, "horiz");
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
