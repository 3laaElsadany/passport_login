const express = require("express")
const app = express();
const router = require("./routes/index")
const routerLog = require("./routes/users")
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const db = require("./config/keys");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
require("./config/passport")(passport)

const port = 8080;

mongoose.connect(db.mongoURL)
  .then(() => console.log("Connected To DB"))
  .catch((err) => console.log(err))

app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(express.urlencoded({
  extended: false
}));
app.use(express.json())

app.use(session({
  secret: "secret",
  saveUninitialized: true,
  resave: true
}))

app.use(passport.initialize())
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
})


app.use("/", router);
app.use("/users", routerLog);

app.listen(port, () => console.log(`Server Running At http://localhost:${port}`))