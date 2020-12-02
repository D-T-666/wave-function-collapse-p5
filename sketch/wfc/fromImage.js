Field.createFromImage = async (img, n = 2, symmetry = false, w = 16, h = 16) => {
  img.loadPixels();

  const iW = img.width;
  const iH = img.height;

  console.time("Built the rgb map");
  // Since p5.Image doesn't store images with the shape (width, height rgba)
  // but rather (width*height*4) we need to reshape the image manually.
  let rgba_map = [];
  let color_table = [];
  let color_frequencies = [];

  // Loop over the height of the image.
  for (let i = 0; i < iH; i++) {
    // Add a row of [rgba]s 
    rgba_map[i] = [];
    // Loop over the width of the image.
    for (let j = 0; j < iW; j++) {
      let col = [];
      // Populate the ellement with values.
      for (let k = 0; k < 3; k++)
        col.push(img.pixels[(i * iW + j) * 4 + k]);

      col = JSON.stringify(col);
      let ind;

      if (!color_table.includes(col)) {
        color_frequencies.push(0);
        color_table.push(col);
      }
      ind = color_table.indexOf(col);

      rgba_map[i][j] = ind;
      color_frequencies[ind] += 1;
    }
  }
  rgba_map = transpose2DArray(flip1DArray(rgba_map));
  console.timeEnd("Built the rgb map");


  console.time("Collected the patterns");
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

      if (!patterns.includes(JSON.stringify(pattern))) {
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
          patterns.push(JSON.stringify(pattern));
        }
      }
    }
  }
  console.timeEnd("Collected the patterns");

  console.time("Compiled the matcher");
  // Initialize the matcher object
  let parsed_patterns = [];
  let matcher = new Matcher();

  // Check every pattern for every other pattern
  for (let i = 0; i < patterns.length; i++) {
    for (let j = 0; j < patterns.length; j++) {
      if (i == 0)
        parsed_patterns.push(JSON.parse(patterns[j]));
      // Check for compatibility in every direction
      for (let direction = 0; direction < 4; direction++) {
        // If compatible, add it to the matcher as a posibility
        if (Matcher.tileCompatible((parsed_patterns[i]), (parsed_patterns[j]), direction)) {
          // // if (Matcher.tileCompatible(JSON.parse(patterns[i]), JSON.parse(patterns[j]), direction)) {
          matcher.addPattern(i, j, direction);
        }
      }
    }
  }
  console.timeEnd("Compiled the matcher");
  console.log(`${matcher.patterns.length} patterns`);

  console.time("Set up color table");
  let colors = [];
  for (let patt of patterns) {
    colors.push(JSON.parse(patt)[0][0]);
  }
  console.timeEnd("Set up color table");

  color_table = color_table.map(JSON.parse);

  // Calculate an opaque background color by darkening and 
  //hueshifting the most used color in the picture 
  background_color = color_table[color_frequencies.indexOf(color_frequencies.reduce((a, b) => a > b ? a : b))];
  background_color = color(background_color[0] * 0.7, background_color[1] * 0.75, background_color[2] * 0.85);

  // Return a Field object initialized with the patterns list,
  // matcher and the specified width and height
  return new Field(color_table, colors, matcher, w, h);
}