module.exports = function (A) {
  try {
    return {
      e: false,
      v: A()
    };
  } catch (A) {
    return {
      e: true,
      v: A
    };
  }
};