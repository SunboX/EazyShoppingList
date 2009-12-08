/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

Element.Events.click = $merge(Element.Events.click, {
	condition: function(e){
		return !window.retrieve('moving', false);
	}
});

var Touch = Touch || {};

Touch.WindowScroller = new Class({
	
	Extends: Touch,
	
	initialize: function(){
		this.parent(document.body, {
			delay: 150
		});
		
		this.addEvents({
			'move': function(dx, dy){
				window.store('moving', true);
				var y = document.body.getScroll().y + -dy;
				window.scrollTo(0, y < 1 ? 1 : y);
			},
			'end': function(){
				(function() { window.store('moving', false); }).delay(150);
			}
		});
	}
});