class Field {
    constructor(patterns, matcher, W, H) {
        this.patterns = patterns;
        this.matcher = matcher;
        this.W = W;
        this.H = H;

        this.affected = [];
    }

    static createFromImage(img, N = 2, Symetry = false, W = 16, H = 16) {
        img.loadPixels();

        const iW = img.width;
        const iH = img.height;

        let rgba_map = [];
        for (let i = 0; i < iH; i++) {
            rgba_map[i] = [];
            for (let j = 0; j < iW; j++) {
                rgba_map[i][j] = [];
                for (let k = 0; k < 4; k++) {
                    rgba_map[i][j].push(img.pixels[(i * iW + j) * 4 + k]);
                }
            }
        }


        let patterns = [];

        for (let i = 0; i < iH; i++) {
            for (let j = 0; j < iW; j++) {
                let pattern = [];
                for (let u = 0; u < N; u++) {
                    pattern[u] = [];
                    for (let v = 0; v < N; v++) {
                        pattern[u][v] = rgba_map[(i + u) % iH][(j + v) % iW];
                    }
                }

                if (!patterns.includes(JSON.stringify(pattern))) {
                    patterns.push(JSON.stringify(pattern));
                }
            }
        }

        let matcher = new Matcher();

        for (let patA of patterns) {
            for (let patB of patterns) {
                for (let direction = 0; direction < 4; direction++) {
                    if (Matcher.tileCompatible(JSON.parse(patA), JSON.parse(patB), direction)) {
                        matcher.addPattern(patterns.indexOf(patA), patterns.indexOf(patB), direction);
                    }
                }
            }
        }

        return new Field(patterns, matcher, W, H);
    }

    clearGrid() {
        this.grid = [];
        for (let i = 0; i < this.H; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.W; j++) {
                let states = [];
                for (let k = 0; k < this.patterns.length; k++) {
                    states.push(k);
                }
                this.grid[i][j] = new Tile(states, this.patterns.length, i, j, 24);
            }
        }
    }

    getLowestEntropyLocation() {
        let grid = [];
        let collumn = [];

        for (let row of this.grid) {
            let entropy_row = [];

            for (let elt of row) {
                entropy_row.push(elt.getEntropy());
            }

            grid.push(entropy_row);
            collumn.push(Min(entropy_row));
        }

        let iInd = collumn.indexOf(Min(collumn));
        let jInd = grid[iInd].indexOf(Min(collumn));

        return [iInd, jInd];
    }

    getNeighborIndicies(i, j) {
        return [
            [(i + 0 + this.H) % this.H, (j + 1 + this.W) % this.W],
            [(i + 1 + this.H) % this.H, (j + 0 + this.W) % this.W],
            [(i + 0 + this.H) % this.H, (j - 1 + this.W) % this.W],
            [(i - 1 + this.H) % this.H, (j + 0 + this.W) % this.W]
        ];
    }

    updateStep(collapse = true) {
        if (this.affected.length == 0) {
            if (collapse) {
                let [iMin, jMin] = this.getLowestEntropyLocation();

                if (!this.grid[iMin][jMin].hasCollapsed()) {
                    this.grid[iMin][jMin].collapse();
                    this.affected = this.getNeighborIndicies(iMin, jMin);
                    if (this.grid[iMin][jMin].states.length == 1)
                        // console.log(this.patterns[this.grid[iMin][jMin].states[0]]);
                        this.grid[iMin][jMin].color = color(...JSON.parse(this.patterns[this.grid[iMin][jMin].states[0]])[0][0]);
                    else
                        this.grid[iMin][jMin].color = color(255, 0, 255);
                    this.grid[iMin][jMin].slowReveal();
                }
            }
        }
        if (this.affected.length > 0) {
            let nAffected = [];

            for (let affected of this.affected) {
                let [i, j] = affected;
                let neighborIndicies = this.getNeighborIndicies(i, j);

                let neighbors = [];
                for (let neighbor of neighborIndicies) {
                    let [iN, jN] = neighbor;

                    neighbors.push(this.grid[iN][jN].states);
                }

                let pStates = this.grid[i][j].states;
                let nStates = this.matcher.match(pStates, neighbors);

                console.log(nStates.length);

                if (!arrayIsEqual(pStates, nStates) && nStates.length > 0) {
                    this.grid[i][j].states = nStates;

                    if (nStates.length == 1) {
                        this.grid[i][j].color = color(...JSON.parse(this.patterns[nStates[0]])[0][0]);
                        this.grid[i][j].slowReveal(2);
                    }

                    for (let neighbor of neighborIndicies) {
                        if (nAffected.indexOf(neighbor) == -1 && this.affected.indexOf(neighbor)) {
                            nAffected.push(neighbor)
                        }
                    }
                }
            }

            this.affected = nAffected;
        }
    }
}

