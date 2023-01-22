const HORIZONTAL = "horiz";
const VERTICAL = "vert";

function isNumber(num) {
    return (typeof num === "number" && !isNaN(num));
}

export {
    HORIZONTAL,
    VERTICAL,
    isNumber,
};
