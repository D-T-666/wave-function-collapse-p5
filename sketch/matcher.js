class Matcher {
  constructor() {
    this.patterns = [];
    this.pattLen;
  }

  addPattern(pattern, neighbor, direction) {
    if (this.patterns[pattern] != undefined) {
      this.patterns[pattern][direction].push(neighbor);
    } else {
      this.patterns[pattern] = [[], [], [], []];
      this.patterns[pattern][direction][0] = neighbor; // This made it work!
    }
    this.pattLen = this.patterns.length;
  }

  match(pStates, neighbor_states) {
    let possibilities = new Set(pStates);

    for (let direction = 0; direction < 4; direction++) {
      const oppositeDirection = (direction + 2) % 4;
      let current_possibilities = new Set();

      neighbor_states[direction].forEach((state) =>
        this.patterns[state][oppositeDirection].forEach((elt) =>
          current_possibilities.add(elt)
        )
      );

      for (let i = 0; i < this.pattLen; i++)
        if (!current_possibilities.has(i)) possibilities.delete(i);
    }

    return [...possibilities];
  }

  static tileCompatible(a, b, direction) {
    let A = [...a];
    let B = [...b];

    // Check if the tile a overlaps b in a specified direction

    switch (direction) {
      case 0: // Checks the up direction
        A.pop();
        B.shift();

        break;

      case 1: // Checks the left direction
        A = transpose2DArray(A);
        A.pop();
        B = transpose2DArray(B);
        B.shift();

        break;

      case 2: // Checks the down direction
        A.shift();
        B.pop();

        break;

      case 3: // Checks the right direction
        A = transpose2DArray(A);
        A.shift();
        B = transpose2DArray(B);
        B.pop();

        break;
    }

    return arrayIsEqual(A, B);
  }
}

function transpose2DArray(arr) {
  // Returns a transposed copy of the specified array
  let nArr = [];
  for (let i = 0; i < arr[0].length; i++) {
    nArr[i] = [];
    for (let j = 0; j < arr.length; j++) {
      nArr[i][j] = arr[j][i];
    }
  }
  return nArr;
}

function flip1DArray(arr) {
  // Returns a flipped copy of the specified array
  let nArr = [];
  for (let i = arr.length - 1; i > -1; i--) {
    nArr.push(arr[i]);
  }
  return nArr;
}

function arrayIsEqual(a, b) {
  // Checks if array a is equal to array b.
  // JS sucks with being sensible.
  return JSON.stringify(a) == JSON.stringify(b);
}

function Min(lis) {
  // get the minimum number from a 1D array
  let minmum = Infinity;

  lis.forEach((elt) => (minmum = elt < minmum ? elt : minmum));

  return minmum;
}
