/*
	Script: Database.js
	  
	Copyright:
	  Copyright (c) 2009 Dipl.-Ing. (FH) André Fiedler <kontakt@visualdrugs.net>
	  
	License:
	  MIT-style license
	  
	Version
	  0.9
*/

var Browser = $merge({

	Database: {name: window.openDatabase ? 'whatwg' : (window.google && window.google.gears ? 'gears' : 'unknown')}

}, Browser || {});

var Database = new Class({
    
    initialize: function(name){
		if (Browser.Database.name == 'unknown') {
			alert('No valid Database found!');
			return;
		}
		
		this.whatwg = Browser.Database.name == 'whatwg';
		
		if(this.whatwg)
			this.db = openDatabase(name, '1.0', '', 65536);
		else{
			this.db = google.gears.factory.create('beta.database');
			this.db.open(name);
		}
	},
	
	execute: function(sql, values, callback){
		if(this.whatwg)
			this.db.transaction(function (transaction) {
				transaction.executeSql(sql, (values || []), function(transaction, rs){
					if(callback)
						callback(new Database.ResultSet(rs));
				}, function(){});
			});
		else
			if(callback)
				callback(new Database.ResultSet(this.db.execute(sql)));
			else
				this.db.execute(sql);
	},
	
	close: function(){
		this.db.close();
	}
});

Database.ResultSet = new Class({
	
	initialize: function(rs){
		this.whatwg = Browser.Database.name == 'whatwg';
		this.rs = rs;
		this.index = 0;
	},
	
	next: function(){
		var row = null;
		
		if(this.whatwg && this.index < this.rs.rows.length){
			row = new Database.ResultSet.Row(this.rs.rows.item(this.index++));
		}
		else if(!this.whatwg && this.rs.isValidRow()){
			row = new Database.ResultSet.Row(this.rs);
			this.rs.next();
			this.index++;
		}
		return row;
	}
});

Database.ResultSet.Row = new Class({
	
	initialize: function(row){
		this.whatwg = Browser.Database.name == 'whatwg';
		this.row = row;
	},
	
	get: function(index){
		var col = null;
		
		if(this.whatwg)
			return this.row[index];
		
		return this.row.field(index);
	}
});