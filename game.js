import Phaser from "phaser";

let game;

const Options = {

    characterGravity: 500,
    characterSpeed: 200
};


window.onload = function () {
    let Config = {
        type: Phaser.AUTO,
        backgroundColor: 'rgb(170,170,170)',
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            width: 1024,
            height: 1024,
        },
        pixelArt: true,
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 10
                }
            }

        },
        scene: [Stage1, Victory]

    }

    game = new Phaser.Game(Config);
    window.focus;

}




class Stage1 extends Phaser.Scene {


    constructor() {
        super({key: "Stage1"});
    }

    preload() {
        this.load.image("tileset", "assets/Maps/Tileset.png")
        this.load.tilemapTiledJSON("maps", "assets/maps/Map1.json");
        this.load.spritesheet("characters", "assets/sprites/characters.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("ghost", "assets/sprites/ghost.png", {frameWidth: 102, frameHeight: 90});
    }
    create() {
        this.map = this.make.tilemap({ key: "maps" });
        this.tileset = this.map.addTilesetImage("Tileset", "tileset");
        this.layer = this.map.createLayer("Stage1", this.tileset, 0, 0);
        this.layer.setCollisionBetween(0, 50);
        this.character = this.physics.add.sprite(500, 800, "characters", 25);
        this.ghostGroup = this.physics.add.group({
            bounceX: 1,
            bounceY: 1,
            immovable: true,
            gravityX: false,
            gravityY: false,
            velocityX: Phaser.Math.Between(-100,100),
            velocityY: Phaser.Math.Between(-100,100)
        });

        this.character.body.gravity.y = Options.characterGravity;
        this.physics.add.collider(this.character, this.layer, null, null, this);
        this.physics.add.collider(this.ghostGroup, this.layer, null, null, this);
        this.physics.add.collider(this.character, this.ghostGroup, this.restartGame, null, this);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.timerText = this.add.text(3/4*game.config.width, 32, "0", {fontSize: "50px", color: "#562880", fill: "#FFFFFF"});
        this.timer = this.time.addEvent({delay: 60000});
        this.helpText = this.add.text(32, 32, "Move with arrow keys and try to survive for 60 seconds to win the game!", {fontSize: "20px", fontFamily: "Impact", fill: "#FFFFFF"}); 

        this.triggerTimer = this.time.addEvent({
            callback: this.createGhosts,
            callbackScope: this,
            delay: 3000,
            loop: true,
        })

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("characters", {start: 24, end: 28}),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: "turn",
            frames: [{key: "characters", frame: 24}],
            frameRate: 20,
        })
        this.anims.create({
            key: "jump1",
            frames: [{key: "characters", frame: 28}],
            frameRate: 20,
        })
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("characters", {start: 24, end: 27}),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create({
            key: "scare",
            frames: this.anims.generateFrameNumbers("ghost", {start: 1, end: 9}),
            frameRate: 10,
            repeat: -1,
        })
        this.anims.create
    }

    createGhosts() {
        console.log("Adding ghosts!");
       
        this.ghostGroup.create(Phaser.Math.Between(33, game.config.height-33), Phaser.Math.Between(33, game.config.width-33), "ghost", 1);
 
    }
    restartGame(){
        this.scene.restart();
    }

    update() {
        
        if(this.ghostGroup.getLength()>0){
            this.ghostGroup.playAnimation("scare", 1);
        }
        this.timerText.setText(this.timer.getOverallRemainingSeconds().toPrecision(3).toString());

        if (this.cursors.up.isDown) {
            if (this.character.body.onFloor()) {
                this.character.body.velocity.y = -1.7*Options.characterSpeed;
                this.character.anims.play("jump1", true);
            }

        }

        if (this.cursors.left.isDown) {
            this.character.body.velocity.x = -Options.characterSpeed;
            this.character.anims.play("left", true);
            this.character.setScale(-1, 1);

        }
        else if (this.cursors.right.isDown) {
            this.character.body.velocity.x = Options.characterSpeed;
            this.character.anims.play("right", true);
            this.character.setScale(1, 1);

        }
        else{
            if (this.character.body.onFloor()) {
                this.character.body.velocity.x = 0;
                this.character.anims.play("turn", true);
                this.character.setScale(1, 1);
            }
        
        }
        if(this.timer.getOverallRemainingSeconds()<= 0){
            this.scene.start("Victory");
        }
        else if(this.timer.getOverallRemainingSeconds()<= 50){
            this.helpText.destroy(true);
        }
    }
    
}


class Victory extends Phaser.Scene {

    constructor(){
        super("Victory");
    }
    preload() {
        this.load.image("victory", "assets/sprites/victory.png");
    }

    create(){
        this.victory = this.add.image(500, 500, "victory");
        this.victory.setScale(2);
        this.spacebar = this.input.keyboard.addKey("SPACE", true, true); 
        this.add.text(16, 16, "Press Spacebar to restart the game!", {fontSize: "20px", fontFamily: "Impact", fill: "#FFFFFF"}); 
    }
    update(){
        if(this.spacebar.isDown){
            this.scene.start("Stage1")
        }
    }

}




