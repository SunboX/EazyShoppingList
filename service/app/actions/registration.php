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