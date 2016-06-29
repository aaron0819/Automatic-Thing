
const request = require('request');
const express = require('express');
const session = require('express-session');
const port = process.env.PORT || 3000;
const app = express();
app.set('view engine', 'ejs');

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
  scope: 'scope:user:profile scope:trip scope:location scope:vehicle:profile scope:vehicle:events scope:behavior'
});

var api = require('./api');
var trips;
var vehicle;
var user;

function printTrips() {
  var tripIds = "";

  for (var i = trips.length - 1; i >= 0; i--) {
    tripIds += trips[i].id;
  }

  return tripIds;
}


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

  function saveToken(error, result) {
    if (error) {
      console.log('Access token error', error.message);
      res.send('Access token error: ' +  error.message);
      return;
    }

    // Attach `token` to the user's session for later use
    // This is where you could save the `token` to a database for later use
    req.session.token = oauth2.accessToken.create(result);
    
    request.get({
      uri: "https://api.automatic.com/trip/",
      headers: {Authorization: 'Bearer ' + req.session.token.token.access_token},
      json: true
    }, function(e, r, body) {
      if(e){
      } else{
        trips = body.results;
      }
      res.redirect('/trips');
    });
  }

  oauth2.authCode.getToken({
    code: code
  }, saveToken);
});

app.get('/welcome', (req, res) => {
  if (req.session.token) {
    // Display token to authenticated user
    console.log('Automatic access token', req.session.token.token.access_token);
    res.send('You are logged in.<br>Access Token: ' +  req.session.token.token.access_token + "<br />" + printTrips());
  } else {
    // No token, so redirect to login
    res.redirect('/');
  }
});

app.get('/trips', function(req, res) {
  console.log("/trips");

  for(var i = 0; i < trips.length; i++ ) {
    if(i % 2 == 0) {
      trips[i].ignition_on = 0;
      trips[i].ignition_off = -1;
    } else {
      trips[i].ignition_off = 1;
      trips[i].ignition_on = -1;
    }


    if(Math.floor( Math.random() * 20 ) > 15) {
      trips[i].engine_temperature = Math.floor(Math.random() * 17) + 500;
    } else {
      trips[i].engine_temperature = Math.floor(Math.random() * 17) + 200;
    }
  }

  res.render('trips', {
    trips: trips
  });
});

// Main page of app with link to log in
app.get('/', (req, res) => {
  res.send('<html>
    <head>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script type="text/javascript" src="/assets/script/jquery.canvasjs.min.js"></script> 
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
        </head>
    <body>
        <div class="container">
            <div class="row">
                  <div class="col-md-8">
                                       <br/>
                        <img style="border-radius: 5px;" src="http://i.imgur.com/3U6rueQ.jpg" alt="Smiley face">
                        <br/>
                        </div>
                         <div class="col-md-2 col-md-offset-1">
                               
                                <a style="margin-top:300px;" class="btn btn-success" href="/auth">Log in with Automatic</a>
                            </div>
            
            </div>
            </div>
      </body>
</html>');
});

app.get('/claims', function(req, res) {
  console.log("/claims");

  request.get({
    uri: "https://api.automatic.com/user/me/",
    headers: {Authorization: 'Bearer ' + req.session.token.token.access_token},
    json: true
  }, function(e, r, body) {
    if(e){
    } else{
      user = body;

      request.get({
        uri: "https://api.automatic.com/vehicle/",
        headers: {Authorization: 'Bearer ' + req.session.token.token.access_token},
        json: true
      }, function(e, r, body) {
        if(e){
        } else{
          vehicle = body.results[0];
        }
      });

      res.render('claims', {
        trips: trips,
        vehicle: vehicle,
        user: user
      });

    }
  });
});

app.get('/claims2', function(req, res) {
  console.log("/claims2");

  request.get({
    uri: "https://api.automatic.com/user/me/",
    headers: {Authorization: 'Bearer ' + req.session.token.token.access_token},
    json: true
  }, function(e, r, body) {
    if(e){
    } else{
      user = body;

      request.get({
        uri: "https://api.automatic.com/vehicle/",
        headers: {Authorization: 'Bearer ' + req.session.token.token.access_token},
        json: true
      }, function(e, r, body) {
        if(e){
        } else{
          vehicle = body.results[0];
        }
      });

      res.render('claims2', {
        trips: trips,
        vehicle: vehicle,
        user: user
      });

    }
  });
});

app.get('/claims3', function(req, res) {
  console.log("/claims3");

  request.get({
    uri: "https://api.automatic.com/user/me/",
    headers: {Authorization: 'Bearer ' + req.session.token.token.access_token},
    json: true
  }, function(e, r, body) {
    if(e){
    } else{
      user = body;

      request.get({
        uri: "https://api.automatic.com/vehicle/",
        headers: {Authorization: 'Bearer ' + req.session.token.token.access_token},
        json: true
      }, function(e, r, body) {
        if(e){
        } else{
          vehicle = body.results[0];
        }
      });

      res.render('claims3', {
        trips: trips,
        vehicle: vehicle,
        user: user
      });

    }
  });
});

app.get('/claims', function(req, res) {
  console.log("/claims");

  request.get({
    uri: "https://api.automatic.com/user/me/",
    headers: {Authorization: 'Bearer ' + req.session.token.token.access_token},
    json: true
  }, function(e, r, body) {
    if(e){
    } else{
      user = body;

      request.get({
        uri: "https://api.automatic.com/vehicle/",
        headers: {Authorization: 'Bearer ' + req.session.token.token.access_token},
        json: true
      }, function(e, r, body) {
        if(e){
        } else{
          vehicle = body.results[0];
        }
      });

      res.render('claims', {
        trips: trips,
        vehicle: vehicle,
        user: user
      });

    }
  });
});

app.get('/claims4', function(req, res) {
  console.log("/claims4");

  res.render('claims4', {
    trips: trips,
    vehicle: vehicle,
    user: user
  });
});

app.get('/dashboard', function(req, res) {
  console.log("/dashboard");

  res.render('dashboard-new', {
  });
});

// Start server
app.listen(port);

console.log('Express server started on port ' + port);
