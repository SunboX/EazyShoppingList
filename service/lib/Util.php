<?
/**
 * content adicted CMS
 *
 * @author 	   André Fiedler <kontakt at visualdrugs dot net>
 * @link 	   http://www.visualdrugs.net/
 * @copyright  2007 - 2009 André Fiedler.
 * @license    MIT License
 * @version    1.1
 */

class Util
{	
	static function wordcut($sText, $iMaxLength, $sMessage)
	{
		if (strlen($sText) > $iMaxLength)
		{
			$sString = wordwrap($sText, ($iMaxLength-strlen($sMessage)), '[cut]', 1);
			$asExplodedString = explode('[cut]', $sString);

			$sCutText = $asExplodedString[0];

			$sReturn = $sCutText.$sMessage;
		}
		else
		{
			$sReturn = $sText;
		}

		return $sReturn;
	}
	
	static function urlcut($url)
	{
		$parsed = parse_url($url);
		
		if(!empty($parsed['path'])) $parsed['path'] = '...';
		
		$uri = isset($parsed['scheme']) ? $parsed['scheme'].':'.((strtolower($parsed['scheme']) == 'mailto') ? '':'//'): '';
        $uri .= isset($parsed['user']) ? $parsed['user'].($parsed['pass']? ':'.$parsed['pass']:'').'@':'';
        $uri .= isset($parsed['host']) ? $parsed['host'] : '';
        $uri .= isset($parsed['port']) ? ':'.$parsed['port'] : '';
        $uri .= isset($parsed['path']) ? $parsed['path'] : '';
        $uri .= isset($parsed['query']) ? '?'.$parsed['query'] : '';
        $uri .= isset($parsed['fragment']) ? '#'.$parsed['fragment'] : '';
    	
		return $uri;
	}
	
	static function get_max_upload_file_size()
	{
		if(!$filesize = ini_get('upload_max_filesize'))
		{
			$filesize = '5M';
		}
		$minimumsize = self::get_real_size($filesize);
		
		if($postsize = ini_get('post_max_size'))
		{
			$postsize = self::get_real_size($postsize);
			if($postsize < $minimumsize)
			{
				$minimumsize = $postsize;
			}
		}
		return $minimumsize;
	}

	static function get_real_size($size)
	{
		$scan = array();
		$scan['MB'] = 1048576;
		$scan['Mb'] = 1048576;
		$scan['M'] = 1048576;
		$scan['m'] = 1048576;
		$scan['KB'] = 1024;
		$scan['Kb'] = 1024;
		$scan['K'] = 1024;
		$scan['k'] = 1024;
		
		while(list($key) = each($scan))
		{
			if((strlen($size) > strlen($key)) && (substr($size, strlen($size) - strlen($key)) == $key))
			{
				$size = substr($size, 0, strlen($size) - strlen($key)) * $scan[$key];
				break;
			}
		}
		return $size;
	}
	
	static function get_size_formated($size)
	{
		if(!$size) return '0';
		$format = array('B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB');
		$n = floor(log($size) / log(1024));
		return $n ? number_format($size / pow(1024, $n), 2, ',', '.') . ' ' . $format[$n] : '0 B';
	}
}

?>