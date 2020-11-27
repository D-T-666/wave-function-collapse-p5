class Matcher {
    constructor() {
        // Initializes patterns as an empty array
        this.patterns = [];
    }

    addPattern(pattern, neighbor, direction) {
        // Checks if there already is a pattern key
        // in the patterns list
        if (this.patterns[pattern] != undefined) {
            // In case there already is, it just appends the 
            // neighbor in the specified direction 
            this.patterns[pattern][direction].push(neighbor);
        } else {
            // In case pattern key hasn't been added yet, add
            // it and also initialize all the neighbor lists
            this.patterns[pattern] = [[], [], [], []];
            this.patterns[pattern][direction].push(neighbor); // This made it work!
        }
    }

    match(pStates, neighbor_states) {
        // Initialize the new states list to be the previous states list
        // since there is no chance that a new possibility will be added.
        // This just saves some time.
        let nStates = pStates;
        let length = nStates;
        let i = 0;

        let collapse_dir = 2;

        // Loop over every direction. 
        for (let direction = 0; direction < 4; direction++) {
            let neighbor_posibilities = [];

            // Get all the possible neighbors for each neighbor in the oposite direction.
            neighbor_states[direction].forEach(state => {
                // neighbor_posibilities = [...neighbor_posibilities, ...this.patterns[state][(direction + 2) % 4]];
                neighbor_posibilities.push(...this.patterns[state][(direction + 2) % 4]);
            });

            for (i = 0; i < length; i++) {
                if (!neighbor_posibilities.includes(nStates[i])) {
                    nStates.splice(i, 1);
                    i--;
                    length--;
                }
            }

            // Get the intersection of the previous states and the possibilities.
            nStates = nStates.filter((a) => neighbor_posibilities.includes(a));

            // console.log(length - nStates.length);
            // length = nStates.length;


            if (length == 1 && collapse_dir == 2) {
                collapse_dir = direction % 2;
            }
        }

        return [nStates, collapse_dir];
    }

    static tileCompatible(a, b, direction) {
        let A = [...a];
        let B = [...b];

        // Check if the tile a overlaps b in a specified direction

        switch (direction) {
            case 0:// Checks the up direction
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

            case 3:// Checks the right direction
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
    for (let elt of lis) {
        minmum = (elt < minmum) ? elt : minmum;
    }
    return minmum;
}