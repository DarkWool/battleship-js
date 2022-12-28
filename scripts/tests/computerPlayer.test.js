import { computerPlayer } from "../computerPlayer.js";
import { gameboard } from "../gameboard.js";

const enemyGameboard = gameboard();
const player = computerPlayer("PC", gameboard());

describe("computerPlayer inherits properties from 'player'", () => {
    test("Should have a 'name' property", () => {
        expect(player).toHaveProperty("name");
    });
    
    test("Should have a 'gameboard' property", () => {
        expect(player).toHaveProperty("gameboard");
    });
});

describe("getLastCoords", () => {
    player.attack(enemyGameboard);
    const board = enemyGameboard.getBoard();

    test("Should return an array", () => {
        expect(player.getLastCoords).toBeInstanceOf(Array);
    });

    test("Returns an array of length 2", () => {
        expect(player.getLastCoords).toHaveLength(2);
    });

    test("Returns an array with numbers", () => {
        const coords = player.getLastCoords;
        for (const coord of coords) {
            expect(coord).not.toBeNaN();
            expect(coord).toEqual(expect.any(Number));
            expect(typeof coord).toBe("number");
        }
    });

    test("Returns the value of the last coords used by the computer player to attack the enemy board", () => {
        player.attack(enemyGameboard);
        let coords = player.getLastCoords;
        expect(board[coords[0]][coords[1]]).toBe("/");

        player.attack(enemyGameboard);
        coords = player.getLastCoords;
        expect(board[coords[0]][coords[1]]).toBe("/");
    });
});

describe("attack()", () => {
    const board = enemyGameboard.getBoard();
        
    test("Attacks a position on the enemy board", () => {
        let attackCoords;

        player.attack(enemyGameboard);
        attackCoords = player.getLastCoords;
        expect(board[attackCoords[0]][attackCoords[1]]).toBe("/");
        
        player.attack(enemyGameboard);
        attackCoords = player.getLastCoords;
        expect(board[attackCoords[0]][attackCoords[1]]).toBe("/");
        
        player.attack(enemyGameboard);
        attackCoords = player.getLastCoords;
        expect(board[attackCoords[0]][attackCoords[1]]).toBe("/");

        player.attack(enemyGameboard);
        attackCoords = player.getLastCoords;
        expect(board[attackCoords[0]][attackCoords[1]]).toBe("/");
    });
});
