var n = require("./520a.js");
require("./5ca1.js")({
  target: "RegExp",
  proto: true,
  forced: n !== /./.exec
}, {
  exec: n
});