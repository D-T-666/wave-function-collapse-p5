class Tile {
    constructor(x, y, size, states) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.states = states;
        this.pstates = states;
    }

    collapse() {
        this.states = [random(this.states)];
    }

    has_collapsed() {
        return this.states.length == 1;
    }

    reveal(direction) {
        if (!this.has_collapsed()) return false;

        this.reveal_direction = direction;
        this.reveal_begin_frame = frameCount;
        return true;
    }

    reveal_step() {
        let r = constrain(float(frameCount - this.reveal_begin_frame) / 60, 0, 1); // 10 frames to finish the animation
        if (r == 1) return true;

        let dr = (this.reveal_begin_frame != undefined) ? 1 : 0;

        fill(255);
        noStroke();
        rect(
            this.x + ((this.direction % 2 == 0) ? (this.size * (1 - r) * 0.5) : 0),
            this.y + ((this.direction % 2 == 1) ? (this.size * (1 - r) * 0.5) : 0),
            this.size * ((this.direction % 2 == 1) ? r : dr),
            this.size * ((this.direction % 2 == 0) ? r : dr)
        );

        return false;
    }

    show() {
        noFill();
        stroke(1);
        strokeWeight(1);

        rect(this.x, this.y, this.size, this.size);
    }
}