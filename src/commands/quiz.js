var PouchDB = require('pouchdb');
var db = new PouchDB('data/quiz');
PouchDB.plugin(require('pouchdb-find'));

const doQuiz = (data) => {
    const subCommands = ['award', 'gibap'];
    var question = data.message,
        subCommand = data.message.split(' ')[0],
        id = data.to + '_' + data.from;

    db.find({
        selector: {
            _id : id
        }
    }).then(function (result) {
        var result = result.docs[0];
        if (subCommands.indexOf(subCommand) == -1) {
            if (!question) {
                if (!result || !result.question)
                    client.say(data.to, 'You currently have no active quiz running. Create one by using !quiz your question');
                else
                    client.say(data.to, 'Your active quiz is: ' + result.question + ' created @ ' + result.time + ' — !quiz gibap to disregard it.');
            } else if (result && result.question) {
                client.say(data.to, 'Yuo already haz a quiz goin: ' + result.question + ' @ ' + result.time);
            } else {
                db.put({
                    _id: id,
                    question: question,
                    time: Date.now()
                }, function(err, response) {
                    if (err) { return console.log(err); }
                    return false;
                });
                client.say(data.to, 'New quiz started by ' + data.from + ': '+ question);
            }
        } else if (subCommand == 'award') {
            if (!result || !result.question) {
                client.say(data.to, 'You currently have no active quiz running, start one by using !quiz your question');
                return false;
            } else {
                var millionaire = data.message.split(' ')[1];
                if (!millionaire) {
                    client.say(data.to, 'Please specify a winner using !quiz award winnernick');
                } else if (millionaire === data.from) {
                    client.say(data.to, 'You cheeky bastard, just !quiz gibap');
                } else {
                    var activeQuiz = result;
                    db.find({
                        selector: {
                            _id: 'points_' + data.to,
                            user: millionaire
                        }
                    }).then(function (result) {
                        var result = result.docs[0];
                        if (!result || !result.points) {
                            var points = 1;
                        } else {
                            var points = parseInt(result.points) + 1;
                        }
                        db.remove(activeQuiz._id, activeQuiz._rev);
                        db.put({
                            _id: 'points_' + data.to,
                            user: millionaire,
                            points: points
                        });

                        client.say(data.to, 'Mkay, gratz ' + data.message.split(' ')[1] + ' on being smarty pants. You now have score of ' + points + ' in total.');
                    });
                }
            }
        } else if (subCommand == 'gibap') {
            if (!result || !result.question) {
                client.say(data.to, 'You currently have no active quiz running, start one by using !quiz your question');
                return false;
            } else {
                db.remove(result._id, result._rev, function(err, response) {
                    if (err) { return console.log(err); }
                    client.say(data.to, 'Gratz everyone on not being intelligent @ ' + data.from + ' question: ' + result.question);
                });
            }
        }
    }).catch(function (err) {
        console.log('FIND ERROR:');
        console.log(err);
    });
}

const data = [{
    command     : 'quiz',
    callback    : doQuiz,
    public      : true,
    receive     : ['from', 'to', 'message']
}];

module.exports = {
    doQuiz,
    data
};
