function CreateField(file_name, options = { N: 1, W: 16, H: 16, Symmetry: false }) {
	const { N, W, H, Symmetry } = options;

	let input = loadImage(file_name);
	input.loadPixels();

	let patterns = {};
	let pattern_list = [];

	for (let i = 0; i < input.height; i++) {
		for (let j = 0; j < input.width; j++) {
			let tile = [];
			for (let u = 0; u < N; u++) {
				tile[u] = [];
				for (let v = 0; v < N; v++) {
					tile[u][v] = [];
					for (let k = 0; k < 4; k++) {
						tile[u][v].push(input.pixels[(((i + u) % input.height) * input.width + (j + v) % input.width) * 4 + k]);
					}
				}
			}
			console.log(tile);

			if (Symmetry) {
				for (let flip = 0; flip < 2; flip++) {
					tile = flip_list_lr(tile);

					for (let rotate = 0; rotate < 4; rotate++) {
						tile = rotate_list_90(tile);

						if (pattern_list.indexOf(tile) == -1) {
							patterns[tile] = pattern_list.length;
							pattern_list.push(tile);
						}
					}
				}
			} else {
				if (pattern_list.indexOf(tile) == -1) {
					patterns[tile] = pattern_list.length;
					pattern_list.push(tile);
				}
			}
		}
	}

	let matcher = new Matcher();


	for (let a of pattern_list) {
		for (let b of pattern_list) {
			for (let dir = 0; dir < 4; dir++) {
				// TODO: fix pattern_compatible()
				if (pattern_compatible(a, b, dir)) {
					matcher.add_pattern(patterns[a], patterns[b], dir);
				}
			}
		}
	}

	print(matcher)

	return new Field(pattern_list, matcher, W, H);
}

class Field {
	constructor(patterns, matcher, W, H) {
		this.patterns = patterns;
		this.matcher = matcher;

		this.W = W;
		this.H = H;

		this.flush()
	}

	flush() {
		// creates a grid of tiles with all 
		// possible states

		this.grid = [];
		for (let i = 0; i < this.H; i++) {
			this.grid[i] = [];
			for (let j = 0; j < this.W; j++) {
				this.grid[i][j] = []
				for (let k = 0; k < this.patterns.length; k++)
					this.grid[i][j].push(k);
			}
		}
	}

	get_p5_image(upscale = 8) {
		let img = createImage(this.W * upscale, this.H * upscale);

		img.loadPixels();

		for (let i = 0; i < this.H; i++) {
			for (let j = 0; j < this.W; j++) {
				let r, g, b = 127;

				if (this.has_tile_collapsed(i, j)) {
					r = this.grid[i][j][0];
					g = this.grid[i][j][1];
					b = this.grid[i][j][2];
				}

				for (let u = 0; u < upscale; u++) {
					for (let v = 0; v < upscale; v++) {
						img.pixels[((i + u) * this.W * upscale + (j + v)) * 4 + 0] = r;
						img.pixels[((i + u) * this.W * upscale + (j + v)) * 4 + 1] = g;
						img.pixels[((i + u) * this.W * upscale + (j + v)) * 4 + 2] = b;
						img.pixels[((i + u) * this.W * upscale + (j + v)) * 4 + 3] = 255;
					}
				}
			}
		}

		img.updatePixels();

		return img;
	}

	get_lowest_entropy_index() {
		// returns the i,j indecies of the tile 
		// with the lowest entropy

		let entropies = [];
		for (let i = 0; i < this.H; i++) {
			entropies[i] = [];
			for (let j = 0; j < this.W; j++) {
				entropies[i][j] = calculate_entropy(this.grid[i][j]);
			}
		}

		let min_collumn = [];
		for (let row of entropies) {
			min_collumn.push(min_(row));
		}

		let min_i = min_collumn.indexOf(min_(min_collumn));
		print(min_(min_collumn));
		let min_j = entropies[min_i].indexOf(min_(min_collumn));

		return { min_i, min_j }
	}

	has_tile_collapsed(i, j) {
		return this.grid[i][j].length == 1;
	}

