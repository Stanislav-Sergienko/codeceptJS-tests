
Feature('4gamer');

Scenario('test opening page', (I) => {
	I.clearCookie();
	I.amOnPage('/summon/');
	I.checkLayout();

});
