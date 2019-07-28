var jsonParser = require('body-parser').json(); // nhận json từ client
var user_route = require('./user_route');
var groupadmin_route = require('./groupadmin_route');
var midPoint_route = require('./midPoint_route');

module.exports = {
  route: function(app) {
    app.get('/', (req, res) => res.send('Hello, I am OK now!'));
    app.get('/user', (req, res) => user_route.getUsers(req, res));
    app.get('/user/auth', jsonParser, (req, res) => user_route.auth(req, res));
    app.post('/user/loginWithGoogle', jsonParser, (req, res) => user_route.loginGoogle(req, res));
    app.get('/user/search', jsonParser, (req, res) => user_route.searchUser(req, res));
    app.post('/user/freeTime', jsonParser, (req, res) => user_route.setFreeTimeForGroup(req, res));
    app.post('/user/location', jsonParser, (req, res) => user_route.setLocationForGroup(req, res));

    app.post('/group/', jsonParser, (req, res) => groupadmin_route.createGroup(req, res)); //DONE
    app.put('/group/updateGroupInfo', jsonParser, (req, res) => groupadmin_route.updateGroupInformation(req, res)); //update cac thong tin group
    app.get('/group/', jsonParser, (req, res) => groupadmin_route.getGroupsByUserID(req, res)); //DONE
    app.post('/group/groupID', jsonParser, (req, res) => groupadmin_route.getGroup(req, res)); //DONE
    app.put('/group/updateGroupMembers', jsonParser, (req, res) => groupadmin_route.updateGroupMembers(req, res)); // DONE
    //To Do
    app.post('/group/member', jsonParser, (req, res) => groupadmin_route.getGroupMember(req, res));
    app.put('/user/profile', jsonParser, (req, res) => user_route.updateProfile(req, res)); // lam duoc thi tot
    app.get('/user/notify', (req, res) => user_route.getNotify(req, res)); // lam duoc thi tot

    app.get('/group/:groupid/members_time', (req, res) => groupadmin_route.getMembersTime(req, res)); //lay du lieu thong ke de show graph
    app.post('/group/createMeeting', jsonParser, (req, res) => groupadmin_route.createMeeting(req, res)); // tao meeting moi ( sau khi da xem thong ke)
    app.post('/group/midPoint', jsonParser, (req, res) => midPoint_route.MeatUp(req, res));
    app.post('/group/location', jsonParser, (req, res) => groupadmin_route.getLocation(req, res));
    app.post('/group/freeTime',jsonParser, (req, res) => groupadmin_route.getFreeTimeOfGroup(req,res));

  },
};
