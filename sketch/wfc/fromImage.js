async function createFromImage(img, n = 2, symmetry = false, w = 16, h = 16) {
    // Load the pixels of the p5.Image specified
    img.loadPixels();

    // Store the width and height of the image in 
    // variables with sammler names
    const iW = img.width;
    const iH = img.height;

    // Since p5.Image doesn't store images with the shape (width, height rgba)
    // but rather (width*height*4) we need to reshape the image manually.
    let rgba_map = [];

    // Loop over the height of the image.
    for (let i = 0; i < iH; i++) {
        // Add a row of [rgba]s 
        rgba_map[i] = [];
        // Loop over the width of the image.
        for (let j = 0; j < iW; j++) {
            // Add a [rgba] ellement.
            rgba_map[i][j] = [];
            // Populate the ellement with values.
            for (let k = 0; k < 4; k++) {
                rgba_map[i][j].push(img.pixels[(i * iW + j) * 4 + k]);
            }
        }
    }
    rgba_map = transpose2DArray(flip1DArray(rgba_map));


    // initialize the list that will hold the patterns.
    let patterns = [];

    // Loop over the width and height of the image to extract patterns.
    for (let i = 0; i < iW; i++) {
        for (let j = 0; j < iH; j++) {
            // initialize a 2d pattern
            let pattern = [];

            // loop over a NxN box with the offset i,j in the image 
            // to extract a single pattern
            for (let u = 0; u < n; u++) {
                pattern[u] = [];
                for (let v = 0; v < n; v++) {
                    pattern[u][v] = rgba_map[(i + u) % iW][(j + v) % iH];
                }
            }

            // Now that we have our pattern extracted wecheck if the symmetry is enabled.
            if (symmetry) {
                // If symmetry is enabled, we need to do all the rotations and reflections.
                // Loop over all directions.
                for (let rotation = 0; rotation < 4; rotation++) {
                    // Tanspose the pattern
                    pattern = transpose2DArray(pattern);
                    // Check if this instance of the pattern is in the
                    // patterns list. If not, add it to the list
                    let stringified = JSON.stringify(pattern);
                    if (!patterns.includes(stringified)) {
                        patterns.push(stringified);
                    }
                    // Flip the pattern
                    pattern = flip1DArray(pattern);
                    // Check if this instance of the pattern is in the
                    // patterns list. If not, add it to the list
                    stringified = JSON.stringify(pattern);
                    if (!patterns.includes(stringified)) {
                        patterns.push(stringified);
                    }

                    // If you think about it Transpose+Flip = Rot90°
                }
            } else {
                // If we're not doing any symmetry, We can just
                // check if this instance of the pattern is in the
                // patterns list. If not, add it to the list
                let stringified = JSON.stringify(pattern);
                if (!patterns.includes(stringified)) {
                    patterns.push(stringified);
                }
            }
        }
    }

    // Initialize the matcher object
    let matcher = new Matcher();

    // Check every pattern for every other pattern
    for (let i = 0; i < patterns.length; i++) {
        for (let j = 0; j < patterns.length; j++) {
            // Check for compatibility in every direction
            for (let direction = 0; direction < 4; direction++) {
                // If compatible, add it to the matcher as a posibility
                if (Matcher.tileCompatible(JSON.parse(patterns[i]), JSON.parse(patterns[j]), direction)) {
                    matcher.addPattern(i, j, direction);
                }
            }
        }
    }
    console.log(matcher)


    let colors = [];
    for (let patt of patterns) {
        colors.push(color(...JSON.parse(patt)[0][0]));
    }

    // callBack(new Field(patterns, matcher, w, h));

    // Return a Field object initialized with the patterns list,
    // matcher and the specified width and height
    return new Field(colors, matcher, w, h);
}