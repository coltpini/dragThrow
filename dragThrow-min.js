var dragThrow=function(e,t,n){this.targetObject=t;this.eventObject=e;this.x=0;this.y=0;this.mouseDown=!1;this.targetPointerLeft=0;this.targetPointerTop=0;this.zoomStart=0;this.targetHeight=0;this.targetWidth=0;this.targetTop=0;this.targetLeft=0;if(this.targetObject.nodeName.toLowerCase()==="img"&&typeof this.targetObject.naturalHeight=="undefined"){var r=new Image;r.src=this.targetObject.src;this.targetObject.naturalHeight=r.height;this.targetObject.naturalWidth=r.width}this.start()};dragThrow.prototype.start=function(){this.eventObject.addListener("mousemove",this.movement,!1,this);this.eventObject.addListener("mousedown",this.downHandler,!1,this);this.eventObject.addListener("mouseup",this.upHandler,!1,this);this.eventObject.addListener("touchstart",this.downHandler,!1,this);this.eventObject.addListener("touchend",this.upHandler,!1,this);this.eventObject.addListener("touchmove",this.movement,!1,this);this.eventObject.addListener("DOMMouseScroll",this.mouseZoom,!1,this);this.eventObject.addListener("mousewheel",this.mouseZoom,!1,this)};dragThrow.prototype.downHandler=function(e){fw.stopCancel(e);this.setpoints(e);if(pos.points&&pos.points.length>1){var t=pos.points[0].x-pos.points[1].x,n=pos.points[0].y-pos.points[1].y;this.zoomStart=Math.sqrt(Math.pow(t,2)+Math.pow(n,2))}this.mouseDown=!0};dragThrow.prototype.upHandler=function(e){fw.stopCancel(e);this.mouseDown=!1};dragThrow.prototype.setpoints=function(e){this.ratio=this.targetObject.naturalHeight/this.targetObject.naturalWidth;pos=fw.pointerPosition(e);this.targetPointerTop=pos.y-this.targetObject.offsetTop;this.targetPointerLeft=pos.x-this.targetObject.offsetLeft;this.targetTop=this.targetObject.offsetTop;this.targetLeft=this.targetObject.offsetLeft;this.targetHeight=this.targetObject.offsetHeight;this.targetWidth=this.targetObject.offsetWidth};dragThrow.prototype.movement=function(e){fw.stopCancel(e);if(this.mouseDown){pos=fw.pointerPosition(e);this.x=pos.x;this.y=pos.y;this.targetObject.style.top=this.y-this.targetPointerTop+"px";this.targetObject.style.left=this.x-this.targetPointerLeft+"px";pos.points&&pos.points.length>1&&this.touchZoom(pos.points)}else if(!e.touches){this.targetHeight=this.targetObject.offsetHeight;this.setpoints(e)}};dragThrow.prototype.touchZoom=function(e,t){var n=pos.points[0].x-pos.points[1].x,r=pos.points[0].y-pos.points[1].y,i=Math.sqrt(Math.pow(n,2)+Math.pow(r,2)),s=Math.round(i/this.zoomStart*100),o=this.targetHeight*(s/100);this.zoom(o)};dragThrow.prototype.mouseZoom=function(e){fw.stopCancel(e);var t=fw.mouseWheel(e),n=t.y,r=this.targetObject.offsetHeight+this.targetObject.offsetHeight*n/4;this.zoom(r)};dragThrow.prototype.zoom=function(e){if(e>this.targetObject.naturalHeight*.2&&e<this.targetObject.naturalHeight*1.5){var t=e/this.ratio,n=e-this.targetHeight,r=this.targetHeight/this.targetPointerTop,i=this.targetWidth/this.targetPointerLeft,s=this.targetTop-n/r,o=t-this.targetWidth,u=this.targetLeft-o/i;this.targetObject.style.height=e+"px";this.targetObject.style.width=t+"px";this.targetObject.style.top=s+"px";this.targetObject.style.left=u+"px"}};