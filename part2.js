const rls = require("readline-sync");

const rows = "ABCDEFGHIJ";
const numOfShips = {
  2: 1,
  3: 2,
  4: 1,
  5: 1,
};
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
const gridSize = parseInt(rls.question("Please enter a grid size "));

const placeShips = () => {
  for (const shipSize in numOfShips) {
    for (let i = 0; i < numOfShips[shipSize]; i++) {
      let shipPlaced = false;
      while (!shipPlaced) {
        const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
        let row, col;
        if (orientation === "horizontal") {
          row = Math.floor(Math.random() * gridSize);
          col = Math.floor(Math.random() * (gridSize - shipSize + 1));
        } else {
          row = Math.floor(Math.random() * (gridSize - shipSize + 1));
          col = Math.floor(Math.random() * gridSize);
        }

        let validPlacement = true;
        for (let j = 0; j < shipSize; j++) {
          const newRow = row + (orientation === "vertical" ? j : 0);
          const newCol = col + (orientation === "horizontal" ? j : 0);
          if (
            newRow < 0 ||
            newRow >= gridSize ||
            newCol < 0 ||
            newCol >= gridSize ||
            (shipLocations[newRow] && shipLocations[newRow][newCol])
          ) {
            validPlacement = false;
            break;
          }
        }

        if (validPlacement) {
          for (let j = 0; j < shipSize; j++) {
            const newRow = row + (orientation === "vertical" ? j : 0);
            const newCol = col + (orientation === "horizontal" ? j : 0);
            if (!shipLocations[newRow]) {
              shipLocations[newRow] = {};
            }
            shipLocations[newRow][newCol] = true;
          }
          shipPlaced = true;
        }
      }
    }
  }
};

placeShips();

const restartGame = () => {
  const win = Object.values(shipLocations).every((row) =>
    Object.values(row).every((cell) => !cell)
  );
  if (win) {
    shipLocations = {};
    areasHit = {};
    placeShips();

    gameplay();
  }
};

const gameplay = () => {
  while (
    Object.values(shipLocations).some((row) =>
      Object.values(row).some((cell) => cell)
    )
  ) {
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
      console.log("Hit! You have hit a battleship!");
    } else {
      console.log("Miss!");
      areasHit[target] = true;
    }
  }

  const win = rls.keyInYNStrict("You have won! Would you like to play again? ");
  if (win) {
    restartGame();
  }
};

gameplay();
