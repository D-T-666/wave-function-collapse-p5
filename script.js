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

    WFC = Field.createFromImage(originImage);

    WFC.clearGrid();

    WFC.grid[0][0].collapse();
    WFC.grid[0][0].slowReveal(1);

    console.log(WFC);
}

function draw() {
    background(51);

    for (let row of WFC.grid) {
        for (let elt of row) {
            elt.display();
        }
    }
}