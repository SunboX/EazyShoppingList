<?
/**
 * content adicted nano Framework
 *
 * @author     André Fiedler <kontakt at visualdrugs dot net>
 * @link       http://github.com/SunboX/content-adicted/tree
 * @copyright  2007 - 2009 André Fiedler.
 * @license    MIT License
 * @version    1.0
 */

class ContentAdictedDatabase
{
	protected $conn = null;
	
	protected function connect()
	{
		$this->conn = new PDO(
			ContentAdicted::get('core.database.dns'),
			ContentAdicted::get('core.database.username'),
			ContentAdicted::get('core.database.password'),
			ContentAdicted::get('core.database.options')
		);
		$attributes = ContentAdicted::get('core.database.attributes', array(
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
		));
		foreach($attributes as $key => $value)
		{
			$this->conn->setAttribute($key, $value);
		}
		return $this->conn;
	}
	
	public function getConnection()
	{
		return $this->conn === null ? $this->connect() : $this->conn;
	}
}
?>