





class Vector2 {
    constructor(x, y) {
        if(x instanceof Vector2) {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x || 0;
            this.y = y || 0;
        }
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

    static dist(vector1, vector2) {
        return Math.sqrt(Math.pow(vector2.x - vector1.x, 2) + Math.pow(vector2.y - vector1.y, 2));

        // if(arguments.length == 2) {
        //     let vector1 = arguments[0];
        //     let vector2 = arguments[1];
        //     return Math.sqrt(Math.pow(vector2.x - vector1.x, 2) + Math.pow(vector2.y - vector1.y, 2));
        // }
        // if(arguments.length == 3 && arguments[0] instanceof Vector2) {
        //     let vector = arguments[0];
        //     let x = arguments[1];
        //     let y = arguments[2];
        //     return Math.sqrt(Math.pow(x - vector.x, 2) + Math.pow(y - vector.y, 2));
        // }
        // if(arguments.length == 3 && typeof arguments[0] == 'number') {
        //     let x = arguments[0];
        //     let y = arguments[1];
        //     let vector = arguments[2];
        //     return Math.sqrt(Math.pow(x - vector.x, 2) + Math.pow(y - vector.y, 2));
        // }
        // if(arguments.length == 4) {
        //     let x1 = arguments[0];
        //     let y1 = arguments[1];
        //     let x2 = arguments[2];
        //     let y2 = arguments[3];
        //     return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        // }

        // console.error("Invalid arguments for Vector2.dist()");
        // return 0;
    }
}








let mouse = {
    pos: new Vector2(0, 0),
    leftDown: false,
    rightDown: false,
    onLeftClick: () => {},
    onLeftRelease: () => {},
    relativeContainer: null,
    isInContainer: false,
    get x() { return this.pos.x; },
    get y() { return this.pos.y },
    set x(x) { this.pos.x = x; },
    set y(y) { this.pos.y = y; },
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


let keyPressListeners = [];
function addKeyPressListener(key, callback) {
    let listener = {
        key: key,
        func: event => {
            if(event.key == key) {
                callback();
            }
        }
    }

    document.addEventListener('keydown', listener.func);
    keyPressListeners.push(listener);
}

function removeKeyListeners(key) {
    for(let i = 0; i < keyPressListeners.length; i++) {
        if(keyPressListeners[i].key == key) {
            document.removeEventListener('keydown', keyPressListeners[i].func);
            keyPressListeners.splice(i, 1);
            i--;
        }
    }
}





document.addEventListener("visibilitychange", () => {
    if(document.hidden) {
        mouse.leftDown = false;
        mouse.rightDown = false;

        keys.forEach(key => {
            keys[key] = false;
        });
    }
});







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


