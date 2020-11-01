let canvas;

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
    canvas = createCanvas(displayWidth, displayHeight);

    WFC = Field.createFromImage(
        originImage,
        N = 3,
        symmetry = true,
        w = 32,
        h = 18
    );
}

function draw() {
    background('#0f0f25');

    for (let row of WFC.grid) {
        for (let elt of row) {
            elt.display();
        }
    }

    if (frameCount % 30 == 0)
        WFC.updateStep();

}

function keyPressed() {
    if (keyCode == 122) {
        // Resize when F11 is pressed
    }
}