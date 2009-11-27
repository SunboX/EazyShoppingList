/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */
 
Mobile.Application.extend({
	
	config: {
		is_registered: true
	},
	
	run: function(){
		
		this.db = new Database('EasyShopList');
		
		/* create db table if not exist */
		this.db.execute('CREATE TABLE shopping_lists (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, items TEXT NOT NULL)');
		
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
	
	setCurrentList: function(id){
		this.currentListId = id.toInt();
	},
	
	getCurrentList: function(){
		return this.currentListId;
	}
});
