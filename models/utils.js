const HORIZONTAL = "horiz";
const VERTICAL = "vert";

function isNumber(num) {
  return typeof num === "number" && !isNaN(num);
}

function getRandomCoords(max) {
  const coordY = Math.floor(Math.random() * (max - 0 + 1)) + 0;
  const coordX = Math.floor(Math.random() * (max - 0 + 1)) + 0;
  return [coordY, coordX];
}

export { HORIZONTAL, VERTICAL, isNumber, getRandomCoords };
