
Feature('4game-referral');

Scenario('Незалогиненный пользователь заходит на страницу реферальной системы', (I) => {
	I.clearCookie();
	I.amOnPage('/summon/');
	I.see("Войди в свой аккаунт")
	I.checkLayout('referrer_unauth', [ {name: 'body', elem: 'body'} ], 0.5, '4game-referral-system');
});
