const rls = require("readline-sync");

const rows = "ABCDEFGHIJ";
const shipLengths = [2, 3, 3, 4, 5];
let shipLocations = {};
let areasHit = {};
let numOfShips = shipLengths.shipLengths;

function buildGrid(gridSize) {
  let grid = [];
  for (let i = 0; i < gridSize; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSize; j++) {
      grid[i][j] = rows[i] + (j + 1);
    }
  }
  return grid;
}

const startGame = rls.keyIn("Press any key to start ");
const gridSize = rls.question("Enter a grid size. ");

const placeShips = () => {
  shipLengths.forEach((length) => {
    let row, col, orientation;

    do {
      row = Math.floor(Math.random() * gridSize);
      col = Math.floor(Math.random() * gridSize);
      orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
    } while (!isValidPlacement(row, col, length, orientation));

    for (let i = 0; i < length; i++) {
      if (!shipLocations[row]) {
        shipLocations[row] = {};
      }
      shipLocations[row][col + i] = true;

      if (orientation === "horizontal") {
        col++;
      } else {
        row++;
      }
    }
  });
};

const isValidPlacement = (startRow, startCol, length, orientation) => {
  for (let i = 0; i < length; i++) {
    const row = startRow + (orientation === "vertical" ? i : 0);
    const col = startCol + (orientation === "horizontal" ? i : 0);

    if (row >= gridSize || col >= gridSize || shipLocations[row]?.[col]) {
      return false;
    }
  }
  return true;
};

placeShips();

console.log("Battleship Game - Grid Layout:");
const grid = buildGrid(gridSize);
for (let i = 0; i < gridSize; i++) {
  console.log(grid[i].join(" "));
}

while (numOfShips > 0) {
  const target = rls.question("Enter a location to strike (e.g., A2): ");

  const row = rows.indexOf(target[0].toUpperCase());
  const col = parseInt(target.substring(1)) - 1;

  if (areasHit[target]) {
    console.log("You have already picked this location. Miss!");
  } else if (shipLocations[row] && shipLocations[row][col] === true) {
    areasHit[target] = true;
    shipLocations[row][col] = false;
    numOfShips--;
    console.log(
      "Hit! You have sunk a battleship!",
      numOfShips.toString(),
      "remaining"
    );
  } else {
    console.log("Miss!");
    areasHit[target] = true;
  }
}

let win;
do {
  win = rls.question(
    "You have destroyed all battleships. Would you like to play again? (Y/N): "
  );
} while (win.toUpperCase() !== "Y" && win.toUpperCase() !== "N");

if (win.toUpperCase() === "Y") {
  shipLocations = {};
  areasHit = {};
  placeShips(numOfShips);
  numOfShips = 2;
  console.log("Battleship Game - Grid Layout:");
  const newGrid = buildGrid(gridSize);
  for (let i = 0; i < gridSize; i++) {
    console.log(newGrid[i].join(" "));
  }
} else {
  console.log("Thank you for playing!");
}
