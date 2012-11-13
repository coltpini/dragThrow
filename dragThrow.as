package classes
{
    import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.events.TimerEvent;
	import flash.utils.Timer;
	

	
	public class PanAndThrow
	{		
		private var MouseDragged:Boolean = new Boolean();
		private var MousePrevX:Number = 0;
		private var MousePrevY:Number = 0;
		private var arMousePrevX:Number = 0;
		private var arMousePrevY:Number = 0;
		private var MouseCurrX:Number = 0;
      	private var MouseCurrY:Number = 0;
      	private var originalDecay:Number = .9;
      	private var Decay:Number = originalDecay;
      	private var buttonDown:Boolean = false;
      	private var moveY:Boolean = true;
      	private var moveX:Boolean = true;
      	private var overTarget:Boolean = false;
      	private var xOppositeEdge:Boolean = false;
      	private var yOppositeEdge:Boolean = false;
      	private var TargetClick:Boolean = true;
      	
      	
      	private var t:Timer;
		private var timerInterval:int = 100;      	
      	
      	private var targetObject:Sprite = new Sprite();
      	private var eventObject:Sprite = new Sprite();
      	
		public function PanAndThrow()
		{
			
		}
		
		public function init(ObjectToMove:Sprite, ObjectToEventise:Sprite, DecayAmount:Number = .9, isMoveY:Boolean = true, isMoveX:Boolean = true, OnlyMoveOnTargetClick:Boolean = true ):void
		{
			targetObject = ObjectToMove;
			eventObject = ObjectToEventise;
			originalDecay = DecayAmount;
											
			moveX = isMoveX;
			moveY = isMoveY;
			TargetClick = OnlyMoveOnTargetClick;					
    		    			
    		t = new Timer(timerInterval);	
    		start();				
		}		
		
		public function start():void{
			targetObject.addEventListener(MouseEvent.MOUSE_DOWN, handleOverTarget);
			eventObject.addEventListener(MouseEvent.MOUSE_DOWN, handleOverTarget);
			eventObject.addEventListener(MouseEvent.MOUSE_MOVE, moveIt);
			targetObject.addEventListener(MouseEvent.MOUSE_UP, throwIt);
    		eventObject.addEventListener(MouseEvent.MOUSE_UP, throwIt);
    		targetObject.addEventListener(MouseEvent.MOUSE_OUT, throwItOut);
    		eventObject.addEventListener(MouseEvent.MOUSE_OUT, throwItOut);

    		    		
    		t.addEventListener(TimerEvent.TIMER, timerOut);
    		t.start();
		}
		
		private function handleOverTarget(e:MouseEvent):void
		{
			buttonDown = true;
			arMousePrevX = MousePrevX = MouseCurrX = eventObject.mouseX;
        	arMousePrevY = MousePrevY = MouseCurrY = eventObject.mouseY;
        		
			if(e.currentTarget == targetObject || !TargetClick)
    		{
    			overTarget = true;
    		}
    		else if(e.target.toString().search(targetObject.toString()) < 0)
    		{
    			overTarget = false;
    		}
    		
		}	
		
		private function timerOut(e:TimerEvent):void
		{
			MouseDragged = false;	 
			arMousePrevX = MousePrevX = MouseCurrX = eventObject.mouseX;
        	arMousePrevY = MousePrevY = MouseCurrY = eventObject.mouseY;    	
		}
		
		private function moveIt(e:MouseEvent):void
        {
        	       	
        	if(e.buttonDown && overTarget)
        	{          
        		buttonDown = true;
        		MouseDragged = true;
        		MouseCurrX = eventObject.mouseX;
        		MouseCurrY = eventObject.mouseY;
        		arMousePrevX = MousePrevX;
        		arMousePrevY = MousePrevY;
        		
        		var Topper:int = (eventObject.mouseY - MousePrevY) + targetObject.y;
        		var Sider:int = (eventObject.mouseX - MousePrevX) + targetObject.x;
       		 
        		if(moveY){targetObject.y = Topper;}
        		if(moveX){targetObject.x = Sider;}          		
        		
        		Decay = originalDecay;           		   		
        	}
    	 	else
    	 	{       	          		
        		buttonDown = false;
        		if(!TargetClick)
        			overTarget = false;
    	 	}
        		
    		MousePrevX = eventObject.mouseX;
    		MousePrevY = eventObject.mouseY;
    		
    		
    		if(targetObject.width > eventObject.width){xOppositeEdge = true;}	
			else{xOppositeEdge = false;}		
			
			if(targetObject.height > eventObject.height){yOppositeEdge = true;}	
			else{yOppositeEdge = false;}	
        	
        	
        	t.stop();
        	t.start();
        }
            
        private function throwIt(e:MouseEvent):void
		{				
			buttonDown = false;
			if(MouseDragged){						
				eventObject.addEventListener(Event.ENTER_FRAME, theRepeater);
			}	  		
       	}
       	
       	private function throwItOut(e:MouseEvent):void
		{							
			buttonDown = false;			
			if(e.relatedObject == null || e.relatedObject == eventObject.parent){
				eventObject.addEventListener(Event.ENTER_FRAME, theRepeater);	         		
   			}
       	}
  		
  		private function theRepeater(e:Event):void
  		{	        		  
  			t.stop();
    		  
		   var oldxer:Number = MouseCurrX;
		   var oldyer:Number = MouseCurrY;
		   
		   
  			var xDiff:Number = MouseCurrX - arMousePrevX;
  			var yDiff:Number = MouseCurrY - arMousePrevY;
  			
  			if(!buttonDown)
  			{
  			
      			xDiff = xDiff * Decay;
      			yDiff = yDiff * Decay;          			
      			
      			
      			if(xOppositeEdge)
      			{   
      				if(targetObject.x < (eventObject.width - targetObject.width - 50)){xDiff = -1 * xDiff; targetObject.x = eventObject.width - targetObject.width - 50;}
          			if(targetObject.x > 50){xDiff = -1 * xDiff; targetObject.x = 50; }          			
      			}
      			else 
  				{
          			if(targetObject.x <  -5){xDiff = -1 * xDiff; targetObject.x = -5;}
          			if(targetObject.x > (eventObject.width - (targetObject.width - 5))){xDiff = -1 * xDiff; targetObject.x = eventObject.width - (targetObject.width - 5);}
          		} 
          		
      			if(yOppositeEdge)
      			{         				
          			if(targetObject.y < (eventObject.height - targetObject.height - 50)){yDiff = -1 * yDiff; targetObject.y = eventObject.height - targetObject.height - 50;}
          			if(targetObject.y > 50){yDiff = -1 * yDiff; targetObject.y = 50;}       				          				
          			
      			}
      			else 
  				{
  					if(targetObject.y < -5){yDiff = -1 * yDiff; targetObject.y = -5;}
          			if(targetObject.y > (eventObject.height - (targetObject.height - 5))){yDiff = -1 * yDiff; targetObject.y = eventObject.height - (targetObject.height - 5);}	          			
      			} 
      			
      			var sider:int = xDiff + targetObject.x;
      			var Topper:int = yDiff + targetObject.y;
      			
      			MouseCurrX = MouseCurrX + xDiff;
      			MouseCurrY = MouseCurrY + yDiff;
      			
      			if(moveY){targetObject.y = Topper;}
        		if(moveX){targetObject.x = sider; }
        		
        		arMousePrevX = oldxer;
        		arMousePrevY = oldyer;
        		   
        		if(originalDecay < 1)
        			Decay = Decay - .004; 

  			}
  			else
  			{
  				eventObject.removeEventListener(Event.ENTER_FRAME, theRepeater);
  			}
  			     			
		    if(Math.abs(xDiff) < 1 && Math.abs(yDiff) < 1)
		    {
      			eventObject.removeEventListener(Event.ENTER_FRAME, theRepeater);			        
		    }
		}
		
		public function stop():void{
			
			targetObject.removeEventListener(MouseEvent.MOUSE_DOWN, handleOverTarget);
			eventObject.removeEventListener(MouseEvent.MOUSE_DOWN, handleOverTarget);
			eventObject.removeEventListener(MouseEvent.MOUSE_MOVE, moveIt);
			targetObject.removeEventListener(MouseEvent.MOUSE_UP, throwIt);
    		eventObject.removeEventListener(MouseEvent.MOUSE_UP, throwIt);
    		targetObject.removeEventListener(MouseEvent.MOUSE_OUT, throwItOut);
    		eventObject.removeEventListener(MouseEvent.MOUSE_OUT, throwItOut);		
			eventObject.removeEventListener(Event.ENTER_FRAME, theRepeater);

    		t.removeEventListener(TimerEvent.TIMER, timerOut);
    		t.stop();
		}
		
		public function get decay():Number
		{
			return originalDecay;
		}
		public function set decay(value:Number):void
		{
			originalDecay = value;
		}
		
	}
}