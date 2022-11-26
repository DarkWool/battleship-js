function ship(length) {
    let hits = 0;
    let sunk = false;

    return {
        hits,
        hit() {
            this.hits++;
            return this.hits;
        },
        isSunk() {
            if (this.hits >= length) {
                sunk = true;
                return true;
            }

            return false;
        }
    }
}

export {
    ship
};