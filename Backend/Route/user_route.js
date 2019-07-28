var db = require('../Model/database');
const secure = require('./secure');
var verifier = require('google-id-token-verifier');
var androidId = require('./key').google.androidID;
var iosId = require('./key').google.iosID;

var user_router = {
  setFreeTimeForGroup: async (req, res) => {
    let user = secure.verifyUserToken(req.headers.authorization);
    if (user == null) {
      res.statusCode = 403;
      res.send('Không xác thực được người dùng');
    } else {
      const userName = user.u;
      const groupName = req.body.groupName;
      const listFreeTimes = req.body.listFreeTimes;
      db.updateFreeTime(user.u,listFreeTimes);
      db.setFreeTimeForGroup(userName, groupName, listFreeTimes)
        .then((result) => {
          console.log(result);
          res.status(200).send(result);
        })
        .catch((error) => {
          console.log(error);
          res.statusCode = 400;
          res.send(error);
        });
    }
  },
  setLocationForGroup: async (req, res) => {
    let user = secure.verifyUserToken(req.headers.authorization);
    if (user == null) {
      res.statusCode = 403;
      res.send('Không xác thực được người dùng');
    } else {
      const userName = user.u;
      const groupName = req.body.groupName;
      const location = req.body.location;
      db.setLocationForGroup(userName, groupName, location)
        .then((result) => {
          console.log(result);
          res.status(200).send(result);
        })
        .catch((error) => {
          console.log(error);
          res.statusCode = 400;
          res.send(error);
        });
    }
  },
  searchUser: async (req, res) => {
    let user = secure.verifyUserToken(req.headers.authorization);
    if (user == null) {
      res.statusCode = 403;
      res.send('Không xác thực được người dùng');
    } else {
      let keyword = req.query.userName;
      db.searchUser(keyword)
        .then((result) => {
          console.log(result);
          res.status(200).send(result);
        })
        .catch((error) => {
          console.log(error);
          res.statusCode = 400;
          res.send(error);
        });
    }
  },

  auth: function(req, res) {
    var token = req.headers.authorization;
    if (secure.verifyUserToken(token)) {
      const userName = secure.verifyUserToken(token).u;
      db.getUserByUserName(userName)
        .then((result) => {
          res.statusCode = 200;
          res.send(result);
        })
        .catch((error) => {
          console.log(error);
          res.statusCode = 401;
          res.send();
        });
    } else {
      res.statusCode = 401;
      res.send('Unauthenticated');
    }
  },
  loginGoogle: function(req, res) {
    var clientId = req.body.platform == 'ios' ? iosId : androidId;
    verifier.verify(req.body.token, clientId, function(err, tokenInfo) {
      if (!err) {
        let newUser = {
          avatar: tokenInfo.picture,
          name: tokenInfo.name,
          userName: tokenInfo.email,
          dark: tokenInfo.sub,
        };

        db.manageUser(newUser)
          .then((result) => {
            let token = secure.createUserToken({
              u: result.userName,
              n: result.name,
            });
            res.statusCode = 200;
            res.send({ token: token });
          })
          .catch((error) => {
            console.log(error);
            res.statusCode = 401;
            res.send();
          });
      } else {
        res.statusCode = 401;
        res.send();
      }
    });
  },
  getUsers: function(req, res) {
    let user = secure.verifyUserToken(req.headers.authorization);
    if (user == null) {
      // token không xác thực được
      res.statusCode = 401;
      res.send('Không xác thực được người dùng');
    } else {
      db.getUsers()
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((error) => {
          console.log(error);
          res.statusCode = 401;
          res.send();
        });
    }
  },
  setFreeTime: function(req, res) {
  },
  // setFreeTime: function(req, res) {
  //   fretime;
  // },
  getProfile: async function(req, res) {
    let user = secure.verifyUserToken(req.headers.authorization);
    if (user == null) {
      // token không xác thực được
      res.statusCode = 401;
      res.send('Không xác thực được người dùng');
    } else {
      var uid = user.u;
      db.getUserProfile(uid)
        .then((r) => res.status(200).send(r))
        .catch((e) => console.log(e));
    }
  },
};
module.exports = user_router;
