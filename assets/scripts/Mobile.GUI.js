/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var Mobile = Mobile || {};

Mobile.GUI = Mobile.GUI || {};

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
			text: text,
			id: options.id || 'm-g-l-' + $time()
		}).inject(this.element);
		
		return item;
	}
});

Mobile.GUI.Form = new Class({
 	
	Implements: [Mobile.GUI.Control],
	
	initialize: function(options){
		this.element = new Element('ul', {
			'class': 'form'
		});
	},
	
	addTextfield: function(name, label, options){
		options = options || {};
		
		if (!$chk(name)) {
			alert('Mobile.GUI.Form.addTextfield: No name found!');
			return null;
		}	
		
		if (!$chk(label)) {
			alert('Mobile.GUI.Form.addTextfield: No label found!');
			return null;
		}
		
		var value = options.value || label;
		
		var item = new Element('li').inject(this.element);
		
		var field = new Element('input', {
			type: 'text',
			name: name,
			value: value,
			defaultValue: label,
			id: options.id || 'fe-' + $time()
		}).inject(item);
		
		field.isEmpty = function(){
			return this.get('value') == this.get('defaultValue');
		}
			
		field.setError = function(hasError){
			if(hasError == null) hasError = true;
			if(hasError) this.getParent('li').addClass('error');
			else this.getParent('li').removeClass('error');
		}
		
		field.addEvents({
			'click': function(e){
				this.setError(false);
				if(this.get('value') == this.get('defaultValue'))
					this.set('value', '');
			},
			'blur': function(e){
				if(this.get('value') == '')
					this.set('value', this.get('defaultValue'));
			}
		});
		
		return field;
	},
	
	addTextarea: function(name, label, options){
		options = options || {};
		
		if (!$chk(name)) {
			alert('Mobile.GUI.Form.addTextarea: No name found!');
			return null;
		}	
		
		if (!$chk(label)) {
			alert('Mobile.GUI.Form.addTextarea: No label found!');
			return null;
		}
		
		var value = options.value || label;
		
		var item = new Element('li').inject(this.element);
		
		var field = new Element('textarea', {
			name: name,
			value: value,
			defaultValue: label,
			id: options.id || 'fe-' + $time()
		}).inject(item);
		
		field.isEmpty = function(){
			return this.get('value') == this.get('defaultValue');
		}
			
		field.setError = function(hasError){
			if(hasError == null) hasError = true;
			if(hasError) this.getParent('li').addClass('error');
			else this.getParent('li').removeClass('error');
		}
		
		field.addEvents({
			'click': function(e){
				this.setError(false);
				if(this.get('value') == this.get('defaultValue'))
					this.set('value', '');
			},
			'blur': function(e){
				if(this.get('value') == '')
					this.set('value', this.get('defaultValue'));
			}
		});
		
		return field;
	}
});
