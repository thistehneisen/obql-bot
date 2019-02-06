var irc = require('irc');
var nickname = 'obql';
var commandPrefix = '!';
var publicCommands = {
    'uptime'    : 'zis will point to a function',
    'ping'      : 'zis one just gives PONG, no need for a faknšan',
    'echo'      : 'prolly less than a minute',
    'version'   : 'barely alive'
}

var client = new irc.Client('chat.freenode.net', nickname, {
    userName: 'null',
    realName: 'https://obql.nils.digital/',
    channels: ['#meeseekeria'],
});

client.addListener('message', function (from, to, message) {
    var command = message.replace(nickname + ',', '').replace(nickname, '').trim();
    if (command.startsWith(commandPrefix)) {
        var command = command.substr(1);
        if (publicCommands[command] != undefined) {
            client.say('#meeseekeria', from + ', ' + publicCommands[command]);
        }
    }
});
