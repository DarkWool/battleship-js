import { player } from "../player.js";
import { gameboard } from "../gameboard.js";

const playerA = player("Wool", gameboard());
const playerB = player("Fenix", gameboard());

describe("Player object properties", () => {
    test("Should have a name property", () => {
        expect(playerA).toHaveProperty("name");
        expect(playerA.name).toBe("Wool");
        expect(playerB.name).toBe("Fenix");
    });

    test("Should have a gameboard property", () => {
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