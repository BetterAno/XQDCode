module.exports = function (A) {
  try {
    return !!A();
  } catch (A) {
    return true;
  }
};