Meteor.methods({
  updateSchedule: function(obj, id) {
    if (!Roles.userIsInRole(Meteor.userId(), ["admin"])) {
      throw new Meteor.Error("not-authorized");
    }
    else {
      if (Schedules.findOne({event: id})) { // if a schedule exists, update it.
        Schedules.update({event: id}, {$set: {'sched': obj}});
      }
      else {
        Schedules.insert({ // create a new document
          event: id,
          sched: obj
        });
      }
    }
  },
  makeQueuer: function(id) {
    if (!Roles.userIsInRole(Meteor.userId(), ["admin"])) {
      throw new Meteor.Error("not-authorized");
    }
    else {
      Roles.addUsersToRoles(id, ["queuer"]);
    }
  },
  demoteQueuer: function(id){
    if (!Roles.userIsInRole(Meteor.userId(), ["admin"])) {
      throw new Meteor.Error("not-authorized");
    }
    else {
      Roles.removeUsersFromRoles(id, ["queuer"]);
    }
  },
  followTeam: function(teamNum, userId) {
    if (Teams.findOne({number: teamNum})) {
      if (Teams.findOne({number: teamNum}).followers.indexOf(userId) < 0) {
        Teams.update({number: teamNum}, {$push: {"followers": userId}});
      }
    }
    else {
      Teams.insert({
        number: teamNum,
        followers: [userId]
      })
    }
  },
  unfollowTeam: function(teamNum, userId) {
    if (Teams.findOne({number: teamNum})) { // if the team exists
      Teams.update({number: teamNum}, {$pull: {followers: userId}}); // pull the user from the followers array
    }
  },
  textFollowers: function(d, roundNum) {
    var labels = ['red1', 'red2', 'blue1', 'blue2'];
    for (var i = 0; i < labels.length; i++) {
      var tid = d[labels[i]]; // the team number for one of the teams in the match.
      if (Teams.findOne({number: tid})) { // if the team exists in the database
        var users = Teams.findOne({number: tid}).followers; // get the array of their followers
        for (var i = 0; i < users.length; i++) { // loop thru their followers
          var number = Meteor.users.findOne(users[i]).profile.number;
          if (number) { // if they have a phone number, send them a text.
            HTTP.post("https://api.twilio.com/2010-04-01/Accounts/"+twilioKey.sid+"/Messages.json",{
              params: {
                From: "+12018856228",
                To: number,
                Body: "Hello! Your team #"+tm+" is ready to queue on field " + (roundNum % 2 == 0 ? "2" : "1")+" for round #"+roundNum+"."
                // TODO: Have a variable number of fields (1,2,3 etc).
              },
              auth: twilioKey.sid +":"+ twilioKey.token
            });
          }
        }
      }
    }
  }
});