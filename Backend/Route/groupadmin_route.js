var db = require('../Model/database');
var timeModel = require('../Model/timemodel');
var findMidpoint = require('../Route/midPoint_route');
const secure = require('./secure');
var Array = [];
var groupadmin_router = {
  getGroup: async (req, res) => {
    let user = secure.verifyUserToken(req.headers.authorization);
    if (user == null) {
      res.statusCode = 403;
      res.send('Không xác thực được người dùng');
    } else {
      let groupID = req.body.groupID;
      db.getGroup(groupID)
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((error) => {
          console.log(error);
          res.statusCode = 400;
          res.send(error);
        });
    }
  },
  //To Do
  getLocation: async (req, res) => {
    var Array = [];
    let user = secure.verifyUserToken(req.headers.authorization);
    if (user == null) {
      res.statusCode = 403;
      res.send('Không xác thực được người dùng');
    } else {
      let userName = user.u;

      const groupName = req.body.groupName;
      const groupID = groupName + '.' + userName;
      console.log(groupID);
      let tempArr = [];
      const result = await db.getListMember(groupID);
      for (let i = 0; i < result.length; i++) {
        // console.log(member);
        let member = result[i];
        const r = await db.getLocationFromUserName(groupName, member);
        if (r) {
          let temp = r.location;

          let tempLocation = { name: member, lat: temp.lat, lon: temp.lon };
          // console.log(temp);
          if (tempLocation.lat) tempArr.push(tempLocation);
        }
      }
      res.status(200).send(findMidpoint.MeatUp(tempArr));
    }
  },

  getGroupsByUserID: async (req, res) => {
    let user = secure.verifyUserToken(req.headers.authorization);
    if (user == null) {
      res.statusCode = 403;
      res.send('Không xác thực được người dùng');
    } else {
      let username = secure.verifyUserToken(req.headers.authorization).u;
      db.getGroupsByUserID(username)
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((error) => {
          console.log(error);
          res.statusCode = 400;
          res.send();
        });
    }
  },

  createGroup: async function(req, res) {
    let user = secure.verifyUserToken(req.headers.authorization);
    if (user == null) {
      res.statusCode = 403;
      res.send('Không xác thực được người dùng');
    } else {
      var newGroups = {};
      let groupAvatar = req.files != null ? req.files.groupAvatar : null;
      try {
        if (groupAvatar !== null) {
          var path = require('path');
          // // tạo ra đường dẫn để lưu vào database
          let databasePath = user.u + '__' + secure.createSalt() + groupAvatar.name;
          // // tạo đường dẫn để ghi file
          let serverPath = '/images/groups/' + databasePath;

          // console.log(databasePath, " <- databasePath");
          var file = path.join(__dirname, '..', serverPath);
          await groupAvatar.mv(file);
          newGroups.groupAvatar = serverPath;
        }
        (newGroups.groupName = req.body.groupName),
          (newGroups.category = req.body.category),
          (newGroups.adminEmail = req.body.adminEmail),
          (newGroups.description = req.body.description),
          (newGroups.startDate = req.body.startDate),
          (newGroups.endDate = req.body.endDate),
          await db.addGroup(newGroups);
        res.status(200).send(newGroups);
      } catch (error) {
        console.log(error);
        res.statusCode = 400;
        res.send();
      }
    }
  },

  updateGroupInformation: async (req, res) => {
    let user = secure.verifyUserToken(req.headers.authorization);
    if (user == null) {
      res.statusCode = 403;
      res.send('Không xác thực được người dùng');
    } else {
      var newGroups = {};
      let groupAvatar = req.files != null ? req.files.groupAvatar : null;
      try {
        if (groupAvatar !== null) {
          var path = require('path');
          // // tạo ra đường dẫn để lưu vào database
          let databasePath = user.u + '__' + secure.createSalt() + groupAvatar.name;
          // // tạo đường dẫn để ghi file
          let serverPath = '/images/groups/' + databasePath;

          // console.log(databasePath, " <- databasePath");
          var file = path.join(__dirname, '..', serverPath);
          await groupAvatar.mv(file);
          newGroups.groupAvatar = serverPath;
        }
        (newGroups.groupName = req.body.groupName),
          (newGroups.category = req.body.category),
          (newGroups.adminEmail = req.body.adminEmail),
          (newGroups.description = req.body.description),
          (newGroups.startDate = req.body.startDate),
          (newGroups.endDate = req.body.endDate),
          await db.updateGroupInformation(newGroups);
        res.status(200).send(newGroups);
      } catch (error) {
        console.log(error);
        res.statusCode = 400;
        res.send();
      }
    }
  },

  updateGroupMembers: async (req, res) => {
    let user = secure.verifyUserToken(req.headers.authorization);
    if (user == null) {
      res.statusCode = 403;
      res.send('Không xác thực được người dùng');
    } else {
      let listMemberID = req.body.listMemberID;
      let groupID = req.body.groupID;
      try {
        db.addMemberToGroup(groupID, listMemberID)
          .then((result) => {
            res.status(200).send(result);
          })
          .catch((error) => {
            console.log(error);
            res.statusCode = 400;
            res.send();
          });
      } catch (error) {
        console.log(error);
        res.statusCode = 404;
        res.send();
      }
    }
  },

  getGroupMember: async (req, res) => {
    let user = secure.verifyUserToken(req.headers.authorization);
    if (user == null) {
      res.statusCode = 403;
      res.send('Không xác thực được người dùng');
    } else {
      let groupName = req.body.groupName;
      let userName = user.u;
      let groupID = groupName + '.' + userName;
      console.log(groupID);
      try {
        db.getUserInGroup(groupID)
          .then((listMember) => {
            res.status(200).send(listMember);
          })
          .catch((error) => {
            console.log(error);
            res.statusCode = 400;
            res.send();
          });
      } catch (error) {
        console.log(error);
        res.statusCode = 404;
        res.send();
      }
    }
  },

  getFreeTimeOfGroup: (req, res) => {
    let groupID = req.body.gid;
    db.getUserTimeInGroup(groupID)
      .then((freeArr) => {
        if (freeArr instanceof Array) {
          let result = [];
          console.log(freeArr);
          freeArr.forEach((member) => {
            // console.log(member);
            if (member.freetimes instanceof Array)
              member.freetimes.forEach((time) => {
                // console.log("vàooooo!")
                // console.log(time);
                let timeObj = time;
                timeObj.name = member.name;
                result = timeModel.addTimeToArray(timeObj, result);
              });
          });
          let final = [];
          result.forEach((time) => {
            let obj = {};
            // obj.x=time.from.toString().substr(5,10)+"-"+time.to.toString().substr(5,10);
            obj.x = time.from.toString() + '-' + time.to.toString();

            obj.y = time.freeMembers.length;
            obj.freeMembers = time.freeMembers;
            final.push(obj);
          });
          res.statusCode = 200;
          res.send(final);
        } else {
          res.statusCode = 500;
          res.send();
        }
      })
      .catch((error) => {
        console.log(error);
        res.statusCode = 400;
        res.send();
      });
  },
};
module.exports = groupadmin_router;
// groupadmin_router.getFreeTimeOfGroup("Đi chơi Trung thu.thaihuynhatquang@gmail.com").then(r=>console.log(r))
