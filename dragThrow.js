var dragThrow = function(){

        var mouseDragged = false,
            mousePrevX = 0,
            mousePrevY = 0,
            arMousePrevX = 0,
            arMousePrevY = 0,
            mouseCurrX = 0,
            mouseCurrY = 0,
            originalDecay = 0.9,
            
            buttonDown = false,
            
            overTarget = false,
            xOppositeEdge = false,
            yOppositeEdge = false,
            targetClick = true,
            t,
            ant,
            timerInterval = 100,        
            ainterval = 50;

        this.targetObject;
        this.eventObject;
        this.moveY = true;
        this.moveX = true;
        this.decay = this.originalDecay;
        this.onlyTarget = true;
        //TODO:extend the settings with options.

        //private functions
        this.handleOverTarget = function(e){            
            buttonDown = true;
            arMousePrevX = mousePrevX = mouseCurrX = e.pageX;
            arMousePrevY = mousePrevY = mouseCurrY = e.pageY;

            if(e.target === this.targetObject || !targetClick){
                overTarget = true;
            }
            /*else if(e.target.toString().search(this.targetObject.toString()) < 0){
                overTarget = false;
            }*/
        }

        this.timerOut = function(e){
            mouseDragged = false;
            arMousePrevX = mousePrevX = mouseCurrX = this.targetObject.offsetLeft;
            arMousePrevY = mousePrevY = mouseCurrY = this.targetObject.offsetTop;
        }

        this.moveIt = function(e){
            if(e.buttonDown && overTarget){
                buttonDown = true;
                mouseDragged = true;
                mouseCurrX = e.pageX;
                mouseCurrY = e.pageY;
                arMousePrevX = mousePrevX;
                arMousePrevY = mousePrevY;
                
                var topper = (this.eventObject.mouseY - mousePrevY) + this.targetObject.offsetTop;
                var sider = (this.eventObject.mouseX - mousePrevX) + this.targetObject.offsetLeft;
                
                if(this.moveY)this.this.targetObject.offsetTop = topper;
                if(this.moveX)this.this.targetObject.offsetLeft = sider;
                
                this.decay = originalDecay;
            }
             else{
                buttonDown = false;
                if(!targetClick)
                    overTarget = false;
             }
            
            mousePrevX = e.pageX;
            mousePrevY = e.pageY;
            
            
            if(this.targetObject.outerWidth > this.eventObject.outerWidth)
                xOppositeEdge = true;
            else
                xOppositeEdge = false;
            
            if(this.targetObject.outerHeight > this.eventObject.outerHeight)
                yOppositeEdge = true;
            else
                yOppositeEdge = false;
            
            clearTimeout(this.t);
            this.t = setTimeout(this.timerOut,this.timerInterval);
        }
        //this will need to be different. Should be smoother because we will use a setTimeout instead of a frame.
        this.throwIt = function(e){
            buttonDown = false;
            if(mouseDragged){
                ant = setTimeout(this.theRepeater, ainterval);
            }
        }

        this.throwItOut = function(e){
            buttonDown = false;
            if(e.relatedObject === null || e.relatedObject === this.eventObject.parent){
                ant = setTimeout(this.theRepeater, ainterval);
            }
        }

        this.theRepeater = function(){
            clearTimeout(this.t);

            var oldxer = mouseCurrX;
            var oldyer = mouseCurrY;
            
            
            var xDiff = mouseCurrX - arMousePrevX;
            var yDiff = mouseCurrY - arMousePrevY;
            
            if(!buttonDown){

            xDiff = xDiff * this.decay;
            yDiff = yDiff * this.decay;
            
            
            if(xOppositeEdge)
            {
                if(this.targetObject.offsetTop < (this.eventObject.outerWidth - this.targetObject.outerWidth - 50)){xDiff = -1 * xDiff; this.targetObject.offsetLeft = this.eventObject.outerWidth - this.targetObject.outerWidth - 50;}
                if(this.targetObject.offsetLeft > 50){xDiff = -1 * xDiff; this.targetObject.offsetLeft = 50; }
            }
            else
            {
                if(this.targetObject.offsetLeft <  -5){xDiff = -1 * xDiff; this.targetObject.offsetLeft = -5;}
                if(this.targetObject.offsetLeft > (this.eventObject.outerWidth - (this.targetObject.outerWidth - 5))){xDiff = -1 * xDiff; this.targetObject.offsetLeft = this.eventObject.outerWidth - (this.targetObject.outerWidth - 5);}
            }
            
            if(yOppositeEdge)
            {
                if(this.targetObject.offsetTop < (this.eventObject.outerHeight - this.targetObject.outerHeight - 50)){yDiff = -1 * yDiff; this.targetObject.offsetTop = this.eventObject.outerHeight - this.targetObject.outerHeight - 50;}
                if(this.targetObject.offsetTop > 50){yDiff = -1 * yDiff; this.targetObject.offsetTop = 50;}
            
            }
            else
            {
                if(this.targetObject.offsetTop < -5){yDiff = -1 * yDiff; this.targetObject.offsetTop = -5;}
                if(this.targetObject.offsetTop > (this.eventObject.outerHeight - (this.targetObject.outerHeight - 5))){yDiff = -1 * yDiff; this.targetObject.offsetTop = this.eventObject.outerHeight - (this.targetObject.outerHeight - 5);}
            }
            
            var sider = xDiff + this.targetObject.offsetLeft;
            var Topper = yDiff + this.targetObject.offsetTop;
            
            mouseCurrX = mouseCurrX + xDiff;
            mouseCurrY = mouseCurrY + yDiff;
            
            if(this.moveY){this.targetObject.offsetTop = Topper;}
            if(this.moveX){this.targetObject.offsetLeft = sider; }
            
            arMousePrevX = oldxer;
            arMousePrevY = oldyer;
            
            if(originalDecay < 1){
                this.decay = this.decay - 0.004;
                ant = setTimeout(this.theRepeater, ainterval);
            }

            if(Math.abs(xDiff) < 1 && Math.abs(yDiff) < 1)
            {
                clearTimeout(ant);
            }
        }
    };

    dragThrow.prototype.init = function (args){
        this.targetObject = args.targetObject;
        this.eventObject = args.eventObject;
        this.originalDecay = typeof(args.decay) === "undefined" ? args.decay : 0.8;
        
        this.moveX = typeof(args.moveX) === "undefined" ? args.moveX : true;
        this.moveY = typeof(args.moveY) === "undefined" ? args.moveY : true;
        this.TargetClick = typeof(args.onlyTarget) === "undefined" ? args.onlyTarget : true;
        
        this.start();
    };

    dragThrow.prototype.start = function(){
        this.targetObject.addEventListener( "mousedown",    this.handleOverTarget.bind(this));
        this.eventObject.addEventListener(  "mousedown",    this.handleOverTarget.bind(this));
        this.eventObject.addEventListener(  "mousemove",    this.moveIt.bind(this));
        this.targetObject.addEventListener( "mouseup",      this.throwIt.bind(this));
        this.eventObject.addEventListener(  "mouseup",      this.throwIt.bind(this));
        this.targetObject.addEventListener( "mouseout",     this.throwItOut.bind(this));
        this.eventObject.addEventListener(  "mouseout",     this.throwItOut.bind(this));
        
        this.t = setTimeout(this.timerOut,this.timerInterval);
    }



    dragThrow.prototype.stop = function(){

        this.targetObject.removeEventListener(  "mousedown",  this.handleOverTarget);
        this.eventObject.removeEventListener(   "mousedown",  this.handleOverTarget);
        this.eventObject.removeEventListener(   "mousemove",  this.moveIt);
        this.targetObject.removeEventListener(  "mouseup",    this.throwIt);
        this.eventObject.removeEventListener(   "mouseup",    this.throwIt);
        this.targetObject.removeEventListener(  "mouseout",   this.throwItOut);
        this.eventObject.removeEventListener(   "mouseout",   this.throwItOut);
        
        
        clearTimeout(this.t);
    }


};