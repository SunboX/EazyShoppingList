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
		var ret = {name: '', parameters: {}};
        match = str.match(this.regex);
		if(match == null || match.lenth < 2)  return ret;
        ret.name = match[1];
		if(!$chk(match[2]))  return ret;
        match[2].split(':').each(function(param){
            var kv = param.split('=');
            ret.parameters[kv[0]] = kv[1];
        });
        return ret;
    }
};