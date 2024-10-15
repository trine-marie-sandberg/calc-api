var express = require('express');
var jsend = require('jsend');
var router = express.Router();
var db = require("../models");
var crypto = require('crypto');
var UserService = require("../services/UserService");
var userService = new UserService(db);
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var jwt = require('jsonwebtoken');

router.use(jsend.middleware);

router.post("/signup", async (req, res, next) => {
    const { name, email, password } = req.body;
    var salt = crypto.randomBytes(16);
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', function(err, hashedPassword) {
      if (err) { return next(err); }
      userService.create(name, email, hashedPassword, salt)
      res.jsend.success({"result": "You created an account."});
    });
});

router.post("/login", jsonParser, async (req, res, next) => {
    const { email, password } = req.body;
    userService.getOne(email).then((data) => {
        if(data === null) {
            return res.jsend.fail({"result": "Incorrect email or password"});
        }
        crypto.pbkdf2(password, data.Salt, 310000, 32, 'sha256', function(err, hashedPassword) {
          if (err) { return cb(err); }
          if (!crypto.timingSafeEqual(data.EncryptedPassword, hashedPassword)) {
              return res.jsend.fail({"result": "Incorrect email or password"});
          }
          let token;
          try {
            token = jwt.sign(
              { id: data.id, email: data.Email },
              process.env.TOKEN_SECRET,
              { expiresIn: "1h" }
            );
          } catch (err) {
            res.jsend.error("Something went wrong with creating JWT token")
          }
          res.jsend.success({"result": "You are logged in", "id": data.id, email: data.Email, token: token});
        });
    });
});

module.exports = router;