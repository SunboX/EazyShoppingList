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

class ContentAdictedUser
{
	public function __construct()
	{
		session_name(ContentAdicted::get('core.session_name', 'SID'));
		$rd = array_merge($_POST, $_GET);
		if(isset($rd[ContentAdicted::get('core.session_name', 'SID')]))
			session_id($rd[ContentAdicted::get('core.session_name', 'SID')]);
		@session_start();

		if(!is_array($_SESSION['core.user.messages.success']))
			$_SESSION['core.user.messages.success'] = array();
		if(!is_array($_SESSION['core.user.messages.error']))
			$_SESSION['core.user.messages.error'] = array();
	}
	
	public function __call($name, $arguments)
	{
		if(isset($_SESSION['core.user.model'][$name])) 
			return $_SESSION['core.user.model'][$name];
		return false;
	}
	
	public function login($user, $pass)
	{
		$conn = ContentAdicted::get('core.database')->getConnection();
		
		$rs = $conn->query('SELECT * FROM content_adicted_user WHERE username = ' . $conn->quote($user) . ' LIMIT 1 ;');
			
		$user = $rs->fetch(PDO::FETCH_ASSOC);
			
		if($user && $user['password_md5'] == md5($pass))
		{
			$this->hydrate($user);
			
			$conn->query('
				UPDATE content_adicted_user SET
					last_login = ' . time() . ',
					logins = ' . ($user['logins'] + 1) . '
					
				WHERE id = ' . $user['id']
			);
			$this->setAuthenticated(true);
		}
		return $this->isAuthenticated();
	}
	
	public function logout()
	{
		unset($_SESSION['core.user.authenticated']);
		unset($_SESSION['core.user.model']);
	}
	
	public function isAuthenticated()
	{
		return isset($_SESSION['core.user.authenticated']) && $_SESSION['core.user.authenticated'] === true;
	}
	
	public function setAuthenticated($authenticated)
	{
		$_SESSION['core.user.authenticated'] = $authenticated;
	}
	
	public static function setMessage($msg, $type = 'success')
	{
		if(!preg_match('/success|error/', $type))
			throw new Exception('No valid message type. Found "' . $type . '" must be one of "success" or "error".');
		$_SESSION['core.user.messages.' . $type][] = $msg;
	}
	
	public static function getMessages($type = false)
	{
		$msgs = array();
		if($type === false)
		{
			$msgs = array_merge($_SESSION['core.user.messages.success'], $_SESSION['core.user.messages.error']);
			$_SESSION['core.user.messages.success'] = array();
			$_SESSION['core.user.messages.error'] = array();
		}
		else
		{
			$msgs = $_SESSION['core.user.messages.' . $type];
			$_SESSION['core.user.messages.' . $type] = array();
		}
		return $msgs;
	}
	
	public static function hasMessages($type = false)
	{
		if($type === false)
		{
			return count($_SESSION['core.user.messages.success']) + count($_SESSION['core.user.messages.error']) > 0;
		}
		return count($_SESSION['core.user.messages.' . $type]) > 0;
	}
	
	public function hydrate($model)
	{
		$_SESSION['core.user.model'] = $model;
	}
}

?>