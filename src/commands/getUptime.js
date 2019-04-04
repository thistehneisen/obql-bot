var os = require('os');
const humanizeDuration = require('humanize-duration');

const getUptime = (data) => {
    client.say(data.to, Math.round(humanizeDuration(process.uptime() * 1000)));
}

const data = [{
    command     : 'uptime',
    callback    : getUptime,
    public      : false,
    receive     : ['from', 'to']
}];

module.exports = {
    getUptime,
    data
};
