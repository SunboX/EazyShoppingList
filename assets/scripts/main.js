/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

window.addEvent('domready', function(){
	
	var app = new iPhone.Application(document.body);
	
	var header = new iPhone.GUI.Header({
		title: MooTools.lang.get('ESL', 'yourLists')
	});
	
	var newBtn = header.addButton(MooTools.lang.get('ESL', 'newList'))
	
	app.addControl(header);
	
	var shopListsList = new iPhone.GUI.List();
	
	shopListsList.addItem('test 1');
	shopListsList.addItem('test 2');
	shopListsList.addItem('test 3');
	shopListsList.addItem('test 4');
	
	app.addControl(shopListsList);
	
	newBtn.addEvent('click', function(e){
		e.stop();
		alert('New List!');
	});
});
