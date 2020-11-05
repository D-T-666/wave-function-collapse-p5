let canvas;

let WFC;

let originImage;

let readyToGenerate = false;


function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    background('#0f0f25');

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
        w = floor(width / 16),
        h = floor(height / 16)

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
    if (readyToGenerate) {

        for (let row of WFC.grid) {
            for (let elt of row) {
                elt.display();
            }
        }

        if (frameCount % 1 == 0)
            WFC.updateStep();
    }
}