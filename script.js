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
    createCanvas(800, 800);

    WFC = Field.createFromImage(originImage, N = 3, Symetry = true, W = 32, H = 32);
}

function draw() {
    background('#252525');

    for (let row of WFC.grid) {
        for (let elt of row) {
            elt.display();
        }
    }

    if (frameCount % 30 == 0)
        WFC.updateStep();

}