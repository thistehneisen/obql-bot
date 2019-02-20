var os = require('os');

const doEcho = (data) => {
    client.say(data.to, data.message);
}

const data = [{
    command     : 'echo',
    callback    : doEcho,
    public      : false,
    receive     : ['to', 'message']
}];

module.exports = {
    doEcho,
    data
};
