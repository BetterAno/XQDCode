var http = require('https');
var fs = require('fs');
var path = require('path');

var url = 'https://www.jscq.com.cn/';

http.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    }
}, function(res) {
    var body = '';
    console.log('Status:', res.statusCode);
    console.log('Set-Cookie:', JSON.stringify(res.headers['set-cookie']));
    res.on('data', function(chunk) { body += chunk; });
    res.on('end', function() {
        fs.writeFileSync(path.join(__dirname, '_412_response.html'), body);
        console.log('HTML length:', body.length);
        console.log('First 2000 chars:');
        console.log(body.substring(0, 2000));
    });
}).on('error', function(e) {
    console.error('Error:', e.message);
});
