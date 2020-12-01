let sampleImage;
let canvas;
let WFC;

let readyToGenerate = false;
let finished = false;

let steps = 100;
let avg_steps = 0;
let render_frames = 0;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  background('#0f0f25');

  let { pattern } = getURLParams();

  sampleImage = loadImage(
    "data/" + (pattern || "demo-3") + ".png",
    () => createField(),
    () => console.log("couldn't loaded the image")
  );
}

function createField() {
  Field.createFromImage(
    sampleImage,
    N = 3,
    symmetry = true,
    w = floor(width / 16),
    h = floor(height / 16)
  ).then(
    (field) => {
      WFC = field;
      WFC.seed();

      readyToGenerate = true;
      background('#0f0f25');

      tileW = width / WFC.W;
      tileH = height / WFC.H;
      tileSpacing = min(tileH, tileW) / 8;
      tileBorderRadius = tileSpacing * 1.3;

      console.log("Succesfully finished loading...");
      console.log({ width: WFC.W, height: WFC.H });
      console.time("Finished collapsing in");
    }
  );
}

function draw() {
  if (readyToGenerate) {

    for (let row of WFC.grid)
      for (let elt of row)
        elt.display();

    steps = 1200 / deltaTime;
    avg_steps += steps;
    // console.log(avg_steps / render_frames)

    if (!finished)
      // if (frameCount % 2 == 0)
      //   WFC.updateChunk();
      for (let i = 0; i < steps; i++)
        WFC.updateStep();

    render_frames++;
  } else {
    background(0, 60, 20);
  }
}