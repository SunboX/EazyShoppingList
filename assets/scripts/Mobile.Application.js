/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var Mobile = Mobile || {};
 
Mobile.Application = new Class({

	Implements: [Options, Events],
	
	options: {
	},
	
	currentScreen: {
		name: '',
		parameters: {},
		direction: '',
		control: {}
	},
 	
	initialize: function(options){
		this.setOptions(options);
		this.screenRequest = new Mobile.Request.Screen();
		this.initHistory();
		this.addEvent('screenLoaded', this.changeScreen);
	},
	
	run: function(){},
	
	toElement: function(){
		if (!$chk(this.container)) {
			this.container = new Element('div', {
				'class': 'window'
			}).inject(document.body);
			this.container.set('tween', {duration: 'short'});
		}
			
		return this.container;
	},
	
	loadScreen: function(name, direction, parameters){
		direction = (direction && direction != '') ? direction : (
			this.currentScreen.direction == 'ltr' ? 'rtl' : 'ltr'
		);
		if(this.currentScreen.name == name) return;
		this.currentScreen.name = name;
		this.currentScreen.parameters = parameters || {};
		this.currentScreen.direction = direction;
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
		var s = this.toElement().getSize();
		var d = this.currentScreen.direction;
		var oldControl = this.currentScreen.control;
		this.currentScreen.control = scrControl;
		this.currentScreen.control.addEvent('resize', this.resize);
		this.currentScreen.control.toElement().inject(this.toElement());
		this.resize();
		if ($chk(oldControl.toElement)) {
			if (oldControl.getName() == scrControl.getName()) {
				this.fireEvent('onScreenChanged', this.currentScreen);
				return;
			}
			oldControl.toElement().set('tween', {duration: 'short'});
			scrControl.toElement().set('tween', {duration: 'short'});
			oldControl.toElement().get('tween').addEvent('complete', function(){
				if($chk(oldControl) && oldControl.hide)
					oldControl.hide();
				this.fireEvent('onScreenChanged', this.currentScreen);
			}.bind(this));
			scrControl.toElement().setStyles({
				position: 'absolute',
				top: 0,
				left: (d == 'rtl' ? s.x : -s.x),
				width: s.x
			});
			if (d == 'rtl') {
				oldControl.toElement().tween('left', [0, -s.x]);
				scrControl.toElement().tween('left', [s.x, 0]);
			}
			else {
				oldControl.toElement().tween('left', [0, s.x]);
				scrControl.toElement().tween('left', [-s.x, 0]);
			}
		}
	},
	
	resize: function(){
		this.fireEvent('onResize');
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
				this.loadScreen(ro.name, (ro.direction == 'rtl' ? 'ltr' : 'rtl'), ro.parameters);
			}.bind(this)
		});
		
		History.start();
		
		this.addEvent('onScreenChanged', function(scr){
			this.history.setValue(0, Mobile.Routing.gen(this.currentScreen.name, this.currentScreen.direction, this.currentScreen.parameters));
		}.bind(this));
		
		this.fireEvent('onHistoryInited');
	}
});

Mobile.Application.extend(new Mobile.Application);
