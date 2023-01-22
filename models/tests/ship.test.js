import { ship } from "../ship.js";
import { HORIZONTAL } from "../utils.js";

let testShip = ship(5, HORIZONTAL);

describe("hits property", () => {
    test("Ships should have a 'hits' property", () => {
        expect(testShip).toHaveProperty("hits");
    });
    
    test("Initial value is zero", () => {
        expect(testShip.hits).toEqual(0);
    });
});

describe("length property", () => {
    test("Ships should have a 'length' property", () => {
        expect(testShip).toHaveProperty("length");
    });

    test("Must be a number", () => {
        for (let i = 1; i < 8; i++) {
            const shipLen = i;
            testShip = ship(shipLen);
            expect(typeof testShip.length).toEqual("number");
        }
    });

    test("Must be greater than zero", () => {
        expect(ship(0)).toBeFalsy();
        expect(ship(-10)).toBeFalsy();
        expect(ship(-1000)).toBeFalsy();
    });

    test("When creating a new ship if the length property is NOT a number it shouldn't return an object", () => {
        expect(ship("5")).toBeFalsy();
        expect(ship(null)).toBeFalsy();
        expect(ship(undefined)).toBeFalsy();
        expect(ship(NaN)).toBeFalsy();
        expect(ship([5])).toBeFalsy();
        expect(ship({0: 1})).toBeFalsy();
        expect(ship(true)).toBeFalsy();
    });
});

describe("axis property", () => {
    test("Ships must have an 'axis' property", () => {
        expect(testShip).toHaveProperty("axis");
    });

    test("Must be a string", () => {
        expect(typeof testShip.axis).toBe("string");
    });
});

describe("hit()", () => {
    test("Increases 'hits' property value by one", () => {
        expect(testShip.hits).toEqual(0);

        testShip.hit();
        expect(testShip.hits).toEqual(1);

        testShip.hit();
        expect(testShip.hits).toEqual(2);
    });
    
    test("Returns the value of 'hits' property plus one", () => {
        let hits = testShip.hits;        
        expect(testShip.hit()).toEqual(hits + 1);

        hits = testShip.hits;
        expect(testShip.hit()).toEqual(hits + 1);
        
        hits = testShip.hits;
        expect(testShip.hit()).toEqual(hits + 1);
    });
});

describe("isSunk()", () => {
    beforeAll(() => testShip = new ship(5));

    test("Returns false when the number of hits is less than the length of the ship", () => {
        expect(testShip.isSunk()).toBe(false);
    });

    test("Returns true when the number of hits is greater than or equal to the length of the ship", () => {
        testShip.hits = 5;
        expect(testShip.isSunk()).toBe(true);
    });
});
