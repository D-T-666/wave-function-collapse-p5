class Field {
  constructor(color_table, patterns, matcher, W, H) {
    this.color_table = color_table;
    this.patterns = patterns;
    this.patternsLength = patterns.length;
    this.matcher = matcher;
    this.W = W;
    this.H = H;

    this.affected = [];

    this.clearGrid();
  }

  clearGrid() {
    // Initializes the grid. Also clears the grid if already populated
    this.grid = [];
    for (let i = 0; i < this.H; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.W; j++) {
        let states = [];
        for (let k = 0; k < this.patternsLength; k++) {
          states.push(k);
        }
        this.grid[i][j] = new Tile(states, this.patternsLength, j, i);
      }
    }
  }

  getLowestEntropyLocation() {
    let grid = []; // The grid of entropies
    let minCol = []; // Collumn of minimum numbers

    for (let i = 0; i < this.H; i++) {
      // Initialize the row of entropies
      let entropy_row = [];

      // Populate the row of entropies with values
      for (let j = 0; j < this.W; j++) {
        entropy_row[j] = this.grid[i][j].getEntropy();
      }

      grid[i] = entropy_row;

      // Store the minimum of the row in the minCol
      minCol[i] = Min(entropy_row);
    }

    // Get the y index of the minimum value in the collumn
    let iInd = minCol.indexOf(Min(minCol));
    // Get the x index of the minimum value in the collumn
    let jInd = grid[iInd].indexOf(Min(minCol));

    return [iInd, jInd];
  }

  getNeighborIndicies(i, j) {
    // Gets the warped inidicies of the
    // neighbors of a specified index.
    return [
      [
        // Right
        (i + 0 + this.H) % this.H,
        (j + 1 + this.W) % this.W,
      ],
      [
        // Down
        (i + 1 + this.H) % this.H,
        (j + 0 + this.W) % this.W,
      ],
      [
        // Left
        (i + 0 + this.H) % this.H,
        (j - 1 + this.W) % this.W,
      ],
      [
        //
        (i - 1 + this.H) % this.H,
        (j + 0 + this.W) % this.W,
      ],
    ];
  }

  seed() {
    const i = floor(random(0.45, 0.55) * this.H);
    const j = floor(random(0.45, 0.55) * this.W);
    this.grid[i][j].collapse();
    this.grid[i][j].color = this.color_table[
      this.patterns[this.grid[i][j].states[0]]
    ];

    this.affected = this.getNeighborIndicies(i, j);
  }

  isDone() {
    for (let i = this.H - 1; i >= 0; i--) {
      for (let j = this.W - 1; j >= 0; j--) {
        if (!this.grid[i][j].hasCollapsed()) {
          return false;
        }
      }
    }

    return true;
  }

  updateChunk() {
    // While there are tiles to be updated and no tiles have collapsed
    while (this.affected.length > 0) {
      this.updateStep();
    }

    this.updateStep();
  }

  updateStep() {
    if (!this.isDone()) {
      // Collapse one with the smallest entropy
      if (this.affected.length == 0) {
        // Get the indicies of the tile with the minimum entropy.
        let [iMin, jMin] = this.getLowestEntropyLocation();

        // Colapse the tile.
        this.grid[iMin][jMin].collapse(3);

        // Add the neighbors of the tile to the affected list to be updated later.
        this.affected = this.getNeighborIndicies(iMin, jMin);

        // Set the color of the tile to the corresponding patterns (0,0) tile
        this.grid[iMin][jMin].color = this.color_table[
          this.patterns[this.grid[iMin][jMin].states[0]]
        ];
      }

      // For every affected tile
      let current = this.affected.splice(0, 1)[0];
      while (this.grid[current[0]][current[1]].hasCollapsed()) {
        current = this.affected.splice(0, 1)[0];
        if (current == undefined) return;
      }

      // Get the location
      let [i, j] = current;

      // Get the neighbor indicies
      let neighborIndicies = this.getNeighborIndicies(i, j);

      // Get the neighbor states
      let neighbors = [];
      // Loop over every neighbor location
      for (let dir = 0; dir < 4; dir++) {
        // Get the location
        let [iN, jN] = neighborIndicies[dir];

        // Add the coresponding tiles states to the neighbor states array
        neighbors.push(this.grid[iN][jN].states);
      }

      // Get previous states
      let pStates = this.grid[i][j].states;

      // console.time("mathcher.match");
      // Get new states and the direction of the possible collapse
      // console.time("match.match");
      let nStates = this.matcher.match(pStates, neighbors);
      // console.timeEnd("match.match");
      const nStatesLen = nStates.length;
      // console.timeEnd("mathcher.match");

      // If the size of the previous and new states are different,
      // and the length of new states is greater than 0
      if (pStates.length != nStatesLen && nStatesLen > 0) {
        // fill(0, 0, 255);
        // noStroke();
        // rect(
        //   this.grid[i][j].x * tileW,
        //   this.grid[i][j].y * tileH,
        //   tileW,
        //   tileH
        // );
        // Update tiles states to be the new states
        this.grid[i][j].states = nStates;

        // If the length of new states is 1, it means that
        // the tile has collapsed
        if (nStatesLen == 1) {
          // Set the color of the tile to the coresponding paterns (0,0) tile
          this.grid[i][j].color = this.color_table[this.patterns[nStates[0]]];
          this.grid[i][j]._hasCollapsed = true;
        } else {
          let r = 0;
          let g = 0;
          let b = 0;
          for (let k = 0; k < nStatesLen; k++) {
            r += this.color_table[this.patterns[nStates[k]]][0];
            g += this.color_table[this.patterns[nStates[k]]][1];
            b += this.color_table[this.patterns[nStates[k]]][2];
          }
          this.grid[i][j].color = color(
            r / nStatesLen,
            g / nStatesLen,
            b / nStatesLen
          );
        }

        // For every neighbor indicies
        for (let dir = 0; dir < 4; dir++) {
          // If those indicies are not already in the
          // affected array or in the new affected array,
          // add it to the new affected array
          if (!this.affected.includes(neighborIndicies[dir])) {
            this.affected.push(neighborIndicies[dir]);
          }
        }
      }
    } else {
      if (!finished) {
        main_timer += performance.now();
        total_collapse_count++;
        console.log(
          "%c Average collapse time: " + main_timer / total_collapse_count,
          "color: #2a7a4a"
        );
      }
      finished = true;
    }
  }
}
