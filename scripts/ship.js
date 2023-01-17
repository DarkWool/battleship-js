import { isNumber } from "./utils.js";

function ship(_length) {
    if (!isNumber(_length) || _length <= 0) return;

    let hits = 0;

    return {
        hits,
        get length() {
            return _length;
        },
        hit() {
            this.hits++;
            return this.hits;
        },
        isSunk() {
            if (this.hits >= _length) return true;

            return false;
        },
    };
}

export {
    ship
};
