module.exports = function (A, t, e, n, r) {
  A.config = t;
  if (e) {
    A.code = e;
  }
  A.request = n;
  A.response = r;
  A.isAxiosError = true;
  A.toJSON = function () {
    return {
      message: this.message,
      name: this.name,
      description: this.description,
      number: this.number,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      config: this.config,
      code: this.code
    };
  };
  return A;
};