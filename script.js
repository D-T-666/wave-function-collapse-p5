let sampleImage;
let canvas;
let WFC;

let readyToGenerate = false;
let finished = false;

let steps = 100;
let avg_steps = 0;
let rendered_frames = 0;
let url_params;

let drawCell;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  // randomSeed(0);
  url_params = getURLParams();
  displayBackgroundTiles = Number(url_params.dbt || "0");
  createDrawCell();

  const imagePath = `data/${url_params.pattern || "demo-3"}.png`;

  sampleImage = loadImage(imagePath, createField, () => {
    alert("Image couldn't be loaded );");
  });
}

function draw() {
  if (readyToGenerate) {
    let time_start = performance.now();

    for (let row of WFC.grid) for (let elt of row) elt.display();

    let i = 0;
    if (!finished)
      while (i++ < 1000) {
        WFC.updateStep();

        if (i % 10 == 0) if (performance.now() - time_start > 33.3) break;
      }
    avg_steps += i;
    // WFC.updateChunk();/

    rendered_frames++;

    // if (finished) {
    //   randomSeed(0);
    //   createField();
    //   finished = !finished;
    // }
  } else {
    background(0, 10, 60);
  }
}
