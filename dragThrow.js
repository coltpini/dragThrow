var dragThrow = function(eventObject, targetObject, args){
  this.targetObject = targetObject;
	this.eventObject = eventObject;
	this.x = 0;
	this.y = 0;
	this.mouseDown = false;
	this.targetPointerLeft = 0;
	this.targetPointerTop = 0;
	this.zoomStart = 0;
	this.targetHeight = 0;
	this.targetWidth = 0;
	this.targetTop = 0;
	this.targetLeft = 0;
	this.minHeight = args && args.minHeight ? args.minHeight : 1000;
	this.maxZoom = args && args.maxZoom ? args.maxZoom : 2;

	if(this.targetObject.nodeName.toLowerCase() === "img" && typeof(this.targetObject.naturalHeight) === "undefined"){
		//IE support
		var img = new Image();
		img.src = this.targetObject.src;
		this.targetObject.naturalHeight = img.height;
		this.targetObject.naturalWidth = img.width;
	}

	this.start();
};

dragThrow.prototype.start = function(){
	this.eventObject.addListener('mousemove', this.movement,false,this);
	this.eventObject.addListener('mousedown', this.downHandler,false,this);
	this.eventObject.addListener('mouseup', this.upHandler,false,this);
	this.eventObject.addListener('mouseleave', this.upHandler,false,this);

	this.eventObject.addListener("touchstart", this.downHandler, false, this);
	this.eventObject.addListener("touchend", this.upHandler, false, this);
	this.eventObject.addListener("touchmove", this.movement, false, this);

	this.eventObject.addListener('DOMMouseScroll', this.mouseZoom, false, this);
	this.eventObject.addListener("mousewheel", this.mouseZoom, false, this);

	// this.targetObject.addListener('mouseenter', this.overHandler, false, this);
	// this.targetObject.addListener('mouseleave', this.overHandler, false, this);

};

dragThrow.prototype.downHandler = function(e){
	fw.stopCancel(e);
	this.setpoints(e);

	if(pos.points && pos.points.length > 1){
		//a^2 + b^2 = c^2
		var a = pos.points[0].x - pos.points[1].x,
			b = pos.points[0].y - pos.points[1].y;
		this.zoomStart = Math.sqrt(Math.pow(a,2) + Math.pow(b, 2));
	}

	this.mouseDown = true;
};

dragThrow.prototype.upHandler = function(e){
	fw.stopCancel(e);
	this.mouseDown = false;
};

dragThrow.prototype.setpoints = function(e){
	this.ratio = this.targetObject.naturalHeight / this.targetObject.naturalWidth;
	pos = fw.pointerOffset(e);
	this.targetPointerTop = pos.y - this.targetObject.offsetTop;
	this.targetPointerLeft = pos.x - this.targetObject.offsetLeft;
	this.targetTop = this.targetObject.offsetTop;
	this.targetLeft = this.targetObject.offsetLeft;
	this.targetHeight = this.targetObject.offsetHeight;
	this.targetWidth = this.targetObject.offsetWidth;

};

dragThrow.prototype.movement = function(e){
	this.doAction = e.target === this.targetObject;
	if(this.doAction){
		fw.stopCancel(e);
		if(this.mouseDown){
			pos = fw.pointerOffset(e);
			this.x = pos.x;
			this.y = pos.y;
			this.targetObject.style.top = (this.y - this.targetPointerTop) + "px";
			this.targetObject.style.left = (this.x - this.targetPointerLeft) + "px";
			if(pos.points && pos.points.length > 1)
				this.touchZoom(pos.points);
		}
		else if (!e.touches){
			this.targetHeight = this.targetObject.offsetHeight;
			this.setpoints(e);
		}
	}
};

dragThrow.prototype.touchZoom =  function(touches,onMove){
	var a = pos.points[0].x - pos.points[1].x,
		b = pos.points[0].y - pos.points[1].y,
		c = Math.sqrt(Math.pow(a,2) + Math.pow(b, 2)),
		p = Math.round((c/this.zoomStart ) * 100),
		h = this.targetHeight * (p/100);

	this.zoom(h);
};

dragThrow.prototype.mouseZoom = function(e){
	fw.stopCancel(e);
	var md = fw.mouseWheel(e),
		p = md.y,
		h = this.targetObject.offsetHeight + (this.targetObject.offsetHeight * p/4);

	this.zoom(h);
};

/* todo, never let the left side of an image go past the right side of the stage, and visa versa. */

dragThrow.prototype.zoom = function(h){
	if(this.doAction){
		var w = h / this.ratio,
			minHeight = 0,
			maxHeight = this.targetObject.naturalHeight * this.maxZoom,
			eoH = this.eventObject.offsetHeight,
			eoW = this.eventObject.offsetWidth;

		if((h > w && eoH < eoW) || (h < w && eoH < eoW)){
			minHeight = eoH - 20;
			if(this.targetObject.naturalWidth * this.maxZoom < eoW){
				maxHeight = eoW * this.ratio;
				this.maxZoom = maxHeight / eoH;
			}
		}
		else{
			minHeight = (eoW * this.ratio) - 20;
			if(this.targetObject.naturalHeight * this.maxZoom < eoH){
				maxHeight = eoH;
				this.maxZoom = maxHeight / eoH;
			}
		}

		if((h > minHeight && this.targetObject.offsetHeight > h) || (h < maxHeight && this.targetObject.offsetHeight < h)){
			var dH = h - this.targetHeight,
				pT = this.targetHeight / this.targetPointerTop,
				pW = this.targetWidth / this.targetPointerLeft,
				t = this.targetTop - (dH / pT),
				dW = w - this.targetWidth,
				l = this.targetLeft - (dW / pW);

			this.targetObject.style.height = h + "px";
			this.targetObject.style.width = w + "px";
			this.targetObject.style.top = t + "px";
			this.targetObject.style.left = l + "px";
		}
	}
};
