'use strict';

let Helper = codecept_helper;
let assert = require('assert');
let webdrivercss = require('webdrivercss');

var options = {
  webdrivercss: {
    'screenshotRoot': 'tests/visual/reference',
    'failedComparisonsRoot': 'tests/visual/failed',
    'misMatchTolerance': 0.05,
    'screenWidth': [1024]
  }
};

class WebdriverCSS extends Helper {
  //Метод для проверки Layout с помощью фреймворка WebdriverCSS
  //id - уникальный id для скриншота/страницы
  //options - опции проверки страницы, подробнее https://github.com/webdriverio/webdrivercss#usage
  //misMatchTolerance - Максимальное возможное отклонение в скриншотах (по умолчанию 0.05)
  //screenshootPath - путь до основной папки со скриншотами (внутри будут visual/reference и visual/failed)
  checkLayout(id, options, misMatchTolerance, screenshootPath) {
    //получаем информацию о webdriver
    let client = this.helpers['WebDriverIO'].browser;
    console.log('ниже ширина вьюпорта');
//TODO: доделать обработку параметров
//    client.getViewportSize('width').then(function(size) {
//        options.webdrivercss.screenWidth = size;
//    })
//    console.log(options.webdrivercss.screenWidth);
//    options.webdrivercss.screenWidth = client.getViewportSize(width);
//    options.webdrivercss.misMatchTolerance = misMatchTolerance;
//    options.webdrivercss.screenshotRoot = screenshootPath + '/visual/reference';
//    oprions.webdrivercss.failedComparisonsRoot = screenshootPath + '/visual/reference';
    //логирование вебдрайвера
    //console.log(client);
    //инициализируем фреймворк webdrivercss
    webdrivercss.init(client, options.webdrivercss);
    //возвращаем в основной тест результаты проверки фреймворком webdrivercss
    return client
    .webdrivercss(id, options, function(err,res) {
      //Логирование ошибок и результата
      //console.log(err);
      //console.log(res);

      if (typeof err != 'undefined') {
        //произошла непредвиденная ошибка
        assert.fail(err, 'undefined', 'Unexpected error');
        return;
      }
      else {
        assert.ok(res.body[0].isWithinMisMatchTolerance, res);
        return;
      }
    })
  }
}

module.exports = WebdriverCSS;
