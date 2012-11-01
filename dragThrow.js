var dragThrow = function(){

		var mouseDragged = false,
			mousePrevX = 0,
			mousePrevY = 0,
			arMousePrevX = 0,
			arMousePrevY = 0,
			mouseCurrX = 0,
			mouseCurrY = 0,
			decay,
			buttonDown = false,
			overTarget = false,
			xOppositeEdge = false,
			yOppositeEdge = false,
			t,
			ant,
			timerInterval = 100,
			ainterval = 5;

		this.targetObject;
		this.eventObject;
		this.moveY = true;
		this.moveX = true;
		this.originalDecay;
		this.onlyTarget = true;
		//TODO:extend the settings with options.

		//private functions
		this.handleOverTarget = function(e){
			buttonDown = true;
			arMousePrevX = mousePrevX = mouseCurrX = e.offsetX;
			arMousePrevY = mousePrevY = mouseCurrY = e.offsetY;

			if(e.target === this.targetObject){
				overTarget = true;
			}
			/*
			this was if you were over a child, but I think in js it isn't needed.
			else if(e.target.toString().search(this.targetObject.toString()) < 0){
				overTarget = false;
			}*/
		};

		this.timerOut = function(e){
			//mouseDragged = false;
			//arMousePrevX = mousePrevX = mouseCurrX = this.targetObject.offsetLeft;
			//arMousePrevY = mousePrevY = mouseCurrY = this.targetObject.offsetTop;
		};

		this.moveIt = function(e){
			if(!this.onlyTarget) overTarget=true;

			if(buttonDown && overTarget){
				buttonDown = true;
				mouseDragged = true;
				mouseCurrX = e.offsetX;
				mouseCurrY = e.offsetY;
				arMousePrevX = mousePrevX;
				arMousePrevY = mousePrevY;


				var topper = (e.offsetY - mousePrevY) + this.targetObject.offsetTop;// - (this.targetObject.offsetTop - e.offsetY);
				var sider = (e.offsetX - mousePrevX) + this.targetObject.offsetLeft;// - (this.targetObject.offsetLeft - e.offsetX);
				//console.log("topper: " + topper,"mousePrvY: " + mousePrevY, "math: " + (e.offsetY - mousePrevY), "top: " + this.targetObject.offsetTop, "offsetY: " + e.offsetY, "math: " + (this.targetObject.offsetTop - e.offsetY));


				if(this.moveY)this.targetObject.style.top = topper + "px";
				if(this.moveX)this.targetObject.style.left = sider + "px";

				decay = this.originalDecay;
			}
			else{
				buttonDown = false;
				if(!this.onlyTarget)
					overTarget = false;
			}
			mousePrevX = e.offsetX;
			mousePrevY = e.offsetY;

			if(this.targetObject.offsetWidth > this.eventObject.offsetWidth)
				xOppositeEdge = true;
			else
				xOppositeEdge = false;

			if(this.targetObject.offsetHeight > this.eventObject.offsetHeight)
				yOppositeEdge = true;
			else
				yOppositeEdge = false;

			clearTimeout(this.t);
			this.t = setTimeout(this.timerOut.bind(this),this.timerInterval);
		};
		//this will need to be different. Should be smoother because we will use a setTimeout instead of a frame.
		this.throwIt = function(e){
			buttonDown = false;
			if(mouseDragged){
				ant = setTimeout(this.theRepeater.bind(this), ainterval);
			}
		};

		this.throwItOut = function(e){
			buttonDown = false;
			ant = setTimeout(this.theRepeater.bind(this), ainterval);

		};

		this.theRepeater = function(e){
			clearTimeout(this.t);

			var oldxer = mouseCurrX;
			var oldyer = mouseCurrY;


			var xDiff = mouseCurrX - arMousePrevX;
			var yDiff = mouseCurrY - arMousePrevY;


			if(!buttonDown){

				xDiff = xDiff * decay;
				yDiff = yDiff * decay;


				if(xOppositeEdge){
					if(this.targetObject.offsetTop < (this.eventObject.offsetWidth - this.targetObject.offsetWidth - 50)){
							xDiff = -1 * xDiff;
							this.targetObject.offsetLeft = this.eventObject.offsetWidth - this.targetObject.offsetWidth - 50;
					}
					if(this.targetObject.offsetLeft > 50){
						xDiff = -1 * xDiff;
						this.targetObject.offsetLeft = 50;
					}
				}
				else{
					if(this.targetObject.offsetLeft <  -5){
						xDiff = -1 * xDiff;
						this.targetObject.offsetLeft = -5;
					}
					if(this.targetObject.offsetLeft > (this.eventObject.offsetWidth - (this.targetObject.offsetWidth - 5))){
						xDiff = -1 * xDiff;
						this.targetObject.offsetLeft = this.eventObject.offsetWidth - (this.targetObject.offsetWidth - 5);
					}
				}

				if(yOppositeEdge){
					if(this.targetObject.offsetTop < (this.eventObject.offsetHeight - this.targetObject.offsetHeight - 50)){
						yDiff = -1 * yDiff;
						this.targetObject.offsetTop = this.eventObject.offsetHeight - this.targetObject.offsetHeight - 50;
					}
					if(this.targetObject.offsetTop > 50){
						yDiff = -1 * yDiff;
						this.targetObject.offsetTop = 50;
					}

				}
				else
				{
					if(this.targetObject.offsetTop < -5){
						yDiff = -1 * yDiff;
						this.targetObject.offsetTop = -5;
					}
					if(this.targetObject.offsetTop > (this.eventObject.offsetHeight - (this.targetObject.offsetHeight - 5))){
						yDiff = -1 * yDiff;
						this.targetObject.offsetTop = this.eventObject.offsetHeight - (this.targetObject.offsetHeight - 5);
					}
				}

				var sider = xDiff + this.targetObject.offsetLeft;
				var topper = yDiff + this.targetObject.offsetTop;

				mouseCurrX = mouseCurrX + xDiff;
				mouseCurrY = mouseCurrY + yDiff;

				if(this.moveY){this.targetObject.style.top = topper + "px";}
				if(this.moveX){this.targetObject.style.left = sider + "px"; }

				arMousePrevX = oldxer;
				arMousePrevY = oldyer;

				//console.log(this.originalDecay, decay);

				if(this.originalDecay < 1){
					decay = decay - 0.001;
				}

				ant = setTimeout(this.theRepeater.bind(this), ainterval);

				if(Math.abs(xDiff) < 1 && Math.abs(yDiff) < 1)
				{
					clearTimeout(ant);
				}
			}
		};
	};

	dragThrow.prototype.init = function (args){
		this.targetObject = args.targetObject;
		this.eventObject = args.eventObject;
		this.originalDecay = typeof(args.decay) !== "undefined" ? args.decay : 0.8;

		this.moveX = typeof(args.moveX) !== "undefined" ? args.moveX : true;
		this.moveY = typeof(args.moveY) !== "undefined" ? args.moveY : true;
		this.onlyTarget = typeof(args.onlyTarget) !== "undefined" ? args.onlyTarget : true;

		this.start();
	};

	dragThrow.prototype.start = function(){
		this.eventObject.addEventListener(  "mousedown",    this.handleOverTarget.bind(this));
		this.eventObject.addEventListener(  "mousemove",    this.moveIt.bind(this));
		this.eventObject.addEventListener(  "mouseup",      this.throwIt.bind(this));
		this.eventObject.addEventListener(  "mouseout",     this.throwItOut.bind(this));

		//this.targetObject.addEventListener( "mousedown",    this.handleOverTarget.bind(this));
		//this.targetObject.addEventListener( "mouseout",     this.throwItOut.bind(this));
		//this.targetObject.addEventListener( "mouseup",      this.throwIt.bind(this));

		this.t = setTimeout(this.timerOut.bind(this),this.timerInterval);
	};



	dragThrow.prototype.stop = function(){


		this.eventObject.removeEventListener(   "mousedown",  this.handleOverTarget);
		this.eventObject.removeEventListener(   "mousemove",  this.moveIt);
		this.eventObject.removeEventListener(   "mouseup",    this.throwIt);
		this.eventObject.removeEventListener(   "mouseout",   this.throwItOut);

		/*this.targetObject.removeEventListener(  "mousedown",  this.handleOverTarget);
		this.targetObject.removeEventListener(  "mouseup",    this.throwIt);
		this.targetObject.removeEventListener(  "mouseout",   this.throwItOut);*/


		clearTimeout(this.t);
	};