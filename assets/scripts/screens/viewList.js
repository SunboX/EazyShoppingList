/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var scr = new Mobile.GUI.Screen('viewList');

var db = Mobile.Application.getDB();

db.execute('SELECT id, name FROM shopping_list WHERE id = ?', [Mobile.Application.getCurrentList()], function(rs){
	
	var title = '';

	while(row = rs.next()){
		title = row.get('name');
		items = row.get('items', '').trim().split("\n");
	}
	
	db.execute('SELECT id, item, checked FROM shopping_list_item WHERE list_id = ? ORDER BY position', [Mobile.Application.getCurrentList()], function(rs){
	
		var items = [];

		while(row = rs.next()){
			items.push([row.get('id', 0), row.get('item', ''), row.get('checked') == 1]);
		}
		
		var header = new Mobile.GUI.Header({
			title: title
		});
		
		var editBtn = header.addButton(MooTools.lang.get('ESL', 'edit'));
		var backBtn = header.addButton(MooTools.lang.get('ESL', 'back'), {type: 'back'});
		
		scr.addControl(header);
		
		var shopListsList = new Mobile.GUI.List();
		
		items.each(function(item){
			var item = shopListsList.addItem(item[1], {
				id: 'list-' + item[0],
				icon: item[2] ? 'assets/images/checkbox-checked.png' : 'assets/images/checkbox.png'
			});
			item.store('checked', item[2]);
			item.addEvent('click', function(e){
				e.stop();
				this.store('checked', !this.retrieve('checked', false));
				this.setIcon(this.retrieve('checked') ? 'assets/images/checkbox-checked.png' : 'assets/images/checkbox.png');
				db.execute('UPDATE shopping_list_item SET checked = ? WHERE id = ?', [this.retrieve('checked') ? 1 : 0, this.get('id').replace(/list-/, '')]);
			});
		});
		
		scr.addControl(shopListsList);
		
		backBtn.addEvent('click', function(e){
			e.stop();
			Mobile.Application.loadLastScreen();
		});
		
		editBtn.addEvent('click', function(e){
			e.stop();
			alert('Not implemented yet!');
		});
		
		var deleteBtn = new Mobile.GUI.Button(MooTools.lang.get('ESL', 'Delete this List'));
		
		deleteBtn.addEvent('click', function(e){
			db.execute('DELETE FROM shopping_list_item WHERE list_id = ?', [Mobile.Application.getCurrentList()], function(rs){
				db.execute('DELETE FROM shopping_list WHERE id = ?', [Mobile.Application.getCurrentList()], function(rs){
					Mobile.Application.loadScreen('main');
				});
			});
		});
		
		scr.addControl(deleteBtn);
		
		Mobile.Application.showScreen(scr);
	});
});
