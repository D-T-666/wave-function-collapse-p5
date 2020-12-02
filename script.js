let sampleImage;
let canvas;
let WFC;

let readyToGenerate = false;
let finished = false;

let steps = 100;
let avg_steps = 0;
let rendered_frames = 0;
let url_params;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  url_params = getURLParams();
  displayBackgroundTiles = Number(url_params.dbt || "0");
  if (Number(url_params.stitches || "1")) {
    widthDivider = 28;
    heightDivider = 22;
    drawCell = (x, y, w, h) => {
      x = x + tileSpacing / 2;
      y = y + tileSpacing / 2;
      w = w - tileSpacing;
      h = h - tileSpacing;
      const sw = w / 4;
      strokeWeight(sw);
      line(
        x + sw / 2 - w / 16,
        y + sw / 2,
        x - sw / 2 + w / 2 - sw / 8,
        y + sw / 2 + h + sw / 2
      );
      line(
        x - sw / 2 + w + w / 16,
        y + sw / 2,
        x + sw / 2 + w / 2 + sw / 8,
        y + sw / 2 + h + sw / 2
      );
      smooth();
    };
  } else {
    widthDivider = 24;
    heightDivider = 24;
    drawCell = (x, y, w, h) => {
      noStroke();
      rect(x + tileSpacing / 2, y + tileSpacing / 2, w - tileSpacing, h - tileSpacing, tileBorderRadius);
    }
  }

  sampleImage = loadImage(
    "data/" + (url_params.pattern || "demo-3") + ".png",
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
    w = floor(width / widthDivider),
    h = floor(height / heightDivider)
  ).then(
    (field) => {
      WFC = field;
      WFC.seed();

      readyToGenerate = true;
      background(background_color);

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

    let time_start = performance.now();
    for (let row of WFC.grid)
      for (let elt of row)
        elt.display();

    let i = 0;
    if (!finished)
      while (i++ < 10000) {
        WFC.updateStep();
        if (i % 10 == 0)
          if (performance.now() - time_start > 32) {
            avg_steps += i;
            break;
          }
      }

    rendered_frames++;
  } else {
    background(0, 10, 60);
  }
}

let drawCell;