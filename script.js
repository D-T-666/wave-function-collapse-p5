let sampleImage;
let canvas;
let WFC;

let readyToGenerate = false;
let finished = false;

let steps = 100;
let avg_steps = 0;
let render_frames = 0;
let url_params;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  background('#0f0f25');

  url_params = getURLParams();
  let { pattern } = url_params;

  sampleImage = loadImage(
    "data/" + (pattern || "demo-3") + ".png",
    () => createField(),
    () => console.log("couldn't loaded the image")
  );
}

function createField() {
  const N = Number(url_params.n || "3");
  const symmetry = Number(url_params.symmetry || "1");
  Field.createFromImage(
    sampleImage,
    N,
    symmetry,
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

    steps = 2200 / deltaTime;
    avg_steps += steps;
    // console.log(avg_steps / render_frames)

    if (!finished)
      for (let i = 0; i < steps; i++)
        WFC.updateStep();

    render_frames++;
  } else {
    background(0, 60, 20);
  }
}