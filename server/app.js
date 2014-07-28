/**
 * signup server
 */
var express = require('express'),
    app = express(),
    http = require('http').Server(app),
    bodyParser = require('body-parser');

// Express configuration
app.set('root', __dirname);
app.set('views', __dirname + '/dev/views');
app.set('view engine', 'jade');

// Express modules
app.use(express.static(require('path').join(__dirname, '../client')));
app.use(bodyParser.json());

// redirect / to /signup form
app.get('/', function(req, res) {
  res.redirect('/signup');
});

// render signup page using Jade
app.get('/signup', function(req, res) {
  res.render('signup');
});

// hardcoded database
var db = [
  {first: 'john', last: 'smith', email: 'john@anonymous.com'},
  {first: 'jack', last: 'smith', email: 'jack@anonymous.com'},
  {first: 'jim', last: 'smith', email: 'jim@anonymous.com'},
];

// target for form submit
app.post('/user', function(req, response) {
  var first = req.body.first;
  var last = req.body.last;
  var email = req.body.email;
  var password = req.body.password;
  var verification = req.body.verification;

  var error = null;
  // regexp from https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js#L4
  var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;

  // check for valid inputs
  if (!first || !last || !email || !password || !verification) {
    error = 'All fields are required';
  } else if (first !== encodeURIComponent(first)) {
    error = 'First name may not contain any non-url-safe characters';
  } else if (last !== encodeURIComponent(last)) {
     error = 'Last name may not contain any non-url-safe characters';
  } else if (!email.match(EMAIL_REGEXP)) {
    error = 'Email is invalid';
  } else if (password !== verification) {
    error = 'Passwords don\'t match';
  }
  
  if (error) {
    response.status(403);
    response.render('signup', {
      error: error
    });
    return
  }

  // check if username is already taken
  for (var i = 0; i < db.length; i++) {
    if ((db[i].first === first) && (db[i].last === last)) {
      response.status(403);
      response.render('signup', {
        error: 'You have already signed up'
      });
      return;
    }
  }

  // create the user
  var user = {
    first: first,
    last: last,
    password: password,
    createdAt: Date.now()
  };

  // send the user back (for now)
  response.status(200).jsonp(user);
});

http.listen(3000, function(){
   console.log('signup server started...');
});
