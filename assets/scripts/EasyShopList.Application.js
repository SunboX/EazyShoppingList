/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */
 
Mobile.Application.extend({
	
	options: $merge(Mobile.Application.options, {}),
	
	config: {
		is_registered: true
	},
	
	run: function(){
		
		this.db = new Database('EasyShopList');
		
		/* create db table if not exist */
		this.db.execute('CREATE TABLE IF NOT EXISTS shopping_list (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)');
		this.db.execute('CREATE TABLE IF NOT EXISTS shopping_list_item (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, list_id INTEGER NOT NULL, checked INTEGER NOT NULL DEFAULT 0, position INTEGER NOT NULL, item TEXT NOT NULL)');
		
		if(this.config.is_registered){
			this.fireEvent('startUp');
		} else {
			this.fireEvent('notRegistered');
		}
	},
	
	isRegistered: function(){
		return this.config.is_registered;
	},
	
	getDB: function(){
		return this.db;
	},
	
	getCurrentList: function(){
		return this.currentScreen.parameters.id;
	}
});
