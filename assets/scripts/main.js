/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var scroller;

window.addEvents({

	'domready': function(){
		
		scroller = new Fx.Scroll(document.body, {
			wheelStops: false
		});
		
		var touch = new Touch(window);
		
		touch.addEvent('move', function(dx, dy){
			scroller.start(0, document.body.getScroll().y + -dy * 100);
		});
		
		touch.addEvent('end', function(){
			scroller.cancel();
		});

		
		Mobile.Application.addEvents({
		
			'notRegistered': function(){
				//Mobile.Application.loadScreen('signup');
			},
			
			'startUp': function(){
				Mobile.Application.loadScreen('main');
			}
		});
		
		Mobile.Application.run();
	},
	
	'load': function(){
	
		// hide toolbar in iphone
		(function(){ window.scrollTo(0, 1); }).delay(100);
	},
	
	'mousewheel': function(e) {
		
		scroller.start(0, document.body.getScroll().y + -e.wheel * 100);
	}
});
