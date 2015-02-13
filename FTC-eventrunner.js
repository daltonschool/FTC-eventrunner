if (Meteor.isClient) {
    // counter starts at 0
    Session.setDefault('counter',0);

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
        },
        'submit .new-task': function(event) {
            var text = event.target.text.value;
            console.log(Papa.parse(text));
            return false;
        }
    });



    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
    // code to run on server at startup
    });
}
