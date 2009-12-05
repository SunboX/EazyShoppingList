/**
 * @author Dipl.-Ing. (FH) André Fiedler
 * @copyright Dipl.-Ing. (FH) André Fiedler
 * @license http://creativecommons.org/licenses/by-nc-nd/3.0/
 */

MooTools.lang.set('en-US', 'ESL', {
 
 	'sign up': 				'Sign Up',
    'yourLists': 			'Your Lists',
	'newList': 				'New List',
	'editList': 			'Edit List',
	'new': 					'new',
	'back': 				'back',
	'done': 				'done',
	'listName':				'Name',
	'listContentMsg': 		'Add your list items here.' + "\n" + 'Sepparate items through line breaks.',
	'edit':					'edit',
	'settings':				'settings',
	'Delete this List':		'Delete this List',
	'You have to signup first. Signup now?':	'You have to signup first. Signup now?',
	'nickNameField':		'Nickname',
	'emailField':			'E-Mail',
	'passwordField':		'Password',
	'confirmPasswordField':	'Confirm Password',
	'do sign up':			'do sign up'

});

MooTools.lang.set('de-DE', 'ESL', {
 
 	'sign up': 				'Registrieren',
    'yourLists': 			'Deine Listen',
	'newList': 				'Neue Liste',
	'editList': 			'Liste Bearbeiten',
	'new': 					'Neu',
	'back': 				'Zurück',
	'done': 				'Fertig',
	'listName':				'Name',
	'listContentMsg': 		'Listeneinträge hier hinzufügen.' + "\n" + 'Einträge durch Zeilenumbruch trennen.',
	'edit':					'Bearbeiten',
	'settings':				'Einstellungen',
	'Delete this List':		'Diese Liste löschen',
	'You have to signup first. Signup now?':	'Sie müssen sich vorher anmelden. Jetzt registrieren?',
	'nickNameField':		'Nickname',
	'emailField':			'E-Mail',
	'passwordField':		'Passwort',
	'confirmPasswordField':	'Passwort wiederholen',
	'do sign up':			'Registrierung senden'

});

Browser.Language = (function(){
	var lang = navigator.language ? navigator.language : navigator.userLanguage;
	if(!lang.match(/\w+-\w+/))
		lang = lang + '-' + lang.toUpperCase();
	return lang;
})();

MooTools.lang.setLanguage(Browser.Language);