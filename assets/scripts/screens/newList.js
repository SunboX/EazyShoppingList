/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var scr = new Mobile.GUI.Screen('newList');

var header = new Mobile.GUI.Header({
	title: MooTools.lang.get('ESL', 'newList')
});
scr.addControl(header);

var doneBtn = header.addButton(MooTools.lang.get('ESL', 'done'), {type: 'action'});
var backBtn = header.addButton(MooTools.lang.get('ESL', 'back'), {type: 'back'});

scr.addControl(header);

doneBtn.addEvent('click', function(e){
	e.stop();
	alert('done!');
});

backBtn.addEvent('click', function(e){
	e.stop();
	Mobile.Application.loadLastScreen();
});

Mobile.Application.showScreen(scr);
