/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var Mobile = Mobile || {};
 
Mobile.Application = new Class({

	Implements: [Options, Events],
	
	options: {},
	
	currentScreen: {
		name: '',
		parameters: {},
		control: {}
	},
 	
	initialize: function(){
		this.screenRequest = new Mobile.Request.Screen();
		this.initHistory();
		this.addEvent('screenLoaded', this.changeScreen);
	},
	
	run: function(){},
	
	getElement: function(){
		if(!$chk(this.container))
			this.container = $(document.body);
			
		return this.container;
	},
	
	addControl: function(control){
		this.currentScreen.control = control;
		control.getElement().inject(this.getElement());
	},
	
	removeControl: function(control){
		if($chk(control) && control.hide)
			control.hide();
	},
	
	loadScreen: function(name, parameters){
		this.currentScreen.name = name;
		this.currentScreen.parameters = parameters || {};
		this.fireEvent('onScreenLoad', this.currentScreen);
		this.screenRequest.send({
			url: 'assets/scripts/screens/' + name + '.js'
		});
	},
	
	loadLastScreen: function(){
		history.back();
	},
	
	showScreen: function(scrControl){
		this.fireEvent('onScreenLoaded', scrControl);
		this.changeScreen(scrControl);
	},
	
	changeScreen: function(scrControl){
		this.fireEvent('onScreenChange', this.currentScreen);
		this.removeControl(this.currentScreen.control);
		this.currentScreen.control = scrControl;
		this.addControl(this.currentScreen.control);
		this.fireEvent('onScreenChanged', this.currentScreen);
	},
	
	initHistory: function() {
		this.fireEvent('onHistoryInit');
		
		this.historyKey = 'screen';
		 
		this.history = new History.Route({
			pattern: this.historyKey + '\\(([^)]+)\\)',
			generate: function(values) {
				return [this.historyKey, '(', values[0], ')'].join('');
			}.bind(this),
			onMatch: function(values){
				var ro = Mobile.Routing.parse(values[0]);
				this.loadScreen(ro.name, ro.parameters);
			}.bind(this)
		});
		
		History.start();
		
		this.addEvent('onScreenChanged', function(scr){
			this.history.setValue(0, Mobile.Routing.gen(this.currentScreen.name, this.currentScreen.parameters));
		}.bind(this));
		
		this.fireEvent('onHistoryInited');
	}
});

Mobile.Application.extend(new Mobile.Application);
