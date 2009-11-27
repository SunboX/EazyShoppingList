/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var Mobile = Mobile || {};
 
Mobile.Application = new Class({

	Implements: [Events],
	
	lastScreen: null,
	currentScreen: null,
	nextScreen: null,
 	
	initialize: function(){
		this.screenRequest = new Mobile.Request.Screen();
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
		this.lastScreen = control;
		if($chk(control))
			control.hide();
	},
	
	loadScreen: function(scrName){
		this.screenRequest.send({
			url: 'assets/scripts/screens/' + scrName + '.js'
		});
	},
	
	loadLastScreen: function(){
		this.loadScreen(this.lastScreen.getName());
	},
	
	showScreen: function(scr){
		this.removeControl(this.currentScreen);
		this.addControl(scr);
		this.screenRequest.success();
	}
});

Mobile.Application.extend(new Mobile.Application);
