// 探测 Klass (WASM D 类) 暴露了哪些方法
const { spawn } = require('child_process');
const path = require('path');

const proc = spawn('node', [path.join(__dirname, 'jcap_env.js'), '--stdio'], {
    env: { ...process.env, JCAP_PATCHED: '1' },
    stdio: ['pipe', 'pipe', 'pipe'],
});

let out = '';
proc.stdout.on('data', d => { out += d.toString(); });
proc.stderr.on('data', d => { process.stderr.write('[child] ' + d.toString()); });

function send(obj) {
    return new Promise(res => {
        const id = Math.random();
        obj.id = id;
        proc.stdin.write(JSON.stringify(obj) + '\n');
        const timer = setInterval(() => {
            const lines = out.split('\n').filter(x => x.trim());
            for (const line of lines) {
                try {
                    const r = JSON.parse(line);
                    if (r.id === id) {
                        clearInterval(timer);
                        res(r);
                        out = out.split('\n').filter(x => { try { return JSON.parse(x).id !== id; } catch { return true; } }).join('\n');
                        return;
                    }
                } catch {}
            }
        }, 100);
    });
}

(async () => {
    // 等 ready
    await new Promise(r => setTimeout(r, 500));
    const r0 = await send({ action: 'init', option: { sessionId: 'test', account: 'x' } });
    console.log('init ok:', r0.ok);
    // 探测
    const r1 = await send({ action: 'probe_klass' });
    console.log('probe:', JSON.stringify(r1, null, 2));
    proc.kill();
})();
