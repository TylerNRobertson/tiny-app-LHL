const express = require("express");

const cookieParser = require('cookie-parser')

const app = express();

const methodOverride = require('method-override')

const PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

// Object Database of short and their matching long URLS

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Generate random shortURL value
function generateRandomString() {
  let text = "";
  let charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  for( var i = 0; i < 5; i++ ) {
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return text;
};

// -------------------- Routing Functions -------------------------

// --------------------     Get Routes    -------------------------

// Sending urlDatabase data within the urls key
app.get("/urls", (req, res) => {
  let templateVars = {
                        urls: urlDatabase,
                        username: req.cookies["username"]
                     };
  res.render("urls_index", templateVars);
});

// Get the Long URL
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase.longURL
  res.redirect(longURL);
});

// Main get request form urls_new to create/add new shortened URLs
app.get("/urls/new", (req, res) => {
  let templateVars = {
                      username: req.cookies["username"]
                     };
  res.render("urls_new", templateVars);
});

// Assign an object key to both the short and long URL to be accessed by urls_show
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
                       longURL: urlDatabase[req.params.id],
                       username: req.cookies["username"]
                     };
  res.render("urls_show", templateVars);
});

// --------------------    Post Routes    -------------------------

// create short URL
app.post("/urls", (req, res) => {
  shortURL = generateRandomString();
  longURL = req.body.longURL
  urlDatabase[shortURL] = longURL;
  res.redirect('/urls');
  res.send("Ok");
});

// URL Delete
app.post('/urls/:id/delete', function (req, res) {
  delete urlDatabase[req.params.id];
  res.send('Deleted! <html><a href="/urls">Go back to URLS</a></html>')
  res.redirect("/urls")
})

// Change Long URL
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.newURL
    res.redirect('/urls')
});

// Login cookie
app.post('/login', function (req, res) {
  res.cookie('username', req.body.username)
  res.redirect('/urls')
})
// Remove login cookie
app.post('/logout', function (req, res) {
  res.clearCookie('username');
  res.redirect('/urls')
})

// Logout
app.post('/logout', (req, res) => {
  req.session.user_id = null;
  res.redirect('/');
});

// Telling the app to listen to the defined port and only that port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
