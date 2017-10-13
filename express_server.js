const express = require('express');

const cookieParser = require('cookie-parser')

const cookieSession = require('cookie-session')

const bcrypt = require('bcrypt');

const app = express();

const methodOverride = require('method-override')

const PORT = process.env.PORT || 8080; // default port 8080

app.set('view engine', 'ejs');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ['Key1', 'Key2'],
  maxAge: 24 * 60 * 60 * 1000
}));

// Object Database of short and their matching long URLS

let urlDatabase = {
  'b2xVn2': {
    shortURL: 'b2xVn2',
    longURL: 'http://www.lighthouselabs.ca',
    user_Id: '1223422'
  },
  '9sm5xK': {
    shortURL: 'b2xVn2',
    longURL: 'http://www.google.com',
    user_Id: '1223422'
  }
};

// users

const users = {}

// Generate random shortURL value
function generateRandomString() {
  let text = '';
  let charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
  for( var i = 0; i < 5; i++ ) {
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return text;
};

// Generate Random User ID
function generateRandomNumber() {
  let userID = Math.random();
  return userID;
}

// -------------------- Routing Functions -------------------------

// --------------------     Get Routes    -------------------------

// Sending urlDatabase data within the urls key

app.get('/urls', (req, res) => {
  let userURLS = {}
  for (let urls in urlDatabase) {
    if (urlDatabase[urls]['user_Id'] === req.session.user_Id) {
      userURLS[urls] = urlDatabase[urls]
    }
  }
  let templateVars = {
                        urls: userURLS,
                        user: users[req.session.user_Id]
                     };
  res.render('urls_index', templateVars);
});

// Get the Long URL

app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL
  res.redirect(longURL);
});

// Main get request form urls_new to create/add new shortened URLs

app.get('/urls/new', (req, res) => {
  let templateVars = {
                      user: users[req.session.user_Id]
                     };
  res.render('urls_new', templateVars);
});

// Assign an object key to both the short and long URL to be accessed by urls_show

app.get('/urls/:id', (req, res) => {
  let templateVars = { shortURL: req.params.id,
                       longURL: urlDatabase[req.params.id]['longURL'],
                       user: users[req.session.user_Id]
                     };
  res.render('urls_show', templateVars);
});

// Registration

app.get('/register', (req, res) => {
  res.render('register');
})
// Login

app.get('/login', (req, res) => {
  res.render('login')
})
// --------------------    Post Routes    -------------------------

// create short URL

app.post('/urls', (req, res) => {
  shortURL = generateRandomString();
  longURL = req.body.longURL
  urlDatabase[shortURL] = {
    shortURL: shortURL,
    longURL: longURL,
    user_Id: req.session.user_Id
  }
  res.redirect('/urls')
});

// URL Delete

app.post('/urls/:id/delete', (req, res) => {
if (urlDatabase[urls]['user_Id'] === req.session['user_Id']) {
  delete urlDatabase[req.params.id];
  res.redirect('/urls')
}
if (urlDatabase[urls]['user_Id'] === req.session['user_Id']) {
  res.status(400).end('You can only edit/delete your own URL')
}})
// Change Long URL

app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id]['longURL'] = req.body.newURL
    res.redirect('/urls')
});

// Login cookie

app.post('/login', (req, res) => {
for (let userKey in users) {
  if (users[userKey]['email'] === req.body.email && bcrypt.compareSync(req.body.password, users[userKey]['password'])){
    req.session['user_Id'] = userKey
    res.redirect('/urls')
  }
}
res.status(400).end('That email and/or password do not exist')
})

// Register

app.post('/register', (req, res) => {
  for (let userKey in users) {
    if (users[userKey]['email'] === req.body.email) {
      res.status(400).end('That email is already in use. Please choose another')
    }
  }
  if (req.body.email === '') {
    res.status(400).end('Please put in a valid email address')
  }
  if (req.body.password === '') {
    res.status(400).end('Please include a password')
  }
  if (req.body.password === '' && req.body.email === '') {
    res.status(400).end('Please include an email and password')
  }
    // generates a new id and assigns it into database
    let newUserId = generateRandomNumber();
    users[newUserId] = {
      id: newUserId,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10)
    };
    req.session['user_Id'] = users[newUserId].id
    res.redirect('/urls');
  });

// Logout

app.post('/logout', (req, res) => {
  req.session['user_Id'] = null;
  res.redirect('login');
});

// Telling the app to listen to the defined port and only that port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
