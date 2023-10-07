const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    key: "customerLogin",
    secret: "login",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "Tobinho1",
  database: "AAAClone",
});

app.post("/login-number", (req, res) => {
  const membershipNumber = req.body.membershipNumber;
  const membershipZip = req.body.membershipZip;

  db.query(
    "SELECT * FROM members WHERE membershipNumber = ? AND zip = ?",
    [membershipNumber, membershipZip],
    (err, result) => {
      if (err) res.send({ err: err });
      else {
        if (result.length != 0) {
          req.session.user = result;
          res.send(result);
        } else {
          res.send({ message: "Couldn't login" });
        }
      }
    }
  );
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.listen(3001, () => {
  console.log("running server on 3001");
});
