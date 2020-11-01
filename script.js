let WFC;

let originImage;

function preload() {
    originImage = loadImage(
        "data/demo-3.png",
        () => console.log("succesfully loaded the image"),
        () => console.log("couldn't loaded the image")
    );
}

function setup() {
    createCanvas(400, 400);

    WFC = Field.createFromImage(originImage, N = 3, Symetry = true, W = 16, H = 16);
}

function draw() {
    background(51);

    for (let row of WFC.grid) {
        for (let elt of row) {
            elt.display();
        }
    }

    if (frameCount % 30 == 0)
        WFC.updateStep();

}