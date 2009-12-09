/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

window.addEvents({

	'domready': function(){
		
		new Touch.WindowScroller();
		
		Mobile.Application.addEvents({
		
			'firstRun': function(){
				if(confirm(MooTools.lang.get('ESL', 'firstRun'))){
					Mobile.Application.loadScreen('login');
				}
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
		var y = document.body.getScroll().y + -e.wheel * 100;
		window.scrollTo(0, y < 1 ? 1 : y);
	}
});
