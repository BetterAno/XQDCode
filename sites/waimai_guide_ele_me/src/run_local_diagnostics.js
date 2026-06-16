'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const NODE = process.execPath;
const REPORT = path.join(ROOT, 'docs', 'local-diagnostics-summary.json');

function runNode(script, args = []) {
  const result = spawnSync(NODE, [path.join(__dirname, script), ...args], {
    cwd: path.resolve(ROOT, '..', '..'),
    encoding: 'utf8',
    windowsHide: true,
  });
  return {
    script,
    status: result.status,
    ok: result.status === 0,
    stdout: result.stdout ? result.stdout.slice(-6000) : '',
    stderr: result.stderr ? result.stderr.slice(-6000) : '',
  };
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function summarizeSdk(report) {
  const fakeParamStatus = {};
  for (const [name, value] of Object.entries(report.fakeParams || {})) {
    fakeParamStatus[name] = value.ok ? 'ok' : `failed: ${value.error}`;
  }
  return {
    loadOk: report.loadResults.filter((item) => item.ok).length,
    loadTotal: report.loadResults.length,
    awscFeatures: report.awscFeatures,
    fakeParamStatus,
    fakeParamDigests: Object.fromEntries(
      Object.entries(report.fakeParams || {})
        .filter(([, value]) => value && value.digest)
        .map(([name, value]) => [name, value.digest]),
    ),
    expiredSample: report.expiredSample,
    behaviorSeed: report.behaviorSeed,
    nodeLeakKeys: report.browserParity && report.browserParity.nodeLeakKeys,
    autoConstructors: report.autoConstructors || [],
  };
}

function summarizeElecheck(report) {
  return {
    importOk: report.importResults.every((item) => item.ok),
    importFiles: report.importResults.map((item) => ({ file: item.file, ok: item.ok })),
    xCheck: report.probes && report.probes.x_check,
    interestingGlobals: report.interestingGlobals,
  };
}

function main() {
  const runs = [
    runNode('sdk_local_simulation.js', ['--quiet']),
    runNode('elecheck_esm_probe.mjs'),
  ];
  const sdkReport = readJson(path.join('docs', 'sdk-local-simulation.json'));
  const elecheckReport = readJson(path.join('docs', 'elecheck-esm-probe.json'));
  const summary = {
    generatedAt: new Date().toISOString(),
    note: 'Local fake-data diagnostic summary. Security SDK outputs are represented as status or redacted digests.',
    runs,
    sdk: summarizeSdk(sdkReport),
    elecheckEsm: summarizeElecheck(elecheckReport),
    reports: {
      sdk: path.join(ROOT, 'docs', 'sdk-local-simulation.json'),
      elecheckEsm: path.join(ROOT, 'docs', 'elecheck-esm-probe.json'),
    },
  };
  fs.writeFileSync(REPORT, JSON.stringify(summary, null, 2));
  console.log(JSON.stringify({
    generatedAt: summary.generatedAt,
    runOk: runs.every((item) => item.ok),
    sdk: summary.sdk,
    elecheckEsm: summary.elecheckEsm,
    reportPath: REPORT,
  }, null, 2));
  process.exit(runs.every((item) => item.ok) ? 0 : 1);
}

main();
