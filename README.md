# codecept-tests

Демо по фреймворку CodeceptJS+WebdriverIO+WebdriverCSS

## Установка
1. Скачиваем репозиторий
2. Устанавливаем компоненты
```
npm i codeceptjs@0.2.8
npm i webdriverio@3.4.0
npm install git://github.com/webdriverio/webdrivercss.git#v2.0.0beta-rc1
```
Перед установкой webdriverCSS необходимо поставить GraphicsMagick. Подробнее [здесь](https://github.com/webdriverio/webdrivercss#install)

Запускаем Java Webdriver (информация находиться в ./selenium/launchinfo)

В codecept указываем настройки вебрайвера:
* Браузер
* Разрешение

Внимание: для IE необходимо отключить безопасный режим

После настройки можно проверить запуск тестов  помощью команды `npm run codeceptjs`
