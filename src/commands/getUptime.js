var os = require('os');

const getUptime = () => {
    client.say('#meeseekeria', os.uptime());
}

module.exports = {
    getUptime,
    data : [{
        command     : '!uptime',
        callback    : getUptime,
        public      : true
    }]
};
