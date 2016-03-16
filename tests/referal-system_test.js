
Feature('Referal system');

Scenario('test something', (I) => {
	I.clearCookie();
	I.amOnPage('/summon/');
	I.see('Войди в свой аккаунт');

});
