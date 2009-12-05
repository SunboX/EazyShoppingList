<?
/**
 * content adicted CMS
 *
 * @author     André Fiedler <kontakt at visualdrugs dot net>
 * @link       http://github.com/SunboX/content-adicted/tree
 * @copyright  2007 - 2009 André Fiedler.
 * @license    MIT License
 * @version    2.0
 */
 
class Registration_Action implements IContentAdictedAction
{
	public function execute($c, $rd)
	{
		$c->setAttribute('json', '{"error":0,"message":"invalid"}');
	}
	
	public function isSecure()
	{
		return false;
	}
}

?>