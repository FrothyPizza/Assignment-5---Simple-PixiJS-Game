let mouse = {
    x: 0,
    y: 0,
    leftDown: false,
    rightDown: false,
    onLeftClick: () => {},
    onLeftRelease: () => {},
    relativeContainer: null,
    isInContainer: false,
};

document.addEventListener('mousemove', event => {
    if(mouse.relativeContainer) {
        let boundingRect = mouse.relativeContainer.getBoundingClientRect();
        mouse.x = event.clientX - boundingRect.left;
        mouse.y = event.clientY - boundingRect.top;

        mouse.isInContainer = mouse.x >= 0 && mouse.x <= mouse.relativeContainer.width &&
                              mouse.y >= 0 && mouse.y <= mouse.relativeContainer.height;
    } else {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    }
});

document.addEventListener('mousedown', event => {
    if(event.button == 0) {
        mouse.leftDown = true;
        mouse.onLeftClick();
    } else if(event.button == 2) {
        mouse.rightDown = true;
    }
});

document.addEventListener('mouseup', event => {
    if(event.button == 0) {
        mouse.leftDown = false;
        mouse.onLeftRelease();
    } else if(event.button == 2) {
        mouse.rightDown = false;
    }
});



let keys = [];
document.addEventListener('keydown', event => {
    keys[event.key] = true;
});

document.addEventListener('keyup', event => {
    keys[event.key] = false;
});



document.addEventListener("visibilitychange", () => {
    if(document.hidden) {
        mouse.leftDown = false;
        mouse.rightDown = false;

        keys.forEach(key => {
            keys[key] = false;
        });
    }
});




class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // getters and setters are so cool
    get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    set length(length) {
        let angle = this.angle;
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    get angle() {
        return Math.atan2(this.y, this.x);
    }

    set angle(angle) {
        let length = this.length;
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
    }

    subtract(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
    }

    multiply(vector) {
        this.x *= vector.x;
        this.y *= vector.y;
    }

    scalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    normalize() {
        let length = this.length;
        this.x /= length;
        this.y /= length;
    }


    static fromAngle(angle) {
        return new Vector2(Math.cos(angle), Math.sin(angle));
    }

    static angleBetween(vector1, vector2) {
        return Math.atan2(vector2.y - vector1.y, vector2.x - vector1.x);
    }
}


class Clock {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.pausedTime = 0;
        this.isPaused = false;
        this.isStarted = false;
    }

    start() {
        this.startTime = performance.now();
        this.isStarted = true;
        this.isPaused = false;
    }

    pause() {
        if (this.isStarted && !this.isPaused) {
            this.isPaused = true;
            this.pausedTime = performance.now();
        }
    }

    resume() {
        if (this.isStarted && this.isPaused) {
            this.isPaused = false;
            this.startTime += (performance.now() - this.pausedTime);
        }
    }

    getElapsedTime() {
        if (this.isStarted && !this.isPaused) {
            this.elapsedTime = performance.now() - this.startTime;
        }
        return this.elapsedTime;
    }

    restart() {
        this.startTime = performance.now();
        this.elapsedTime = 0;
        this.isStarted = true;
        this.isPaused = false;
    }
}



function wrap(obj) {
    if(obj.x + obj.width < 0) {
        obj.x = app.screen.width;
    }
    if(obj.x - obj.width > app.screen.width) {
        obj.x = 0;
    }
    if(obj.y + obj.height < 0) {
        obj.y = app.screen.height;
    }
    if(obj.y - obj.height > app.screen.height) {
        obj.y = 0;
    }
}