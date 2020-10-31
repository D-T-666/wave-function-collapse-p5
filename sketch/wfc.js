class Field {
    constructor(patterns, matcher, W, H) {
        this.patterns = patterns;
        this.matcher = matcher;
        this.W = W;
        this.H = H;
    }

    static createFromImage(img, N = 2, Symetry = false, W = 8, H = 8) {
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

                if (patterns.indexOf(pattern) == -1) {
                    patterns.push(pattern);
                }
            }
        }

        let matcher = new Matcher();

        for (let patA of patterns) {
            for (let patB of patterns) {
                for (let direction = 0; direction < 4; direction++) {
                    if (Matcher.tileCompatible(patA, patB, direction)) {
                        console.log("added a pattern");
                        matcher.addPattern(patterns.indexOf(patA), patterns.indexOf(patB), direction);
                    }
                }
            }
        }

        console.log(matcher);

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
                this.grid[i][j] = new Tile(states, this.patterns.length, i, j, 32);
            }
        }
    }
}

