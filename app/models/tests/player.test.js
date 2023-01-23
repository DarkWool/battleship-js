import { player } from "../player.js";

const playerA = player("Wool");
const playerB = player("Fenix");

describe("Name prop", () => {
    test("Should have a 'name' property", () => {
        expect(playerA).toHaveProperty("name");
        expect(playerA.name).toBe("Wool");
        expect(playerB.name).toBe("Fenix");
    });

    test(`Fails to create a player when 'name' is not a string 
    or it's an empty string`, () => {
        expect(player(123)).toBeFalsy();
        expect(player(0)).toBeFalsy();
        expect(player(["DarkWool"])).toBeFalsy();
        expect(player({ name: "DarkWool" })).toBeFalsy();
        expect(player("")).toBeFalsy();
        expect(player(null)).toBeFalsy();
        expect(player(undefined)).toBeFalsy();
        expect(player(true)).toBeFalsy();
    });
});

describe("Gameboard prop", () => {
    test("Should have a 'gameboard' property", () => {
        expect(playerA).toHaveProperty("gameboard");
        expect(playerB).toHaveProperty("gameboard");
    });
});

describe("attack()", () => {
    test("It shouldn't shoot to the same coords twice", () => {
        playerA.attack(playerB.gameboard, [2, 5]);
        playerA.attack(playerB.gameboard, [0, 8]);
        playerA.attack(playerB.gameboard, [9, 9]);
        
        const receiveAttack = jest.spyOn(playerB.gameboard, "receiveAttack");
        playerA.attack(playerB.gameboard, [2, 5]);
        playerA.attack(playerB.gameboard, [0, 8]);
        playerA.attack(playerB.gameboard, [9, 9]);

        expect(receiveAttack).not.toHaveBeenCalled();
    });
});
