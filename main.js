//Schedules = new Mongo.Collection("schedules");
Teams = new Mongo.Collection('teams');
Events = new Mongo.Collection('events');
if (Meteor.isClient) {
  Meteor.subscribe("users");
  Meteor.subscribe("teams");
  Meteor.subscribe("events");

  Session.setDefault('table', null); // This variable holds the table once the data's entered.
  Session.setDefault('labels', ['Number', 'RED 1', 'RED 2', 'BLUE 1', 'BLUE 2']); // Headers I want shown. Can be changed.
  Session.setDefault('eventID', "1"); // This will be variable for multiple events eventually, but now we're only doing one event.
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Roles.addUsersToRoles("tvK9jubLFHwnvCTK2", ['admin']);
    Roles.addUsersToRoles("dCddD28wbLyj5W2hr", ['queuer']);
  });

  Meteor.publish("schedules", function() {
    return Events.find();
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

