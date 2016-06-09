
'use strict';

let I;

module.exports = {

  _init() {
    I = require('../steps_file.js')();
  },

  // Generic single-player game page locators
  editionPlate: function(n){
  	return {css:'#product-edition-' + n};
  },
  buttonBuy: {
  	active: {css: '#button-buyEdition:not([disabled=disabled])'},
  	disabled: {css: '#button-buyEdition[disabled="disabled"]'}
  },

  priceDiv: {
  	css: '#div-sumWithoutDiscount'
  },
  priceDivDiscount: {
  	css: '#div-sumWithDiscount'
  },
  platformMessage: {
    css: '.bSingleplayerBuy__eMessage',
    icon: {
      "Steam": {
        css: '.bSingleplayerBuy__eMessage .bSingleplayerBuy__eIcon__mPlatform-steam'
      },
      "Uplay": {
        css: '.bSingleplayerBuy__eMessage .bSingleplayerBuy__eIcon__mPlatform-uplay'
      }
    }
  },

  promoCodeLink: {
  	css: '#link-enterPromoCode'
  },
  promoCodeField: {
  	css: '#field-discountCode'
  },
  promoCodeClear: {
  	css: '#button-crossClear'
  },
  promoCodeSuccess: {
  	css: '#div-successActivation'
  },
  promoCodeFail: {
  	css: '#div-failedActivation'
  },
  bonuses:{
  	css: '#purchase-editions-bonuses'
  },

  errorMessage: {
  	css: '.bSingleplayerBuy .bInfoMessage__mType_error'
  },
  errorText: {
  	noKeys: 'Ключи временно закончились'
  },

  editionSwitcher: {
  	css: '#game-editions-switcher-content'
  },

  editionRadio: function(n){
    //return {css: '#game-editions-switcher-content li:nth-child(' + n + ') .bSectionSwitch__eItem__eInput'};
    return {css: '#game-editions-switcher-content li:nth-child(' + n + ')'};
  },

  codesSerialCode: {
  	css: '#field-serialCode'
  },
  codesPreorderText: {
  	css: '#div-ticketTitle'
  },

  
  //Generic single-player game page methods
  checkEveryCodeFor(game){
  	I.waitAndClick(this.promoCodeLink, 30);
  	let i;
	for(i in game.codes){
		I.fillField(this.promoCodeField, game.codes[i]);
		I.waitForVisible(this.promoCodeSuccess, 10);
		I.waitForVisible(this.priceDivDiscount, 10);
		I.click(this.promoCodeClear);
		I.waitToHide(this.promoCodeSuccess, 5);
	};},

	checkGamePurchaseIsDone(game){
    //TODO: разобраться, как можно определить успешную покупку у юзера с уже имеющимися заказами
		if(game.status === 'preorder'){
			I.waitForVisible(this.codesPreorderText, 30);
		}else{
			I.waitForVisible(this.codesSerialCode, 30);
		};
		I.seeInCurrentUrl('/codes');
	},

	checkMetaDescriptions(game){
		I.seeInSource('<meta name="description" content="' + game.description + '">');
		I.seeInSource('<meta property="og:description" content="' + game.ogdescription + '">');
	}

}
