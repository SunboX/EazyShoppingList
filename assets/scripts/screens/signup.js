/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var scr = new Mobile.GUI.Screen('signup');

var header = new Mobile.GUI.Header({
	title: MooTools.lang.get('ESL', 'signUp')
});
scr.addControl(header);

Mobile.Application.showScreen(scr);