	collapse_tile(i, j) {
		this.grid[i][j] = [random(this.grid[i][j])];
	}

	count_collapsed() {
		// returns the number of collapsed tiles

		let count = 0;
		for (let row of this.grid)
			for (let states of row)
				if (states.length <= 1)
					count++;
		return count;
	}

	has_collapsed() {
		return this.count_collapsed() == 0;
	}

	get_neighbor_indexes(i, j) {
		let neighbors = [];

		let cardinals = realtive_cardinals(i, j);
		print(i, j)

		for (let i = 0; i < 4; i++) {
			neighbors.push([(cardinals[i][0] + this.H) % this.H, (cardinals[i][1] + this.W) % this.W]);
		}


		return neighbors;
	}

	collaspse() {
		while (!this.has_collapsed()) {
			const { min_i, min_j } = this.get_lowest_entropy_index();

			if (!this.has_tile_collapsed(min_i, min_j))
				this.collaspse_tile(min_i, min_j);

			let affected = this.get_neighbor_indexes(min_i, min_j);

			while (affected.length > 0) {
				let new_affected = [];

				for (const tile of affected) {
					let i = tile[0];
					let j = tile[1];
					let neighbors = this.get_neighbor_indexes(i, j);
					let neighbor_states = [];
					for (let ind of neighbors) {
						neighbor_states.push(this.grid[ind[0]][ind[1]]);
					}

					let new_states = this.matcher.match(this.grid[i][j], neighbor_states);

					let current_states = this.grid[i][j].states;

					if (current_states !== new_states) {
						this.grid[i][j] = new_states;

						new_affected.push(...neighbors);
					}
				}
				affected = new_affected;
			}
		}
		return true;
	}
}

class Matcher {
	constructor() {
		this.patterns = [];
	}

	add_pattern(state, neighbor, dir) {
		if (this.patters[state] != undefined) {
			if (this.patterns[state][dir] != undefined) {
				this.patterns[state][dir].push(neighbor);
			} else {
				this.patterns[state][dir] = [neighbor];
			}
		} else {
			this.patterns[state] = { dir: [] };
			this.patterns[state][dir].push(neighbor);
		}
	}

	match(my_states, neighbor_states) {
		let states = [...my_states];

		for (let i = 0; i < 4; i++) {
			let possible_neighbors = [];
			for (let state of neighbor_states[i]) {
				possible_neighbors.push(...this.patterns[state][(i + 2) % 4]);
			}
			states = states.filter(value => possible_neighbors.includes(value))
		}

		return states;
	}
}

function pattern_compatible(a, b, dir) {
	let A = 0;
	let B = 1;

	switch (dir) {
		case 0:
			A = transpose_2D(a);
			A.pop();
			B = transpose_2D(b);
			B.shift();
		case 1:
			A = [...a];
			A.pop();
			B = [...b];
			B.shift();
		case 2:
			A = transpose_2D(a);
			A.shift();
			B = transpose_2D(b);
			B.pop();
		case 3:
			A = [...a];
			A.shift();
			B = [...b];
			B.pop();
	}

	print(A, B)

	return A === B;
}

function transpose_2D(l) {
	let nl = [];
	for (let i = 0; i < l[0].length; i++) {
		nl[i] = [];
		for (let j = 0; j < l.length; j++) {
			nl[i][j] = l[j][i];
		}
	}

	return nl;
}

function rotate_list_90(l) {
	return flip_list_lr(transpose_2D(l));
}


function flip_list_lr(l) {
	let nl = [];
	let temp = [...l];
	for (let i = 0; i < l.length; i++) {
		nl.push(temp.pop());
	}
	return nl;
}

function realtive_cardinals(i, j) {
	return [[i, j - 1], [i - 1, j], [i, j + 1], [i + 1, j]];
}

function calculate_entropy(states) {
	return states.length;
}

function min_(lis) {
	let minmum = Infinity;
	for (let elt of lis) {
		minmum = (elt < minmum) ? elt : minmum;
	}
	return minmum;
}