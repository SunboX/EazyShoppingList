/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var scr = new Mobile.GUI.Screen('viewList');

var db = Mobile.Application.getDB();

db.execute('SELECT name FROM shopping_list WHERE id = ?', [Mobile.Application.getCurrentListId()], function(rs){
	
	var title = '';

	while(row = rs.next()){
		title = row.get('name');
	}
	
	db.execute('SELECT id, item, checked FROM shopping_list_item WHERE list_id = ? ORDER BY position', [Mobile.Application.getCurrentListId()], function(rs){
	
		var items = [];

		while(row = rs.next()){
			items.push([row.get('id', 0), row.get('item', ''), row.get('checked')]);
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
			Mobile.Application.loadScreen('main', 'ltr');
		});
		
		editBtn.addEvent('click', function(e){
			e.stop();
			Mobile.Application.loadScreen('editList', 'rtl', {
				id: Mobile.Application.getCurrentListId()
			});
		});
		
		var deleteBtn = new Mobile.GUI.Button(MooTools.lang.get('ESL', 'Delete this List'), {type: 'red'});
		
		deleteBtn.addEvent('click', function(e){
			db.execute('DELETE FROM shopping_list_item WHERE list_id = ?', [Mobile.Application.getCurrentListId()], function(rs){
				db.execute('DELETE FROM shopping_list WHERE id = ?', [Mobile.Application.getCurrentListId()], function(rs){
					Mobile.Application.loadScreen('main', 'ltr');
				});
			});
		});
		
		scr.addControl(deleteBtn);
		
		Mobile.Application.showScreen(scr);
	});
});
