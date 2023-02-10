import { isNumber } from "./utils.js";

function ship(_length, _axis) {
  if (!isNumber(_length) || _length <= 0) return;

  return {
    hits: 0,
    get length() {
      return _length;
    },
    get axis() {
      return _axis;
    },
    hit() {
      this.hits++;
      return this.hits;
    },
    isSunk() {
      if (this.hits >= this.length) return true;

      return false;
    },
  };
}

export { ship };
