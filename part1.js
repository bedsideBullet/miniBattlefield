const rls = require("readline-sync");

const gridSize = 3;
const rows = "ABC";
let numOfShips = 2;
let shipLocations = {};
let areasHit = {};

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

const placeShips = (numOfShips) => {
  for (let i = 0; i < numOfShips; i++) {
    let row = Math.floor(Math.random() * gridSize);
    let col = Math.floor(Math.random() * gridSize);

    while (shipLocations[row] && shipLocations[row][col]) {
      row = Math.floor(Math.random() * gridSize);
      col = Math.floor(Math.random() * gridSize);
    }
    if (!shipLocations[row]) {
      shipLocations[row] = {};
    }
    shipLocations[row][col] = true;
  }
};

placeShips(numOfShips);

const restartGame = () => {
  const win = rls.keyInYNStrict(
    "You have destroyed all battleships. Would you like to play again? (Y/N): "
  );
  if (win) {
    shipLocations = {};
    areasHit = {};
    numOfShips = 2;
    placeShips(numOfShips);

    gameplay();
  }
};

const gameplay = () => {
  while (numOfShips > 0) {
    console.log("Battleship Game - Grid Layout:");
    const grid = buildGrid(gridSize);
    for (let i = 0; i < gridSize; i++) {
      console.log(grid[i].join(" "));
    }

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
  restartGame();
};
gameplay();
