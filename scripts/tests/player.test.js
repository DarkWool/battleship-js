import { player } from "../player.js";
import { gameboard } from "../gameboard.js";

const playerA = player("Wool", gameboard());
const playerB = player("Fenix", gameboard());

describe("Player properties", () => {
    test("Players should have a name property", () => {
        expect(playerA).toHaveProperty("name");
        expect(playerA.name).toBe("Wool");
        expect(playerB.name).toBe("Fenix");
    });

    test("Players should have a gameboard property", () => {
        expect(playerA).toHaveProperty("gameboard");
    });
});

describe("attack()", () => {
    test("It shouldn't shoot the same coords twice (it doesn't call receiveAttack when it has already been shot on the given coords)", () => {
        playerA.attack(playerB.gameboard, [2, 5]);
        playerA.attack(playerB.gameboard, [0, 8]);
        playerA.attack(playerB.gameboard, [9, 9]);
        
        const boardB = jest.spyOn(playerB.gameboard, "receiveAttack");
        playerA.attack(playerB.gameboard, [2, 5]);
        playerA.attack(playerB.gameboard, [0, 8]);
        playerA.attack(playerB.gameboard, [9, 9]);

        expect(boardB).not.toHaveBeenCalled();
    });
});