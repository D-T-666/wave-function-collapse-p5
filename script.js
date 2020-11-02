let canvas;

let WFC;

let originImage;

let readyToGenerate = false;

function preload() {
    originImage = loadImage(
        "data/demo-4.png",
        () => console.log("succesfully loaded the image"),
        () => console.log("couldn't loaded the image")
    );
}

function setup() {
    canvas = createCanvas(displayWidth, displayHeight);
    background(51);

    originImage = loadImage(
        "data/demo-1.png",
        () => createField(),
        () => console.log("couldn't loaded the image")
    );

}

function createField() {
    createFromImage(
        originImage,
        N = 3,
        symmetry = true,
        w = 32 * 2,
        h = 18 * 2
    ).then(
        (field) => {
            WFC = field;
            WFC.seed();
            readyToGenerate = true;
            console.log("heai");
        }
    );
}

function draw() {
    // console.log("boop");
    if (readyToGenerate) {
        background('#0f0f25');

        for (let row of WFC.grid) {
            for (let elt of row) {
                elt.display();
            }
        }

        if (frameCount % 20 == 0)
            WFC.updateStep();
    } else {
        // fill(255);
        // text("loading...", 100, 50 + random(height));
    }
}

function keyPressed() {
    if (keyCode == 122) {
        // Resize when F11 is pressed
    }
}