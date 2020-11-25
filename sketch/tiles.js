/**
 * Tile(states, total amount of states, x location, y location, width that will be display)
*/

class Tile {
    constructor(states, total_states, x, y) {
        this.states = states;
        this.pLen = this.states.length;
        this.total_states = total_states;
        this.pos = createVector(x || 0, y || 0);
        this.highlight = false;
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
        this.reveal_timer_max = 10;
        this.reveal_timer = this.reveal_timer_max;
    }

    display() {
        // set x coordinate to be the x index of the tile * the size of the tile 
        let x = (this.pos.x * tileWidth);
        // set y coordinate to be the y index of the tile * the size of the tile 
        let y = (this.pos.y * tileHeight);
        // Set w, h to size
        let w = tileWidth;
        let h = tileHeight;

        if (this.hasCollapsed()) {
            if (this.reveal_timer > 0.02) {
                fill('#0f0f25');
                noStroke();
                rect(x, y, w, h);
                fill(this.color);
                noStroke();

                if (this.reveal_timer > 0) {
                    if (this.reveal_direction == 0) {
                        w = w * (1 - this.reveal_timer / this.reveal_timer_max);
                        x += (tileWidth - w) / 2;
                    }
                    if (this.reveal_direction == 1) {
                        h = h * (1 - this.reveal_timer / this.reveal_timer_max);
                        y += (tileHeight - h) / 2;
                    }
                    if (this.reveal_direction == 2) {
                        w = w * (1 - this.reveal_timer / this.reveal_timer_max);
                        x += (tileWidth - w) / 2;
                        h = h * (1 - this.reveal_timer / this.reveal_timer_max);
                        y += (tileHeight - h) / 2;
                    }
                }

                this.reveal_timer = lerp(this.reveal_timer, 0, 0.3);

                rect(
                    x + tileSpacing / 2,
                    y + tileSpacing / 2,
                    w - tileSpacing,
                    h - tileSpacing,
                    tileBorderRadius
                );
            }

        } else if (this.highlight) {
            noStroke();
            fill('#0f0f25');
            rect(x, y, w, h);
            this.highlight = false;
        } else {
            if (this.states.length < 26 && this.states.length != this.pLen) {
                const sLen = this.states.length;
                this.pLen = sLen;

                noStroke();
                fill('#0f0f25');
                rect(x, y, w, h);

                // colorMode(HSB, 255, 255, 255);
                // fill(sLen * 12 + 50, 128, 255, 1 - sLen / 10);

                fill(this.color);
                // textAlign(CENTER, CENTER);
                // textSize(min(tileHeight, tileWidth) / 2);
                // text(sLen, x + w / 2, y + h / 2);

                // colorMode(RGB);


                // let br = (1 - this.states.length / this.total_states) * 0.8 + 0.2;
                // fill(255, br * 127);
                noStroke();
                ellipse(x + w / 2, y + h / 2, w * (1 / this.states.length), h * (1 / this.states.length));
            }

            // if (this.color) {
            //     fill(this.color);
            //     noStroke();
            //     rect(
            //         x + tileSpacing / 2,
            //         y + tileSpacing / 2,
            //         w - tileSpacing,
            //         h - tileSpacing,
            //         tileBorderRadius
            //     );
            // }
        }

    }

    Highlight() {
        // set x coordinate to be the x index of the tile * the size of the tile 
        let x = (this.pos.x * tileWidth);
        // set y coordinate to be the y index of the tile * the size of the tile 
        let y = (this.pos.y * tileHeight);
        // Set w, h to size
        let w = tileWidth;
        let h = tileHeight;
        fill(127);
        noStroke();
        rect(
            x + tileSpacing / 2,
            y + tileSpacing / 2,
            w - tileSpacing,
            h - tileSpacing,
            tileBorderRadius
        );
        this.highlight = true;
    }
}