var fs = require('fs');

console.log('Loading configuration:');
fs.readdirSync(__dirname + '/config').forEach(function(file) {
    config = require('./config/' + file);
    console.log('- Configuration ' + file + ' has been loaded.');
});

console.log('Loading commands:');
commands = [];
fs.readdirSync(__dirname + '/commands').forEach(function(file) {
    command = require('./commands/' + file);
    commands.push(command.data);
    console.log('- Command ' + file + ' has been loaded.');
});

commands.forEach(function(moduleCommands) {
    moduleCommands.forEach(function(command) {
        config.commands[command.command] = command;
    });
});

module.exports = {
    config,
    commands
};
