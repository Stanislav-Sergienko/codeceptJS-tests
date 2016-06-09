var game = require('./data/games').FarCryPrimal;
var editions = [];
	for(edt in game.editions){
		editions.push(game.editions[edt]);
	}
var purchases = [];

Feature('Single-player game "' + game.name + '"');

Scenario('Platform over the Buy button', (I, genericPage, spgPage) => {
	I.amOnPage(game.url);
	I.waitForVisible(spgPage.priceDiv, 30);
	I.seeElement(spgPage.platformMessage.icon[game.platform]);
	I.see(game.platform, spgPage.platformMessage.css);
	I.see('blablabla');
});

Scenario('Title and meta info', (I, genericPage, spgPage) => {
	I.amOnPage(game.url);
	I.seeInTitle(game.title);
	I.seeInSource('meta name="description" content="' + game.description + '"');
	I.seeInSource('meta property="og:description" content="' + game.ogdescription + '"');
});

Scenario('Game in the userbar', (I, genericPage, spgPage) => { //Пока не работает. Надо с ним разобраться.
	I.amOnPage(game.url);
	I.waitForVisible(genericPage.barSpgLink, 30);
	I.click(genericPage.barSpgLink);
	I.seeElement({css: 'a[href="' + game.url + '/"] .userbar-game-icon'}, genericPage.barSpgList);
});

Scenario('Game tile on the main page', (I) => {
	I.amOnPage('/?hits');
	I.see(game.name);
});

Scenario('Check editions and all prices', (I, genericPage, spgPage) => {
	I.amOnPage(game.url);
	I.waitForVisible(spgPage.priceDiv, 30);
	I.waitForVisible(spgPage.buttonBuy.active, 30);
	if(editions.length === 1){
		I.dontSee(spgPage.editionSwitcher.css);
		I.dontSee(spgPage.editionPlate(1));
		I.see(game.editions.standard.price.full, spgPage.priceDiv);
		I.see(game.editions.standard.price.bonus, spgPage.bonuses);
		I.waitAndClick(spgPage.promoCodeLink, 30);
		I.fillField(spgPage.promoCodeField, game.codes[0]);
		I.waitForVisible(spgPage.priceDivDiscount, 10);
		I.see(game.editions.standard.price.discount, spgPage.priceDivDiscount);
		I.dontSee(game.editions.standard.price.bonus, spgPage.bonuses);
	}else{
		editions.forEach((edition) => {
			I.click(spgPage.editionRadio(edition.order));
			I.see(edition.price.full, spgPage.priceDiv);
			I.see(edition.price.bonus, spgPage.bonuses);
			if(edition.gold){
				var goldPlate = spgPage.editionPlate(edition.gold);
				I.seeElement(goldPlate);
				I.see(edition.name.toUpperCase(), goldPlate);
			}
			I.waitAndClick(spgPage.promoCodeLink, 30);
			I.fillField(spgPage.promoCodeField, game.codes[0]);
			I.waitForVisible(spgPage.priceDivDiscount, 10);
			I.see(edition.price.discount, spgPage.priceDivDiscount);
			I.dontSee(edition.price.bonus, spgPage.bonuses);
		});
	}
});

