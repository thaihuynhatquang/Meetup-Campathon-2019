var db = require('../Model/database');
const secure = require('./secure');
var groupadmin_route = require('./groupadmin_route');
var PI = Math.PI;
function Location(lat, lon, day, month, year) {
  this.lat = lat;
  this.lon = lon;
}
var midPoint_route = {
  MeatUp: function(data) {
    var totweight = 0;
    this.x = 0;
    this.y = 0;
    this.z = 0;

    var n = data.length;
    for (let i = 0; i < n; i++) {
      data[i].lat = (data[i].lat * PI) / 180;
      data[i].lon = (data[i].lon * PI) / 180;
      data[i].x = Math.cos(data[i].lat) * Math.cos(data[i].lon);
      data[i].y = Math.cos(data[i].lat) * Math.sin(data[i].lon);
      data[i].z = Math.sin(data[i].lat);
      data[i].w = 1;
      totweight += data[i].w;
      this.x += data[i].x * data[i].w;
      this.y += data[i].y * data[i].w;
      this.z += data[i].z * data[i].w;
    }
    this.x /= totweight;
    this.y /= totweight;
    this.z /= totweight;
    var Lon = Math.atan2(this.y, this.x);
    var Hyp = Math.sqrt(this.x * this.x + this.y * this.y);
    var Lat = Math.atan2(this.z, Hyp);
    Lat = (Lat * 180) / PI;
    Lon = (Lon * 180) / PI;
    var MeatUpLocation = new Location(Lat, Lon, data[0].day, data[0].month, data[0].year);
    return { lat: MeatUpLocation.lat, lon: MeatUpLocation.lon };
  },
};
module.exports = midPoint_route;
