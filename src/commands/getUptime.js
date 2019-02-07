var os = require('os');

const getUptime = () => {
    console.log('action retrieved');
    client.say('#meeseekeria', os.uptime());
}

module.exports = {
    getUptime,
    data : [{
        command     : 'uptime',
        callback    : getUptime,
        public      : true
    }]
};
