const doPong = (data) => {
    client.say(data.to, 'pong');
}

const data = [{
    command     : 'ping',
    callback    : doPong,
    public      : false,
    receive     : ['to', 'message']
}];

module.exports = {
    doPong,
    data
};
