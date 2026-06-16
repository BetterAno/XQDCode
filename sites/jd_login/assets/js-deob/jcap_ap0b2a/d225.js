export function a(A, t) {
  if (!(A instanceof t)) {
    throw new TypeError("Cannot call a class as a function");
  }
}