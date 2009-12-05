<?php
/**
 * EazyShoppingList Service Application
 *
 * @author     Dipl.-Ing. (FH) André Fiedler <kontakt at visualdrugs dot net>
 * @link       http://github.com/SunboX/EazyShoppingList
 * @copyright  2007 - 2009 André Fiedler.
 * @license    http://creativecommons.org/licenses/by-nc-nd/3.0/
 * @version    0.1
 */

require_once('lib/ContentAdicted.php');
require_once('lib/Util.php');

ContentAdicted::set(array(
	'core.database.dns' => 'sqlite:./app/data/esl.s3db',
	'core.database.username' => '',
	'core.database.password' => ''
));

ContentAdicted::bootstrap('development');
//ContentAdicted::bootstrap('production');

ContentAdicted::register(array(
	'/sign-up/' => 'sign-up'
));

ContentAdicted::dispatch();

?>