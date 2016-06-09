
'use strict';

const assert = require('assert');
const request = require('sync-request');
const querystring = require('querystring');

class ForGame extends Helper {

  _failed(test){
    return;
  }

  // add custom methods here
  // If you need to access other helpers
  // use: this.helpers['helperName']

  seeSelected(element){
    let client = this.helpers['WebDriverIO'].browser;

    if(typeof(element.css) !== 'undefined'){
      element = element.css;
    };

    return client.isSelected(element)
      .then((selected) => {
        if(!selected){
          throw new Error('Element "' + element + '" is not selected');
        }
      })
      .catch((e) => {
        throw e;
      });
  }

  createUser(email, password, login, balance, bonus, countryCode, characterName){
    login = login || email.replace(/@.*/, '');
    balance = balance || '0';
    bonus = bonus || '0';
    countryCode = countryCode || 'RU';
    if(typeof(characterName) === 'undefined'){
      characterName = '';
    }
    let base = 'http://testapi-q.qa.inn.ru:8088/web/action/createUser?';
    let params = querystring.stringify({
      email: email,
      login: login,
      password: password,
      countryCode: countryCode,
      balance: balance,
      bonus: bonus,
      characterName: ''
    });
    let rg = new RegExp(/User created: ([0-9]*)/);
    let r = request('GET', base + params);
    let result = r.body.toString();
    if(result.indexOf('User created') == -1){
      throw new Error('User creation failed');
    }
    return {email: email, password: password, id: rg.exec(result)[1]};
  }

  acceptAgreementsForNewUser(token){
    let base = 'https://ru.4gametest.com/licence/accept/?';
    let params = querystring.stringify({serviceId: '0', 'licenceId[]': ['177', '178']});
    let r = request('GET', base + params, {
      headers: {'Cookie': 'inn-user=' + token}
    });
    return r.body.toString();
  }

  createRandomUser(){
    var login = 's' + Math.random().toString(36).substring(2, 12);
    var password = '123456';
    return this.createUser(login + '@trollo.com', password, login, 10000, 0, 'RU');
  }

  getAccessToken(login, password){
    let client = this.helpers['WebDriverIO'].browser;
    let res = request('POST',
            'https://api2.4gametest.com/tokens',
          {
            json:{"expiration":"long"},
            headers:{'Authorization': 'basic ' + new Buffer(login + ':' + password).toString('base64')}
          });
    let token = JSON.parse(res.getBody()).accessToken

    return token;
  }

  setLoginCookieFor(login, password){
    let client = this.helpers['WebDriverIO'].browser;
    let token = this.getAccessToken(login, password);

    return client.setCookie({name: 'inn-user', value: token, domain: '4gametest.com', 'secure': true})
      .then()
      .catch((e) => {
        throw e;
      });
  }

  buyGameUsingApi(product, user, discount){
    if(typeof(discount) === 'undefined'){
      discount = false;
    }
    let token = this.getAccessToken(user.email, user.password);
    let prod = request('GET',
            'https://api2.4gametest.com/users/' + user.id + '/apps/31/products/' + product,
          {
            headers:{'Authorization': 'bearer ' + token}
          });
    let prodObject = JSON.parse(prod.body.toString());
    let prices;
    if(discount){
      prices = prodObject.offer.prices[1];
    }else{
      prices = prodObject.offer.prices[0];
    }
    let billingId = prices.extra.billingProductId;
    let price = prices.price;
    let order = request('POST',
            'https://api2.4gametest.com/users/' + user.id + '/orders',
          {
            json:{
              products: [billingId],
              price: price,
              params: "{\"customOrderId\":" + new Date().getTime() + "}"
            },
            headers:{'Authorization': 'bearer ' + token}
          });
    let orderId = JSON.parse(order.body.toString()).orderId;
    let purchase = request('POST',
            'https://api2.4gametest.com/users/' + user.id + '/orders/' + orderId + '/purchases',
          {
            headers:{'Authorization': 'bearer ' + token}
          });
    return orderId;
  }
}

module.exports = ForGame;
