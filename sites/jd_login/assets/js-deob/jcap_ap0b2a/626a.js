var n = require("./2d95.js");
module.exports = Object("z").propertyIsEnumerable(0) ? Object : function (A) {
  if (n(A) == "String") {
    return A.split("");
  } else {
    return Object(A);
  }
};