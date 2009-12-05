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
		$state = 0;
		if(
			isset($rd['nickname']) &&
			isset($rd['email']) &&
			isset($rd['password']) &&
			isset($rd['password-confirm'])
		)
		{
			// validate
			
			if(!preg_match('/^[A-Z0-9-_]{3,50}$/', $rd['nickname']))
			{
				$state = 1; // nickname isn't valid
			}
			else if($c->getConnection()->query(
				'SELECT id FROM user WHERE LOWER(nickname) = LOWER(' . $c->getConnection()->quote($rd['nickname']) . ') LIMIT 1'
			)->rowCount() > 0)
			{
				$state = 2; // nickname exists
			}
			else if(!preg_match('^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$', $rd['email']))
			{
				$state = 3; // email isn't valid
			}
			else if($c->getConnection()->query(
				'SELECT id FROM user WHERE LOWER(email) = LOWER(' . $c->getConnection()->quote($rd['email']) . ') LIMIT 1'
			)->rowCount() > 0)
			{
				$state = 4; // email exists
			}
			else if(!preg_match('/^.{6,50}$/', $rd['password']))
			{
				$state = 5; // password isn't valid
			}
			else
			{
				if($rd['password'] != $rd['password-confirm'])
				{
					$state = 6; // password does not match
				}
				else
				{
					// create new user
					$c->getConnection()->query('INSERT INTO user SET' .
				
						' nickname = ' . $c->getConnection()->quote($rd['nickname']) . ',' .
						' email = ' . $c->getConnection()->quote($rd['email']) . ',' .
						' password = ' . $c->getConnection()->quote($rd['password']) . ',' .
						' created = NOW()'
					);
					$state = 7;
				}
			}
		}
		$c->setAttribute('json', '{"state":' . $state . '}');
	}
	
	public function isSecure()
	{
		return false;
	}
}

?>