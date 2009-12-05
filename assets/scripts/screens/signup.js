/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

var scr = new Mobile.GUI.Screen('signUp');

var header = new Mobile.GUI.Header({
	title: MooTools.lang.get('ESL', 'sign up')
});

var doneBtn = header.addButton(MooTools.lang.get('ESL', 'do sign up'), {type: 'action'});
var backBtn = header.addButton(MooTools.lang.get('ESL', 'back'), {type: 'back'});

scr.addControl(header);

backBtn.addEvent('click', function(e){
	e.stop();
	Mobile.Application.loadScreen('main', 'ltr');
});


var form = new Mobile.GUI.Form();

var nickNameField = form.addTextfield('nick-name', MooTools.lang.get('ESL', 'nickNameField'));
var emailField = form.addTextfield('email', MooTools.lang.get('ESL', 'emailField'));
var passwordField = form.addPasswordfield('password', MooTools.lang.get('ESL', 'passwordField'));
var confirmPasswordField = form.addPasswordfield('password-confirm', MooTools.lang.get('ESL', 'confirmPasswordField'));

scr.addControl(form);

doneBtn.addEvent('click', function(e){
	e.stop();
	alert('done');
});

Mobile.Application.showScreen(scr);
