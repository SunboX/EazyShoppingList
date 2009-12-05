<?php
/**
 * Tyke
 *
 * Is a nano web framework for PHP, like web.py for Python, Sinatra or Camping for Ruby.
 *
 * It was forked by Harald Kirschner of Nice Dog, originally by Tiago Bastos.
 *
 * @author       Tiago Bastos
 * @author       Harald Kirschner <harald@digitarald.com>
 * @copyright    2009 Authors
 * @license      MIT License
 */

/*
 * Tyke - Application core
 *
 * Just configuration and magic routing
 */
class Tyke
{

	static public $routes = array();

	static public $config = array();

	/**
	 * Sets one or many internal value.
	 *
	 * @param			 string|array Name or list of name/value pairs
	 * @param      mixed|null Value
	 */
	public static function set($name, $value = null)
	{
		if (is_array($name)) {
			foreach ($name as $key => &$value) {
				self::set($key, $value);
			}
		} else {
			self::$config[$name] = $value;
		}
	}

	/**
	 * Gets one value by name or the default value if name does not not exist.
	 *
	 * @param			 string Name
	 * @param      mixed|null Default value
	 *
	 * @return     mixed
	 */
	public static function get($name, $default = null)
	{
		if (!isset(self::$config[$name])) return $default;
		
		return self::$config[$name];
	}


	/**
	 * Register URI pattern as route
	 *
	 * @param      string|array Regexp pattern or array of pattern/function pairs
	 * @param      array|string Callback array (*not* static! Will be called on the instance) or string for a method
	 * @param      array|null Options
	 *
	 * @return     Tyke
	 */
	public static function register($pattern, $callback = null, $options = array())
	{
		if (is_array($pattern)) {
			foreach ($pattern as $key => $value) {
				if (is_string($key)) $value = array($key, $value);
				call_user_func_array(array('Tyke', 'register'), $value);
			}
		} else {
			$defaults = array(
				'http_method' => null
			);

			$pattern = str_replace('/', '\/', preg_replace('/\\(([a-z][-\w]*):/i', '(?P<$1>', $pattern));

			self::$routes[] = array(
				'pattern' => '/^' . $pattern . '$/U',
				'callback' => $callback,
				'options' => array_merge($defaults, $options)
			);
		}
	}

	/**
	 * Starts Tyke with the registered routes.
	 *
	 * If "tyke.debug" is enabled, exceptions are displayed, otherwise a 500-Error is shown.
	 */
	public static function run()
	{
		if (self::get('core.debug', true)) {
			error_reporting(E_ALL);
			ini_set('display_errors', '1');
			set_error_handler(array('Tyke', 'rethrow'));
		}

		try {
			self::dispatch();
		} catch (Exception $e) {

			if (!headers_sent()) header('HTTP/1.1 500 Internal Server Error');

			if (self::get('core.debug', true)) {

				$fixedTrace = $e->getTrace();

				if (isset($fixedTrace[0]['file']) && !($fixedTrace[0]['file'] == $e->getFile() && $fixedTrace[0]['line'] == $e->getLine())) {
					array_unshift($fixedTrace, array('file' => $e->getFile(), 'line' => $e->getLine()));
				}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
		<head>
				<title>Error!</title>
		</head>
		<body style="font-family: monospace;">
				<h1>Exception: <?php echo get_class($e); ?></h1>
				<h2>Message</h2>
				<p><?= html_entity_decode($e->getMessage()); ?></p>
				<h2>Stack Trace</h2>
				<ol>
					<?php
					foreach ($fixedTrace as $trace) {
						echo '<li>';

						if (isset($trace['file'])) echo $trace['file'];
						else echo "Unknown file";

						if (isset($trace['line'])) echo " (line: " .$trace['line'] .')';
						else echo "(Unknown line)";

						echo '</li>';
					}
					?>
				</ol>
		</body>
</html><?php

			} else {
				echo 'Internal Server Error';
			}

			exit;
		}
	}

	/**
	 * Internal method to re-throw lame PHP errors as nice exceptions
	 */
	public static function rethrow($errno, $errstr, $errfile, $errline, $errcontext)
	{
		$report = error_reporting();
		if ($report && $report & $errno) {
			throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
		}
	}

