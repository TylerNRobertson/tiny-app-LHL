var express = require("express");

var app = express();

var methodOverride = require('method-override')

var PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

// Generate random shortURL value
function generateRandomString() {
  var text = "";
  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  for( var i = 0; i < 5; i++ ) {
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return text;
};

// Object Database of short and their matching long URLS
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Sending urlDatabase data within the urls key
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// Main get request form urls_new to create/add new shortened URLs
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// create short URL
app.post("/urls", (req, res) => {
  shortURL = generateRandomString();
  longURL = req.body.longURL
  urlDatabase[shortURL] = longURL;
  res.redirect(longURL);
  res.send("Ok");
});

// URL Delete
app.post('/urls/:id/delete', function (req, res) {
  res.send('Got a DELETE request at /user')
  res.redirect("../views/urls_index")
})

// New URL update
app.post("/urls/:id", (req, res) => {
    urlDatabase[req.params.id] = {
      longURL: req.body.newURL }
    res.send('Got a url change request <html><a href="/urls">Go back to URLS</a></html>')
    res.redirect('/urls')
});

// Get the Long URL
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase.longURL
  res.redirect(longURL);
});

// Assign an object key to both the short and long URL to be accessed by urls_show
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id,
                       longURL: urlDatabase[req.params.id]
                     };
  res.render("urls_show", templateVars);
});

// Telling the app to listen to the defined port and only that port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
