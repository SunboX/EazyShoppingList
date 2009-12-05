<?php

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
	'/registration/' => 'registration'
));

ContentAdicted::dispatch();

?>