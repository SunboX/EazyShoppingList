/*
	Script: Database.js
	  
	Copyright:
	  Copyright (c) 2009 Dipl.-Ing. (FH) André Fiedler <kontakt@visualdrugs.net>
	  
	License:
	  MIT-style license
	  
	Version
	  0.9
*/

window.addEvent('domready', function(){
	window.Browser = $merge({
	
		Database: {name: window.openDatabase ? 'html5' : (function(){
			if (window.google && google.gears) return 'gears';
			
			// Sets up google.gears
			var factory = null;
			
			// Firefox
			if ($type(GearsFactory) != 'undefined') factory = new GearsFactory();
			else {
				if(Browser.Engines.trident) {
					// IE
					factory = new ActiveXObject('Gears.Factory');
					// privateSetGlobalObject is only required and supported on IE Mobile on WinCE.
					if (factory.getBuildInfo().indexOf('ie_mobile') != -1) factory.privateSetGlobalObject(this);
				} else {
					// Safari
					if ($type(navigator.mimeTypes) != 'undefined' && navigator.mimeTypes['application/x-googlegears']) {
						factory = new Element('object', {
							style: { display: 'none' },
							width: 0,
							height: 0,
							type: 'application/x-googlegears'
						}).inject(document.body);
					}
				}
			}
			
			if (!factory) return 'unknown';
			
			if (!window.google) google = {};
			if (!google.gears) google.gears = { factory: factory };
			
			return 'gears';
		}.bind(window))()}
	
	}, window.Browser || {});
})

var Database = new Class({
    
    initialize: function(name){
		if (Browser.Database.name == 'unknown') {
			if(confirm('No valid database found! Installing Google Gears Database instead?'))
			{
				new URI('http://gears.google.com/?action=install&message=&return=' + new URI(document.location.href).toAbsolute().toString()).go();
			}
			return;
		}
		
		this.html5 = Browser.Database.name == 'html5';
		
		if(this.html5)
			this.db = openDatabase(name, '1.0', '', 65536);
		else{
			this.db = google.gears.factory.create('beta.database');
			this.db.open(name);
		}
	},
	
	execute: function(sql, values, callback, errorCallback){
		values = values || [];
		if(this.html5)
			this.db.transaction(function (transaction) {
				transaction.executeSql(sql, values, function(transaction, rs){
					if(callback)
						callback(new Database.ResultSet(rs, this));
				}, errorCallback);
			});
		else
			if(callback)
				callback(new Database.ResultSet(this.db.execute(sql, values), this.db));

			else
				this.db.execute(sql, values);
	},
	
	close: function(){
		this.db.close();
	}
});

Database.ResultSet = new Class({
	
	initialize: function(rs, db){
		this.html5 = Browser.Database.name == 'html5';
		this.db = db;
		this.rs = rs;
		this.index = 0;
		
		if(!this.html5)
			this.gearsInsertId = this.db.lastInsertRowId + 0;
	},
	
	next: function(){
		var row = null;
		
		if(this.html5 && this.index < this.rs.rows.length){
			row = new Database.ResultSet.Row(this.rs.rows.item(this.index++));
		}
		else if(!this.html5){
			if(this.index > 0)
				this.rs.next();
			if (this.rs.isValidRow()) {
				row = new Database.ResultSet.Row(this.rs);
				this.index++;
			}
		}
		return row;
	},
	
	lastInsertId: function(){
		if(this.html5)
			return this.rs.insertId;
			
		return this.gearsInsertId;
	}
});

Database.ResultSet.Row = new Class({
	
	initialize: function(row){
		this.html5 = Browser.Database.name == 'html5';
		this.row = row;
	},
	
	get: function(index, defaultValue){
		var col = null;
		
		if (this.html5) 
			col = this.row[index];
		else {
			var i = 0;
			while (i < this.row.fieldCount()) {
				if (this.row.fieldName(i) == index) {
					col = this.row.field(i);
					break;
				}
				i++;
			}
		}
		return col || defaultValue;
	}
});