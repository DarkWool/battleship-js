import { player } from "../player.js";

const playerA = player("Wool");
const playerB = player("Fenix");

describe("Players must have a", () => {
  describe("'Name' prop", () => {
    test("Must exist", () => {
      expect(playerA).toHaveProperty("name");
      expect(playerA.name).toBe("Wool");
      expect(playerB.name).toBe("Fenix");
    });
  });

  describe("'Board' prop", () => {
    test("Must exist", () => {
      expect(playerA).toHaveProperty("board");
      expect(playerB).toHaveProperty("board");
    });
  });
});

describe("attack()", () => {
  test("Should call the 'receiveAttack' method of the enemy board", () => {
    const receiveAttack = jest.spyOn(playerB.board, "receiveAttack");
    playerA.attack(playerB.board, [2, 5]);
    playerA.attack(playerB.board, [0, 8]);
    playerA.attack(playerB.board, [9, 9]);

    expect(receiveAttack).toHaveBeenCalled();
    expect(receiveAttack).toHaveBeenCalledTimes(3);
  });
});

describe("Doesn't creates a new player", () => {
  test("When 'name' argument is not a string or it's an empty string", () => {
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
