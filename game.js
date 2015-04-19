
BasicGame.Game = function (game) {
	
};

BasicGame.Game.prototype = {
	
  preload: function(){
   
  },
	
  create: function () {

	BasicGame.Game.ppp = this;//
	this.game.physics.startSystem(Phaser.Physics.ARCADE);
	//creating the background 
	this.starfield = this.game.add.tileSprite(0, 0, 800, 600, 'starfield');
	
	this.music=this.game.add.audio('starCraft');
	this.shotmusic=this.game.add.audio('shot');
	
	this.music.play();
	
	
	this.firingTimer=0;
	this.livingEnemies=[];
	this.scoreString='';
	this.score=0;
	
	
	//  Our bullet group
	this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(8, 'bullet');
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 1);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);
	
	// The enemy's bullets
    this.enemyBullets = this.game.add.group();
    this.enemyBullets.enableBody = true;
    this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyBullets.createMultiple(50, 'enemyBullet');
    this.enemyBullets.setAll('anchor.x', 0.5);
    this.enemyBullets.setAll('anchor.y', 1);
    this.enemyBullets.setAll('outOfBoundsKill', true);
    this.enemyBullets.setAll('checkWorldBounds', true);

    //  The hero!
    this.player = this.game.add.sprite(400, 500, 'ship');
    this.player.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

    //  The baddies!
    this.aliens = this.game.add.group();
    this.aliens.enableBody = true;
    this.aliens.physicsBodyType = Phaser.Physics.ARCADE;

    this.createAliens();

    //  The score
	
	
    this.scoreString = 'Score:';
    this.scoreText = this.game.add.text(10, 10, this.scoreString + this.score, { font: '34px Arial', fill: '#fff' });

    //  Lives
    this.lives = this.game.add.group();
    this.game.add.text(this.game.world.width - 100, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });

    //  Text
    this.stateText = this.game.add.text(this.game.world.centerX,this.game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    this.stateText.anchor.setTo(0.5, 0.5);
    this.stateText.visible = false;

    for (var i = 0; i < 3; i++) 
    {
        var ship = this.lives.create(this.game.world.width - 100 + (30 * i), 60, 'ship');
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = 90;
        ship.alpha = 0.4;
    }

    //  An explosion pool
    this.explosions = this.game.add.group();
    this.explosions.createMultiple(30, 'kaboom');
    this.explosions.forEach(this.setupInvader, this);

	//  And some controls to play the game with
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  },
  
  createAliens:function(){
	 for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 10; x++)
        {
            var alien = this.aliens.create(x * 48, y * 50, 'invader');
            alien.anchor.setTo(0.5, 0.5);
            alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
            alien.play('fly');
            alien.body.moves = false;
        }
    }

    this.aliens.x = 100;
    this.aliens.y = 50;

    //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
    var tween = this.game.add.tween(this.aliens).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

    //  When the tween loops it calls descend
    tween.onLoop.add(this.descend, this);
  },
  
  setupInvader:function(invader){
	invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    invader.animations.add('kaboom');
  },
	
  descend:function(){
	this.aliens.y += 10;
  },
  
  
  update: function () {
    //  Scroll the background
	
    this.starfield.tilePosition.y += 8;

    //  Reset the player, then check for movement keys
    this.player.body.velocity.setTo(0, 0);

	//set the x,y let the player to move 
    if (this.cursors.left.isDown)
    {
		
        this.player.body.velocity.x = -200;
    }
    else if (this.cursors.right.isDown)
    {
        this.player.body.velocity.x = 200;
    }
	else if (this.cursors.up.isDown)
    {
        this.player.body.velocity.y = -200;
    }
	else if (this.cursors.down.isDown)
    {
        this.player.body.velocity.y = 200;
    }

    //  Firing?
    if (this.fireButton.isDown)
    {
        this.fireBullet();
    }
	
    if (this.game.time.now > this.firingTimer)
    {
        this.enemyFires();
    }

    //  Run collision
	this.game.physics.arcade.overlap(this.bullets, this.aliens, this.collisionHandler, null, this);
    this.game.physics.arcade.overlap(this.enemyBullets, this.player, this.enemyHitsPlayer, null, this);
  },
  
   render: function(){
   
  },
  
  collisionHandler:function(bullet, alien) {

    //  When a bullet hits an alien we kill them both	
    bullet.kill();
    alien.kill();
	
    //  Increase the score
    this.score += 20;
    this.scoreText.text = this.scoreString + this.score;

    //  And create an explosion :)
    var explosion = this.explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('kaboom', 30, false, true);

    if (this.aliens.countLiving() == 0)
    {
        this.score += 1000;
        this.scoreText.text = this.scoreString + this.score;

        this.enemyBullets.callAll('kill',this);
        this.stateText.text = " Won, Won, Won!!!";
        this.stateText.visible = true;

        //the "click to restart" handler
        this.game.input.onTap.addOnce(this.restart,this);
    }

},

	enemyHitsPlayer: function (player,bullet) {
    
    bullet.kill();	

    live = this.lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    //  And create an explosion :)
    var explosion = this.explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (this.lives.countLiving() < 1)
    {
        this.player.kill();
        this.enemyBullets.callAll('kill');

        this.stateText.text=" GAME OVER！！";
        this.stateText.visible = true;

        //the "click to restart" handler
        this.game.input.onTap.addOnce(this.restart,this);
    }

},

enemyFires: function() {

    //  Grab the first bullet we can from the pool
    enemyBullet = this.enemyBullets.getFirstExists(false);
	//var this.livingEnemies=[];
    this.livingEnemies.length=0;

	
    this.aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        BasicGame.Game.ppp.livingEnemies.push(alien);
    });


    if (enemyBullet && this.livingEnemies.length > 0)
    {
        
        var random=this.game.rnd.integerInRange(0,this.livingEnemies.length-1);

        // randomly select one of them
        var shooter=this.livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);

        this.game.physics.arcade.moveToObject(enemyBullet,this.player,120);
        this.firingTimer = this.game.time.now + 2000;
    }

},

	fireBullet:function() {
	
	var bulletTime=0
    //  To avoid them being allowed to fire too fast we set a time limit
    if (this.game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = this.bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(this.player.x, this.player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = this.game.time.now + 200;
        }
    }

},

	resetBullet:function(bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

},

	restart:function () {

    //  A new level starts
    
    //resets the life count
    this.lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    this.aliens.removeAll();
    this.createAliens();

    //revives the player
    this.player.revive();
    //hides the text
    this.stateText.visible = false;

},
    
	

  

  quitGame: function (pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    //  Then let's go back to the main menu.
    this.state.start('MainMenu');
  }

};
