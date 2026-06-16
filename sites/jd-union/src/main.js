/**
 * JD h5st v5.3 签名入口
 *   作为库: const { sign } = require('./main');
 *   命令行: node main.js <functionId> <appid> <paramsJson>
 */
const crypto = require("crypto");

require("./browser_envs");
require("./js_security_v3");

const ParamsSign = global.window.ParamsSign;

function sign(functionId, appid, params) {
  const bodyHash = crypto.createHash("sha256").update(JSON.stringify(params)).digest("hex");
  const signer = new ParamsSign({ appId: "586ae" });
  return signer.sign({ functionId, appid, body: bodyHash });
}

// -- CLI --
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error("Usage: node main.js <functionId> <appid> <paramsJson>");
    process.exit(1);
  }
  const [functionId, appid, paramsJson] = args;
  const params = JSON.parse(paramsJson);
  sign(functionId, appid, params).then(result => {
    process.stdout.write(JSON.stringify(result));
    process.exit(0);
  }).catch(err => {
    console.error("Sign error:", err.message);
    process.exit(1);
  });
}

module.exports = { sign };
