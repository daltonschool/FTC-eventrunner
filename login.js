/**
 * Created by davis on 3/4/15.
 */
if (Meteor.isClient) {
  Template.login.events({
    "submit .loginForm": function(event) { // custom login form
      var username = event.target.username.value;
      var password = event.target.password.value;
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


}