
'use strict';

let I;

module.exports = {

  _init() {
    I = require('../steps_file.js')();
  },

  authPopup: {css: '#bAuthPopupWidget'},
  authAndRegButton: {css: '#userBar-button-authAndReg'},
  logoutLink: {css: '#userBar-link-Logout'},
  authFormLogin: {css: '#AuthFormLogin'},
  authFormPassword: {css: '#AuthFormPassword'},
  authFormLoginButton: {css: '#jsLoginPopupWidget__SignIn'},
  userBar: {css: '#UserBar4Game'},
  barUserName: {css: '#userBar-div-LoginName'},
  barBalance: {css: '#userBar-div-UserBalanceData'},

  barSpgLink: {css: '.userbar-control--desktop'},
  barSpgList: {css: '.userbar-games--desktop'},

  // insert your locators and methods here
  login(login, password){
    	I.waitForElement(this.authAndRegButton, 30);
  		I.click(this.authAndRegButton);
  		I.waitForVisible(this.authFormLogin, 30);
  		I.fillField(this.authFormLogin, login);
  		I.fillField(this.authFormPassword, password);
  		I.click(this.authFormLoginButton);
    },

   logout(){
   		I.waitAndClick(this.barUserName, 30);
   		//I.waitForElement(this.barUserName, 30);
   		//I.click(this.barUserName);
   		I.waitAndClick(this.logoutLink, 10);
   		//I.waitForElement(this.logoutLink, 10);
   		//I.click(this.logoutLink);
   }
}
