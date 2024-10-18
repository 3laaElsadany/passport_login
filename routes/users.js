const express = require("express");
const routerLog = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../model/User")
const passport = require("passport");

routerLog.get("/login", (req, res) => {
  const errors = [];
  res.render("login", {
    errors
  });
})


routerLog.get("/register", (req, res) => {
  const errors = [];
  // const success='';
  // const msg='';
  res.render("register", {
    errors
  });
})

routerLog.post("/register", (req, res) => {
  const {
    name,
    email,
    password,
    password2
  } = req.body;
  const errors = [];


  if (name.length === 0 || email.length === 0 || password.length === 0 || password2.length === 0) {
    errors.push({
      msg: "Please fill in all fields"
    })
  }

  if (password !== password2) {
    errors.push({
      msg: "password do not match"
    })
  }

  if (password.length < 6) {
    errors.push({
      msg: "Password should be at last 6 characters"
    })
  }

  console.log(errors)

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2
    })
  } else {

    User.findOne({
        email
      })
      .then(async (user) => {
        if (user) {
          errors.push({
            msg: "Email is already registerd"
          })
          res.render("register", {
            errors,
            name,
            email,
            password,
            password2
          })
        } else {

          const hashPassword = await bcrypt.hash(password, 10);

          const newUser = await new User({
            name,
            email,
            password: hashPassword
          })
          console.log(newUser)
          await newUser.save()
            .then(() => {
              req.flash("error_msg", "You are now registerd and can login")
              res.redirect("/users/login")
            })
            .catch(err => console.log(err))
        }
      })

  }
})

routerLog.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
})

routerLog.get("/logout", (req, res) => {

  req.flash("success_msg", "You are logged")
  res.redirect("/users/login")
})

module.exports = routerLog;