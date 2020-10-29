let WFC;

function setup() {
    createCanvas(400, 400);

    WFC = CreateField('data/demo-1.png', {
        N: 2,
        W: 16,
        H: 16,
        Symmetry: false
    });

    WFC

}

function draw() {

    for (let row of WFC.grid) {
        for (let elt of row) {
            elt.reveal_step(frameCount);
            elt.show();
        }
    }
}