Schedules = new Mongo.Collection("schedules");
Teams = new Mongo.Collection('teams');

if (Meteor.isClient) {
    Meteor.subscribe("schedules");
    Meteor.subscribe("users");
    Meteor.subscribe("teams");

    // counter starts at 0
    Session.setDefault('counter',0); // from the example
    Session.setDefault('table', null); // This variable holds the table once the data's entered.
    Session.setDefault('labels', ['Number', 'RED 1', 'RED 2', 'BLUE 1', 'BLUE 2']); // Headers I want shown. Can be changed.
    Session.setDefault('eventID', "1"); // This will be variable for multiple events eventually, but now we're only doing one event.

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
            var d = Schedules.findOne({event: Session.get("eventID")}).sched;
            var labels = Session.get('labels');
            var rows = [];
            for(var i = 0; i < d['Number'].length; i++) {
                var d2 = {elements: [], indx: i};
                for (var j = 0; j < labels.length; j++) {
                    d2.elements.push({element: d[labels[j]][i]});
                }
                rows.push(d2);
            }
            return rows;
        }
    });

    Template.tbl.events({
        "click .queuer": function(event) {
            var indx = event.target.id;
            var row = Schedules.findOne({event: Session.get("eventID")}).sched;

            var d = {red1: row["RED 1"][indx], red2: row["RED 2"][indx], blue1: row["BLUE 1"][indx], blue2: row["BLUE 2"][indx]};

            Meteor.call('textFollowers', d, parseInt(indx)+1);
        }
    });

    Template.csvInput.events({
        'submit .new-task': function(event) {
            var text = event.target.text.value;
            console.log("click!");
            event.preventDefault();
            Session.set('table', parseCSV(text)); // parse

            Meteor.call("updateSchedule", Session.get('table'), Session.get('eventID'));

            return false;
        }
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
        Roles.addUsersToRoles("tvK9jubLFHwnvCTK2", ['admin']);
        Roles.addUsersToRoles("dCddD28wbLyj5W2hr", ['queuer']);
    });

    Meteor.publish("schedules", function() {
        return Schedules.find();
    });

    Meteor.publish("users", function () {
        return Meteor.users.find();
    });

    Meteor.publish("teams", function() {
        return Teams.find();
    });

    Meteor.publish(null, function (){
        return Meteor.roles.find({});
    });
}

