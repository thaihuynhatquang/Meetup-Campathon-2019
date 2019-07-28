var crypto = require("crypto");
var jwt = require("jsonwebtoken");
const jwtsecure = require("./key").jsecure;

var secure = {
  createSalt: function() {
    return crypto.randomBytes(10).toString("hex");
  },
  encrypt: function(str, salt) {
    return crypto
      .createHash("md5")
      .update(str + salt)
      .digest("hex");
  },
  compare: function(str, hash, salt) {
    return hash == this.encrypt(str, salt);
  },
  createUserToken: function(user) {
    return jwt.sign(user, jwtsecure, { expiresIn: 86400 });
  },
  verifyUserToken: function(token) {
    try {
      return jwt.verify(token, jwtsecure);
    } catch (error) {
      return null;
    }
  }
};
module.exports = secure;
// var u = {
//     username: "adsfasdfasdf",
//     password: "adfafa",
// }
// console.log(u);
// var a=secure.createUserToken(u);
// var b=secure.verifyUserToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkc2Zhc2RmYXNkZiIsInBhc3N3b3JkIjoiYWRmYWZhIiwiaWF0IjoxNTI0MDM4NzQ2LCJleHAiOjE1MjQwNDg3NDZ9.iRX1hY_vtSwRKp-SyUJLqe4r307ftdkvViccD6QbMRU");
// // console.log(a);
// console.log(b);
