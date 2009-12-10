/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var scr = new Mobile.GUI.Screen('main');

var header = new Mobile.GUI.Header({
	title: MooTools.lang.get('ESL', 'yourLists')
});

var settingsBtn = header.addButton(MooTools.lang.get('ESL', 'settings'), { type: 'left' });
var newBtn = header.addButton(MooTools.lang.get('ESL', 'new'));

settingsBtn.addEvent('click', function(e){
	e.stop();
	if(Mobile.Application.isRegistered()){
		
	} else {
		if(confirm(MooTools.lang.get('ESL', 'You have to signup first. Signup now?')))
			Mobile.Application.loadScreen('signUp', 'ltr');
	}
});

scr.addControl(header);

var shopListsList = new Mobile.GUI.List();

var db = Mobile.Application.getDB();

db.execute('SELECT id, name FROM shopping_list', {
	onComplete: function(rs){
		while (row = rs.next()) {
			var item = shopListsList.addItem(row.get('name'), {
				type: 'arrow',
				id: 'list-' + row.get('id')
			});
			item.addEvent('click', function(e){
				Mobile.Application.loadScreen('viewList', 'rtl', {
					id: this.get('id').replace(/list-/, '')
				});
			});
		}
		
		if (shopListsList.length > 0) 
			scr.addControl(shopListsList);
		
		newBtn.addEvent('click', function(e){
			e.stop();
			Mobile.Application.loadScreen('newList', 'rtl');
		});
		
		Mobile.Application.showScreen(scr);
	}
});
