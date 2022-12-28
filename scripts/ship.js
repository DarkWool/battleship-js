function ship(length) {
    let hits = 0;

    return {
        hits,
        hit() {
            this.hits++;
            return this.hits;
        },
        isSunk() {
            if (this.hits >= length) return true;

            return false;
        }
    };
}

export {
    ship
};
