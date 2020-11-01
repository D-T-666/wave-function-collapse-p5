/**
 * Tile(states, total amount of states, x location, y location, width that will be display)
*/

class Tile {
    constructor(states, total_states, x, y, size) {
        this.states = states;
        this.total_states = total_states;
        this.pos = createVector(x || 0, y || 0);
        this.size = size;
    }

    collapse() {
        // Picks a random state and makes it the only state in the list
        this.states = [random(this.states)];
    }

    hasCollapsed() {
        // Checks if the length of the possible states is 1 
        // which would mean that the tile has collapsed
        return this.states.length == 1;
    }

    getEntropy() {
        // Returns infity if the tile has collapsed and returns the 
        // length of the states if the tile hasn't collapsed
        return (this.states.length > 1) ? this.states.length : Infinity;
    }

    slowReveal(dir = 0) {
        // initiallizes some varialbes for animation
        this.reveal_direction = dir;
        this.reveal_timer_max = 30;
        this.reveal_timer = this.reveal_timer_max;
    }

    display() {
        // set x coordinate to be the x index of the tile * the size of the tile 
        let x = (this.pos.x * this.size);
        // set y coordinate to be the y index of the tile * the size of the tile 
        let y = (this.pos.y * this.size);
        // Set w, h to size
        let w = (this.size);
        let h = (this.size);

        if (this.hasCollapsed()) {
            fill(this.color);
            noStroke();

            if (this.reveal_timer > 0) {
                if (this.reveal_direction == 0) {
                    w = w * (1 - this.reveal_timer / this.reveal_timer_max);
                    x += (this.size - w) / 2;
                }
                if (this.reveal_direction == 1) {
                    h = h * (1 - this.reveal_timer / this.reveal_timer_max);
                    y += (this.size - h) / 2;
                }
                if (this.reveal_direction == 2) {
                    w = w * (1 - this.reveal_timer / this.reveal_timer_max);
                    x += (this.size - w) / 2;
                    h = h * (1 - this.reveal_timer / this.reveal_timer_max);
                    y += (this.size - h) / 2;
                }
            }

            this.reveal_timer = lerp(this.reveal_timer, 0, 0.08);

            rect(x, y, w, h);
        } else {
            let br = 1 - this.states.length / this.total_states;
            fill(255, br * 255);
            noStroke();
            ellipse(x + w / 2, y + h / 2, w * .4, h * .4);
        }

    }
}