/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var scr = new Mobile.GUI.Screen('editList');

var db = Mobile.Application.getDB();

db.execute('SELECT id, name FROM shopping_list WHERE id = ?', [Mobile.Application.getCurrentListId()], function(rs){

	var title = '';

	while(row = rs.next()){
		title = row.get('name');
	}
	
	db.execute('SELECT id, item, checked FROM shopping_list_item WHERE list_id = ? ORDER BY position', [Mobile.Application.getCurrentListId()], function(rs){
	
		var itemsTemp = [];
		var itemsContent = '';

		while(row = rs.next()){
			itemsTemp.push([row.get('id', 0), row.get('item', ''), row.get('checked') == 1]);
			itemsContent += row.get('item', '') + "\n";
		}
		
		var header = new Mobile.GUI.Header({
			title: MooTools.lang.get('ESL', 'editList')
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
		
		var nameField = form.addTextfield('name', MooTools.lang.get('ESL', 'listName'), { value: title });
		var itemsField = form.addTextarea('items', MooTools.lang.get('ESL', 'listContentMsg'), { value: itemsContent });
		
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
				db.execute('DELETE FROM shopping_list_item WHERE list_id = ?', [Mobile.Application.getCurrentListId()]);
		
				var inserted = 0;
				var items = itemsField.get('value', '').trim().split("\n");
				
				db.execute('UPDATE shopping_list SET name = ? WHERE id = ?', [nameField.get('value'), Mobile.Application.getCurrentListId()], function(rs){
					items.each(function(item, i){
						var checked = 0;
						itemsTemp.each(function(itemTemp){
							if(item == itemTemp[1])
								checked = itemTemp[2] ? 1 : 0;
						});
						db.execute('INSERT INTO shopping_list_item (item, position, checked, list_id) VALUES (?, ?, ?, ?)', [item, i, checked, Mobile.Application.getCurrentListId()], function(){
							if((++inserted) == items.length)
								Mobile.Application.loadScreen('viewList', 'prev', {
									id: Mobile.Application.getCurrentListId()
								});
						});
					});
				});
			}
		});
		
		scr.addControl(form);
		
		Mobile.Application.showScreen(scr);
	});
});
