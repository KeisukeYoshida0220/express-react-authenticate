const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET;

// Used by the authenticated requests to deserialize the user,
// i.e., to fetch user derails from the JWT

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {

    // Check against the DB only if necessary.
    // This can  be avoided if you dont want to fetch user derails in each request.
    User.findOne({_id: jwt_payload._id}, (err, user) => {
      if(err){
        return done(err, false);
      }
      if(user){
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    })
  })
)