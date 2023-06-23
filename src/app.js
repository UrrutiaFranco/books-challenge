const express = require('express');
const mainRouter = require('./routes/main');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const sessionUser = require("./middleware/sessionUser");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', 'src/views');
app.use(session({
  secret: "userBooks",
  resave: false,
  saveUninitialized: true
}));
app.use(cookieParser());
app.use(sessionUser);
app.use('/', mainRouter);

app.listen(3000, () => {
  console.log('listening in http://localhost:3000');
});
