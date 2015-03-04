/**
 * Created by davis on 3/4/15.
 */
Template.addQueuer.events({
  'click .promote': function(event) {
    event.preventDefault();
    var u  = $(event.currentTarget).parent().children("input").val();
    var o = Meteor.users.findOne({'username': u});
    if (o) {
      Meteor.call("makeQueuer", o._id);
    }
    else {
      console.log("not a valid user.");
    }
    return false;
  },
  'click .demote': function(event) {
    event.preventDefault();
    var u  = $(event.currentTarget).parent().children("input").val();
    var o = Meteor.users.findOne({'username': u});
    if (o) {
      console.log(o.username);
      console.log(o._id);
      Meteor.call("demoteQueuer", o._id);
    }
    else {
      console.log("not a valid user.");
    }
    return false;
  }
});

Template.addQueuer.helpers({
  "users": function() {
    return Meteor.users.find({}).fetch();
  },
  "queuers": function() {
    return Roles.getUsersInRole('queuer');
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