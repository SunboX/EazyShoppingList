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
			
			// Copyright 2007, Google Inc.
			//
			// Redistribution and use in source and binary forms, with or without
			// modification, are permitted provided that the following conditions are met:
			//
			//  1. Redistributions of source code must retain the above copyright notice,
			//     this list of conditions and the following disclaimer.
			//  2. Redistributions in binary form must reproduce the above copyright notice,
			//     this list of conditions and the following disclaimer in the documentation
			//     and/or other materials provided with the distribution.
			//  3. Neither the name of Google Inc. nor the names of its contributors may be
			//     used to endorse or promote products derived from this software without
			//     specific prior written permission.
			//
			// THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR IMPLIED
			// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
			// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
			// EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
			// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
			// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
			// OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
			// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
			// OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
			// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
			//
			// Sets up google.gears.*, which is *the only* supported way to access Gears.
			//
			// Circumvent this file at your own risk!
			//
			// In the future, Gears may automatically define google.gears.* without this
			// file. Gears may use these objects to transparently fix bugs and compatibility
			// issues. Applications that use the code below will continue to work seamlessly
			// when that happens.
			
			(function() {
			  // We are already defined. Hooray!
			  if (window.google && google.gears) {
			    return;
			  }
			
			  var factory = null;
			
			  // Firefox
			  if (typeof GearsFactory != 'undefined') {
			    factory = new GearsFactory();
			  } else {
			    // IE
			    try {
			      factory = new ActiveXObject('Gears.Factory');
			      // privateSetGlobalObject is only required and supported on IE Mobile on
			      // WinCE.
			      if (factory.getBuildInfo().indexOf('ie_mobile') != -1) {
			        factory.privateSetGlobalObject(this);
			      }
			    } catch (e) {
			      // Safari
			      if ((typeof navigator.mimeTypes != 'undefined')
			           && navigator.mimeTypes["application/x-googlegears"]) {
			        factory = document.createElement("object");
			        factory.style.display = "none";
			        factory.width = 0;
			        factory.height = 0;
			        factory.type = "application/x-googlegears";
			        document.documentElement.appendChild(factory);
			      }
			    }
			  }
			
			  // *Do not* define any objects if Gears is not installed. This mimics the
			  // behavior of Gears defining the objects in the future.
			  if (!factory) {
			    return;
			  }
			
			  // Now set up the objects, being careful not to overwrite anything.
			  //
			  // Note: In Internet Explorer for Windows Mobile, you can't add properties to
			  // the window object. However, global objects are automatically added as
			  // properties of the window object in all browsers.
			  if (!window.google) {
			    google = {};
			  }
			
			  if (!google.gears) {
			    google.gears = {factory: factory};
			  }
			})();
			
			return window.google && google.gears ? 'gears' : 'unknown';
		})()}
	
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
		
		if(this.html5)
			this.lastInsertedId = this.rs.insertId + 0;
		else
			this.lastInsertedId = this.db.lastInsertRowId + 0;
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
		return this.lastInsertedId;
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