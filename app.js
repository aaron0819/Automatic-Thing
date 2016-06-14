var request = require('request')
const express = require('express');
const session = require('express-session');
const port = process.env.PORT || 3000;
const app = express();
var holder;
// Add your automatic client id and client secret here or as environment variables
const AUTOMATIC_CLIENT_ID = process.env.AUTOMATIC_CLIENT_ID || '2ee3c7c2f4b652fc1ee1';
const AUTOMATIC_CLIENT_SECRET = process.env.AUTOMATIC_CLIENT_SECRET || 'ba1590bcd38c31a310d79726e6be9a89d383aa69';

const oauth2 = require('simple-oauth2')({
  clientID: AUTOMATIC_CLIENT_ID,
  clientSecret: AUTOMATIC_CLIENT_SECRET,
  site: 'https://accounts.automatic.com',
  tokenPath: '/oauth/access_token'
});

// Authorization uri definition
const authorizationUri = oauth2.authCode.authorizeURL({
  scope: 'scope:user:profile'
});

// Enable sessions
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// Initial page redirecting to Automatic's oAuth page
app.get('/auth', (req, res) => {
  res.redirect(authorizationUri);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/redirect', (req, res) => {
  const code = req.query.code;
 holder = "this needs to change";
  function saveToken(error, result) {
    if (error) {
      console.log('Access token error', error.message);
      res.send('Access token error: ' +  error.message);
      return;
    }
  
    // Attach `token` to the user's session for later use
    // This is where you could save the `token` to a database for later use
    req.session.token = oauth2.accessToken.create(result);
    app.get({
        uri: "https://api.automatic.com/device/",
        headers: {Authorization: 'bearer ' + req.session.token.token.access_token},
        json: true
      }, function(e, r, body) {
        if(e){
          holder = e;
        }
        holder.jsonHolder= body;
        holder.tester = " Testing to see if it hits this";
      });
    res.redirect('/welcome');
  }

  oauth2.authCode.getToken({
    code: code
  }, saveToken);
});

app.get('/welcome', (req, res) => {
  if (req.session.token) {
    // Display token to authenticated user
    console.log('Automatic access token', req.session.token.token.access_token);
    res.send(holder + 'You are logged in.<br>Access Token: ' +  req.session.token.token.access_token + " " + holder.jsonHolder +"<br>"+ holder.tester);
  } else {
    // No token, so redirect to login
    res.redirect('/');
  }
});

// Main page of app with link to log in
app.get('/', (req, res) => {
  res.send('<a href="/auth">Log in with Automatic</a>');
});

// Start server
app.listen(port);

console.log('Express server started on port ' + port);