	/**
	 * Process the given URL or the path from the .htaccess redirect.
	 *
	 * @param      string|null URI
	 */
	public static function dispatch($uri = null)
	{
		if ($uri === null) {
			$parts = array_merge(array('path' => '', 'query' => ''), parse_url('ty://ke' . $_SERVER['REQUEST_URI']));

			$prepend = dirname($_SERVER['SCRIPT_NAME']);

			$from = strlen($prepend);
			$uri = $parts['path'];

			if ($from < 2) {
				$prepend = '/';
				$page = $uri;
			} else {
				$uri = substr($uri, $from);
				$page = $prepend . $uri;
			}

			$self = $page;

			$_GET = array();

			if ($parts['query']) {
				parse_str($parts['query'], $query);
				if (is_array($query)) {
					$_GET = $query;
					$self .= '?' . http_build_query($query, null, '&');
				}
			}

			Tyke::set('core.run.basepath', $prepend);
			Tyke::set('core.run.uri', $page);
			Tyke::set('core.run.self', $self);
		}

		foreach(self::$routes as $route) {

			if (!preg_match($route['pattern'], $uri, $matches)) {
				continue;
			}

			$options = $route['options'];

			// optional http_method, can be string or array
			if (!empty($options['http_method'])) {
				$check = $_SERVER['REQUEST_METHOD'];

				if (is_array($options['http_method'])) {
					if (!in_array($check, $options['http_method'])) continue;
				} else {
					if ($options['http_method'] != $check) continue;
				}
			}

			Tyke::set('core.run.route', $route);

			// get params from named matches
			array_shift($matches);

			$params = array();

			foreach($matches as $key => $match){
				if (is_string($key)) $params[$key] = $match;
			}

			Tyke::set('core.run.params', $params);

			// populate data back to global data holders
			$_GET = array_merge($_GET, $params);
			$_REQUEST = array_merge($_POST, $_GET, $_COOKIE);

			self::execute($route['callback'], $params);
		}

		$r404 = Tyke::get('core.r404', 'r404');

		if ($r404 && function_exists($r404)) {
			call_user_func($r404, $_SERVER['REQUEST_METHOD']);
		} else {
			if (!headers_sent()) header('HTTP/1.1 404 Not Found');
			die('Error: 404 Not Found');
		}
	}

	/**
	 * Execute a function with the given arguments, echoes the result and exits the application.
	 *
	 * @param      array|string Callback, array (class[, method == 'index']), string 'class::method' or 'function'
	 * @param      array Parameters for the callback
	 */
	public function execute($callback, array $params = array())
	{
		if (is_string($callback) && strpos($callback, '::') !== false) $callback = explode('::', $callback, 2);

		if (is_array($callback)) {
			if (is_string($callback[0])) {
				if (!class_exists($callback[0], true)) throw new Exception('Controller "'.$class.'" Not Found');

				$callback[0] = new $callback[0]();
			}

			if (empty($callback[1])) $callback[1] = 'index';

			if (!method_exists($callback[0], $callback[1]) && !method_exists($callback[0], '__call')) {
				throw new Exception('Method "'.$callback[1].'" Not Found');
			}
		}

		ob_start();

		call_user_func_array($callback, $params);

		$out = ob_get_contents();
		ob_end_clean();

		if (is_array($callback) && !empty($callback[0]->headers)) {
			foreach($callback[0]->headers as $header) header($header);
		}

		print $out;
		exit;
	}

}


/*
 * TykeC - The Controller
 */
class TykeC
{
	protected $layout = true;

	protected $layoutTemplate = 'views/layout.php';

	public $headers = array();

	/**
	 * Render function return php rendered in a variable
	 *
	 * @param      string File
	 * @return     Controller Instance
	 */
	public function render($file, $vars = null)
	{
		if (!$this->layout) {
			print $this->renderPartial($file, $vars);
		} else {
			$this->content = $this->renderPartial($file, $vars);

			print $this->renderPartial($this->layoutTemplate, $vars);
		}
		return $this;
	}

	/**
	 * Open template to render and return php rendered in a variable using ob_start/ob_end_clean
	 *
	 * @param      string Path
	 * @return     string Output
	 */
	protected function renderPartial($tyke_file, $tyke_vars = null)
	{
		if (!is_readable($tyke_file)) throw new Exception('View "'.$tyke_file.'" Not Found');

		if (is_array($tyke_vars)) extract($tyke_vars, EXTR_REFS | EXTR_PREFIX_INVALID, '_');

		extract(get_object_vars($this), EXTR_REFS | EXTR_PREFIX_INVALID, '_');

		ob_start();

		require($tyke_file);

		$out = ob_get_contents();
		ob_end_clean();

		return $out;
	}

	/**
	 * Add information in header
	 *
	 * @param      string Value
	 * @return     Controller Instance
	 */
	public function header($text)
	{
		$this->headers[] = $text;
		return $this;
	}

	/**
	 * Redirect to a new page
	 *
	 * @param      string uri
	 * @param      boolean Indicates that dispatcher will not wait all process
	 * @return     Controller Instance
	 */
	public function redirect($uri, $now = false)
	{
		if (!$now) return $this->header('Location: ' . $uri);

		header('Location: ' . $uri);
		exit;
	}

	/**
	 * Forward to a new action
	 *
	 * @param      string uri
	 * @param      boolean Indicates that dispatcher will not wait all process
	 * @return     Controller Instance
	 */
	public function forward($callback, $params = array())
	{
		Tyke::execute($callback, $params);
	}

}

?>
