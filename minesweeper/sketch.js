var grid = [];
var gridSize = 10;
var cellSize;
var exploded = false;
var risk;

function setup() {
  createCanvas(600, 600);

  // restart button
  let button = createButton("New game");
  button.position(650, 20);
  button.mousePressed(initializeGame);

  let difficulty = createSlider(0.5, 4, 1.5, 0.5);
  difficulty.position(650, 60);
  difficulty.changed(() => {
    risk = difficulty.value();
    initializeGame();
  });

  cellSize = width / gridSize;
  initializeGame();
}

function draw() {
  background(255)
    // draw grid
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      stroke(0);
      strokeWeight(2);
      fill(grid[i][j].background);
      rect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let currentCell = grid[i][j];
      if (currentCell.revealed) {
        currentCell.show();
      }
    }
  }

}

function mouseClicked() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
    return;
  }

  let cellX = floor(mouseX / cellSize);
  let cellY = floor(mouseY / cellSize);

  let currentCell = grid[cellX][cellY];
  if (!currentCell.flagged) currentCell.reveal();
}

function mousePressed() {
  if (mouseButton === RIGHT && !exploded) {
    let cellX = floor(mouseX / cellSize);
    let cellY = floor(mouseY / cellSize);
    // corrects for edge cases
    if (cellX < 0) cellX = 0;
    if (cellX > grid.length - 1) cellX = grid.length - 1;
    if (cellY < 0) cellY = 0;
    if (cellY > grid.length - 1) cellY = grid.length - 1

    let currentCell = grid[cellX][cellY];
    if (currentCell.flagged) {
      currentCell.flagged = false;
    } else {
      currentCell.flagged = true;
    }

    currentCell.reveal();
  }
}

function initializeGame() {
  exploded = false;
  console.clear();
  grid = [] // clear grid to fix neighbor count issue on consecutive games
  grid = make2DArray(gridSize)

  // evalute neighbors after grid has been populated
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      grid[i][j].evaluateNeighbors();
    }
  }
}

function make2DArray(size) {
  let result = []
  for (let i = 0; i < size; i++) {
    let tempRow = [];
    for (let j = 0; j < size; j++) {
      tempRow.push(new Cell(i, j, cellSize, risk));
    }
    result.push(tempRow);
  }
  return result;
}
