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

require_once('lib/Tyke.php');
require_once('ContentAdictedUser.php');
require_once('ContentAdictedDatabase.php');


class ContentAdicted extends TykeC
{
	protected $layoutTemplate = 'app/views/baseTemplate.php';
	public $template = array();

	public static function bootstrap($environment = 'production')
	{
		if($environment == 'development')
		{
			// debug enables display-errors and exception page
			Tyke::set('core.debug', true);
		}
		
		self::set('core.environment', $environment);
		
		$db_cls = self::get('core.factories.database', 'ContentAdictedDatabase');
		$user_cls = self::get('core.factories.user', 'ContentAdictedUser');
		self::set('core.database', new $db_cls());
		self::set('core.user', new $user_cls());
	}
	
	public function __call($name, $params)
	{
		$cls_name = preg_replace('/\s/', '', ucwords(preg_replace('/[_\-\s]+/', ' ', $name))) . '_Action';
		
		if(!class_exists($cls_name, true))
		{
			if(!is_readable('app/actions/' . $name . '.php'))
			{
				throw new Exception('ClassFile "app/actions/' . $name . '.php" Not Found');
			}
			
			include('app/actions/' . $name . '.php');
			
			if(!class_exists($cls_name, true))
			{
				throw new Exception('Action "' . $cls_name . '" Not Found');
			}
			$cls = new $cls_name();
			
			if($cls instanceof IContentAdictedAction)
			{
				if($cls->isSecure() && !$this->get('core.user')->isAuthenticated() && $name != self::get('core.routing.login', 'login'))
				{
					self::redirect(self::get('core.routing.login', 'login'), true);
				}
				$cls->execute($this, $_REQUEST);
			}
			else
			{
				throw new Exception('Action "' . $cls_name . '" must be implementing IContentAdictedAction');
			}
		}
		
		$this->layout = $this->get('core.layout', true);
		
		$this->render('app/views/' . $name . '.php');
		
		return true;
	}
	
	public static function register($pattern, $function = 'index', $options = array())
	{
		if(is_array($pattern))
		{
			foreach($pattern as $key => $value)
			{
				if(is_string($value)) $value = array('ContentAdicted', $value);
				Tyke::register($key, $value);
			}
		} 
		else 
		{
			Tyke::register($key, array('ContentAdicted', $value));
		}
	}
	
	public function forward($method = 'index', $params = array())
	{
		parent::forward(array('ContentAdicted', $method), $params);
	}
	
	public static function set($name, $value = null)
	{
		Tyke::set($name, $value);
	}
	
	public static function get($name, $default = null)
	{
		return Tyke::get($name, $default);
	}
	
	public function setAttribute($name, $value)
	{
		$this->template[$name] = $value;
	}
	
	public function getAttribute($name, $default = null)
	{
		return isset($this->template[$name]) ? $this->template[$name] : $default;
	}
	
	public function hasAttribute($name)
	{
		return isset($this->template[$name]) && !empty($this->template[$name]);
	}
	
	public static function getConnection()
	{
		return self::get('core.database')->getConnection();
	}
	
	public function getUser()
	{
		return $this->get('core.user');
	}
	
	public static function dispatch()
	{
	 	Tyke::run();
	}
}

interface IContentAdictedAction
{
	public function execute($controller, $rd);
	public function isSecure();
}

?>