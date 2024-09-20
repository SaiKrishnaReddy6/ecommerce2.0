const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Seller = require('../models/seller');

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const seller = await Seller.authenticate()(email, password);
        if (!seller) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        return done(null, seller);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((seller, done) => {
  done(null, seller.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const seller = await Seller.findById(id);
    if (!seller) {
      return done(null, false);
    }
    return done(null, seller);
  } catch (error) {
    return done(error);
  }
});
