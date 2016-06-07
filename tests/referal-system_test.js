
Feature('Referal system');

Scenario('test something', (I) => {
	I.clearCookie();
	I.amOnPage('/articles/');
	Galen.checkHTML('./specs/header.gspec');

});
