/**
 * Created by davis on 3/4/15.
 */
Template.body.helpers({
  "getEvent": function() {
    var s = Session.get("eventID");
    if (s)
      return s;
    else
      return null;
  }
});

Template.body.events({

});