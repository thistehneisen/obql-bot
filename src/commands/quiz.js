var PouchDB = require('pouchdb');
var db = new PouchDB('data/quiz');
PouchDB.plugin(require('pouchdb-find'));
PouchDB.plugin(require('pouchdb-upsert'));

function upsertPoints(doc) {
    doc.points = doc.points || 0;
    doc.points++;
    return doc;
}

const setPoints = (to, account, points, client) => {
    var id = 'points_' + to + '_' + account;
    db.find({
        selector: {
            _id: id
        }
    }, function(err, response) {
        if (err) { return console.log(err); }
        return false;
    }).then(function (result) {
        var result = result.docs[0];

        if (!result || !result.points) { var setPoints = 1; }
        else { var setPoints = parseInt(result.points) + points; }

        db.upsert(id, upsertPoints).then(function(res) {
            client.say(to, 'Mkay, gratz ' + account + ' on being smarty pants. You now have score of ' + setPoints + ' in total.');
        }).catch(function (err) {
            console.log(err);
        });
    });
}

const subCommand = (action = 'main', data, result, question, id) => {
    if (action == 'main') {
        if (!question) {
            if (!result || !result.question)
                client.say(data.to, 'You currently have no active quiz running. Create one by using !quiz your question');
            else
                client.say(data.to, 'Your active quiz is: ' + result.question + ' created @ ' + result.time + ' — !quiz gibap to disregard it or !quiz award nickname.');
        } else if (result && result.question) {
            client.say(data.to, 'Yuo already haz a quiz goin: ' + result.question + ' @ ' + result.time + ' — use !quiz gibap to disregard or !quiz award nickname.');
        } else {
            db.put({
                _id: id,
                question: question,
                time: Date.now()
            }, function(err, response) {
                if (err) { return console.log(err); }
                return false;
            });
            client.say(data.to, 'New quiz started by ' + data.from + ': ' + question + '. Use !quiz gibap or !quiz award nickname when suitable.');
        }
    } else if (action == 'award') {
        if (!result || !result.question) {
            client.say(data.to, 'You currently have no active quiz running, start one by using !quiz your question');
            return false;
        } else {
            var account = data.message.split(' ')[1];
            if (!account) {
                client.say(data.to, 'Please specify a winner using !quiz award winnernick');
            } else if (account === data.from) {
                client.say(data.to, 'You cheeky bastard, just !quiz gibap');
            } else {
                var points = setPoints(data.to, account, 1, client);
                db.remove(result._id, result._rev);
            }
        }
    } else if (action == 'gibap') {
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
}

const doQuiz = (data) => {
    const subCommands = ['award', 'gibap'];
    var question = data.message,
        action = data.message.split(' ')[0],
        id = data.to + '_' + data.from;
    
    if (subCommands.indexOf(action) == -1)
        action = undefined;

    db.find({
        selector: {
            _id : id
        }
    }).then(function (result) {
        var result = result.docs[0];
        subCommand(action, data, result, question, id);
    });
}

const data = [{
    command     : 'quiz',
    callback    : doQuiz,
    public      : false,
    receive     : ['from', 'to', 'message']
}];

module.exports = {
    doQuiz,
    data
};
