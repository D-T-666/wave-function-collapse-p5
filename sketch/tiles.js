class Tile {
    constructor(states, total_states, x, y, size) {
        this.states = states;
        this.total_states = total_states;
        this.pos = createVector(x || 0, y || 0);
        this.size = size;
    }

    collapse() {
        this.states = [random(this.states)];
    }

    slowReveal(dir = 0) {
        this.reveal_direction = dir % 2;
        this.reveal_timer_max = 30;
        this.reveal_timer = this.reveal_timer_max;
    }

    isCollapsed() {
        return this.states.length < 2;
    }

    display() {
        fill(255 - this.states.length / this.total_states * 204);
        stroke(255, 100);
        strokeWeight(1);

        let x = (this.pos.x * this.size);
        let y = (this.pos.y * this.size);
        let w = (this.size);
        let h = (this.size);

        if (this.reveal_timer > 0) {
            if (this.reveal_direction == 0) {
                w = w * (1 - this.reveal_timer / this.reveal_timer_max);
                x += (this.size - w) / 2;
            }
            if (this.reveal_direction == 1) {
                h = h * (1 - this.reveal_timer / this.reveal_timer_max);
                y += (this.size - h) / 2;
            }
        }

        this.reveal_timer = lerp(this.reveal_timer, 0, 0.08);

        rect(x, y, w, h);
    }
}