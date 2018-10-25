class Cell {
  constructor(row, column, size, risk = 1) {
    this.x = row;
    this.y = column;
    this.size = size;
    this.revealed = false;
    this.neighbors = 0;
    this.risk = risk;
    this.background = 255;
    this.flagged = false;

    // determine if cell has mine
    ((floor(Math.random() * 10)) <= risk) ? this.contains = true: this.contains =
      false;
  }

  evaluateNeighbors() {
    for (let xoff = -1; xoff <= 1; xoff++) {
      for (let yoff = -1; yoff <= 1; yoff++) {
        let i = this.x + xoff;
        let j = this.y + yoff;
        if (i > -1 && i <= grid.length - 1 && j > -1 && j <= grid.length - 1) {
          let neighbor = grid[i][j];
          if (neighbor.contains) this.neighbors++;
        }
      }
    }
  }

  show() {
    let offset = (this.size ^ 2) / 2;
    if (this.flagged) {
      fill(255, 0, 0, 100) // transparent red flag
      rectMode(RADIUS)
      rect(this.x * this.size + offset, this.y * this.size + offset, this.size *
        0.5 / 2, this.size * 0.5 / 2);
    } else if (this.contains) {
      stroke(0);
      fill(color(0, 126, 255, 102));
      ellipseMode(RADIUS);
      ellipse(this.x * this.size + offset, this.y * this.size + offset, (
        this
        .size * 0.7) / 2);
    } else if (this.neighbors > 0) {
      rectMode(CORNER);
      textSize(cellSize * 0.9);
      textAlign(CENTER, CENTER);
      fill(0)
      text(this.neighbors, this.x * this.size + offset, this.y * this.size +
        offset);
    }
  }

  reveal() {
    this.revealed = true;
    this.background = 200;
    if (this.contains && !this.flagged) {
      exploded = true;
      console.log("BOOMM!!!");
      this.explode();
    }

    if (!this.flagged && this.neighbors === 0) {
      this.revealArea();
    }
  }

  revealArea() {
    // flood fill surrounding area without mines
    for (let xoff = -1; xoff <= 1; xoff++) {
      for (let yoff = -1; yoff <= 1; yoff++) {
        let i = this.x + xoff;
        let j = this.y + yoff;

        if (i > -1 && i <= grid.length - 1 && j > -1 && j <= grid.length - 1) {
          let neighbor = grid[i][j];
          if (!neighbor.contains && !neighbor.revealed) {
            neighbor.reveal();
          }
        }
      }
    }
  }

  explode() {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        grid[i][j].revealed = true;
      }
    }
  }
}
