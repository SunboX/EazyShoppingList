/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var scr = new Mobile.GUI.Screen('viewList');

var db = Mobile.Application.getDB();

db.execute('SELECT id, name, items FROM shopping_lists WHERE id = ?', [Mobile.Application.getCurrentList()], function(rs){
	
	var title = '';
	var items = [];

	while(row = rs.next()){
		title = row.get('name');
		items = row.get('items').trim().split("\n");
	}
	
	var header = new Mobile.GUI.Header({
		title: title
	});
	
	var editBtn = header.addButton(MooTools.lang.get('ESL', 'edit'));
	var backBtn = header.addButton(MooTools.lang.get('ESL', 'back'), {type: 'back'});
	
	scr.addControl(header);
	
	var shopListsList = new Mobile.GUI.List();
	
	items.each(function(item){
		shopListsList.addItem(item);
	});
	
	scr.addControl(shopListsList);
	
	backBtn.addEvent('click', function(e){
		e.stop();
		Mobile.Application.loadLastScreen();
	});
	
	Mobile.Application.showScreen(scr);
});
