import { HORIZONTAL, isNumber } from "./utils.js";

function ship(_length, _axis = HORIZONTAL) {
    if (!isNumber(_length) || _length <= 0) return;

    let hits = 0;

    return {
        hits,
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
            if (this.hits >= _length) return true;

            return false;
        },
    };
}

export {
    ship
};
