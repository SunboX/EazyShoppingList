/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var Mobile = Mobile || {};
 
Mobile.Routing = {
 	
	regex: /^(\w+):+([\w=:]+)*$/,
    
    gen: function(name, parameters){
        var ret = name + ':';
		hash = new Hash(parameters);
		hash.each(function(v, k){
			ret += ':' + escape(k) + '=' + escape(v); 
    	});
		return ret;
    },
    
    parse: function(str){
        match = str.match(this.regex);
		if(match == null || match.lenth < 2)  return {name: '', parameters: {}};
        var name = match[1];
		if(!$chk(match[2]))  return {name: name, parameters: {}};
        var params = {};
        match[2].split(':').each(function(param){
            var kv = param.split('=');
            params[kv[0]] = kv[1];
        });
        return {name: name, parameters: params};
    }
};