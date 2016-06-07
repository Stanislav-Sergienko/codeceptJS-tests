'use strict';

// NPM packages
var webdriverio = require('webdriverio');
var webdrivercss = require('webdrivercss');

// All options go here, to allow easier boilerplating.
var options = {
  browser: {
    'browserstack.debug': 'true',
    'browserstack.local': 'true',
    'browserName': 'chrome'
  },
  test: {
    'title': 'Body_win7-ie9',
    'name': 'body',
    'url': 'https://ru.4game.com/summon/', // this needs to be a real URL
    'selector': 'body',
  },
  webdrivercss: {
    'screenshotRoot': 'visual/reference',
    'failedComparisonsRoot': 'visual/failed',
    'misMatchTolerance': 0.05,
    'screenWidth': [1024]
  }
};

// Get your key here: https://www.browserstack.com/accounts/automate
//
// Script assumes your BrowserStack creds are listed in the JSON file.
// Convenient if you want to avoid storing keys in VCS. If storing in
// VCS is ok, just assign an object literal to config:
//
//var config = require('./browserstack.json');

// Configure webdriverio
let client = webdriverio.remote({
  desiredCapabilities: options.browser,
  host: '127.0.0.1',
  port: 3244,
}).init();
//console.log(client);

// Initialize webdrivercss
webdrivercss.init(client, options.webdrivercss);

// Run the test
client
  .url(options.test.url)
  .webdrivercss(options.test.title, {
    name: options.test.name,
    elem: options.test.selector
  }, function(err, res) {
    console.log(client);
    console.log(err);
    console.log(res);
  })
  .end();
