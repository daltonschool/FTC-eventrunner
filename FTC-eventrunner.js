

if (Meteor.isClient) {
    // counter starts at 0
    Session.setDefault('counter',0); // from the example

    Session.setDefault('table', null); // This variable holds the table once the data's entered.
    Session.setDefault('labels', ['Number', 'RED 1', 'RED 2', 'BLUE 1', 'BLUE 2']); // Headers I want shown. Can be changed.

    Template.tbl.helpers({
        // renders the labels for the match table
        labels: function() {
            var labels = Session.get('labels');
            var d = [];
            for (var i = 0; i < labels.length; i++) {
                d.push({label: labels[i]});
            }
            return d;
        },
        // renders rows for the match table
        rows: function() {
            var d = Session.get('table');
            var labels = Session.get('labels');
            var rows = [];
            for(var i = 0; i < d['Number'].length; i++) {
                var d2 = {elements: []};
                for (var j = 0; j < labels.length; j++) {
                    d2.elements.push({element: d[labels[j]][i]});
                }
                rows.push(d2);
            }
            return rows;
        }
    });

    Template.hello.helpers({
        counter: function () {
            if (Meteor.userId())
                return Meteor.users.findOne({_id: Meteor.userId()}).profile.counter;
            else
                return Session.get('counter');
        }
    });
    Template.hello.events({
        'click button': function () {
            // increment the counter when button is clicked
            if (Meteor.userId()) {
                Meteor.users.update({_id: Meteor.userId()}, {$inc: {'profile.counter': 1}});
            }
            else {
                Session.set('counter', Session.get('counter') + 1);
            }
        }
    });

    Template.csvInput.events({
        'submit .new-task': function(event) {
            var text = event.target.text.value;
            Session.set('table', parseCSV(text));
            return false;
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}

function parseCSV(s) {
    var d = Papa.parse(s).data;
    var final = {};
    for (var i = 0; i < d[0].length; i++) {
        final[d[0][i]] = [];
    }
    for (i = 1; i < d.length; i++) {
        for (var j = 0; j < d[i].length; j++) {
            final[d[0][j]].push(d[i][j]);
        }
    }
    return final;
}

if (Meteor.isServer) {
    Meteor.startup(function () {
    // code to run on server at startup
    });
}
