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
	Mobile.Application.loadScreen('main', 'ltr');
});

var form = new Mobile.GUI.Form();

var nameField = form.addTextfield('name', MooTools.lang.get('ESL', 'listName'));
var itemsField = form.addTextarea('items', MooTools.lang.get('ESL', 'listContentMsg'));

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
		var inserted = 0;
		var items = itemsField.get('value', '').trim().split("\n");
		
		db.execute('INSERT INTO shopping_list (name) VALUES (?)', [nameField.get('value')], function(rs){
			var listId = db.lastInsertId();
			items.each(function(item, i){
				db.execute('INSERT INTO shopping_list_item (item, position, list_id) VALUES (?, ?, ?)', [item, i, listId], function(){
					if((++inserted) == items.length)
						Mobile.Application.loadScreen('main', 'ltr');
				});
			});
		});
	}
});

scr.addControl(form);

Mobile.Application.showScreen(scr);
