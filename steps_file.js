
'use strict';
// in this file you can append custom step methods to 'I' object
const request = require('sync-request');
const assert = require('assert');

module.exports = function() {
  return actor({

    // Define custom steps here, use 'this' to access default methods of I.
    // It is recommended to place a general 'login' function here.
    waitAndClick: function(element, time){
    	if(typeof(time)==='undefined'){time = 30};
    	this.waitForVisible(element, time);
    	this.click(element);
    },

    doQuickLogin: function(url){
		this.amOnPage('/404');
		this.setLoginCookieFor(user.email, user.password);
		this.amOnPage(url);
        return 1;
    }

  });
}
