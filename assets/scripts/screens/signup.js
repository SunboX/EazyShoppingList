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
	
var waiting = false;

doneBtn.addEvent('click', function(e){
	e.stop();
	
	// validate
	var nickname = nickNameField.get('value', '').trim();
	var email = emailField.get('value', '').trim();
	var password = passwordField.get('value', '').trim();
	var passwordConfirm = confirmPasswordField.get('value', '').trim();
	
	if(nickname == ''){
		nickNameField.setError();
		alert(MooTools.lang.get('ESL', 'Plz fill all marked fields.'));
		return;
	}
	if(!nickname.match(/^[a-zA-Z0-9-_]{3,50}$/)){
		nickNameField.setError();
		alert(MooTools.lang.get('ESL', 'Check your nickname! Allowed chars are a-Z, 0-9, scores and underscores.'));
		return;
	}
	if(email == ''){
		emailField.setError();
		alert(MooTools.lang.get('ESL', 'Plz fill all marked fields.'));
		return;
	}
	if(!email.match(/^[a-zA-Z0-9\._%+-]+@[a-zA-Z0-9\.-]+\.[a-z]{2,6}$/)){
		emailField.setError();
		alert(MooTools.lang.get('ESL', 'Check your email address!'));
		return;
	}
	if(password == '' || passwordConfirm == '' || password != passwordConfirm){
		passwordField.setError();
		confirmPasswordField.setError();
		alert(MooTools.lang.get('ESL', 'Your password doesn´t match.'));
		return;
	}
	
	if(!waiting)
		new Request.JSON({url: 'service/sign-up/', onSuccess: function(response){
			switch(response.state.toInt())
			{
				case 6:
					alert('success');
					break;
				
				default:
					waiting = false;
					alert('denied');
			}
		}}).post({
			'nickname': nickname,
			'email': email,
			'password': password
		});
	
	waiting = true;
});

Mobile.Application.showScreen(scr);
