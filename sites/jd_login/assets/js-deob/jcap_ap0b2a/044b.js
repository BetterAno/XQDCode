function e(A) {
  return !!A.constructor && typeof A.constructor.isBuffer == "function" && A.constructor.isBuffer(A);
}
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
module.exports = function (A) {
  return A != null && (e(A) || function (A) {
    return typeof A.readFloatLE == "function" && typeof A.slice == "function" && e(A.slice(0, 0));
  }(A) || !!A._isBuffer);
};