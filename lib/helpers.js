/**
 * Created by davis on 3/4/15.
 */
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