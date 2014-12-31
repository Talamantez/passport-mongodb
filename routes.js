var passport = require('passport');
var Account = require('./models/account');

module.exports = function (app) {

  app.get('/', function (req, res) {
      res.render('index', { user : req.user });
  });

  app.get('/register', function(req, res) {
      res.render('register', { });
  });

  app.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { info : "account already exists" });
        }

        passport.authenticate('local')(req, res, function () {
          res.redirect('/');
        });
    });
  });

  app.get('/login', function(req, res) {
      res.render('login', { user : req.user });
  });

  app.post('/login',function(req, res, next) {

     passport.authenticate('local', function(err, user, info, link){
        if ( err ) { return next(err); }
        if ( !user ) { return res.render('login', {info : "Either the username or password is incorrect or the user doesn't exist yet. You can register ", link: "register"});
          }
        req.logIn(user, function(err) {
          if (err){ return next(err); }
          return res.redirect('/');
        });
     })(req, res, next);
  });

  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });

  app.get('/ping', function(req, res){
      res.send("pong!", 200);
  });

};