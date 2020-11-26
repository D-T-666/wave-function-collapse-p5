class Field {
    constructor(patterns, matcher, W, H) {
        this.patterns = patterns;
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
                for (let k = 0; k < this.patterns.length; k++) {
                    states.push(k);
                }
                this.grid[i][j] = new Tile(states, this.patterns.length, j, i);
            }
        }
    }

    getLowestEntropyLocation() {
        let grid = []; // The grid of entropies
        let minCol = []; // Collumn of minimum numbers

        for (let row of this.grid) {
            // Initialize the row of entropies
            let entropy_row = [];

            // Populate the row of entropies with values
            for (let elt of row) {
                entropy_row.push(elt.getEntropy());
            }

            grid.push(entropy_row);

            // Store the minimum of the row in the minCol
            minCol.push(Min(entropy_row));
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
            [ // Right
                (i + 0 + this.H) % this.H,
                (j + 1 + this.W) % this.W
            ],
            [ // Down
                (i + 1 + this.H) % this.H,
                (j + 0 + this.W) % this.W
            ],
            [ // Left
                (i + 0 + this.H) % this.H,
                (j - 1 + this.W) % this.W
            ],
            [ //
                (i - 1 + this.H) % this.H,
                (j + 0 + this.W) % this.W
            ]
        ];
    }

    seed() {
        const i = floor(random(0.25, 0.75) * this.H);
        const j = floor(random(0.25, 0.75) * this.W);
        this.grid[i][j].collapse();
        this.grid[i][j].color = this.patterns[this.grid[i][j].states[0]];
        this.grid[i][j].slowReveal(2);
        this.affected = this.getNeighborIndicies(i, j);
    }

    isDone() {
        let sum = 0;

        for (let row of this.grid) {
            for (let elt of row) {
                if (elt.states.length > 1) {
                    sum++;
                }
            }
        }

        return sum == 0;
    }

    updateChunk() {
        if (!this.isDone()) {
            // If all the tiles have been updated
            if (this.affected.length == 0) {
                // Get the indicies of the tile with the minimum entropy.
                let [iMin, jMin] = this.getLowestEntropyLocation();

                // Colapse the tile.
                this.grid[iMin][jMin].collapse(3);

                // Add the neighbors of the tile to the affected list to be updated later.
                this.affected = this.getNeighborIndicies(iMin, jMin);

                // Set the color of the tile to the corresponding patterns (0,0) tile
                this.grid[iMin][jMin].color = this.patterns[this.grid[iMin][jMin].states[0]];

                // Start the reveal animation
                this.grid[iMin][jMin].slowReveal();
            }

            // While there are tiles to be updated and no tiles have collapsed 
            while (this.affected.length > 0) {
                // Initialize the new affected array
                let nAffected = [];

                // For every affected tile
                for (let affected of this.affected) {

                    // Get the location
                    let [i, j] = affected;
                    if (!this.grid[i][j].hasCollapsed()) {
                        // Get the neighbor indicies
                        let neighborIndicies = this.getNeighborIndicies(i, j);

                        // Get the neighbor states
                        let neighbors = [];
                        // Loop over every neighbor location
                        for (let neighbor of neighborIndicies) {
                            // Get the location
                            let [iN, jN] = neighbor;

                            // Add the coresponding tiles states to the neighbor states array
                            neighbors.push(this.grid[iN][jN].states);
                        }

                        // Get previous states 
                        let pStates = this.grid[i][j].states;

                        // Get new states and the direction of the possible collapse
                        let [nStates, collapse_dir] = this.matcher.match(pStates, neighbors);

                        // If the size of the previous and new states are different,
                        // and the length of new states is greater than 0
                        if (pStates.length != nStates.length && nStates.length > 0) {
                            // Update tiles states to be the new states
                            this.grid[i][j].states = nStates;

                            // If the length of new states is 1, it means that
                            // the tile has collapsed
                            if (nStates.length == 1) {
                                // Set the color of the tile to the coresponding paterns (0,0) tile
                                this.grid[i][j].color = this.patterns[nStates[0]];
                                // Start the animation in the specified direction
                                this.grid[i][j].slowReveal(collapse_dir);
                            } else {
                                let r = 0;
                                let g = 0;
                                let b = 0;
                                for (let k = 0; k < nStates.length; k++) {
                                    r = red(this.patterns[nStates[k]])
                                    g = green(this.patterns[nStates[k]])
                                    b = blue(this.patterns[nStates[k]])
                                }
                                this.grid[i][j].color = color(
                                    r / nStates.length,
                                    g / nStates.length,
                                    b / nStates.length
                                );
                            }

                            // For every neighbor indicies
                            for (let neighbor of neighborIndicies) {
                                // If those indicies are not already in the 
                                // affected array or in the new affected array, 
                                // add it to the new affected array 
                                if (!nAffected.includes(neighbor) && !this.affected.includes(neighbor)) {
                                    nAffected.push(neighbor);
                                }
                            }
                        }
                    }
                }

                // Update the affected array 
                this.affected = nAffected;
            }
        }


    }

    updateStep() {
        if (!this.isDone()) {
            // If all the tiles have been updated
            if (this.affected.length == 0) {
                // Get the indicies of the tile with the minimum entropy.
                let [iMin, jMin] = this.getLowestEntropyLocation();

                // Colapse the tile.
                this.grid[iMin][jMin].collapse(3);

                // Add the neighbors of the tile to the affected list to be updated later.
                this.affected = this.getNeighborIndicies(iMin, jMin);

                // Set the color of the tile to the corresponding patterns (0,0) tile
                this.grid[iMin][jMin].color = this.patterns[this.grid[iMin][jMin].states[0]];

                // Start the reveal animation
                this.grid[iMin][jMin].slowReveal();
            }

            while (this.affected.length > 0) {

                // For every affected tile
                let current = this.affected.splice(0, 1)[0];
                while (this.grid[current[0]][current[1]].hasCollapsed()) {
                    current = this.affected.splice(0, 1)[0];
                    if (current == undefined)
                        return;
                }

                // For every affected tile
                // let current = this.affected.pop();
                // while (this.grid[current[0]][current[1]].hasCollapsed()) {
                //     current = this.affected.pop();
                //     if (current == undefined)
                //         return;
                // }

                // Get the location
                let [i, j] = current;

                // Get the neighbor indicies
                let neighborIndicies = this.getNeighborIndicies(i, j);

                // Get the neighbor states
                let neighbors = [];
                // Loop over every neighbor location
                for (let neighbor of neighborIndicies) {
                    // Get the location
                    let [iN, jN] = neighbor;

                    // Add the coresponding tiles states to the neighbor states array
                    neighbors.push(this.grid[iN][jN].states);
                }

                // Get previous states 
                let pStates = this.grid[i][j].states;

                // Get new states and the direction of the possible collapse
                let [nStates, collapse_dir] = this.matcher.match(pStates, neighbors);

                // If the size of the previous and new states are different,
                // and the length of new states is greater than 0
                if (pStates.length != nStates.length && nStates.length > 0) {
                    // Update tiles states to be the new states
                    this.grid[i][j].states = nStates;

                    this.grid[i][j].Highlight();

                    // If the length of new states is 1, it means that
                    // the tile has collapsed
                    if (nStates.length == 1) {
                        // Set the color of the tile to the coresponding paterns (0,0) tile
                        this.grid[i][j].color = this.patterns[nStates[0]];
                        // Start the animation in the specified direction
                        this.grid[i][j].slowReveal(collapse_dir);
                    } else {
                        let r = 0;
                        let g = 0;
                        let b = 0;
                        for (let k = 0; k < nStates.length; k++) {
                            r = red(this.patterns[nStates[k]])
                            g = green(this.patterns[nStates[k]])
                            b = blue(this.patterns[nStates[k]])
                        }
                        this.grid[i][j].color = color(
                            r / nStates.length,
                            g / nStates.length,
                            b / nStates.length
                        );
                    }

                    // For every neighbor indicies
                    for (let neighbor of neighborIndicies) {
                        // If those indicies are not already in the 
                        // affected array or in the new affected array, 
                        // add it to the new affected array 
                        if (!this.affected.includes(neighbor)) {
                            this.affected.push(neighbor);
                        }
                    }
                }

                break;
            }

            // Update the affected array 
            // this.affected = nAffected;
            // }
        }
    }
}