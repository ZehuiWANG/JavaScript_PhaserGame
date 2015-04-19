
BasicGame.Preloader = function (game) {

  this.background = null;
  this.preloadBar = null;

  //this.ready = false;

};

BasicGame.Preloader.prototype = {

  preload: function () {

    //  Show the loading progress bar asset we loaded in boot.js
    this.stage.backgroundColor = '#2d2d2d';

    this.preloadBar = this.add.sprite(400, 300, 'preloaderBar');
    this.add.text(500, 300, "Loading...", { font: "32px monospace", fill: "#fff" }).anchor.setTo(0.5, 0.5);

    //  This sets the preloadBar sprite as a loader sprite.
    //  What that does is automatically crop the sprite from 0 to full-width
    //  as the files below are loaded in.
    this.load.setPreloadSprite(this.preloadBar);

    //  Here we load the rest of the assets our game needs...
	this.load.image('menu_image', 'assets/deep-space.png');
	this.game.load.image('bullet', 'assets/bullets.png');
    this.game.load.image('enemyBullet', 'assets/enemy-bullet.png');
    this.game.load.spritesheet('invader', 'assets/invader.png', 32, 32);
    this.game.load.image('ship', 'assets/player.png');
    this.game.load.spritesheet('kaboom', 'assets/explode.png', 128, 128);
    this.game.load.image('starfield', 'assets/background.png');
	this.game.load.audio('starCraft', ['assets/audio/music.mp3']);
	this.game.load.audio('sfx', 'assets/audio/shot.mp3');
	
	//partical system
	this.game.load.spritesheet('rain', 'assets/rain.png', 21, 21);
    
   
  },

  create: function () {
	
   	this.state.start('MainMenu');
  }
};
