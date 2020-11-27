let canvas;

let WFC;

let originImage;

let readyToGenerate = false;


function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    background('#0f0f25');

    // frameRate(1);

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
        w = floor(width / 16),
        h = floor(height / 16)

    ).then(
        (field) => {
            WFC = field;
            WFC.seed();
            readyToGenerate = true;
            tileHeight = height / WFC.H;
            tileWidth = width / WFC.W;
            tileSpacing = min(tileHeight, tileWidth) / 8;
            tileBorderRadius = tileSpacing * 1.3;
            console.log("Succesfuly finished loading...");
        }
    );
}

let done = false;

function draw() {

    if (readyToGenerate) {

        for (let row of WFC.grid)
            for (let elt of row) {
                if (done)
                    elt.highlight = true;
                elt.display();
            }
        if (done)
            done = false;

        let steps = 10;//frameRate() / 3; //700 / deltaTime;

        // console.time(steps + " steps");
        for (let i = 0; i < steps; i++)
            // WFC.updateChunk();
            WFC.updateStep();
        // console.timeEnd(steps + " steps");
    }
}