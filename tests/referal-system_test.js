
Feature('4gamer');

Scenario('test opening page', (I) => {
	I.clearCookie();
	I.amOnPage('/summon/');
	WebdriverCSS.checkLayout();
	I.see('Войди в свой аккаунт');

});
