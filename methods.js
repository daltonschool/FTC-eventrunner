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
    var stuff = ['red1', 'red2', 'blue1', 'blue2'];
    var ts = [];
    var allFollowers = {};
    var nums = {};
    for (var i = 0; i < stuff.length; i++) {
      var tid = d[stuff[i]];
      allFollowers[tid] = [];
      if (Teams.findOne({number: tid})) {
        allFollowers[tid] = Teams.findOne({number: tid}).followers;
      }
    }
    for (var t in allFollowers) {
      var users = allFollowers[t];
      nums[t] = [];
      for (var i = 0; i < users.length; i++) {
        var number = Meteor.users.findOne(users[i]).profile.number;
        if (number) {
          nums[t].push(number);
        }
      }
    }

    for (var tm in nums) {
      var toText = nums[tm];
      for (var i = 0; i < toText.length; i++) {
        HTTP.post("https://api.twilio.com/2010-04-01/Accounts/"+twilioKey.sid+"/Messages.json",{
          params: {
            From: "+12018856228",
            To: toText[i],
            Body: "Hello! Your team #"+tm+" is ready to queue on field " + (roundNum % 2 == 0 ? "2" : "1")+" for round #"+roundNum+"."
          },
          auth: twilioKey.sid +":"+ twilioKey.token
        });
      }
    }

    console.log(nums);

  },
  "testAJAX": function() {

  }
});