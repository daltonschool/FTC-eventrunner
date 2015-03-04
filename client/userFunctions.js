/**
 * Created by davis on 3/4/15.
 */
Template.followTeam.helpers({
  phoneNumber: function() {
    return Meteor.user().profile.number || '';
  },
  teamsFollowing: function() {
    return Teams.find({followers: Meteor.userId()});
  }
});

Template.followTeam.events({
  'click button.remove-team': function(event) {
    Meteor.call('unfollowTeam', event.currentTarget.id, Meteor.userId());
  },
  'submit .newNumber': function(event) {
    event.preventDefault();

    var phoneNumber = event.target.number.value;
    var team = event.target.team.value;

    Meteor.users.update(Meteor.userId(), {$set: {'profile.number': phoneNumber}});

    Meteor.call('followTeam', team, Meteor.userId());

    return false;
  }
});