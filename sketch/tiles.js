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
        // Returns infinity if the tile has collapsed and returns the 
        // length of the states if the tile hasn't collapsed
        return (this.states.length > 1) ? this.states.length : Infinity;
    }

    slowReveal(dir = 0) {
        // initiallizes some varialbes for animation
        this.reveal_direction = dir;
        this.reveal_timer_max = 20;
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

            let spacing = this.size / 8;
            // let corner = ceil(spacing * 0.7);
            let corner = spacing * 1.3;

            rect(
                x + spacing / 2,
                y + spacing / 2,
                w - spacing,
                h - spacing,
                corner
            );

        } else {
            if (this.states.length < 11) {
                const sLen = this.states.length;

                colorMode(HSB, 255, 255, 255);
                fill(sLen * 12 + 50, 128, 255, 1 - sLen / 10);
                textAlign(CENTER, CENTER);
                textSize(this.size / 2);
                text(sLen, x + w / 2, y + h / 2);
                colorMode(RGB);


                // let br = (1 - this.states.length / this.total_states) * 0.8 + 0.2;
                // fill(255, br * 127);
                // noStroke();
                // ellipse(x + w / 2, y + h / 2, w * .4, h * .4);
            }
        }

    }
}