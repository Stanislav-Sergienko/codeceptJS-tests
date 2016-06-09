config = require('./lib/config');
request = require('sync-request');
subs = require('codeceptjs/lib/utils').template;

module.exports = {
    slack: {
        sendSync: function(message){
            var res = request('POST', config.notify.slack_webhook,
                        {
                            json:{'text': message},
                            headers:{'Content-Type': 'application/json'}
                        });
        },
        block: function(text){
            return '\n```' + text + '```\n';
        },
        code: function(text){
            return '`' + text + '`';
        },
        bold: function(text){
            return '*' + text + '*';
        },
        italic: function(text){
            return '_' + text + '_';
        },
        quotes: function(text){
            return '"' + text + '"';
        },
        test: function(test){
            return 'Test ' + this.quotes(this.bold(test.title)) + ' failed with error:\n';
        },
        error: function(test, stepsFormatted){
            var stepsBlock = '';
            if(stepsFormatted.length){
              stepsBlock = 'Steps:' + this.block(stepsFormatted);
            }
            if (!test.err.message) {
                msg = this.block(subs(test.err.template, test.err.params)) +
                      stepsBlock +
                      'Stack:' +
                      this.block(test.err.stack);
                return msg;
            }else{
                msg = this.block(test.err.message) +
                      stepsBlock +
                      'Stack:' +
                      this.block(test.err.stack);
                return msg;
            };
        },

        formFailMessage: function(test, steps){
            var stepsFormatted = '';
            for(i in steps){
              stepsFormatted += '- ' + steps[i].toString() + '\n';
            };
            return this.test(test) + this.error(test, stepsFormatted);
        }
    }

}
