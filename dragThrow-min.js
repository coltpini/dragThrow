var dragThrow=function(){var e=!1,t=0,n=0,r=0,i=0,s=0,o=0,u,a,f=!1,l=!1,c,h=100,p=5,d=0,v=3;this.targetObject=undefined;this.eventObject=undefined;this.originalGravity=0;this.moveY=!0;this.moveX=!0;this.originalDecay=.8;this.onlyTarget=!0;this.xOppositeEdge=!1;this.yOppositeEdge=!1;this.handleOverTarget=function(e){e.preventDefault();var u=this.findElement(e.target);f=!0;r=t=s=e.clientX;i=n=o=e.clientY;l=u===this.targetObject};this.moveIt=function(c){c.preventDefault();this.onlyTarget||(l=!0);if(f&&l){f=!0;e=!0;s=c.clientX||c.touches.item(0).clientX;o=c.clientY||c.touches.item(0).clientY;r=t;i=n;var h=o-n+this.targetObject.offsetTop,p=s-t+this.targetObject.offsetLeft;this.moveY&&(this.targetObject.style.top=h+"px");this.moveX&&(this.targetObject.style.left=p+"px");this.findEdgeY(0);this.findEdgeX(0);u=this.originalDecay;a=this.originalGravity;v=3;d=0}else{f=!1;this.onlyTarget||(l=!1)}t=s;n=o};this.throwIt=function(t){t.preventDefault();f=!1;e&&(c=setTimeout(this.theRepeater.bind(this),p))};this.findElement=function(e){while(e!==this.targetObject){if(e===this.eventObject||e===null)break;e=e.parentNode}return e};this.findEdgeY=function(e){if(this.yOppositeEdge){if(this.targetObject.offsetTop<this.eventObject.offsetHeight-this.targetObject.offsetHeight-20){e=-0.1*e;i=o;this.targetObject.style.top=this.eventObject.offsetHeight-this.targetObject.offsetHeight-20+"px"}if(this.targetObject.offsetTop>20){e=-0.1*e;i=o;this.targetObject.style.top="20px"}}else{if(this.targetObject.offsetTop<0){e=-1*e;this.targetObject.style.top="0px"}if(this.targetObject.offsetTop>this.eventObject.offsetHeight-this.targetObject.offsetHeight){e=-1*e;this.targetObject.style.top=this.eventObject.offsetHeight-this.targetObject.offsetHeight+1+"px"}}return e};this.findEdgeX=function(e){if(this.xOppositeEdge){if(this.targetObject.offsetLeft<this.eventObject.offsetWidth-this.targetObject.offsetWidth-20){e=-0.1*e;r=s;this.targetObject.style.left=this.eventObject.offsetWidth-this.targetObject.offsetWidth-20+"px"}if(this.targetObject.offsetLeft>20){e=-0.1*e;r=s;this.targetObject.style.left="20px"}}else{if(this.targetObject.offsetLeft<0){e=-1*e;this.targetObject.style.left="0px"}if(this.targetObject.offsetLeft>this.eventObject.offsetWidth-this.targetObject.offsetWidth){e=-1*e;this.targetObject.style.left=this.eventObject.offsetWidth-this.targetObject.offsetWidth+"px"}}return e};this.theRepeater=function(e){clearTimeout(this.t);var t=s,n=o,l=!1,h=s-r,m=o-i;if(!f){h*=u;m*=u;m<0?m+=a:m+=a*(1-a);m<0&&d>0&&(v=d);d=m;h=this.findEdgeX(h);m=this.findEdgeY(m);var g=h+this.targetObject.offsetLeft,y=m+this.targetObject.offsetTop;s+=h;o+=m;this.moveY&&(this.targetObject.style.top=y+"px");this.moveX&&(this.targetObject.style.left=g+"px");r=t;i=n;if(this.originalDecay<1){u-=.001;a=0;l=!0}else if(a&&v>2)u-=1e-5;else if(v<2){u-=.001;l=!0}c=setTimeout(this.theRepeater.bind(this),p);Math.abs(h)<.5&&Math.abs(m)<.5&&l&&clearTimeout(c)}}};dragThrow.prototype.init=function(e){this.targetObject=e.targetObject;this.eventObject=e.eventObject;this.originalDecay=typeof e.decay!="undefined"?e.decay:.8;this.originalGravity=typeof e.gravity!="undefined"?e.gravity:0;this.moveX=typeof e.moveX!="undefined"?e.moveX:!0;this.moveY=typeof e.moveY!="undefined"?e.moveY:!0;this.onlyTarget=typeof e.onlyTarget!="undefined"?e.onlyTarget:!0;this.start()};dragThrow.prototype.start=function(){this.eventObject.addEventListener("mousedown",this.handleOverTarget.bind(this),!1);this.eventObject.addEventListener("mousemove",this.moveIt.bind(this),!1);document.addEventListener("mouseup",this.throwIt.bind(this),!1);this.eventObject.addEventListener("touchstart",this.handleOverTarget.bind(this),!1);this.eventObject.addEventListener("touchend",this.throwIt.bind(this),!1);this.eventObject.addEventListener("touchmove",this.moveIt.bind(this),!1);this.targetObject.addEventListener("mousedown",this.handleOverTarget.bind(this),!1);this.targetObject.addEventListener("touchstart",this.handleOverTarget.bind(this),!1);this.xOppositeEdge=this.targetObject.offsetWidth>this.eventObject.offsetWidth;this.yOppositeEdge=this.targetObject.offsetHeight>this.eventObject.offsetHeight};dragThrow.prototype.stop=function(){this.eventObject.removeEventListener("mousedown",this.handleOverTarget,!1);this.eventObject.removeEventListener("mousemove",this.moveIt.false);document.removeEventListener("mouseup",this.throwIt);this.eventObject.removeEventListener("touchstart",this.handleOverTarget,!1);this.eventObject.removeEventListener("touchend",this.throwIt,!1);this.eventObject.removeEventListener("touchmove",this.moveIt,!1);this.targetObject.removeEventListener("mousedown",this.handleOverTarget,!1);this.targetObject.removeEventListener("touchstart",this.handleOverTarget,!1)};