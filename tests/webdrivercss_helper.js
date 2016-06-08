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

class WebdriverCSS extends Helper {
  //Метод для проверки Layout с помощью фреймворка WebdriverCSS
  //id - уникальный id для скриншота/страницы
  //options - опции проверки страницы, подробнее https://github.com/webdriverio/webdrivercss#usage
  //misMatchTolerance - Максимальное возможное отклонение в скриншотах (по умолчанию 0.05)
  //screenshootPath - путь до основной папки со скриншотами (внутри будут visual/reference и visual/failed)
  checkLayout(id, options, misMatchTolerance, screenshootPath) {
    //получаем информацию о webdriver
    let client = this.helpers['WebDriverIO'].browser;
//    console.log(config);
//    console.log('ниже ширина вьюпорта');
//TODO: доделать обработку параметров (остался размер окна)
//    client.getViewportSize('width').then(config.webdrivercss.screenWidth[0] = size);
//    console.log(size);
//    config.webdrivercss.screenWidth[0] = parseFloat(client.getViewportSize('width'));
//    console.log(config);
//    options[webdrivercss.screenWidth] = client.getViewportSize(width);
    config.webdrivercss.misMatchTolerance = misMatchTolerance;
    config.webdrivercss.screenshotRoot = screenshootPath + '/visual/reference';
    config.webdrivercss.failedComparisonsRoot = screenshootPath + '/visual/failed';
//    console.log(config);
    //логирование вебдрайвера
    //console.log(client);
    //инициализируем фреймворк webdrivercss
    webdrivercss.init(client, config.webdrivercss);
    console.log('Я уже здесь');
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
        //отправляем результат проверки
        //т.к. не знаем, какое название у объекта, берем самый первый
        var resPrepare = res[Object.keys(res)[0]];
        assert.ok(resPrepare[0].isWithinMisMatchTolerance, "misMatchPercentage = " + resPrepare[0].misMatchPercentage);
        return;
      }
    })
  }
}

module.exports = WebdriverCSS;
