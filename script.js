let canvas;

let WFC;

let originImage;

let readyToGenerate = false;


function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    background(51);

    originImage = loadImage(
        "data/demo-3.png",
        () => createField(),
        () => console.log("couldn't loaded the image")
    );

}

function createField() {
    createFromImage(
        originImage,
        N = 3,
        symmetry = true,
        w = 32 * 2 + 7,
        h = 18 * 2
    ).then(
        (field) => {
            WFC = field;
            WFC.seed();
            readyToGenerate = true;
            console.log("heai");
            tileHeight = height / WFC.H;
            tileWidth = width / WFC.W;
            tileSpacing = min(tileHeight, tileWidth) / 8;
            tileBorderRadius = tileSpacing * 1.3;
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

        if (frameCount % 30 == 0)
            WFC.updateStep();
    }
}

function keyPressed() {
    if (keyCode == 122) {

    }
}