const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const passport = require("passport");
const connectDB = require(`./config/db`);
const session = require("express-session");

//Load config
dotenv.config({ path: "./config/config.env" });

//Passport Config
require("./config/passport")(passport);
connectDB();

const app = express();

//Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Handlebars
// Add .engine after exphbs
app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: "hbs",
  })
);
app.set("view engine", ".hbs");

// Sessions Middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/index"));
app.use("auth/", require("./routes/auth"));

const PORT = process.env.PORT | 8500;

//Middleware

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
