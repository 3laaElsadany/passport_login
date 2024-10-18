const passportLocal = require("passport-local");
const localStrategy = passportLocal.Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../model/User");

module.exports = (passport) => {
  passport.use(new localStrategy({
    usernameField: "email"
  }, (email, password, done) => {
    User.findOne({
        email
      })
      .then((user) => {
        if (!user) {
          return done(null, false, {
            message: "That email is not registerd"
          })
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "Password incorrect"
            })
          }
        })
      })
      .catch(err => console.log(err));
  }))
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    const dat = User.findById(id)
      .then(user => done(null, user))
      .catch(err => console.log(err))
  })
}