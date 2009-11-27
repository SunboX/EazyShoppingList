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


Mobile.GUI = new Class({});

Mobile.GUI.Control = new Class({
	
	Implements: [Options],
	
	options: {},
	
	element: {},
	
	getElement: function(){
		return this.element;
	},
	
	hide: function(){
		this.getElement().dispose();
	}
});

Mobile.GUI.Screen = new Class({
 	
	Implements: [Mobile.GUI.Control],
	
	initialize: function(screenName, options){
		options = options || {};
		
		if (!$chk(screenName)) {
			alert('No Mobile.GUI.Screen name found!');
			return null;
		}
		
		this.screenName = screenName;
		
		this.element = new Element('div', {
			'class': 'screen'
		});
	},
	
	getName: function(){
		return this.screenName;
	},
	
	addControl: function(control){
		control.getElement().inject(this.element);
	}
});

Mobile.GUI.Header = new Class({
 	
	Implements: [Mobile.GUI.Control],
	
	initialize: function(options){
		options = options || {};
		
		this.element = new Element('div', {
			'class': 'header'
		});
		this.title = new Element('h1', {
			text: options.title || ''
		}).inject(this.element);
	},
	
	setTitle: function(title){
		this.title.set('text', title);
	},
	
	getTitle: function()
	{
		return this.title.get('text', '');
	},
	
	addButton: function(text, options){
		options = options || {};
		
		var btn = new Element('a', {
			text: text,
			'class': 'nav'
		}).inject(this.element);
		
		if($chk(options.type))
			btn.addClass(options.type);
			
		if($chk(options.href))
			btn.set('href', options.href);
			
		return btn;
	}
});

Mobile.GUI.List = new Class({
 	
	Implements: [Mobile.GUI.Control],
	
	initialize: function(options){
		this.element = new Element('ul');
	},
	
	addItem: function(text, options){
		options = options || {};
		
		var item = new Element('li', {
			text: text
		}).inject(this.element);
		
		return item;
	}
});
