const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user exists based on googleId
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if user exists with same email (if so, link accounts or error?)
        // For now, we'll try to link if email matches, otherwise create new
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // Update user to include googleId
          user.googleId = profile.id;
          user.authProvider = "google"; // or "both"? keeping it simple
          if (!user.profilePicture) user.profilePicture = profile.photos[0].value;
          await user.save();
          return done(null, user);
        }

        // Create new user
        user = new User({
          userName: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          profilePicture: profile.photos[0].value,
          authProvider: "google",
          isEmailVerified: true // Google emails are verified
        });

        await user.save();
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// Serialize user for session (or token generation reference)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
