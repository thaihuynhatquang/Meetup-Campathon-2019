var Obj = {
  name: 'Xuân',
  from: '4',
  to: '8'
}

var result = [
  {
    from: '1',
    to: '4',
    freeMembers: ['Huy', 'quang', 'linh', 'Dương']
  },
  {
    from: '5',
    to: '7',
    freeMembers: ['Huy', 'linh']
  }
];
var tm={
  addTimeToArray: function(time,freTimeArr){
    result=freTimeArr;
    this.addFreeTime(time);
    result.sort(compare);
    return result;
  },
  addFreeTime:function (freeTimeObject){
    let x1= freeTimeObject.from;
    let x2= freeTimeObject.to;
    let name = freeTimeObject.name;
      //duyệt tất cả các khung thời gian đã được thêm vào trước đó
    for(var i=0; i< result.length;i++){
      let y1= result[i].from;
      let y2= result[i].to;
      //xét từng trường hợp 1
      if(x1<=y1 && x2>=y2){
        // new(x): |---------|
        // old(y):   |-----|}
        let oldMembers=result[i].freeMembers;
        result.splice(i,1);
        oldMembers.push(name);
        let fragment2 ={
          from:y1,
          to:y2,
          freeMembers:oldMembers
        }
        result.push(fragment2);
        if(x1<y1){
          let fragment1={
            from:x1,
            to:y1,
            name:name
          }
          addFreeTime(fragment1);
        }
        if(x2>y2){
          let fragment3 = {
            from:y2,
            to:x2,
            name:name
          }
          addFreeTime(fragment3);
        }
        return result;
      }
      if(x1>=y1 && x2<=y2){
        // new(x):   |--------|
        // old(y): |-----------|
        let oldMembers=result[i].freeMembers;
        result.splice(i,1);
        if(x1>y1){
          let fragment1 = {
            from:y1,
            to:x1,
            freeMembers:oldMembers
          }
          result.push(fragment1);
        }
        if(y2>x2){
          let fragment3={
            from:x2,
            to:y2,
            name:name
          }
          result.push(fragment3);
        }
        oldMembers.push(name);
        let fragment2 ={
          from:x1,
          to:x2,
          freeMembers:oldMembers
        }
        result.push(fragment2);

        return result;
      }
      if(x1<=y1 && x2<=y2 && y1<x2){
        // new(x):   |--------|
        // old(y):       |-------|
        let oldMembers=result[i].freeMembers;
        result.splice(i,1);

        if(x1<y1){
          let fragment1={
            from:x1,
            to:y1,
            name:name
          }
          addFreeTime(fragment1);
        }
        if(x2<y2){
          let fragment3={
            from: x2,
            to:y2,
            freeMembers:oldMembers
          }
          result.push(fragment3)
        }
        oldMembers.push(name);
        let fragment2= {
          from:y1,
          to:x2,
          freeMembers:oldMembers
        }
        result.push(fragment2);
        return result;
      }
      if(x1>=y1 && x2>=y2 && x1<y2){
        // new(x):   |--------|
        // old(y): |-------|
        let oldMembers=result[i].freeMembers;
        resutl =result.splice(i,1);
        if(x1>y1){
          let fragment1={
            from:y1,
            to:x1,
            freeMembers:oldMembers
          }
          result.push(fragment1);
        }
        if(x2>y2){
          let fragment3={
            from: y2,
            to:x2,
            name:name
          }
          addFreeTime(fragment3);
        }
        oldMembers.push(name);
        let fragment2= {
          from:x1,
          to:y2,
          freeMembers:oldMembers
        }
        result.push(fragment2);
        return result;
      }
    };
    freeTimeObject.freeMembers=[freeTimeObject.name];
    delete(freeTimeObject.name);
    result.push(freeTimeObject);
    // result.sort()
    return result;
  }
}
module.exports=tm;

function compare( a, b ) {
  if ( a.from < b.from ){
    return -1;
  }
  if ( a.from > b.from ){
    return 1;
  }
  return 0;
}
// addFreeTime(Obj);
// result.sort(compare);
// console.log(result)
