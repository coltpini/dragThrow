var dragThrow = function(){
		var mouseDragged = false,mousePrevX = 0,mousePrevY = 0,arMousePrevX = 0,arMousePrevY = 0,mouseCurrX = 0,mouseCurrY = 0,decay,gravity,buttonDown = false,overTarget = false,ant,timerInterval = 100,ainterval = 5,prevDiff = 0,peak = 3,prevD = 0, scrollIt = "scroll", inZoom = false;
		this.targetObject = undefined;
		this.eventObject = undefined;
		this.originalGravity = 0;
		this.moveY = true;
		this.moveX = true;
		this.originalDecay = 0.8;
		this.onlyTarget = true;
		this.xOppositeEdge = false;
		this.yOppositeEdge = false;
		this.percentage = 1;
		this.doZoom = true;
		this.minPercent = 0.2;
		this.maxPercent = 2;

		this.handleOverTarget = function(e){
			e.preventDefault();
			var elem = this.findElement(e.target);
			buttonDown = true;
			arMousePrevX = mousePrevX = mouseCurrX = e.clientX || e.touches.item(0).clientX;
			arMousePrevY = mousePrevY = mouseCurrY = e.clientY || e.touches.item(0).clientY;
			overTarget = elem === this.targetObject;
			this.checkSize();
			if(e.touches)
					this.touchZoom(e.touches);
		};
		this.moveIt = function(e){
			e.preventDefault();
			if(!this.onlyTarget) overTarget=true;
			if(buttonDown && overTarget){
				buttonDown = true;
				mouseDragged = true;

				mouseCurrX = e.clientX || e.touches.item(0).clientX;
				mouseCurrY = e.clientY || e.touches.item(0).clientY;


				if(e.touches)
					this.touchZoom(e.touches, true);

				arMousePrevX = mousePrevX;
				arMousePrevY = mousePrevY;

				var topper = (mouseCurrY - mousePrevY) + this.targetObject.offsetTop;
				var sider = (mouseCurrX - mousePrevX) + this.targetObject.offsetLeft;

				if(this.moveY)this.targetObject.style.top = topper + "px";
				if(this.moveX)this.targetObject.style.left = sider + "px";

				if(!inZoom){
					this.findEdgeY(0);
					this.findEdgeX(0);
				}

				decay = this.originalDecay;
				gravity = this.originalGravity;
				peak = 3;
				prevDiff = 0;
			}
			else{
				buttonDown = false;
				if(!this.onlyTarget)
					overTarget = false;
			}
			mousePrevX = mouseCurrX;
			mousePrevY = mouseCurrY;
		};
		this.checkSize = function(){
			this.xOppositeEdge = this.targetObject.offsetWidth > this.eventObject.offsetWidth;
			this.yOppositeEdge = this.targetObject.offsetHeight > this.eventObject.offsetHeight;
		};
		this.touchZoom =  function(touches,onMove){
			if(this.doZoom){
				if(touches.length > 1){
					var d = Math.sqrt(Math.pow(mouseCurrY - touches.item(1).clientY,2) + Math.pow(mouseCurrX - touches.item(1).clientX, 2)),
						dDiff = (d - prevD) * (this.targetObject.offsetHeight / 100),
						clientX = touches.item(0).clientX - ((touches.item(0).clientX - touches.item(1).clientX)/2),
						clientY = touches.item(0).clientY - ((touches.item(0).clientY - touches.item(1).clientY)/2),
						xPoint = clientX - this.eventObject.offsetLeft - this.targetObject.offsetLeft,
						yPoint = clientY - this.eventObject.offsetTop - this.targetObject.offsetTop;

					if(onMove){
						this.zoom(xPoint, yPoint, dDiff);
					}

					this.checkSize();
					prevD = d;
					inZoom = true;
				}
				else{
					inZoom = false
				}
			}
		};
		this.mouseZoom = function(e){
			if(this.doZoom){
				e.preventDefault();
				e.stopPropagation();
				e = e ? e : window.event;
				var wheelData = Math.ceil((e.detail ? e.detail * -1 : e.wheelDelta / 40) * 20),
				xPoint = e.clientX - this.eventObject.offsetLeft - this.targetObject.offsetLeft,
				yPoint = e.clientY - this.eventObject.offsetTop - this.targetObject.offsetTop;

				this.zoom(xPoint, yPoint, wheelData);
			}
		};
		this.zoom = function(xP, yP, change){
			change = Math.ceil(change * 10) / 10;
			var cH = this.targetObject.offsetHeight,
				cW = this.targetObject.offsetWidth;

			if((scrollIt === "tooFarUp" && change < 0) || (scrollIt === "tooFarDown" && change > 0)){
				scrollIt = "scroll";
			}

			HP = yP / this.targetObject.offsetHeight;
			WP = xP / this.targetObject.offsetWidth;

			if(this.targetObject.offsetHeight > this.targetObject.naturalHeight * this.maxPercent && scrollIt === "scroll"){
				this.targetObject.style.height = (this.targetObject.naturalHeight * this.maxPercent) + "px";
				scrollIt = "tooFarUp";
			}
			else if(this.targetObject.offsetHeight < this.targetObject.naturalHeight * this.minPercent && scrollIt) {
				this.targetObject.style.height = (this.targetObject.naturalHeight * this.minPercent) + "px";
				scrollIt = "tooFarDown";
			}
			else if(scrollIt === "scroll"){
				this.targetObject.style.height = (this.targetObject.offsetHeight + change) + "px";
			}
			else
				change = 0;

			this.targetObject.style.width = (this.targetObject.offsetHeight * (this.targetObject.naturalWidth / this.targetObject.naturalHeight)) + "px";

			cH = this.targetObject.offsetHeight - cH;
			cW = this.targetObject.offsetWidth - cW;

			this.targetObject.style.top = (this.targetObject.offsetTop - (cH * HP )) + "px";
			this.targetObject.style.left = (this.targetObject.offsetLeft - (cW * WP)) + "px";

			this.checkSize();
			this.percentage = 1;
		};
		this.throwIt = function(e){
			e.preventDefault();
			buttonDown = false;
			if(mouseDragged){
				ant = setTimeout(this.theRepeater.bind(this), ainterval);
			}
		};
		this.findElement = function(elem){
			while(elem !== this.targetObject){
				if(elem === this.eventObject || elem === null)break;
				elem = elem.parentNode;
			}
			return elem;
		};
		this.findEdgeY = function(yDiff){
				if(this.yOppositeEdge){
					if(this.targetObject.offsetTop < (this.eventObject.offsetHeight - this.targetObject.offsetHeight - 20)){
						yDiff = -0.1 * yDiff;
						arMousePrevY = mouseCurrY;
						this.targetObject.style.top = (this.eventObject.offsetHeight - this.targetObject.offsetHeight - 20) + "px";
					}
					if(this.targetObject.offsetTop > 20){
						yDiff = -0.1 * yDiff;
						arMousePrevY = mouseCurrY;
						this.targetObject.style.top = 20 + "px";
					}
				}
				else{
					if(this.targetObject.offsetTop < 0){
						yDiff = -1 * yDiff;
						this.targetObject.style.top = 0 + "px";
					}
					if(this.targetObject.offsetTop > (this.eventObject.offsetHeight - this.targetObject.offsetHeight)){
						yDiff = -1 * yDiff;
						this.targetObject.style.top = (this.eventObject.offsetHeight - this.targetObject.offsetHeight + 1) + "px";
					}
				}
				return yDiff;
		};
		this.findEdgeX = function(xDiff){
			if(this.xOppositeEdge){
					if(this.targetObject.offsetLeft < (this.eventObject.offsetWidth - this.targetObject.offsetWidth - 20)){
							xDiff = -0.1 * xDiff;
							arMousePrevX = mouseCurrX;
							this.targetObject.style.left = (this.eventObject.offsetWidth - this.targetObject.offsetWidth - 20) + "px";
					}
					if(this.targetObject.offsetLeft > 20){
						xDiff = -0.1 * xDiff;
						arMousePrevX = mouseCurrX;
						this.targetObject.style.left = 20 + "px";
					}
				}
				else{
					if(this.targetObject.offsetLeft < 0){
						xDiff = -1 * xDiff;
						this.targetObject.style.left = 0 + "px";
					}
					if(this.targetObject.offsetLeft > this.eventObject.offsetWidth - this.targetObject.offsetWidth){
						xDiff = -1 * xDiff;
						this.targetObject.style.left = (this.eventObject.offsetWidth - this.targetObject.offsetWidth) + "px";
					}
				}
				return xDiff;
		};
		this.theRepeater = function(e){
			clearTimeout(this.t);
			var oldxer = mouseCurrX,oldyer = mouseCurrY,done = false,xDiff = mouseCurrX - arMousePrevX,yDiff = mouseCurrY - arMousePrevY;
			if(!buttonDown){
				xDiff = xDiff * decay;
				yDiff = yDiff * decay;

				if(yDiff < 0)yDiff = yDiff + gravity;
				else yDiff = yDiff + gravity * (1 - gravity);

				if(yDiff < 0 && prevDiff > 0)
					peak = prevDiff;
				prevDiff = yDiff;
				xDiff = this.findEdgeX(xDiff);
				yDiff = this.findEdgeY(yDiff);

				var sider = xDiff + this.targetObject.offsetLeft;
				var topper = yDiff + this.targetObject.offsetTop;

				mouseCurrX = mouseCurrX + xDiff;
				mouseCurrY = mouseCurrY + yDiff;

				if(this.moveY){this.targetObject.style.top = topper + "px";}
				if(this.moveX){this.targetObject.style.left = sider + "px"; }

				arMousePrevX = oldxer;
				arMousePrevY = oldyer;

				if(this.originalDecay < 1){
					decay = decay - 0.001;
					gravity = 0;
					done = true;
				}
				else if(gravity && peak > 2){
					decay = decay - 0.00001;
				}
				else if(peak < 2){
					decay = decay - 0.001;
					done = true;
				}
				ant = setTimeout(this.theRepeater.bind(this), ainterval);
				if(Math.abs(xDiff) < 0.5 && Math.abs(yDiff) < 0.5 && done){
					clearTimeout(ant);
				}
			}
		};
	};
	dragThrow.prototype.init = function (args){
		this.targetObject = args.targetObject;
		this.eventObject = args.eventObject;
		if(this.targetObject.nodeName.toLowerCase() == "img" && typeof(this.targetObject.naturalHeight) === "undefined"){
			//IE support
			var img = new Image();
			img.src = this.targetObject.src;
			this.targetObject.naturalHeight = img.height;
			this.targetObject.naturalWidth = img.width;
		}


		this.originalDecay = typeof(args.decay) !== "undefined" ? args.decay : 0.8;
		this.originalGravity = typeof(args.gravity) !== "undefined" ? args.gravity : 0;
		this.moveX = typeof(args.moveX) !== "undefined" ? args.moveX : true;
		this.moveY = typeof(args.moveY) !== "undefined" ? args.moveY : true;
		this.onlyTarget = typeof(args.onlyTarget) !== "undefined" ? args.onlyTarget : true;
		this.doZoom = typeof(args.doZoom) !== "undefined" ? args.doZoom : true;
		this.minPercent = typeof(args.minPercent) !== "undefined" ? args.minPercent : 0.2;
		this.maxPercent = typeof(args.maxPercent) !== "undefined" ? args.maxPercent : 2;
		this.start();
	};
	dragThrow.prototype.start = function(){

		//we also need a mouse scroll event for zooming not on a mobile device.
		if(this.eventObject.addEventListener){
			this.eventObject.addEventListener("mousedown", this.handleOverTarget.bind(this),false);
			this.eventObject.addEventListener("mousemove", this.moveIt.bind(this),false);
			document.addEventListener("mouseup", this.throwIt.bind(this),false);
			this.eventObject.addEventListener("touchstart", this.handleOverTarget.bind(this),false);
			this.eventObject.addEventListener("touchend", this.throwIt.bind(this),false);
			this.eventObject.addEventListener("touchmove", this.moveIt.bind(this),false);
			this.targetObject.addEventListener("mousedown", this.handleOverTarget.bind(this),false);
			this.targetObject.addEventListener("touchstart", this.handleOverTarget.bind(this),false);
			this.eventObject.addEventListener('DOMMouseScroll', this.mouseZoom.bind(this), false);
			this.eventObject.addEventListener("mousewheel", this.mouseZoom.bind(this), false);
		}
		else if(this.eventObject.attachEvent){
			this.eventObject.attachEvent("onmousewheel", this.bind(this.mouseZoom,this));
			this.eventObject.attachEvent("mousedown", this.bind(this.handleOverTarget, this));
			this.eventObject.attachEvent("onmousemove", this.bind(this.moveIt, this));
			document.attachEvent("onmouseup", this.bind(this.throwIt, this));
			this.eventObject.attachEvent("ontouchstart", this.bind(this.handleOverTarget,this));
			this.eventObject.attachEvent("ontouchend", this.bind(this.throwIt,this));
			this.eventObject.attachEvent("ontouchmove", this.bind(this.moveIt,this));
			this.targetObject.attachEvent("onmousedown", this.bind(this.handleOverTarget, this));
			this.targetObject.attachEvent("ontouchstart", this.bind(this.handleOverTarget,this));
		}

	};
	dragThrow.prototype.percentageZoom = function(perc){

	};
	if(typeof(function(){}).bind === "undefined"){
		this.prototype.bind = function (func, thisValue) {
			return function () {
			   return func.apply(thisValue, arguments);
		   }
	   	};
	}
	dragThrow.prototype.stop = function(){
		this.eventObject.removeEventListener("mousedown", this.handleOverTarget,false);
		this.eventObject.removeEventListener("mousemove", this.moveIt.false);
		document.removeEventListener("mouseup", this.throwIt);
		this.eventObject.removeEventListener("touchstart", this.handleOverTarget,false);
		this.eventObject.removeEventListener("touchend", this.throwIt,false);
		this.eventObject.removeEventListener("touchmove", this.moveIt,false);
		this.targetObject.removeEventListener("mousedown", this.handleOverTarget, false);
		this.targetObject.removeEventListener("touchstart", this.handleOverTarget,false);
	};