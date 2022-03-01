

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







class Enemy {
    constructor() {
        this.vel = Vector2.fromAngle(Math.random() * Math.PI * 2);
        this.vel.length = 2;

        this.radius = 20;

        this.gfx = new PIXI.Graphics();
        this.gfx.beginFill(0xFF0000);
        this.gfx.drawCircle(0, 0, this.radius);
        this.gfx.endFill();

        this.gfx.x = Math.random() * renderer.width;
        this.gfx.y = Math.random() * renderer.height;

        this.setRandomEdgePosition()

        stage.addChild(this.gfx);
    }

    update() {
        this.gfx.x += this.vel.x;
        this.gfx.y += this.vel.y;

        wrap(this.gfx);
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
            this.gfx.x = renderer.width;
            this.gfx.y = Math.random() * renderer.height;
        }
        if(side == 2) {
            this.gfx.x = 0;
            this.gfx.y = Math.random() * renderer.height;
        }
        if(side == 1) {
            this.gfx.x = Math.random() * renderer.width;
            this.gfx.y = 0;
        }
        if(side == 3) {
            this.gfx.x = Math.random() * renderer.width;
            this.gfx.y = renderer.height;
        }

    }


}

class Player {
    constructor() {
        this.vel = new Vector2();
        this.radius = 5;

        this.gfx = new PIXI.Graphics();
        this.gfx.beginFill(0x0000FF);
        this.gfx.drawCircle(0, 0, this.radius);
        this.gfx.endFill();
    }

    update() {
        this.vel = Vector2.fromAngle(Vector2.angleBetween(new Vector2(this.gfx.x, this.gfx.y), new Vector2(mouse.x, mouse.y)));
    }
}



let enemies = [];

let enemySpawnTimer = new Clock();
enemySpawnTimer.start();

let lastTime = 0;
function gameLoop() {
    let now = performance.now();
    let delta = (now - lastTime) / 1000;
    lastTime = now;
    if(delta > 0.2) delta = 0.2;
    if(delta < 0) delta = 0;

    enemies.forEach(enemy => {
        enemy.update();

    });

    if(enemySpawnTimer.getElapsedTime() > 200) {
        enemySpawnTimer.restart();
        enemies.push(new Enemy());
    }


    requestAnimationFrame(gameLoop);
} 

function startGame() {
    
    for(let i = 0; i < 10; i++) {
        enemies.push(new Enemy());
    }
    gameLoop();
}

