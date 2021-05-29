require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

//#region constants
const posts = [
  {
    username: "Kyle",
    title: "post 1",
  },
  {
    username: "Armando",
    title: "post 2",
  },
];

//#endregion

//allows the app to use json from the body
app.use(express.json());

app.get("/posts", authenticate, (req, res) => {
  //this is to only give the data associated to the user through JWT
  res.json(posts.filter((post) => post.username === req.user.name));
});

//#region middleware
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) return res.sendStatus(402);

    req.user = user;
    next();
  });
}
//#endregion
app.listen(3000);
