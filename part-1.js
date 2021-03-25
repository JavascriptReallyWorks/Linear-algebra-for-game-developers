var cnv, ctx, red_chart_cnv, red_chart_ctx, game_loop, Actor, enemy, player, CANVAS_WIDTH, CANVAS_HEIGHT, FPS, vector_add, actors;

// Configuration

CANVAS_WIDTH = 800;
CANVAS_HEIGHT = 600;
FPS = 1000/13;


// Functions

var vector_add = function (a, b, result) {
	if (!result)
		result = a;
	a[0] = a[0] + b[0];
	a[1] = a[1] + b[1];
};

var vector_sub = function (a, b, result) {
	if (!result)
		result = a;
	result[0] = a[0] - b[0];
	result[1] = a[1] - b[1];
};

var vector_scalprod = function (v, scalar, result) {
	if (!result)
		result = v;
	result[0] = v[0] * scalar;
	result[1] = v[1] * scalar;
};

var vector_prod = function (a, b) {
	return a[0] * b[0] + a[1] * b[1];
};

var vector_norm = function (v) {
	return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
};


// Experimental requestAnimationFrame
// comde from: http://paulirish.com/2011/requestanimationframe-for-smart-animating/

window.requestAnimFrame = (function () {
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback) {
            window.setTimeout(callback, FPS);
        };
})();

// Classes

var Actor = (function () {
	function Actor (opts) {
		this.position = opts.position || [0, 0];
		this.velocity = opts.velocity || [0, 0];
		this.acceleration = opts.acceleration || [0, 0];
		this.image_src = opts.image_src || "img/none.png";
		this.image = new Image();
		this.image.src = this.image_src;
		this.width = opts.width;
		this.height = opts.height;
		this.plot_data = [];
	}

	Actor.prototype.accelerate = function (delta_a) {
		vector_add(this.acceleration, delta_a);
	};

	Actor.prototype.update = function () {
		vector_add(this.velocity, this.acceleration);
		vector_add(this.position, this.velocity);
		this.plot_data.unshift({
			position: this.position.slice(),
			velocity: this.velocity.slice(),
			acceleration: this.acceleration.slice()
		});
		if (this.plot_data.length > CANVAS_WIDTH)
			this.plot_data.length = CANVAS_WIDTH;
	};

	Actor.prototype.draw = function (ctx) {
		ctx.drawImage(this.image, this.position[0], this.position[1]);
	};

	Actor.prototype.plot = function (cnv, ctx) {
		var i, len;
		ctx.beginPath();
		ctx.moveTo(0, cnv.height/2);
		len = this.plot_data.length;
		for (i = 0; i < len; i++) {
			ctx.lineTo(i, Math.floor(cnv.height/2) - Math.floor(this.plot_data[i].velocity[1]));
		}
		ctx.stroke();
	};

	Actor.prototype.collision = function (other) {
		var x1, y1, x2, y2;
		x1 = this.position[0];
		y1 = this.position[1];
		x2 = other.position[0];
		y2 = other.position[1];

		if (x1 + this.width < x2)
			return false;
		if (y1 + this.height < y2)
			return false;
		if (x1 > x2 + other.width)
			return false;
		if (y1 > y2 + other.height)
			return false;
		return true;
	};

	return Actor;
}());


// Canvas setup

cnv = document.getElementById('canvas');
ctx = cnv.getContext('2d');

cnv.width = CANVAS_WIDTH;
cnv.height = CANVAS_HEIGHT;

red_chart_cnv = document.getElementById('red-chart');
red_chart_ctx = red_chart_cnv.getContext('2d');

red_chart_cnv.width = CANVAS_WIDTH;
red_chart_cnv.height = Math.floor(CANVAS_HEIGHT / 2);
red_chart_ctx.strokeStyle = 'red';


// Player setup

player = new Actor({
	position: [700, 100],
	acceleration: [0, 5],
	velocity: [-20, 3],
	image_src: "img/red-ball-100px.png",
	width: 100,
	height: 100
});

enemy = new Actor({
	position: [100, 100],
	acceleration: [0, 1],
	velocity: [20, 3],
	image_src: "img/green-ball-100px.png",
	width: 100,
	height: 100
});


actors = [player, enemy];


(function loop () {
	var i, j, len = actors.length, actor;

	requestAnimFrame(loop);
	ctx.clearRect(0, 0, cnv.width, cnv.height);
	red_chart_ctx.clearRect(0, 0, red_chart_cnv.width, red_chart_cnv.height);
	for (i = 0; i < len; i++) {
		actor = actors[i];
		actor.update();
		vector_scalprod(actor.velocity, 0.99);

		if (actor.position[0] >= CANVAS_WIDTH - actor.width) {
			actor.position[0] = CANVAS_WIDTH - actor.width;
			actor.velocity[0] *= -0.99;
		} else if (actor.position[0] < 0) {
			actor.position[0] = 0;
			actor.velocity[0] *= -0.99;
		}

		if (actor.position[1] >= CANVAS_HEIGHT - actor.height) {
			actor.position[1] = CANVAS_HEIGHT - actor.height;
			actor.velocity[1] *= -0.99;
		}

		for (j = i+1; j < len; j++) {
			if (actor.collision(actors[j])) {
				// TODO:
				// bounce balls
			}
		}

		actor.draw(ctx);
		actor.plot(red_chart_cnv, red_chart_ctx);
	}
}());
