<?
/**
 * EazyShoppingList Service Application
 *
 * @author     Dipl.-Ing. (FH) André Fiedler <kontakt at visualdrugs dot net>
 * @link       http://github.com/SunboX/EazyShoppingList
 * @copyright  2007 - 2009 André Fiedler.
 * @license    http://creativecommons.org/licenses/by-nc-nd/3.0/
 * @version    0.1
 */
 
class CompileScripts_Action implements IContentAdictedAction
{
	public function execute($c, $rd)
	{
		$scripts = array(
		    'assets/scripts/mootools-core.js',
			'assets/scripts/mootools-more.js',
		    'assets/scripts/Database.js',
		    'assets/scripts/History.js',
		    'assets/scripts/History.Routing.js',
		    'assets/scripts/Touch.js',
		    'assets/scripts/Touch.WindowScroller.js',
		    'assets/scripts/Mobile.Request.js',
		    'assets/scripts/Mobile.Routing.js',
		    'assets/scripts/Mobile.Application.js',
		    'assets/scripts/Mobile.GUI.js',
		    'assets/scripts/EazyShoppingList.Application.js',
		    'assets/scripts/main.js'
		);
		
		if(ContentAdicted::get('core.debug', false))
		{
			$code = '';
			foreach($scripts as $script)
			{
				$code .= file_get_contents(dirname(__FILE__) . '/../../../' . $script) . "\n";
			}
			$c->setAttribute('compiledCode', $code);
			return '';
		}
		
		$code_url = '';
		$cachename = '';
		foreach($scripts as $script)
		{
			$cachename .= filemtime(dirname(__FILE__) . '/../../../' . $script);
			$code_url .= '&code_url=' . urlencode(ContentAdicted::get('core.document_root') . $script);
		}
		$cachename = dirname(__FILE__) . '/../cache/' . md5($cachename) . '.js';
		
		if(is_readable($cachename))
		{
			$c->setAttribute('compiledCode', file_get_contents($cachename));
			return '';
		}
		
		$ch = curl_init('http://closure-compiler.appspot.com/compile');
 
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, 'output_format=xml&output_info=compiled_code&output_info=warnings&output_info=errors&output_info=statistics&compilation_level=SIMPLE_OPTIMIZATIONS&warning_level=default' . $code_url);
		$xml = curl_exec($ch);
		curl_close($ch);
		
		$doc = new DOMDocument();
		$doc->loadXML($xml);
		
		$xpath = new DOMXpath($doc);
		$elements = $xpath->query('/compilationResult/compiledCode');
		
		$script = $elements->item(0)->nodeValue;
		
		file_put_contents($cachename, $script);
		
		$c->setAttribute('compiledCode', $script);
	}
	
	public function isSecure()
	{
		return false;
	}
}

?>