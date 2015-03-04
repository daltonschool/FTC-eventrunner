/**
 * Created by davis on 3/4/15.
 */
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