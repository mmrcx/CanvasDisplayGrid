var requestAnimationFrame = ( function() {
	return	window.requestAnimationFrame		||
			window.webkitRequestAnimationFrame	||
			window.mozRequestAnimationFrame		||
			window.oRequestAnimationFrame		||
			window.msRequestAnimationFrame		||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
})();

var timestamp = function(){
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
};

var inherits = function(ctor, superCtor) { // took this right from requrie('util').inherits
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};


(function () {
    Vector = function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    Vector.prototype = {
        x: 0,
        y: 0,
        clone: function () {
            return new Vector(this.x, this.y);
        },
        set: function (v) {
            this.x = v.x;
            this.y = v.y;
            return this;
        },
        add: function (v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        },
        nadd: function (v) {
            return new Vector(this.x + v.x, this.y + v.y);
        },
        sub: function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        },
        nsub: function (v) {
            return new Vector(this.x - v.x, this.y - v.y);
        },
        dot: function (v) {
            return this.x * v.x + this.y * v.y;
        },
        length: function () {
            return Sqrt(this.x * this.x + this.y * this.y);
        },
        distance: function (v) {
            var xx = this.x - v.x,
            yy = this.y - v.y;
            return Sqrt(xx * xx + yy * yy);
        },
        theta: function () {
            return Atan2(this.y, this.x);
        },
        thetaTo: function (vec) {
            var v = this.clone() .norm(),
            w = vec.clone() .norm();
            return Math.acos(v.dot(w));
        },
        thetaTo2: function (vec) {
            return Atan2(vec.y, vec.x) - Atan2(this.y, this.x);
        },
        norm: function () {
            var len = this.length();
            this.x /= len;
            this.y /= len;
            return this;
        },
        nnorm: function () {
            var len = this.length();
            return new Vector(this.x / len, this.y / len);
        },
        rotate: function (a) {
            var ca = Cos(a),
            sa = Sin(a);
            with (this) {
                var rx = x * ca - y * sa,
                ry = x * sa + y * ca;
                x = rx;
                y = ry;
            }
            return this;
        },
        nrotate: function (a) {
            var ca = Cos(a),
            sa = Sin(a);
            return new Vector(this.x * ca - this.y * sa, this.x * sa + this.y * ca);
        },
        invert: function () {
            this.x = - this.x;
            this.y = - this.y;
            return this;
        },
        ninvert: function () {
            return new Vector( - this.x, - this.y);
        },
        scale: function (s) {
            this.x *= s;
            this.y *= s;
            return this;
        },
        nscale: function (s) {
            return new Vector(this.x * s, this.y * s);
        },
        scaleTo: function (s) {
            var len = s / this.length();
            this.x *= len;
            this.y *= len;
            return this;
        },
        nscaleTo: function (s) {
            var len = s / this.length();
            return new Vector(this.x * len, this.y * len);
        }
    };
})();


/**
 * Game root namespace.
 *
 * @namespace Game
 */
if ( typeof Game == "undefined" || !Game) {
	var Game = {};
}

(function() {

	Game.Math = {

		random : function(min, max) {
			return (min + (Math.random() * (max - min)));
		},

		randomInt : function(min, max) {
			return Math.round(this.random(min, max));
		},
	};

	Game.Map = function(cellX, cellY) {
		this.cellX = cellX;
		this.cellY = cellY;

		return this;
	};

	Game.Map.prototype = {

		/**
		 * rendering event method.
		 *
		 * @method onRender
		 * @param ctx {object} Canvas rendering context
		 * @param world {object} World metadata
		 */
		onRender : function onRender(ctx, world) {
		}
	};


	/**
	 * Actor base class.
	 *
	 * Game actors have a position(vector) in the game world
	 *    and a current velocity (vector) to indicate the speed of travel per frame.
	 * Support the onUpdate() and onRender() event methods,
	 * finally an actor has an expired() method which should
	 * return true when the actor object should be removed from play.
	 *
	 * @namespace Game
	 * @class Game.Actor
	 */
	Game.Actor = function(initialPosition, initialVelocity) {
		this.position = initialPosition;
		this.velocity = initialVelocity;

		console.log('Actor.constructor');

		return this;
	};

	Game.Actor.prototype = {
		/**
		 * Actor position
		 *
		 * @property position
		 * @type Vector
		 */
		position : null,

		/**
		 * Actor velocity
		 *
		 * @property velocity
		 * @type Vector
		 */
		velocity : null,

		/**
		 * Alive flag
		 *
		 * @property alive
		 * @type boolean
		 */
		alive : true,

		/**
		 * Actor expiration test
		 *
		 * @method expired
		 * @return true if expired and to be removed from the actor list, false if still in play
		 */
		expired : function expired() {
			return !(this.alive);
		},

		/**
		 * Actor game loop update event method. Called for each actor
		 * at the start of each game loop cycle.
		 *
		 * @method onUpdate
		 */
		onUpdate : function onUpdate(elapsed) {
			console.log('elapsed', elapsed);
		},

		/**
		 * Actor rendering event method. Called for each actor to
		 * render for each frame.
		 *
		 * @method onRender
		 * @param ctx {object} Canvas rendering context
		 * @param world {object} World metadata
		 */
		onRender : function onRender(ctx, world) {
		}
	};

	Game.Runner = function() {
		this.last = 0;
		this.now = 0;
		this.elapsed = 0;
		this.step = 1/60;
		
		this.elapsedBack = 0;
		this.backgroundStep = 1/24;
		
		this.game = null;

		return this;
	};

	Game.Runner.prototype = {

		run : function(game) {
			var that = this;
			this.game = game;
			this.last = timestamp();
			
			requestAnimationFrame( function() { that.mainloop(); });
		},

		mainloop : function() {
			var that = this;
			
			this.now = timestamp();
			
			this.elapsed = this.elapsed + Math.min(1 , (this.now - this.last) / 1000 ); 
			this.elapsedBack += this.elapsed;
			
			while(this.elapsed >= this.step){
				this.elapsed = this.elapsed  - this.step;
				
				this.game.update(this.step);
			}
			
			if(this.elapsed < 16){
			
				this.game.renderhight();
	
				if(this.elapsedBack > this.backgroundStep){
					this.game.renderslow();	
					this.elapsedBack = 0;
				}
			}
			
			this.last = this.now;
			
			requestAnimationFrame( function() { that.mainloop(); });
		}
	};

})();
