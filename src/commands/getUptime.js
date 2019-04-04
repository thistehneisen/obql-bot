var os = require('os');
const humanizeDuration = require('humanize-duration');

const getUptime = (data) => {
    client.say(data.to, humanizeDuration(process.uptime() * 1000, { round: true }));
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
