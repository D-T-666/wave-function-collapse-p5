let WFC;

let originImage;

function preload() {
    originImage = loadImage(
        "data/demo-1.png",
        () => console.log("succesfully loaded the image"),
        () => console.log("couldn't loaded the image")
    );
}

function setup() {
    createCanvas(400, 400);

    WFC = Field.createFromImage(originImage, N = 2);

    WFC.clearGrid();

    WFC.getLowestEntropyLocation();

    // WFC.grid[0][0].collapse();
    // WFC.grid[0][0].slowReveal(1);

    console.log(WFC);
}

function draw() {
    background(51);

    for (let row of WFC.grid) {
        for (let elt of row) {
            elt.display();
        }
    }

    // displayPattern(WFC.patterns[floor(frameCount / 20)]);

    if (frameCount % 20 == 0)
        WFC.updateStep();
}

function displayPattern(patt) {
    const size = 32;
    for (let i = 0; i < JSON.parse(patt).length; i++) {
        for (let j = 0; j < JSON.parse(patt)[0].length; j++) {
            fill(...JSON.parse(patt)[i][j]);
            rect(i * size, j * size, size, size);
        }
    }
}