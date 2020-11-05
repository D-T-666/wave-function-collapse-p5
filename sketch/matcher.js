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

        let collapse_dir = 2;

        // Loop over every direction. 
        for (let direction = 0; direction < 4; direction++) {
            let neighbor_posibilities = [];
            // Get all the possible neighbors for each neighbor in the oposite direction.
            for (let state of neighbor_states[direction]) {
                neighbor_posibilities.push(...this.patterns[state][(direction + 2) % 4]);
            }

            // Get the intersection of the previous states and the possibilities.
            let update_states = nStates.filter((a) => neighbor_posibilities.includes(a));

            if (update_states.length == 1 && collapse_dir == 2) {
                collapse_dir = direction % 2;
            }
            // Set the new states to be the intersection
            nStates = update_states;
        }

        return [nStates, collapse_dir];
    }

    static tileCompatible(a, b, direction) {
        let A = 0;
        let B = 1;

        // Check if the tile a overlaps b in a specified direction

        if (direction == 0) {
            // Checks the up direction

            A = [...a]; // Copy array a 
            // Remove the last row
            A.pop();
            B = [...b]; // Copy array b
            // Remove the first row
            B.shift();

        } else if (direction == 1) {
            // Checks the left direction

            A = [...a]; // Copy array a
            A = transpose2DArray(A);
            // Remove the last row
            A.pop();
            B = [...b]; // Copy array b
            B = transpose2DArray(B);
            // Remove the first row
            B.shift();

        } else if (direction == 2) {
            // Checks the down direction

            A = [...a]; // Copy array a
            // Remove the first row
            A.shift();
            B = [...b]; // Copy array b
            // Remove the last row
            B.pop();

        } else if (direction == 3) {
            // Checks the right direction

            A = [...a]; // Copy array a
            A = transpose2DArray(A);
            // Remove the first row
            A.shift();
            B = [...b]; // Copy array b
            B = transpose2DArray(B);
            // Remove the last row
            B.pop();
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