'use strict';

let Helper = codecept_helper;
let assert = require('assert');
let webdrivercss = require('webdrivercss');

var config = {
  webdrivercss: {
    'screenshotRoot': 'tests/visual/reference',
    'failedComparisonsRoot': 'tests/visual/failed',
    'misMatchTolerance': 0.05,
    'screenWidth': [1024]
  }
};
var browser;

class WebdriverCSS extends Helper {
  //перед тестом проверяем размер вьюпорта и корректируем данные webdrivercss
  _afterStep() {
    let client = this.helpers['WebDriverIO'].browser;
    client.getViewportSize('width').then(function(size) {
        size = Math.ceil(size / 10) * 10;
        config.webdrivercss.screenWidth[0] = parseFloat(size); // outputs: {width: 1024, height: 768}
    })
    // Определяем браузер в котором запущен тест
    browser = client.desiredCapabilities.browserName;
    if (browser == 'internet explorer') { browser = 'ie'}
  }

  //Метод для проверки Layout с помощью фреймворка WebdriverCSS
  //id - уникальный id для скриншота/страницы
  //options - опции проверки страницы, подробнее https://github.com/webdriverio/webdrivercss#usage
  //misMatchTolerance - Максимальное возможное отклонение в скриншотах (по умолчанию 0.05)
  //screenshootPath - путь до основной папки со скриншотами (внутри будут visual/reference и visual/failed)
  checkLayout(id, options, misMatchTolerance, screenshootPath) {
    console.log('object options:');
    console.log(options);
    //получаем информацию о webdriver
    let client = this.helpers['WebDriverIO'].browser;

    //обновляем информацию для фреймворка webdrivercss
    config.webdrivercss.misMatchTolerance = misMatchTolerance;
    config.webdrivercss.screenshotRoot = 'tests/' + screenshootPath + '/visual/reference';
    config.webdrivercss.failedComparisonsRoot = 'tests/' + screenshootPath + '/visual/failed';
    //делаем маску скриншота
    var uniqueId = browser + '_' + id;
    //логирование конфига
    //console.log(config);
    //логирование вебдрайвера
    //console.log(client);

    //инициализируем фреймворк webdrivercss
    //возвращаем в основной тест результаты проверки фреймворком webdrivercss
    webdrivercss.init(client, config.webdrivercss);
        return client.webdrivercss(uniqueId, options, function(err,res) {
          //Логирование ошибок и результата
          //console.log(err);
          //console.log(res);

          if (typeof err != 'undefined') {
            //произошла непредвиденная ошибка
            assert.fail(err, 'undefined', 'Unexpected error');
            return;
          } else {
            //отправляем результат проверки
            //т.к. не знаем, какое название у объекта, берем первый (он же единственный)
            var resPrepare = res[Object.keys(res)[0]];
            assert.ok(resPrepare[0].isWithinMisMatchTolerance, "misMatchPercentage = " + resPrepare[0].misMatchPercentage);
            return;
          }
        })
  }
}

module.exports = WebdriverCSS;
