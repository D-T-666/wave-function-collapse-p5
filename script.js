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
  if (Number(url_params.stitches || "0")) {
    widthDivider = 28;
    heightDivider = 22;
    drawCell = (x, y, w, h, b = false) => {
      x = x + tileSpacing / 2;
      y = y + tileSpacing / 2;
      w = w - tileSpacing;
      strokeWeight(b ? sw + 1 : sw);
      line(
        x + sw / 2 - w / 32,
        y + sw / 2,
        x - sw / 2 + w / 2 - sw / 16,
        y + h
      );
      line(
        x - sw / 2 + w + w / 32,
        y + sw / 2,
        x + sw / 2 + w / 2 + sw / 16,
        y + h
      );
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
    w = floor(floor(width / widthDivider) / sampleImage.width + .5) * sampleImage.width,
    h = floor(height / heightDivider)
  ).then(
    (field) => {
      WFC = field;
      WFC.seed();

      readyToGenerate = true;
      background(background_color);

      tileW = width / floor(width / widthDivider);
      tileH = height / floor(height / heightDivider);
      tileSpacing = min(tileH, tileW) / 8;
      tileBorderRadius = tileSpacing * 1.3;
      sw = (tileW - tileSpacing) / 4;

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