
BasicGame.MainMenu = function (game) {

  this.playButton = null;

};

BasicGame.MainMenu.prototype = {

  create: function () {
	
	// a very simple menu
	this.add.tileSprite(0, 0, 800, 600, 'menu_image');

    this.loadingText1 = this.add.text(150, 200, "Start Game", { font: "24px monospace", fill: "#fff" });
	this.loadingText2 = this.add.text(150, 250, "Score History", { font: "24px monospace", fill: "#fff" });
	this.loadingText3 = this.add.text(160, 320, "Game Over", { font: "24px monospace", fill: "#fff" });
    this.loadingText1.anchor.setTo(0.1, 0.5);
	this.loadingText3.anchor.setTo(-0.2, 0.8);
	
	
	
	//create the partical system
	var emitter = this.game.add.emitter(this.game.world.centerX, 0, 400);
	emitter.width = this.game.world.width;
	// emitter.angle = 30; // uncomment to set an angle for the rain.

	emitter.makeParticles('rain');

	emitter.minParticleScale = 0.1;
	emitter.maxParticleScale = 0.5;

	emitter.setYSpeed(300, 500);
	emitter.setXSpeed(-5, 5);

	emitter.minRotation = 0;
	emitter.maxRotation = 0;

	emitter.start(false, 1600, 5, 0);
  
  },

  update: function () {

    if (this.input.activePointer.isDown) {
      this.startGame();
    }
    //  Do some nice funky main menu effect here

  },

  startGame: function (pointer) {
    // start the  game
    this.state.start('Game');
  }

};
