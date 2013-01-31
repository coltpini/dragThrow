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

dragThrow.prototype.zoom = function(h){
	if(h > this.targetObject.naturalHeight * 0.2 && h < this.targetObject.naturalHeight * 1.5){
		var w = h / this.ratio,
			dH = h - this.targetHeight,
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
};
