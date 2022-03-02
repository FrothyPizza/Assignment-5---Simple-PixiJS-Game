

const loader = new PIXI.Loader();
loader.add('startButton', 'images/start-btn.png');


let app = new PIXI.Application({
    width: 600,
    height: 600,
    view: document.getElementById("canvas"),
    antialias: true,
});

let stage = app.stage;
let renderer = app.renderer;

mouse.relativeContainer = app.view;



let startScene = new PIXI.Container();
stage.addChild(startScene);
loader.load(() => {
    let startButton = new PIXI.Sprite(loader.resources.startButton.texture);
    startButton.x = renderer.width / 2 - startButton.width / 2;
    startButton.y = renderer.height / 2 - startButton.height / 2;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on('pointerdown', () => {
        startGame();
        startScene.visible = false;
    });
    startScene.addChild(startButton);
});

let gameScene = new PIXI.Container();
gameScene.visible = false;
stage.addChild(gameScene);


function wrap(pos, size) {
    // if(obj.x + obj.width < 0) {
    //     obj.x = app.screen.width;
    // }
    // if(obj.x - obj.width > app.screen.width) {
    //     obj.x = 0;
    // }
    // if(obj.y + obj.height < 0) {
    //     obj.y = app.screen.height;
    // }
    // if(obj.y - obj.height > app.screen.height) {
    //     obj.y = 0;
    // }

    if(pos.x + size.x < 0) {
        pos.x = app.screen.width;
    }
    if(pos.x - size.x > app.screen.width) {
        pos.x = 0;
    }
    if(pos.y + size.y < 0) {
        pos.y = app.screen.height;
    }
    if(pos.y - size.y > app.screen.height) {
        pos.y = 0;
    }
}


class Enemy {
    constructor() {
        this.vel = Vector2.fromAngle(Math.random() * Math.PI * 2);
        this.pos = new Vector2();
        this.vel.length = 200;

        this.radius = 20;

        this.gfx = new PIXI.Graphics();
        this.gfx.beginFill(0xFF0000);
        this.gfx.drawCircle(0, 0, this.radius);
        this.gfx.endFill();

        this.gfx.x = Math.random() * renderer.width;
        this.gfx.y = Math.random() * renderer.height;

        this.setRandomEdgePosition()

        gameScene.addChild(this.gfx);
    }

    destroy() {
        gameScene.removeChild(this.gfx);
    }

    update(delta) {
        this.pos.x += this.vel.x * delta;
        this.pos.y += this.vel.y * delta;

        wrap(this.pos, new Vector2(this.radius * 2, this.radius * 2));

        this.updateGraphicsPosition();
    }

    setRandomEdgePosition() {
        let side = Math.floor(Math.random() * 4);
        /*  
            __1__
           |     |
         2 |     | 0
           |_____|
              3
        */
        if(side == 0) {
            this.pos.x = renderer.width;
            this.pos.y = Math.random() * renderer.height;
        }
        if(side == 2) {
            this.pos.x = 0;
            this.pos.y = Math.random() * renderer.height;
        }
        if(side == 1) {
            this.pos.x = Math.random() * renderer.width;
            this.pos.y = 0;
        }
        if(side == 3) {
            this.pos.x = Math.random() * renderer.width;
            this.pos.y = renderer.height;
        }

        this.updateGraphicsPosition();
    }

    updateGraphicsPosition() {
        this.gfx.x = this.pos.x;
        this.gfx.y = this.pos.y;
    }

}

class Player {
    constructor() {
        this.vel = new Vector2();
        this.pos = new Vector2();
        this.radius = 5;
        this.speed = 300;

        this.gfx = new PIXI.Graphics();
        this.gfx.beginFill(0x0000FF);
        this.gfx.drawCircle(0, 0, this.radius);
        this.gfx.endFill();

        this.pos.x = renderer.width / 2;
        this.pos.y = renderer.height / 2;

        gameScene.addChild(this.gfx);
    }

    get x() { return this.pos.x; }
    get y() { return this.pos.y; }
    set x(x) { this.pos.x = x; this.updateGraphicsPosition(); }
    set y(y) { this.pos.y = y; this.updateGraphicsPosition(); }


    update(delta) {
        this.vel = Vector2.fromAngle(Vector2.angleBetween(this.pos, mouse.pos));
        this.vel.length = this.speed * delta;

        if(Vector2.dist(this.pos, mouse.pos) < this.radius) {
            this.vel.length = 0;
        }

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        this.updateGraphicsPosition();
    }

    colliding(enemies) {
        for(let enemy of enemies) {
            // if(Vector2.dist(new Vector2(this.gfx.x, this.gfx.y), new Vector2(enemy.gfx.x, enemy.gfx.y)) < this.radius + enemy.radius) {
            if(Vector2.dist(this.pos, enemy.pos) < this.radius/2 + enemy.radius) {
                return true;
            }
        }
        return this.pos.x < 0 || this.pos.x > renderer.width || this.pos.y < 0 || this.pos.y > renderer.height;
    }

    updateGraphicsPosition() {
        this.gfx.x = this.pos.x;
        this.gfx.y = this.pos.y;
    }

    destroy() {
        gameScene.removeChild(this.gfx);
    }


}






let enemies = [];
let player = new Player();

let enemySpawnTimer = new Clock();
enemySpawnTimer.start();
const ENEMY_SPAWN_DELAY_MS = 500;

let lastTime = 0;
function gameLoop() {
    let now = performance.now();
    let delta = (now - lastTime) / 1000;
    lastTime = now;
    if(delta > 0.2) delta = 0.2;
    if(delta < 0) delta = 0;

    enemies.forEach(enemy => {
        enemy.update(delta);
    });

    player.update(delta);
    if(player.colliding(enemies)) {
        showMenu();
    }

    if(enemySpawnTimer.getElapsedTime() > ENEMY_SPAWN_DELAY_MS) {
        enemySpawnTimer.restart();
        enemies.push(new Enemy());
    }


    requestAnimationFrame(gameLoop);
} 

function startGame() {
    gameScene.visible = true;
    
    enemies.forEach(enemy => {
        enemy.destroy();
    });
    enemies = [];

    player.destroy();
    player = new Player();

    enemySpawnTimer.restart();

    for(let i = 0; i < 10; i++) {
        enemies.push(new Enemy());
    }
    gameLoop();
}


function showMenu() {
    gameScene.visible = false;
    startScene.visible = true;
}
