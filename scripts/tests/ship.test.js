import { ship } from "../ship.js";

let testShip = new ship(5);

describe("Hits property", () => {
    test("Ships should have a 'hits' property", () => {
        expect(testShip).toHaveProperty("hits");
    });
    
    test("Initial value is zero", () => {
        expect(testShip.hits).toEqual(0);
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
