'use strict';

let Helper = codecept_helper;
let assert = require('assert');

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


class WebdriverCSS extends Helper {
  checkLayout() {
    let webdrivercss = require('webdrivercss');
    let client = this.helpers['WebDriverIO'].browser;
    console.log(client);
    webdrivercss.init(client, options.webdrivercss);
    client
    .webdrivercss('body',[
        {
            name: 'body',
            elem: 'body'
        }
    ], function(err,res) {
          console.log('I like this');
          console.log(err);
          console.log(res);
          assert.ifError(err);
          assert.fail('error');
          return;
    })

  }

}

module.exports = WebdriverCSS;
