/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var scr = new Mobile.GUI.Screen('main');

var header = new Mobile.GUI.Header({
	title: MooTools.lang.get('ESL', 'yourLists')
});

var newBtn = header.addButton(MooTools.lang.get('ESL', 'new'));

scr.addControl(header);

var shopListsList = new Mobile.GUI.List();

var db = Mobile.Application.getDB();
		
db.execute('SELECT id, name, items FROM shopping_lists', null, function(rs){
	while(row = rs.next()){
		shopListsList.addItem(row.get('name'));
	}
});

scr.addControl(shopListsList);

newBtn.addEvent('click', function(e){
	e.stop();
	Mobile.Application.loadScreen('newList');
});

Mobile.Application.showScreen(scr);
