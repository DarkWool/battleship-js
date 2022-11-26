import { ship } from "../ship.js";

const testShip = new ship(5);

test("Initial value of 'hits' property is zero", () => {
    expect(testShip.hits).toEqual(0);
});

test("Increase 'hits' by one properly", () => {
    expect(testShip.hit()).toEqual(1);
    expect(testShip.hit()).toEqual(2);
    expect(testShip.hit()).toEqual(3);
    expect(testShip.hit()).toEqual(4);
    expect(testShip.hit()).toEqual(5);
});

test("isSunk changes 'sunk' to true when hits is greater than the length of the ship", () => {
    const newShip = new ship(5);
    expect(newShip.isSunk()).toEqual(false);

    newShip.hits = 5;
    expect(newShip.isSunk()).toEqual(true);
});