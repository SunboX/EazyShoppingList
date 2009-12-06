/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */
 
Mobile.Application.extend({
	
	version: '0.1',
	
	options: $merge(Mobile.Application.options, {}),
	
	config: {
		is_registered: false
	},
	
	run: function(){
		
		this.db = new Database('EasyShopList');
		
		/* 
		this.db.execute('DROP TABLE IF EXISTS settings');
		this.db.execute('DROP TRIGGER IF EXISTS settings_created');
		this.db.execute('DROP TRIGGER IF EXISTS settings_modified');
		this.db.execute('DROP TABLE IF EXISTS shopping_list');
		this.db.execute('DROP TRIGGER IF EXISTS shopping_list_created');
		this.db.execute('DROP TRIGGER IF EXISTS shopping_list_modified');
		this.db.execute('DROP TABLE IF EXISTS shopping_list_item');
		this.db.execute('DROP TRIGGER IF EXISTS shopping_list_item_created');
		this.db.execute('DROP TRIGGER IF EXISTS shopping_list_item_modified');
		*/
		
		/* create db table if not exist */
		this.db.execute('CREATE TABLE IF NOT EXISTS settings (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nickname TEXT NOT NULL, email TEXT NOT NULL, password TEXT NOT NULL, created TIMESTAMP, modified TIMESTAMP)');
		
		this.db.execute('CREATE TRIGGER IF NOT EXISTS settings_created AFTER INSERT ON settings FOR EACH ROW BEGIN UPDATE settings SET created = DATETIME(\'NOW\'), modified = DATETIME(\'NOW\') WHERE id = NEW.id; END'); 
		this.db.execute('CREATE TRIGGER IF NOT EXISTS settings_modified AFTER UPDATE ON settings FOR EACH ROW BEGIN UPDATE settings SET modified = DATETIME(\'NOW\') WHERE id = NEW.id; END'); 
		
		this.db.execute('CREATE TABLE IF NOT EXISTS shopping_list (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, created TIMESTAMP, modified TIMESTAMP)');
		
		this.db.execute('CREATE TRIGGER IF NOT EXISTS shopping_list_created AFTER INSERT ON shopping_list FOR EACH ROW BEGIN UPDATE shopping_list SET created = DATETIME(\'NOW\'), modified = DATETIME(\'NOW\') WHERE id = NEW.id; END'); 
		this.db.execute('CREATE TRIGGER IF NOT EXISTS shopping_list_modified AFTER UPDATE ON shopping_list FOR EACH ROW BEGIN UPDATE shopping_list SET modified = DATETIME(\'NOW\') WHERE id = NEW.id; END'); 
		
		this.db.execute('CREATE TABLE IF NOT EXISTS shopping_list_item (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, list_id INTEGER NOT NULL, checked INTEGER NOT NULL DEFAULT 0, position INTEGER NOT NULL, item TEXT NOT NULL, created TIMESTAMP, modified TIMESTAMP)');
		
		this.db.execute('CREATE TRIGGER IF NOT EXISTS shopping_list_item_created AFTER INSERT ON shopping_list_item FOR EACH ROW BEGIN UPDATE shopping_list_item SET created = DATETIME(\'NOW\'), modified = DATETIME(\'NOW\') WHERE id = NEW.id; END'); 
		this.db.execute('CREATE TRIGGER IF NOT EXISTS shopping_list_item_modified AFTER UPDATE ON shopping_list_item FOR EACH ROW BEGIN UPDATE shopping_list_item SET modified = DATETIME(\'NOW\') WHERE id = NEW.id; END'); 
		
		
		this.fireEvent('startUp');
	},
	
	isRegistered: function(){
		return this.config.is_registered;
	},
	
	getDB: function(){
		return this.db;
	},
	
	getCurrentListId: function(){
		return this.currentScreen.parameters.id;
	}
});
