window = global;
require("./mod.js");
let crypto_js = require("crypto-js");

function get_sign(room_id) {
  let o = `live_id=1,aid=6383,version_code=180800,webcast_sdk_version=1.0.15,room_id=${room_id},sub_room_id=,sub_channel_id=,did_rule=3,user_unique_id=7576491808193889832,device_platform=web,device_type=,ac=,identity=audience`;
  let a = crypto_js.MD5(o).toString();
  return window.loader({
    "X-MS-STUB": a,
  })['X-Bogus'];
}

// var room_id = 6954864118239649037;
// console.log(get_sign(room_id));
