require('dotenv').config();
var irc = require('irc');
var src = require('./src');

global.client = new irc.Client('chat.freenode.net', config.nickname, {
    userName: 'alpha',
    realName: 'https://obql.nils.digital/',
    channels: ['#meeseekeria'],
});

client.addListener('message', function (from, to, message) {
    var nickPattern = new RegExp(`${config.nickname}[,: ]{1} ?`);
    if (nickPattern.test(message)) {
        var isPrivate = true;
        var message = message.replace(nickPattern, '');
    }
    var command = message.split(' ')[0];
    if (command[0] === config.commandPrefix) {
        var command = command.substr(1);
        var allowPublic = true;
    }
    if (config.commands[command] != undefined) {
        var cmd = config.commands[command];
        if (!isPrivate && cmd.public === false && !allowPublic) {
            return false;
        }
        var send = [];
        var message = message.split(' ');
        message.shift();
        var message = message.join(' ');
        if (typeof cmd.receive === 'object') {
            cmd.receive.forEach(function(data){
                send[data] = eval(data);
            });
        }
	if (cmd.hasOwnProperty('callback') == true)
        	cmd.callback(send);
    }
});

client.addListener('registered', function (message) {
    client.send('NICKSERV', 'identify', process.env.IRC_NICKSERV_PASS);
});

client.addListener('error', function(message) {
    console.log('IRC Error: ', message);
});

module.exports = {
    client
};
