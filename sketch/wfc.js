class Field {
    constructor(matcher, patterns, options) {
        this.W = options.W;
        this.H = options.H;
        this.N = options.N;
        this.Symmetry = options.Symmetry;

        this.patterns = patterns;
        this.matcher = matcher;

        this.flush()
    }

    flush() {
        this.grid = [];
        for (let i = 0; i < this.H; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.W; j++) {
                this.grid[i][j] = new Tile(i * 10, j * 10, 10, []);
                for (let state = 0; state < this.patterns.length; state++) {
                    this.grid[i][j].states.push(state)
                }
            }
        }
    }
}

function CreateField(file_name, options) {
    let matcher = 0;
    let patterns = [0, 0, 0, 0, 0, 0, 0];
    return new Field(matcher, patterns, options);
}