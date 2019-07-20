const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const publicPath = path.join(__dirname, '../public');
const PORT = 3000;

const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

const userTable = {
  eliot: {
    username: 'eliot',
    password: 'password',
  },
};

app.use((req, res, next) => {
  if (!req.session.count) {
    req.session.count = 0;
  }

  ++req.session.count;

  next();
});

app.use(express.static(publicPath));

app.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  if (username && password) {
    if (userTable[username]) {
      if (userTable[username].password === password) {
        req.session.user = username;

        res.status(200).send('You are logged in!');
      } else {
        res.status(401).send('Unauthorized, wrong password entered.');
      }
    } else {
      res.status(401).send('Unauthorized, please create a user account.');
    }
  } else {
    res.status(401).send('Unauthorized, please try again.');
  }
});

app.get('/whoami', (req, res) => {
  res.send(req.session.user ? req.session.user : 'Not logged in.');
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
