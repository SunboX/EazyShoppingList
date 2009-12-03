/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var Mobile = Mobile || {};
 
Mobile.Routing = {
 	
	regex: /^(\w+):+([\w=:]+)*$/,
    
    gen: function(name, direction, parameters){
        var ret = name + ':';
		hash = new Hash(parameters);
		hash.each(function(v, k){
			ret += ':' + escape(k) + '=' + escape(v); 
    	});
		ret += ':' + direction;
		return ret;
    },
    
    parse: function(str){
		var ret = {name: '', direction: '', parameters: {}};
        match = str.match(this.regex);
		if(match == null || match.lenth < 2)  return ret;
        ret.name = match[1];
		if(!$chk(match[2]))  return ret;
        match[2].split(':').each(function(param){
            var kv = param.split('=');
			if(kv.length == 2)
            	ret.parameters[kv[0]] = kv[1];
			else if(kv.length = 1)
				ret.direction = kv[0];
        });
        return ret;
    }
};