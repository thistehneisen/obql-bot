var fs = require('fs');

console.log('Loading configuration:');

fs.readdirSync(__dirname + '/config').forEach(function(file) {
    config = require('./config/' + file);
    console.log('- Configuration ' + file + ' has been loaded.');
});

console.log('Loading commands:');

fs.readdirSync(__dirname + '/commands').forEach(function(file) {
    commands = require('./commands/' + file);
    console.log('- Command ' + file + ' has been loaded.');
});

module.exports = {
    config,
    commands
};
