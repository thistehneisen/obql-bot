var irc = require('irc');
var src = require('./src');

global.client = new irc.Client('chat.freenode.net', config.nickname, {
    userName: 'null',
    realName: 'https://obql.nils.digital/',
    channels: ['#meeseekeria'],
});

client.addListener('message', function (from, to, message) {
    var command = message.replace(config.nickname + ',', '').replace(config.nickname, '').trim();
    if (command.startsWith(config.commandPrefix)) {
        var command = command.substr(1);
        if (config.commands[command] != undefined) {
            var send = [];
            config.commands[command].receive.forEach(function(data){
                send[data] = eval(data);
            });
            config.commands[command].callback(send);
        }
    }
});

module.exports = {
    client
};
