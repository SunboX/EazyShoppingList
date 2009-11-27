/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

window.addEvent('domready', function(){
	
	Mobile.Application.addEvents({
		
		'notRegistered': function(){
			Mobile.Application.loadScreen('signup');
		},
		
		'startUp': function(){
			Mobile.Application.loadScreen('main');
		}
	});
	
	Mobile.Application.run();
});
