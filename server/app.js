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

// TODO use get()/set() or some other more elegant strategy
var conf = {
  test: true
};

// show the app page using Jade
app.get('/', function(req, res) {
  res.render('app', conf);
});

// render signup page using Jade
app.get('/signup', function(req, res) {
  res.render('signup', conf);
});

//render signup thanks page using Jade
app.get('/signup/thanks', function(req, res) {
  res.render('thanks', conf);
});

// hardcoded database
var db = [
  {first: 'john', last: 'smith', email: 'john@anonymous.com'},
  {first: 'jack', last: 'smith', email: 'jack@anonymous.com'},
  {first: 'jim', last: 'smith', email: 'jim@anonymous.com'},
];

// target for form submit
app.post('/user', function(req, res) {
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
    res.status(403);
    res.render('signup', {
      error: error
    });
    return
  }

  // check if username is already taken
  for (var i = 0; i < db.length; i++) {
    if (db[i].email === email) {
      res.status(403).jsonp({
        alreadySignedUp: true
      });
      return;
    }
  }

  // create user
  var user = {
    first: first,
    last: last,
    password: password,
    createdAt: Date.now()
  };

  // TODO store user

  // move to next page
  var next = {
    user: user,
    location: 'thanks'    
  };

  // show the 'thanks' page 
  res.status(200).jsonp(next);
});

http.listen(3000, function(){
   console.log('signup server started...');
});
