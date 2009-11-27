/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */
 
Mobile.Application.extend({
	
	config: {
		is_registered: true
	},
	
	run: function(){
		if(this.config.is_registered){
			this.fireEvent('startUp');
		} else {
			this.fireEvent('notRegistered');
		}
	},
	
	isRegistered: function(){
		return this.config.is_registered;
	}
});
