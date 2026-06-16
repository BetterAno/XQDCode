var cp = require('child_process');
var path = require('path');
for (var i = 0; i < 5; i++) {
    try {
        var result = cp.execSync('node "' + path.join(__dirname, 'gen_cookie.js') + '" "' + path.join(__dirname, '_test_input.json') + '"', {encoding: 'utf-8', stdio: ['pipe','pipe','pipe']});
        var j = JSON.parse(result);
        var m = j.pcookie.match(/jDwkDWjIm6GRP=(.+)/);
        var v = m[1];
        var parts = v.split('.');
        console.log('Run ' + (i+1) + ': Length=' + v.length + ' Parts=' + parts.length + ' PartsLen=[' + parts.map(function(p){return p.length;}).join(',') + ']');
    } catch(e) {
        console.log('Run ' + (i+1) + ': ERROR - ' + (e.stderr || e.message).substring(0, 100));
    }
}
