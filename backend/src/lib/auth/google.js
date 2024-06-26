(await import("dotenv")).config();
import passport from "passport";
import { Router } from "express";
import { getUserById, postUser } from "../../db/query/user-query.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";

const googleOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.LOCAL_URL + "/api/auth" + "/google/callback",
  passReqToCallback: true,
};
const googleVerify = async (req, accessT, refreshT, profile, done) => {
  try {
    console.log("profile", profile._json);
    const { id, displayName: name, email } = profile;
    const [result] = await getUserById(email);

    result.length == 0 && (await postUser(email, name));

    return done(null, { id: email, role: "user" });
  } catch (error) {
    return done(error, null);
  }
};

// Google 2.0 OAuth strategy
passport.use(new GoogleStrategy(googleOptions, googleVerify));

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, user);
  });
});

passport.deserializeUser(function (user, cb) {
  // console.log("deserialize: ", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

const router = Router();
router.get(
  "/",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "/api/auth/success",
    failureRedirect: "/api/auth/failure",
  })
);

export default router;
