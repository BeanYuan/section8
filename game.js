class GamePlayScene extends Phaser.Scene {
    constructor() {
        super("gameplayscene");
    }
    preload(){
        this.load.path = './assets/';
        this.load.image("main_character", "textures/main_character.png");
        this.load.image("wall", "textures/wall.png");
        this.load.image("mob", "textures/mob.png");
    }
    create(){
        this.gameover = false;
        this.cursors = this.input.keyboard.addKeys('W,A,S,D,T');

        this.mainCharacter = this.physics.add.sprite(100, 200, 'main_character')
        .setInteractive()
        .setScale(1.5)
        .setCollideWorldBounds(true);

        let timedEvent = this.time.addEvent({ delay: 2000, callback: this.spawnMob, callbackScope: this, loop: true });

        this.wallGroup = this.physics.add.group();
        this.createWall();

        this.mobGroup = this.physics.add.group();

        this.physics.add.collider(this.mainCharacter, this.wallGroup);
    }
    update() {
        if (this.cursors.A.isDown && !this.gameover) {
            this.mainCharacter.setVelocityX(-160);
        }
        else if (this.cursors.D.isDown && !this.gameover) {
            this.mainCharacter.setVelocityX(160);
        }
        else {
            this.mainCharacter.setVelocityX(0);
        }

        if (this.cursors.W.isDown && this.mainCharacter.body.touching.down && !this.gameover) {
            this.mainCharacter.setVelocityY(-150);
        }

        if(this.mainCharacter.x > 500){
            this.win();
        }
    }
    fail() {
        this.gameover = true;
        let fail = this.add.text(300, 200, "You fail").setFontSize(50);
        this.tweens.add({
            targets: fail,
            alpha: 0,
            duration: 2000,
            onComplete: () => {
                this.scene.start("gameplayscene");
            }
        });
    }

    win(){
        let win = this.add.text(300, 200, "You win").setFontSize(50);
        this.tweens.add({
            targets: win,
            alpha: 0,
            duration: 2000,
            onComplete: () => {
                this.scene.start("gameplayscene");
            }
        });
    }
    spawnMob() {
        this.enemy = this.physics.add.sprite(500, 281, 'mob')
        .setInteractive()
        .setScale(1.5);
        this.enemy.body.allowGravity = false;
        this.tweens.add({
            targets: this.enemy,
            x: 0,
            y: 281,
            duration: 6000,
            ease: 'Linear',
            onComplete: () => { 
                this.enemy.destroy();
            }
        });
        this.physics.add.collider(this.mainCharacter, this.enemy, this.fail, null, this);
    }
    createWall() {
        this.wall1 = this.add.tileSprite(400, 300, 800, 10, 'wall');
        this.wall1Collider = this.wallGroup.create(this.wall1.x, this.wall1.y);
        this.wall1Collider.setDisplaySize(this.wall1.width, this.wall1.height);
        this.wall1Collider.setVisible(false);
        this.wall1Collider.setImmovable(true);
        this.wall1Collider.body.allowGravity = false;
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [GamePlayScene],
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200 },
        debug: true,
      }
    }
  };
  
  const game = new Phaser.Game(config);