
'use strict';


class WebdriverCSS extends Helper {
  checkLayout() {
    let client = this.helpers['WebDriverIO'].browser;
   require('webdrivercss').init(client);
   client
    .webdrivercss('startpage',[
        {
            name: 'header',
            elem: '#header'
        }
    ], function(err, res) {
        assert.ifError(err);
        assert.ok(res.header[0].isWithinMisMatchTolerance);
        assert.ok(res.hero[0].isWithinMisMatchTolerance);
    })
  }
  // add custom methods here
  // If you need to access other helpers
  // use: this.helpers['helperName']

}

module.exports = WebdriverCSS;
