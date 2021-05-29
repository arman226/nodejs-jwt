require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

//allows the app to use json from the body
app.use(express.json());

//artifial Database || storage of refresh Tokens
let refreshTokens = [];

//for auth
app.post("/login", (req, res) => {
  // TODO: Authenticate the user
  const username = req.body.username;
  const user = { name: username };

  const accessToken = generateToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN);
  refreshTokens.push(refreshToken);
  res.json({ accessToken, refreshToken });
});

//for request of a new token with the help of refresh token
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  // checks refresh token's validity
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    // if valid, it'll generate a new access token
    const accessToken = generateToken({ name: user.name });
    res.json({ accessToken });
  });
});

//removes refresh token from the list
app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

function generateToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "15s" });
}

app.listen(4000);
