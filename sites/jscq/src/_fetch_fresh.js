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
    var cookies = {};
    (res.headers['set-cookie'] || []).forEach(function(c) {
        var match = c.match(/^([^=]+)=([^;]*)/);
        if (match) cookies[match[1]] = match[2];
    });
    console.log('Status:', res.statusCode);
    console.log('Cookies:', JSON.stringify(cookies));
    res.on('data', function(chunk) { body += chunk; });
    res.on('end', function() {
        // Extract meta content
        var metaMatch = body.match(/<meta\s+[^>]*content="([^"]*)"[^>]*id="[^"]*"|<meta\s+[^>]*id="[^"]*"[^>]*content="([^"]*)"/);
        var metaContent = metaMatch ? (metaMatch[1] || metaMatch[2]) : '';
        console.log('Meta content length:', metaContent.length);
        
        // Extract inline script
        var inlineMatch = body.match(/<script[^>]*>([\s\S]*?)<\/script>/);
        var inlineScript = inlineMatch ? inlineMatch[1].trim() : '';
        console.log('Inline script length:', inlineScript.length);
        console.log('Inline script starts with:', inlineScript.substring(0, 80));
        
        // Extract external JS URL
        var jsMatch = body.match(/<script\s+src="([^"]+)"[^>]*>/);
        var jsUrl = jsMatch ? jsMatch[1] : '';
        console.log('External JS URL:', jsUrl);
        
        // Save to test input
        if (jsUrl && inlineScript) {
            // Fetch external JS
            http.get(jsUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Referer': url,
                }
            }, function(jsRes) {
                var jsContent = '';
                jsRes.on('data', function(chunk) { jsContent += chunk; });
                jsRes.on('end', function() {
                    console.log('External JS length:', jsContent.length);
                    
                    // Find O cookie
                    var oCookieName = '';
                    var oCookieValue = '';
                    Object.keys(cookies).forEach(function(k) {
                        if (k.indexOf('jDwkDWjIm6GRO') >= 0) {
                            oCookieName = k;
                            oCookieValue = cookies[k];
                        }
                    });
                    console.log('O Cookie:', oCookieName, '=', oCookieValue.substring(0, 30) + '...');
                    
                    var input = {
                        url: url,
                        meta_content: metaContent,
                        meta_id: '',
                        inline_script: inlineScript,
                        js_content: jsContent,
                        js_url: jsUrl,
                        o_cookie_name: oCookieName,
                        o_cookie_value: oCookieValue,
                    };
                    
                    fs.writeFileSync(path.join(__dirname, '_test_input.json'), JSON.stringify(input));
                    console.log('Saved to _test_input.json');
                });
            }).on('error', function(e) {
                console.error('JS fetch error:', e.message);
            });
        }
    });
}).on('error', function(e) {
    console.error('Page fetch error:', e.message);
});
