const createDrawCell = (_) => {
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
    drawCell = (x, y, w, h, b = false) => {
      noStroke();
      b
        ? rect(x, y, w, h, tileBorderRadius)
        : rect(
            x + tileSpacing / 2,
            y + tileSpacing / 2,
            w - tileSpacing,
            h - tileSpacing,
            tileBorderRadius
          );
    };
  }
};
