class Field {
    constructor(patterns, matcher, W, H) {
        this.patterns = patterns;
        this.matcher = matcher;
        this.W = W;
        this.H = H;

        this.affected = [];

        this.clearGrid();
    }

    static createFromImage(img, N = 2, Symetry = true, W = 16, H = 16) {
        // Load the pixels of the p5.Image specified
        img.loadPixels();

        // Store the width and height of the image in 
        // variables with sammler names
        const iW = img.width;
        const iH = img.height;

        // Since p5.Image doesn't store images with the shape (width, height rgba)
        // but rather (width*height*4) we need to reshape the image manually.
        let rgba_map = [];

        // Loop over the height of the image.
        for (let i = 0; i < iH; i++) {
            // Add a row of [rgba]s 
            rgba_map[i] = [];
            // Loop over the width of the image.
            for (let j = 0; j < iW; j++) {
                // Add a [rgba] ellement.
                rgba_map[i][j] = [];
                // Populate the ellement with values.
                for (let k = 0; k < 4; k++) {
                    rgba_map[i][j].push(img.pixels[(i * iW + j) * 4 + k]);
                }
            }
        }

        // initialize the list that will hold the patterns.
        let patterns = [];

        // Loop over the width and height of the image to extract patterns.
        for (let i = 0; i < iH; i++) {
            for (let j = 0; j < iW; j++) {
                // initialize a 2d pattern
                let pattern = [];

                // loop over a NxN box with the offset i,j in the image 
                // to extract a single pattern
                for (let u = 0; u < N; u++) {
                    pattern[u] = [];
                    for (let v = 0; v < N; v++) {
                        pattern[u][v] = rgba_map[(i + u) % iH][(j + v) % iW];
                    }
                }

                // Now that we have our pattern extracted wecheck if the Symmetry is enabled.
                if (Symetry) {
                    // If Symetry is enabled, we need to do all the rotations and reflections.
                    // Loop over all directions.
                    for (let rotation = 0; rotation < 4; rotation++) {
                        // Tanspose the pattern
                        pattern = transpose2DArray(pattern);
                        // Check if this instance of the pattern is in the
                        // patterns list. If not, add it to the list
                        if (!patterns.includes(JSON.stringify(pattern))) {
                            patterns.push(JSON.stringify(pattern));
                        }
                        // Flip the pattern
                        pattern = flip1DArray(pattern);
                        // Check if this instance of the pattern is in the
                        // patterns list. If not, add it to the list
                        if (!patterns.includes(JSON.stringify(pattern))) {
                            patterns.push(JSON.stringify(pattern));
                        }

                        // If you think about it Transpose+Flip = Rot90°
                    }
                } else {
                    // If we're not doing any Symetry, We can just
                    // check if this instance of the pattern is in the
                    // patterns list. If not, add it to the list
                    if (!patterns.includes(JSON.stringify(pattern))) {
                        patterns.push(JSON.stringify(pattern));
                    }
                }
            }
        }

        // Initialize the matcher object
        let matcher = new Matcher();

        // Check every pattern for every other pattern
        for (let patA of patterns) {
            for (let patB of patterns) {
                // Check for compatibility in every direction
                for (let direction = 0; direction < 4; direction++) {
                    // If compatible, add it to the matcher as a posibility
                    if (Matcher.tileCompatible(JSON.parse(patA), JSON.parse(patB), direction)) {
                        matcher.addPattern(patterns.indexOf(patA), patterns.indexOf(patB), direction);
                    }
                }
            }
        }

        // Return a Field object initialized with the patterns list,
        // matcher and the specified width and height
        return new Field(patterns, matcher, W, H);
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
                this.grid[i][j] = new Tile(states, this.patterns.length, i, j, width / this.W);
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
            [
                (i + 0 + this.H) % this.H,
                (j + 1 + this.W) % this.W
            ],
            [
                (i + 1 + this.H) % this.H,
                (j + 0 + this.W) % this.W
            ],
            [
                (i + 0 + this.H) % this.H,
                (j - 1 + this.W) % this.W
            ],
            [
                (i - 1 + this.H) % this.H,
                (j + 0 + this.W) % this.W
            ]
        ];
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
                this.grid[iMin][jMin].color = color(...JSON.parse(this.patterns[this.grid[iMin][jMin].states[0]])[0][0]);

                // Start the reveal animation
                this.grid[iMin][jMin].slowReveal();
            }

            // Initialise tiles collapsed counter
            let tiles_collapsed = 0;

            // While there are tiles to be updated and no tiles have collapsed 
            while (this.affected.length > 0 && tiles_collapsed < 1) {
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
                                // Increment the tiles collapsed counter
                                tiles_collapsed++;
                                // Set the color of the tile to the coresponding paterns (0,0) tile
                                this.grid[i][j].color = color(...JSON.parse(this.patterns[nStates[0]])[0][0]);
                                // Start the animation in the specified direction
                                this.grid[i][j].slowReveal(collapse_dir);
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
}
