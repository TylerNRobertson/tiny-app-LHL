const express = require('express');

const cookieParser = require('cookie-parser')

const app = express();

const methodOverride = require('method-override')

const PORT = process.env.PORT || 8080; // default port 8080

app.set('view engine', 'ejs');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

// Object Database of short and their matching long URLS

let urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

// let urlDatabase = {
//   'b2xVn2': {
//     shortURL: 'b2xVn2',
//     longURL: 'http://www.lighthouselabs.ca',
//     user_Id: '1223422'
//   },
// };
// Users Object

const users = {
  '1223422': {
    id: '1223422',
    email: 'tylerr@tnrdesign.net',
    password: 'hello'
  }
}

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
  let templateVars = {
                        urls: urlDatabase,
                        user: users[req.cookies['user_Id']]
                     };
  res.render('urls_index', templateVars);
});

// Get the Long URL
app.get('/u/:shortURL', (req, res) => {
  let longURL = urlDatabase.longURL
  res.redirect(longURL);
});

// Main get request form urls_new to create/add new shortened URLs
app.get('/urls/new', (req, res) => {
  let templateVars = {
                      user_Id: req.cookies['user_Id']
                     };
  res.render('urls_new', templateVars);
});

// Assign an object key to both the short and long URL to be accessed by urls_show
app.get('/urls/:id', (req, res) => {
  let templateVars = { shortURL: req.params.id,
                       longURL: urlDatabase[req.params.id],
                       user_Id: req.cookies['user_Id']
                     };
  res.render('urls_show', templateVars);
});

// Registration
app.get('/register', (req, res) => {
  res.render('register');
})
// Login
app.get('/', (req, res) => {
  res.render('login')
})
// --------------------    Post Routes    -------------------------

// create short URL
app.post('/urls', (req, res) => {
  shortURL = generateRandomString();
  longURL = req.body.longURL
  urlDatabase[shortURL] = longURL;
  res.redirect('/urls');
  res.send('Ok');
});

// URL Delete
app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls')
})

// Change Long URL
app.post('/urls/:id', (req, res) => {
  urlDatabase[req.params.id] = req.body.newURL
    res.redirect('/urls')
});

// Login cookie
app.post('/login', (req, res) => {
for (let userKey in users) {
  if (users[userKey]['email'] === req.body.email && users[userKey]['password'] === req.body.password){
    res.cookie('user_Id', userKey)
    res.redirect('/urls')
  }
}
res.status(400).end('That email and/or password do not exist')
})

// Remove login cookie
app.post('/logout', (req, res) => {
  res.clearCookie('user_Id');
  res.redirect('/urls')
})
// register
app.post('/register', (req, res) => {
  for (let userKey in users) {
    if (req.body.password !== users[userKey]['password']) {
      res.status(400).end('That is the inncorrect password for this account.')
    }
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
      password: req.body.password
    };
    res.cookie('user_Id', users[newUserId].id)
    res.redirect('/urls');
  });

// Logout

app.post('/logout', (req, res) => {
  req.session.user_id = null;
  res.redirect('/');
});

// Telling the app to listen to the defined port and only that port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
