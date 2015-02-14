Schedules = new Mongo.Collection("schedules");

if (Meteor.isClient) {
    // counter starts at 0
    Session.setDefault('counter',0); // from the example

    Session.setDefault('table', null); // This variable holds the table once the data's entered.
    Session.setDefault('labels', ['Number', 'RED 1', 'RED 2', 'BLUE 1', 'BLUE 2']); // Headers I want shown. Can be changed.
    Session.setDefault('eventID', "1"); // This will be variable for multiple events eventually, but now we're only doing one event.

    Template.login.events({
        "submit .loginForm": function(event) { // custom login form
            var username = event.target.username.value;
            var password = event.target.password.value;
            console.log("BUTTON HIT");
            Meteor.loginWithPassword(username, password, function(error) {
                if (error) {
                    Session.set("warnings", "Invalid Username or Password.");
                } else {
                    Session.set("warnings", "");
                }
            });
            return false;
        }
    });
    Template.login.helpers({ // error label for login/signup
        "warnings": function() {
            return Session.get("warnings") || "";
        }
    });

    Template.signup.events({
        "submit #register-form": function(event) {
            var username = event.target.signupName.value;
            var password = event.target.signupPass.value;
            var confirm  = event.target.signupConf.value;

            if (password === confirm) { // if they typed the password correctly twice
                Accounts.createUser({username: username, password: password}, function(err) {
                    if (err) {
                        Session.set("warnings", "user already exists.")
                    } else {
                        $('.signup').modal('hide');
                    }
                })
            } else {
                Session.set("warnings", "you did not confirm your password.");
            }

            return false;
        }
    });
    Template.signup.helpers({
        "warnings": function() {
            return Session.get("warnings") || "";
        }
    });

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
                var d2 = {elements: []};
                for (var j = 0; j < labels.length; j++) {
                    d2.elements.push({element: d[labels[j]][i]});
                }
                rows.push(d2);
            }
            return rows;
        }
    });
    Template.csvInput.events({
        'submit .new-task': function(event) {
            var text = event.target.text.value;
            Session.set('table', parseCSV(text)); // parse

            if (Schedules.find({event: Session.get("eventID")}).count < 1) { // if there isn't any schedule with the ID
                Schedules.insert({ // create a new document
                    event: Session.get("eventID"),
                    sched: Session.get('table')
                });
            } else { // update an existing document.
                Schedules.update({event: Session.get("eventID")}, {$set: Session.get('table')});
            }


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
