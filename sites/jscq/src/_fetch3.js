var http = require('https');
var fs = require('fs');
var path = require('path');

var url = 'https://www.jscq.com.cn/';

// Step 1: Get 412 page
http.get(url, {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    }
}, function(res) {
    var body = '';
    var setCookies = res.headers['set-cookie'] || [];
    var oCookie = '';
    setCookies.forEach(function(c) {
        var m = c.match(/^(jDwkDWjIm6GRO[^=]*)=([^;]+)/);
        if (m) oCookie = m[1] + '=' + m[2];
    });
    res.on('data', function(chunk) { body += chunk; });
    res.on('end', function() {
        console.log('Status:', res.statusCode);
        console.log('O Cookie:', oCookie.substring(0, 50) + '...');
        
        // Parse HTML
        var metaMatch = body.match(/<meta\s+[^>]*id="([^"]*)"[^>]*content="([^"]*)"[^>]*r='m'/);
        if (!metaMatch) metaMatch = body.match(/<meta[^>]*content="([^"]*)"[^>]*id="([^"]*)"/);
        var metaId = metaMatch ? metaMatch[1] : '';
        var metaContent = metaMatch ? metaMatch[2] : '';
        
        // Try both orderings
        if (!metaContent) {
            var metaMatch2 = body.match(/content="([^"]*)"[^>]*id="([^"]*)"/);
            if (metaMatch2) { metaContent = metaMatch2[1]; metaId = metaMatch2[2]; }
        }
        // Actually parse from the actual HTML
        var metaTag = body.match(/<meta\s+id="([^"]*)"\s+content="([^"]*)"/);
        if (metaTag) { metaId = metaTag[1]; metaContent = metaTag[2]; }
        
        console.log('Meta ID:', metaId);
        console.log('Meta content:', metaContent);
        
        // Extract inline script (the one that sets $_ts)
        var scriptMatches = body.match(/<script[^>]*>[\s\S]*?<\/script>/g) || [];
        var inlineScript = '';
        scriptMatches.forEach(function(s) {
            var content = s.replace(/<\/?script[^>]*>/g, '').trim();
            if (content.indexOf('$_ts') >= 0) {
                inlineScript = content;
            }
        });
        console.log('Inline script length:', inlineScript.length);
        
        // Extract external JS URL
        var jsMatch = body.match(/src="([^"]*\.js[^"]*)"/);
        var jsPath = jsMatch ? jsMatch[1] : '';
        var jsUrl = jsPath.startsWith('http') ? jsPath : 'https://www.jscq.com.cn' + jsPath;
        console.log('JS URL:', jsUrl);
        
        // Extract trigger call
        var triggerMatch = body.match(/<\/html>\s*<script[^>]*>([^<]+)<\/script>/);
        var triggerCall = triggerMatch ? triggerMatch[1].trim() : '';
        console.log('Trigger:', triggerCall);
        
        // Step 2: Fetch external JS
        if (!jsUrl) { console.error('No JS URL found!'); return; }
        
        http.get(jsUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': url,
            }
        }, function(jsRes) {
            var jsContent = '';
            jsRes.on('data', function(chunk) { jsContent += chunk; });
            jsRes.on('end', function() {
                console.log('JS content length:', jsContent.length);
                
                // Parse O cookie
                var oName = oCookie.split('=')[0];
                var oValue = oCookie.split('=').slice(1).join('=');
                
                var input = {
                    url: url,
                    meta_content: metaContent,
                    meta_id: metaId,
                    inline_script: inlineScript,
                    js_content: jsContent,
                    js_url: jsUrl,
                    o_cookie_name: oName,
                    o_cookie_value: oValue,
                    trigger_call: triggerCall,
                };
                
                fs.writeFileSync(path.join(__dirname, '_test_input.json'), JSON.stringify(input));
                console.log('\nSaved fresh _test_input.json');
                console.log('O Cookie name:', oName);
                console.log('O Cookie value length:', oValue.length);
            });
        }).on('error', function(e) { console.error('JS error:', e.message); });
    });
}).on('error', function(e) { console.error('Page error:', e.message); });
