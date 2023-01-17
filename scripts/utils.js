function isNumber(num) {
    return (typeof num === "number" && !isNaN(num));
}

export {
    isNumber,
};
