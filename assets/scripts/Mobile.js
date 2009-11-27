/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var Mobile = Mobile || {};

Mobile.Request = Mobile.Request || {};

Mobile.Request.Screen = new Class({

	Implements: [Chain, Events, Options, Log],

	options: {
		url: '',
		data: {},
		retries: 0,
		timeout: 0,
		link: 'ignore',
		callbackKey: 'callback',
		injectScript: document.head
	},

	initialize: function(options){
		this.setOptions(options);
		if (this.options.log) this.enableLog();
		this.running = false;
		this.requests = 0;
		this.triesRemaining = [];
	},

	check: function(){
		if (!this.running) return true;
		switch (this.options.link){
			case 'cancel': this.cancel(); return true;
			case 'chain': this.chain(this.caller.bind(this, arguments)); return false;
		}
		return false;
	},

	send: function(options){
		if (!$chk(arguments[1]) && !this.check(options)) return this;

		var type = $type(options), 
				old = this.options, 
				index = $chk(arguments[1]) ? arguments[1] : this.requests++;
		if (type == 'string' || type == 'element') options = {data: options};

		options = $extend({data: old.data, url: old.url}, options);

		if (!$chk(this.triesRemaining[index])) this.triesRemaining[index] = this.options.retries;
		var remaining = this.triesRemaining[index];

		(function(){
			var script = this.getScript(options);
			this.log('Mobile.Request.Screen retrieving script with url: ' + script.get('src'));
			this.fireEvent('request', script);
			this.running = true;

			(function(){
				if (remaining){
					this.triesRemaining[index] = remaining - 1;
					if (script){
						script.destroy();
						this.send(options, index).fireEvent('retry', this.triesRemaining[index]);
					}
				} else if(script && this.options.timeout){
					script.destroy();
					this.cancel().fireEvent('failure');
				}
			}).delay(this.options.timeout, this);
		}).delay(Browser.Engine.trident ? 50 : 0, this);
		return this;
	},

	cancel: function(){
		if (!this.running) return this;
		this.running = false;
		this.fireEvent('cancel');
		return this;
	},

	getScript: function(options){
		var index = Mobile.Request.Screen.counter;
		Mobile.Request.Screen.counter++;

		var src = options.url;
		if (src.length > 2083) this.log('Mobile.Request.Screen '+ src +' will fail in Internet Explorer, which enforces a 2083 bytes length limit on URIs');

		this.script = new Element('script', {type: 'text/javascript', src: src});
		return this.script.inject(this.options.injectScript);
	},

	success: function(){
		if ($chk(this.script)) this.script.destroy();
		this.running = false;
		this.log('Mobile.Request.Screen successfully loaded.');
		this.fireEvent('complete').fireEvent('success').callChain();
	}

});

Mobile.Request.Screen.counter = 0;

 
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
