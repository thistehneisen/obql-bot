var irc = require('irc');
var src = require('./src');

var client = new irc.Client('chat.freenode.net', config.nickname, {
    userName: 'null',
    realName: 'https://obql.nils.digital/',
    channels: ['#meeseekeria'],
});

client.addListener('message', function (from, to, message) {
    var command = message.replace(config.nickname + ',', '').replace(config.nickname, '').trim();
    if (command.startsWith(config.commandPrefix)) {
        var command = command.substr(1);
        if (config.commands[command] != undefined) {
            console.log('executing ' + command);
            console.log(config.commands.command.callback);
            eval(config.commands.command.callback);
        }
    }
});

module.exports = {
    client
};
