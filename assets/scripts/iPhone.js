/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

 var iPhone = iPhone || {};
 
iPhone.Application = new Class({
 	
	initialize: function(container){
		this.container = $(container);
	},
	
	addControl: function(control){
		control.getElements().inject(this.container);
	}
});

iPhone.GUI = {};

iPhone.GUI.Control = new Class({
	
	Implements: [Options],
	
	options: {},
	
	element: {},
	
	getElements: function(){
		return this.element;
	}
});

iPhone.GUI.Header = new Class({
 	
	Implements: [iPhone.GUI.Control],
	
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

iPhone.GUI.List = new Class({
 	
	Implements: [iPhone.GUI.Control],
	
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
