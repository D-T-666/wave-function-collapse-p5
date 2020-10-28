function setup() {
    createCanvas(400, 400);

    let WFC = CreateField('data/demo-1.png', {
        N: 2,
        W: 16,
        H: 16,
        Symmetry: false
    });

    if (WFC.collaspse()) {
        image(WFC.get_p5_image(), 0, 0);
    }
}