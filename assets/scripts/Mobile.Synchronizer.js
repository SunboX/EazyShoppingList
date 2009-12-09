/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

/*
 * Each db table must specify a "id", "global_id" and "modified" column
 */

var Mobile = Mobile || {};
 
Mobile.Synchronizer = new Class({
	
	Implements: Otions,
	
	options: {
		synchronizeInterval: 10000
	},
 	
	initialize: function(localDB, tablesAndFields, backendUrl, options){
		this.setOptions(options);
		this.db = localDB;
		this.tablesAndFields = tablesAndFields;
		this.request = new Request.JSON({
			url: backendUrl,
			onSuccess: function(globalToLocal){
				var tables = new Hash(globalToLocal.tables);
				tables.each(function(ds, table){
					this.db.execute('UPDATE ' + table + ' (global_id) VALUES (?) WHERE id = ?', [ds.global_id, ds.local_id]);
				}.bind(this));
				this.setLastSyncTime($time());
			}.bind(this)
		});
		
		this.pushData = {
			userID: 0,
			userPass: '',
			tables: {}
		};
		
		this.db.execute('CREATE TABLE IF NOT EXISTS Synchronizer (last_sync_time INTEGER NOT NULL)');
		
		this.lastSyncTime = 0;
		this.db.execute('SELECT last_sync_time FROM Synchronizer', null, function(rs){
			while(row = rs.next())
				this.lastSyncTime = row.get('last_sync_time').toInt();
			this.run();
		}.bind(this));
	},
	
	run: function(){
		this.synchronize();
	},
	
	synchronize: function(){
		this.push();
	},
	
	push: function(){
		this.tablesAndFields.each(function(columns, table){
			this.db.execute('SELECT ' + columns.join(', ') + ' FROM ' + table + ' WHERE modified > ' + this.lastSyncTime, null, function(rs){
				var ds = [];
				while (row = rs.next()) {
					var d = {};
					columns.each(function(column){
						d[column] = row.get(column);
					}.bind(this));
					ds.push(d);
				}
				pushData.tables[table] = ds;
			}.bind(this));
		}.bind(this));
		this.request.post(pushData);
	},
	
	pull: function(){
		
	}
});

var tablesAndFields = new Hash({
	'settings': [
		'id',
		'global_id',
		'nickname',
		'email',
		'password',
		'created',
		'modified'
	],
	'shopping_list': [
		'id',
		'global_id',
		'name',
		'created',
		'modified'
	],
	'shopping_list_item': [
		'id',
		'global_id',
		'list_id',
		'checked',
		'position',
		'created',
		'modified'
	]
});
