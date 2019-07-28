var admin = require('firebase-admin');

var serviceAccount = require('./testmeetup-f5f98-firebase-adminsdk-oujh1-a20533e0bf.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://testmeetup-f5f98.firebaseio.com',
});

var db = admin.firestore();

var db_model = {
  add2DB: async function() {
    //example
    let docRef = db.collection('users').doc();
    let setAda = await docRef.set({
      first: 'Ada',
      last: 'Lovelace',
      born: 1815,
    });
    return Promise.resolve(setAda);
  },

  //Freetime and place
  setFreeTimeForGroup: async (userName, groupName, freeTimeList) => {
    try {
      let timeRef = await db.collection('timesAndPlace').doc(groupName + '.' + userName);
      let timeRef2 = timeRef.get().then(async (doc) => {
        if (doc.exists) {
          timeRef.update({ freetimes: freeTimeList });
          let result = await db
            .collection('timesAndPlace')
            .doc(groupName + '.' + userName)
            .get();
          return result.data();
        } else {
          let newDoc = {};
          newDoc.location = {};
          newDoc.freetimes = freeTimeList;
          await db
            .collection('timesAndPlace')
            .doc(groupName + '.' + userName)
            .set(newDoc);
          return newDoc;
        }
      });
    } catch (error) {
      throw error;
    }
  },
  setLocationForGroup: async (userName, groupName, location) => {
    try {
      let timeRef = await db.collection('timesAndPlace').doc(groupName + '.' + userName);
      let timeRef2 = timeRef.get().then(async (doc) => {
        if (doc.exists) {
          timeRef.update({ location: location });
          let result = await db
            .collection('timesAndPlace')
            .doc(groupName + '.' + userName)
            .get();
          return result.data();
        } else {
          let newDoc = {};
          newDoc.freetimes = [];
          newDoc.location = location;
          await db
            .collection('timesAndPlace')
            .doc(groupName + '.' + userName)
            .set(newDoc);
          return newDoc;
        }
      });
    } catch (error) {
      throw error;
    }
  },

  //Users
  manageUser: async (newUser) => {
    try {
      let userRef = await db
        .collection('users')
        .doc(newUser.userName)
        .get();
      if (!userRef.exists) {
        newUser.freetimes = [];
        newUser.groups = [];
        newUser.meetings = [];
        await db
          .collection('users')
          .doc(newUser.userName)
          .set(newUser);
        return newUser;
      } else {
        return userRef.data();
      }
    } catch (error) {
      throw error;
    }
  },
  getUsers: async () => {
    try {
      const markers = [];
      let userRef = await db.collection('users').get();
      userRef.forEach((doc) => {
        markers.push(doc.data());
      });
      return markers;
    } catch (error) {
      throw error;
    }
  },
  getUserByUserName: async (userName) => {
    try {
      let user = await db
        .collection('users')
        .doc(userName)
        .get();
      return user.data();
    } catch (error) {
      throw error;
    }
  },
  getGroupsByUserID: async (userID) => {
    try {
      let userDoc = await db
        .collection('users')
        .doc(userID)
        .get();
      if (!userDoc.empty) {
        let gidList = userDoc.data().groups;
        if (gidList) {
          let resultArr = [];
          for (let i = 0; i < gidList.length; i++) {
            let gid = gidList[i];
            let grDoc = await db
              .collection('groups')
              .doc(gid)
              .get();
            if (!grDoc.empty) resultArr.push(grDoc.data());
          }
          return resultArr;
        } else return;
      }
    } catch (error) {
      throw error;
    }
  },
  updateFreeTime: async (userid, listFreeTime) => {
    let userCollection = db.collection('users');
    let userDoc = await userCollection.doc(userid).get();
    if (!userDoc.empty) {
      await userCollection.doc(userid).update({ freetimes: listFreeTime });
      return Promise.resolve(true);
    }
    return Promise.reject(false);
  },
  // updateLocation: async (userid,locations) =>
  // {
  //   let userCollection = db.collection('user');
  //   let userDoc = await userCollection.doc(userid).get();
  //   if (!userDoc.empty){
  //     await userCollection.doc(userid).update({locations: locations});
  //     return Promise.resolve(true);
  //   }
  //   return Promise.reject(false);
  // }

  updateProfile: async (userid, updateObject) => {
    let userCollection = db.collection('users');
    let userDoc = await userCollection.doc(userid).get();
    if (!userDoc.empty) {
      await userCollection.doc(userid).update(updateObject);
      return Promise.resolve(true);
    }
    return Promise.reject(false);
  },
  getUserProfile: async (userName) => {
    try {
      let userCollection = db.collection('users');
      let userDoc = await userCollection.doc(userName).get();
      if (!userDoc.empty) {
        let user = await userDoc.data();
        return user;
      }
    } catch (error) {
      throw error;
    }
  },

  //Groups
  getListMember: async (groupID) => {
    try {
      let groupRef = await db
        .collection('groups')
        .doc(groupID)
        .get();
      //  console.log(group.data().member);
      // let memList = group.data().member;
      let group = await groupRef.data();
      if (group) return group.member;
    } catch (error) {
      throw error;
    }
  },
  getLocationFromUserName: async (groupName, userName) => {
    try {
      let locationRef = await db
        .collection('timesAndPlace')
        .doc(groupName + '.' + userName)
        .get();
      //  console.log(group.data().member);
      let memLocations = await locationRef.data();
      //if  (memLocations)
      // console.log(memLocations);
      return memLocations;
    } catch (error) {
      throw error;
    }
  },
  getGroup: async (groupID) => {
    try {
      let group = await db
        .collection('groups')
        .doc(groupID)
        .get();
      console.log(group.data());
      return group.data();
    } catch (error) {
      throw error;
    }
  },
  getGroupInfo: async (groupID) => {
    let grCollection = await db
      .collection('groups')
      .doc(groupID)
      .get();
    if (!grCollection.empty) {
      let gr = grCollection.data();
      // gr.id=groupID;
      return Promise.reject(gr);
    }
    return Promise.reject(null);
  },
  addGroup: async (newGroup) => {
    try {
      let collection = db.collection('groups');
      newGroup.member = [newGroup.adminEmail];
      let currentUser = db
        .collection('users')
        .doc(newGroup.adminEmail)
        .update({
          groups: admin.firestore.FieldValue.arrayUnion(newGroup.groupName + '.' + newGroup.adminEmail),
        });
      let newGroupObject = await collection.doc(newGroup.groupName + '.' + newGroup.adminEmail).set(newGroup);
      return Promise.resolve(newGroupObject);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  updateGroupInformation: async (newGroup) => {
    try {
      let group = await db
        .collection('groups')
        .doc(newGroup.groupName + '.' + newGroup.adminEmail)
        .update({
          category: newGroup.category,
          description: newGroup.description,
          groupName: newGroup.groupName,
          startDate: newGroup.startDate,
          endDate: newGroup.endDate,
        });

      let currentObject = await db
        .collection('groups')
        .doc(newGroup.groupName + '.' + newGroup.adminEmail)
        .get();
      return Promise.resolve(currentObject.data());
    } catch (error) {
      throw error;
    }
  },
  addMemberToGroup: async (groupID, listMemberID) => {
    if (!(listMemberID instanceof Array)) return Promise.reject(false);
    let groupDocRef = db.collection('groups').doc(groupID);
    let group = await groupDocRef.get();
    if (!group.empty) {
      let currListMember = group.data().member;
      let userCollectionRef = db.collection('users');
      for (let i = 0; i < listMemberID.length; i++) {
        let uid = listMemberID[i];
        currListMember.push(uid);
        var udoc = await userCollectionRef.doc(uid).get();
        let newListGroup = udoc.data().groups;
        if (newListGroup == undefined) newListGroup = [];
        newListGroup.push(groupID);
        await userCollectionRef.doc(uid).update({ groups: newListGroup });
      }
      await groupDocRef.update({ member: currListMember });
    }
    let updatedGroup = await groupDocRef.get();
    return updatedGroup.data();
  },
  searchUser: async (keysearch) => {
    try {
      console.log(keysearch);
      let userCollection = db.collection('users');
      let resultArray = await userCollection.where('userName', '==', keysearch.toLowerCase()).get();
      if (!resultArray.empty) {
        let userArr = [];
        resultArray.forEach((user) => {
          userArr.push(user.data());
        });
        return userArr;
      }
    } catch (error) {
      throw error;
    }
  },
  getUserTimeInGroup: async (groupid) => {
    let grCollection = await db
      .collection('groups')
      .doc(groupid)
      .get();
    if (!grCollection.empty) {
      //Todo: chỉnh tên biến range_from, range_to cho hợp với tên biến trên database, 2 biến này thể hiện khoảng thời gian admin mong muốn tổ chức meetings.
      let range_start = new Date(parseInt(grCollection.data().startDate));
      let range_end = new Date(parseInt(grCollection.data().endDate));
      // console.log("startDate",range_start);
      // console.log("endDate",range_end);
      let listMembers = grCollection.data().member;
      let resultUserTimeArr = [];
      for (var m = 0; m < listMembers.length; m++) {
        let memid = listMembers[m];
        let memDoc = await db
          .collection('users')
          .doc(memid)
          .get();
        if (!memDoc.empty) {
          let userTimeArr = {};
          userTimeArr.name = memDoc.data().name;

          if (memDoc.data().freetimes != undefined && memDoc.data().freetimes instanceof Array) {
            let freeTimeList = memDoc.data().freetimes;
            // console.log(freeTimeList);
            userTimeArr.freetimes = [];
            let overDateData = [];
            for (let i = 0; i < freeTimeList.length; i++) {
              //check time is current or future , if not delete it
              var freeFrom = new Date(parseInt(freeTimeList[i].fromTime));
              var freeTo = new Date(parseInt(freeTimeList[i].toTime));
              var curDate = new Date();
              if (freeTo < curDate) {
                overDateData.push(i);
                continue;
              } else {
                // if(freeFrom<=range_end){
                let freetime = {};
                freetime.from = freeFrom > range_start ? freeFrom : range_start;
                freetime.to = freeTo < range_end ? freeTo : range_end;
                userTimeArr.freetimes.push(freetime);
                // }
              }
            }
            // Todo : xóa bỏ các khoảng thời gian đã hết hạn của người dùng ( có index được lưu trong mảng overDateData)
          }
          resultUserTimeArr.push(userTimeArr);
        }
      }

      return Promise.resolve(resultUserTimeArr);
    }
    return Promise.reject(null);
  },
  getUserInGroup: async (groupID) => {
    try {
      let groupCollection = db.collection('groups');
      let groupDoc = await groupCollection.doc(groupID).get();
      if (!groupDoc.empty) {
        let group = await groupDoc.data();
        console.log(groupDoc.data());
        return group.member;
      }
    } catch (error) {
      throw error;
    }
  },
  getTimeAndLocationUserOfGroup: async (groupName, userName) => {
    try {
      let timePlaceId = groupName + '.' + userName;
      let timePlaceCollection = db.collection('timesAndPlace');
      let timePlaceDoc = await timePlaceCollection.doc(timePlaceId).get();
      if (!timePlaceDoc.empty) {
        let timePlace = await timePlaceDoc.data();
        // console.log(timePlaceDoc.data());
        return timePlace;
      }
    } catch (error) {
      throw error;
    }
  },
};
module.exports = db_model;
// db_model.getUserTimeInGroup("Đi chơi Trung thu.thaihuynhatquang@gmail.com").then(r=>{
//   r.forEach(user=>{
//     // console.log(user);
//   })
// }).catch(e=>console.log(e));

// db_model
//   .getLocationFromUserName('Ai là triệu phú', 'thaihuynhatquang@gmail.com')
//   .then((r) => console.log(r))
//   .catch((e) => console.log(e));
// db_model.getLocation("Ai là triệu phú","")