editions.forEach((edition) => {
	//TODO: Состояния блока с рекомендованной игрой на странице кодов
	Scenario((game.name + ' full price purchase for ' + edition.name), function* (I, genericPage, spgPage){
		var user = yield I.createRandomUser();
		I.amOnPage('/404');
		I.setLoginCookieFor(user.email, user.password);
		I.amOnPage(game.url);
		I.waitForVisible(spgPage.priceDiv, 30);
		I.waitForVisible(genericPage.barBalance, 30);

		var oldBalance = yield parseInt(I.grabTextFrom(genericPage.barBalance));
		var newBalance = oldBalance - edition.price.full + edition.price.bonus;
		if(editions.length > 1){
			I.click(spgPage.editionRadio(edition.order));
		}
		I.waitAndClick(spgPage.buttonBuy.active);
		spgPage.checkGamePurchaseIsDone(game);
		I.see(newBalance, genericPage.barBalance);
	});

	Scenario((game.name + ' discount purchase for ' + edition.name), function* (I, genericPage, spgPage){
		var user = yield I.createRandomUser();
		I.amOnPage('/404');
		I.setLoginCookieFor(user.email, user.password);
		I.amOnPage(game.url);
		I.waitForVisible(spgPage.priceDiv, 30);
		I.waitForVisible(genericPage.barBalance, 30);

		var oldBalance = yield parseInt(I.grabTextFrom(genericPage.barBalance));
		var newBalance = oldBalance - edition.price.discount;
		if(editions.length > 1){
			I.click(spgPage.editionRadio(edition.order));
		}
		I.waitAndClick(spgPage.promoCodeLink);
		I.fillField(spgPage.promoCodeField, game.codes[0]);
		I.waitForVisible(spgPage.priceDivDiscount, 10);
		I.waitAndClick(spgPage.buttonBuy.active);
		spgPage.checkGamePurchaseIsDone(game);
		I.see(newBalance, genericPage.barBalance);
	});

});

Scenario('Email with bonuses', function*(I, spgPage, genericPage){
	var user = yield I.createRandomUser();
	I.buyGameUsingApi(game.editions.standard.id, user);
	I.wait(10);
	I.amOnPage('http://notify.qa.inn.ru/maildata/' + user.email + '.htm');
	if(game.status !== 'preorder'){
		I.see('Спасибо за покупку ' + game.name);
		I.see('Subject: Спасибо за покупку ' + game.name);
	}else{
		I.see('Спасибо за предзаказ ' + game.name);
		I.see('Subject: Спасибо за предзаказ ' + game.name);
	}
	I.see('Деньги на твой счет');
	I.see('+' + game.editions.standard.price.bonus);
});

Scenario('Email without bonuses', function*(I, spgPage, genericPage){
	var user = yield I.createRandomUser();
	I.buyGameUsingApi(game.editions.standard.id, user, true);
	I.wait(10);
	I.amOnPage('http://notify.qa.inn.ru/maildata/' + user.email + '.htm');
	if(game.status !== 'preorder'){
		I.see('Спасибо за покупку ' + game.name);
		I.see('Subject: Спасибо за покупку ' + game.name);
	}else{
		I.see('Спасибо за предзаказ ' + game.name);
		I.see('Subject: Спасибо за предзаказ ' + game.name);
	}
	I.dontSee('Деньги на твой счет');
	I.dontSee('+' + game.editions.standard.price.bonus);
});

Scenario('All discount codes work', (I, genericPage, spgPage) => {
	game.codes.forEach((code) => {
		I.amOnPage(game.url); //Это временно, пока есть баг для игр с одним изданием
		I.waitForVisible(spgPage.promoCodeLink, 30);
		I.click(spgPage.promoCodeLink);
		I.fillField(spgPage.promoCodeField, code);
		I.waitForVisible(spgPage.promoCodeSuccess, 10);
		I.waitForVisible(spgPage.priceDivDiscount, 10);
		//I.click(spgPage.promoCodeClear);
		//I.waitToHide(spgPage.promoCodeSuccess, 5);
		//I.waitToHide(spgPage.priceDivDiscount, 5);
	});
});

//При добавлении новой игры - основной приоритет
Scenario('Platform on the codes page');
Scenario('Recommended game on the codes page');
Scenario('Preorder stuff on the game page');
Scenario('Preorder stuff disappears at the release date');
Scenario('Navigation order is correct');
Scenario('Tooltip with gifts works');

//Регресс
Scenario('"Copy" button for serial and giftcode work');
Scenario('Purchase button is inactive when there\'re no more keys');
Scenario('"Oops, something\'s wrong" is displayed on error');
Scenario('"Retrieving the key" is displayed');
Scenario('Link to the codes page and back');