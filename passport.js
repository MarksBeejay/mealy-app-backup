const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('./src/models/User');
// const { sendConfirmationTokenEmail } = require('./src/utils/emailUtils');
// const {generateToken} = require('./src/utils/cryptoToken')

passport.use(
  new GoogleStrategy(
    {
      clientID: '35643656500-lin24lc7k1s50aur7at0jg08t0vhrj3d.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/users/auth/google/callback' // Update this URL to match the app's route
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // User already exists, authenticate the user
          done(null, user);
        } else {
          // User doesn't exist, create a new user account
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            isConfirmed: true,
            googleId: profile.id,
            googleAccessToken: accessToken,
            googleRefreshToken: refreshToken,
          });

          await user.save();

          done(null, user);
        }
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
    // Store only the user ID in the session
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
      // Fetch the user object from the MongoDB database based on the ID
    const user = await User.findById(id);
    // If the user is found, pass it to the next middleware or route handler
    if (user) {
        done(null, user);
      } else {
        // If the user is not found, pass an error to indicate the failure
        done(new Error('User not found'));
      }
  } catch (error) {
    done(error);
  }
});

module.exports = passport;