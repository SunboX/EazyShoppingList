/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var Mobile = Mobile || {};

Mobile.Request = Mobile.Request || {};

Mobile.Request.Screen = new Class({

	Implements: [Events, Options, Log],

	options: {
		url: '',
		noCache: false,
		injectScript: document.head
	},

	initialize: function(options){
		this.setOptions(options);
		if (this.options.log) this.enableLog();
		this.running = false;
		this.toLoad = [];
	},
	
	send: function(options) {
		options = $merge(this.options, options);
		if (this.toLoad.length) return this.loadScript(this.toLoad.shift());
		if (this.running) return this.toLoad.push(script);
		this.running = true;
		this.script = new Element('script', {
			src: options.url + (this.options.noCache ? '?noCache=' + $time() : ''),
			events: {
				load: function() {
					this.success();
				}.bind(this),
				error: function() {
					this.error();
				}.bind(this)
			}
		}).inject(options.injectScript || document.head);
		return this;
	},

	cancel: function(){
		if (!this.running) return this;
		if ($chk(this.script)) this.script.destroy();
		this.running = false;
		this.fireEvent('cancel');
		return this;
	},

	success: function(){
		if ($chk(this.script)) this.script.destroy();
		this.running = false;
		this.log('Mobile.Request.Screen successfully loaded.');
		this.fireEvent('success');
		if (this.toLoad.length) this.loadScript(this.toLoad.shift());
		return this;
	},

	error: function(){
		if ($chk(this.script)) this.script.destroy();
		this.running = false;
		this.log('Mobile.Request.Screen could not load script.');
		this.fireEvent('error');
		if (this.toLoad.length) this.loadScript(this.toLoad.shift());
		return this;
	}
});
