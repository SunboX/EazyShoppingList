/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var scr = new Mobile.GUI.Screen('newList');

var header = new Mobile.GUI.Header({
	title: MooTools.lang.get('ESL', 'newList')
});
scr.addControl(header);

var doneBtn = header.addButton(MooTools.lang.get('ESL', 'done'), {type: 'action'});
var backBtn = header.addButton(MooTools.lang.get('ESL', 'back'), {type: 'back'});

scr.addControl(header);

backBtn.addEvent('click', function(e){
	e.stop();
	Mobile.Application.loadLastScreen();
});

var form = new Mobile.GUI.Form();

var nameField = form.addTextfield('name', MooTools.lang.get('ESL', 'listName'));
var itemsField = form.addTextarea('items', MooTools.lang.get('ESL', 'newListContentMsg'));

doneBtn.addEvent('click', function(e){
	e.stop();
	
	var done = true;
	
	if (nameField.isEmpty()) {
		nameField.setError();
		done = false;
	}
	
	if (itemsField.isEmpty()) {
		itemsField.setError();
		done = false;
	}
	
	if (done) {
		var db = Mobile.Application.getDB();
		
		db.execute('INSERT INTO shopping_lists (name, items) VALUES (?, ?)', [nameField.get('value'), itemsField.get('value')]);
		
		Mobile.Application.loadScreen('main');
	}
});

scr.addControl(form);

Mobile.Application.showScreen(scr);
