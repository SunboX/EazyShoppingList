/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var Mobile = Mobile || {};
 
Mobile.Application = new Class({

	Implements: [Events],
	
	currentScreen: null,
 	
	initialize: function(){
		this.screenRequest = new Mobile.Request.Screen();
		this.initHistory();
	},
	
	run: function(){},
	
	getElement: function(){
		if(!$chk(this.container))
			this.container = $(document.body);
			
		return this.container;
	},
	
	addControl: function(control){
		this.currentScreen = control;
		control.getElement().inject(this.getElement());
	},
	
	removeControl: function(control){
		if($chk(control))
			control.hide();
	},
	
	loadScreen: function(scrName){
		this.fireEvent('onScreenLoad', scrName);
		this.screenRequest.send({
			url: 'assets/scripts/screens/' + scrName + '.js'
		});
	},
	
	loadLastScreen: function(){
		history.back();
	},
	
	showScreen: function(scr){
		this.fireEvent('onScreenLoaded', scr.getName());
		this.fireEvent('onScreenChange', scr);
		this.removeControl(this.currentScreen);
		this.addControl(scr);
		this.screenRequest.success();
		this.fireEvent('onScreenChanged', scr);
	},
	
	 initHistory: function() {
		this.fireEvent('onHistoryInit');
		
		this.historyKey = 'screen';
		 
		this.history = new History.Route({
			pattern: this.historyKey + '\\(([^)]+)\\)',
			generate: function(values) {
				return [this.historyKey, '(', values[0], ')'].join('');
			}.bind(this),
			onMatch: function(values, defaults) {
				this.loadScreen(values[0]);
			}.bind(this)
		});
		
		History.start();
		
		this.addEvent('onScreenLoaded', function(scrName){
			this.history.setValue(0, scrName);
		}.bind(this));
		
		this.fireEvent('onHistoryInited');
	}
});

Mobile.Application.extend(new Mobile.Application);
