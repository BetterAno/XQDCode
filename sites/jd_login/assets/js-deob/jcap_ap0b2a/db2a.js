export function a(A, t) {
  if (t == null || t > A.length) {
    t = A.length;
  }
  for (var e = 0, n = Array(t); e < t; e++) {
    n[e] = A[e];
  }
  return n;
}