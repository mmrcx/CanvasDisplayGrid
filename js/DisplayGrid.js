if ( typeof DisplayGrid == "undefined" || !DisplayGrid) {
	var DisplayGrid = {};
}

(function()
{
	DisplayGrid.Criter = function(initialPosition, initialVelocity){
		DisplayGrid.Criter.super_.call(this, initialPosition, initialVelocity); // call A's constructor
		console.log('Criter.constructor');
		
		this.world = new Vector(360,600);
	};
	
	//--DisplayGrid.Criter.prototype = new Game.Actor(); -- we don't have super_ here
	inherits(DisplayGrid.Criter, Game.Actor); // B now inherits/extends A
	
	DisplayGrid.Criter.prototype.onUpdate = function(elapsed){
		DisplayGrid.Criter.super_.prototype.onUpdate.call(this, elapsed);
		
		
		this.position.add(this.velocity.nscale(elapsed));
		
		//-- i will need a worl or Map; but by now i use a vector definined a Ctor
		if ((this.position.x > this.world.x) || (this.position.x < 0)) {
			this.velocity.x = this.velocity.x * -1;
		}
		if ((this.position.y > this.world.y) || (this.position.y < 0)) {
			this.velocity.y = this.velocity.y * -1;
		}

		console.log('position', this.position);
	};
	
	DisplayGrid.Main = function(){
		
		this.runner = new Game.Runner();
		
		this.ball1 = new DisplayGrid.Criter(new Vector(10,10),new Vector(0,1));
		this.ball2 = new DisplayGrid.Criter(new Vector(10,20),new Vector(0,1));
		
		console.log('ball1', this.ball1);
		
	};
		
	DisplayGrid.Main.prototype = {
		run : function(){
			this.runner.run(this);
		},
		
		update: function(elapsed){
			
			this.ball1.onUpdate(elapsed);
			
			//this.ball2.onUpdate(elapsed);
			
			/*
			this.ball1.position += this.ball1.direction * elapsed;
			this.ball2.position += this.ball2.direction * elapsed;
			*/
		},
		
		renderslow: function(){
			/*
			ctx.fillStyle = '#242424';
		    ctx.beginPath();
		    ctx.arc(this.location[0], this.location[1], this.size, 0, Math.PI * 2, false);
		    ctx.closePath();
		    ctx.fill();
		    */
			
		},
		renderhight: function(){
		}
	};
	
	
	var myGame = new DisplayGrid.Main();
	
	myGame.run();
	
})();
