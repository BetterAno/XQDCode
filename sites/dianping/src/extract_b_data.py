"""
CDP bridge script v2 - Better serialization for b[] data.
Targets desktop dianping shop page which triggers API calls with mtgsig.
"""
import json
import os
import sys
import threading
import time

_project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
sys.path.insert(0, _project_root)
from scripts.cdp_bridge import CDPBridge

WS_URL = "ws://127.0.0.1:9222/devtools/page/0D1037BE8AC977A9721E4022380D1D4E"
OUTPUT_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "real_b_data.json")

HOOK_SCRIPT = """
(function() {
    window.__bDataCaptured = null;
    window.__mtgsigCaptured = null;
    window.__captureLogs = [];
    
    function logCapture(msg) {
        window.__captureLogs.push({time: Date.now(), msg: msg});
        console.log('[H5CAPTURE] ' + msg);
    }
    
    // Helper: serialize any JS value to JSON-safe format
    function serializeForJSON(val, depth) {
        if (depth === undefined) depth = 0;
        if (depth > 3) return '[MAX_DEPTH]';
        
        if (val === null || val === undefined) return null;
        if (typeof val === 'boolean' || typeof val === 'number') return val;
        if (typeof val === 'string') return val;
        
        if (val instanceof ArrayBuffer) {
            return '__ArrayBuffer:' + Array.from(new Uint8Array(val)).join(',');
        }
        if (ArrayBuffer.isView && ArrayBuffer.isView(val)) {
            return '__TypedArray:' + Array.from(new Uint8Array(val.buffer, val.byteOffset, val.byteLength)).join(',');
        }
        
        if (Array.isArray(val)) {
            var result = [];
            for (var i = 0; i < val.length; i++) {
                result.push(serializeForJSON(val[i], depth + 1));
            }
            return result;
        }
        
        if (typeof val === 'object') {
            var result = {};
            try {
                var keys = Object.keys(val);
                for (var i = 0; i < keys.length; i++) {
                    result[keys[i]] = serializeForJSON(val[keys[i]], depth + 1);
                }
            } catch(e) {
                return '[OBJECT_ERROR:' + e.message + ']';
            }
            return result;
        }
        
        if (typeof val === 'function') {
            return '__function:' + (val.name || 'anonymous');
        }
        
        return String(val);
    }
    
    // Hook 1: XMLHttpRequest.setRequestHeader for mtgsig
    var _origSetReqHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        if (header.toLowerCase() === 'mtgsig') {
            window.__mtgsigCaptured = value;
            logCapture('XHR mtgsig: ' + value.substring(0, 100) + '...');
        }
        return _origSetReqHeader.call(this, header, value);
    };
    
    // Hook 2: fetch for mtgsig
    var _origFetch = window.fetch;
    window.fetch = function(url, options) {
        if (options && options.headers) {
            try {
                var h = new Headers(options.headers);
                var mtgsig = h.get('mtgsig');
                if (mtgsig) {
                    window.__mtgsigCaptured = mtgsig;
                    logCapture('Fetch mtgsig: ' + mtgsig.substring(0, 100) + '...');
                }
            } catch(e) {}
        }
        return _origFetch.apply(this, arguments);
    };
    
    // Hook 3: Object.defineProperty to detect H5guard internals
    var _origDefineProperty = Object.defineProperty;
    Object.defineProperty = function(obj, prop, desc) {
        try {
            if (prop === '_b' || prop === '__b' || (typeof prop === 'string' && prop.length <= 2 && prop.match(/^[a-z]$/i))) {
                if (desc && desc.value !== undefined) {
                    var val = desc.value;
                    if (Array.isArray(val) && val.length >= 20 && val.length <= 35) {
                        // This might be the b[] array
                        window.__bDataCaptured = serializeForJSON(val);
                        logCapture('b[] via defineProperty: ' + prop + ' len=' + val.length);
                    } else if (typeof val === 'object' && val !== null) {
                        var keys = Object.keys(val);
                        if (keys.indexOf('b0') !== -1 && keys.indexOf('b1') !== -1) {
                            window.__bDataCaptured = serializeForJSON(val);
                            logCapture('b-like object via defineProperty: ' + prop);
                        }
                    }
                }
            }
        } catch(e) {}
        return _origDefineProperty.call(this, obj, prop, desc);
    };
    
    // Hook 4: Intercept assignment to window properties  
    var _windowProxy = new Proxy(window, {
        set: function(target, prop, value) {
            try {
                if (typeof prop === 'string' && prop.length <= 3) {
                    if (Array.isArray(value) && value.length >= 20 && value.length <= 35) {
                        window.__bDataCaptured = serializeForJSON(value);
                        logCapture('b[] via window.' + prop + ' assignment len=' + value.length);
                    }
                }
            } catch(e) {}
            target[prop] = value;
            return true;
        }
    });
    
    logCapture('Hooks v2 installed. bData serialization uses custom serializer for binary data.');
})();
"""


def main():
    bridge = CDPBridge(WS_URL)
    bridge.connect()
    try:
        bridge.enable_runtime()
        
        # Step 1: Install hooks
        print("[1] Installing hooks with binary-safe serializer...")
        bridge.inject_on_new_document(HOOK_SCRIPT)
        print("    Done.")
        
        # Step 2: Navigate to desktop shop page (triggers API calls with mtgsig)
        print("[2] Navigating to desktop dianping shop page...")
        bridge.send("Page.navigate", {"url": "https://www.dianping.com/shop/G7lZQSVUguP43EIT"})
        print("    Waiting 12 seconds for full page load + API calls...")
        time.sleep(12)
        
        # Step 3: Check captured data
        print("[3] Checking captured data...")
        check = bridge.evaluate("""
        (function() {
            var bd = window.__bDataCaptured;
            return JSON.stringify({
                mtgsig: window.__mtgsigCaptured ? window.__mtgsigCaptured.substring(0, 200) : null,
                bDataExists: bd !== null && bd !== undefined,
                bDataType: bd ? (Array.isArray(bd) ? 'array(len=' + bd.length + ')' : 'object(keys=' + Object.keys(bd).join(',') + ')') : 'null',
                bDataSample: bd ? JSON.stringify(bd).substring(0, 300) : null,
                captureLogs: window.__captureLogs,
                url: window.location.href,
                title: document.title.substring(0, 80)
            });
        })()
        """)
        print(f"    => {check.get('result', {}).get('value', 'N/A')}")
        
        # Step 4: If no data yet, try direct extraction from page
        extra = bridge.evaluate("""
        (function() {
            var result = {found: false};
            
            // Look for H5guard script tag
            var scripts = document.querySelectorAll('script[src]');
            for (var i = 0; i < scripts.length; i++) {
                var src = scripts[i].src || '';
                if (src.indexOf('h5guard') !== -1 || src.indexOf('dper') !== -1 || src.indexOf('sec') !== -1) {
                    result.h5guardSrc = src;
                    result.found = true;
                }
            }
            
            // Also check inline scripts
            var inlineScripts = document.querySelectorAll('script:not([src])');
            for (var i = 0; i < inlineScripts.length; i++) {
                var text = inlineScripts[i].textContent || '';
                if ((text.indexOf('h5guard') !== -1 || text.indexOf('mtgsig') !== -1) && text.length > 1000) {
                    result.h5guardInline = {index: i, length: text.length, preview: text.substring(0, 150)};
                    result.found = true;
                }
                // Check for _0x obfuscated patterns
                if (text.indexOf('_0x') !== -1 && text.length > 5000) {
                    result.obfuscatedScript = {index: i, length: text.length};
                }
            }
            
            // Check window.__NEXT_DATA__ for potential token/h5guard data
            if (window.__NEXT_DATA__) {
                try {
                    var nd = window.__NEXT_DATA__;
                    var ndStr = JSON.stringify(nd);
                    if (ndStr.indexOf('mtgsig') !== -1) {
                        result.mtgsigInNextData = true;
                    }
                } catch(e) {}
            }
            
            return JSON.stringify(result);
        })()
        """)
        print(f"    Extra search: {extra.get('result', {}).get('value', 'N/A')}")
        
        # Step 5: Try navigating to a specific API that requires mtgsig
        # Shop question API is known to require mtgsig
        print("[5] Triggering API call that requires mtgsig...")
        trigger_api = bridge.evaluate("""
        (function() {
            // Make a fetch to a known endpoint that requires mtgsig
            // The H5guard SDK should intercept and add mtgsig header
            var url = 'https://m.dianping.com/wxmapi/shop/shopquestion?shopId=G7lZQSVUguP43EIT';
            var result = {started: false, mtgsigWillBeCaptured: false};
            
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    result.status = xhr.status;
                    result.done = true;
                }
            };
            xhr.send();
            result.started = true;
            
            return JSON.stringify(result);
        })()
        """)
        print(f"    API trigger: {trigger_api.get('result', {}).get('value', 'N/A')}")
        
        time.sleep(3)
        
        # Check if mtgsig was captured after API call
        check2 = bridge.evaluate("""
        (function() {
            return JSON.stringify({
                mtgsig: window.__mtgsigCaptured ? window.__mtgsigCaptured.substring(0, 200) : null,
                bDataExists: window.__bDataCaptured !== null,
                captureLogs: window.__captureLogs
            });
        })()
        """)
        print(f"    After API trigger: {check2.get('result', {}).get('value', 'N/A')}")
        
        # Step 6: Save data if captured
        save_b = bridge.evaluate("""
        (function() {
            if (window.__bDataCaptured) {
                return JSON.stringify(window.__bDataCaptured);
            }
            return null;
        })()
        """)
        
        b_data_value = save_b.get('result', {}).get('value')
        if b_data_value and b_data_value != '[]' and b_data_value != '{}':
            print(f"\n[SUCCESS] Captured b[] data!")
            b_obj = json.loads(b_data_value)
            
            # Save in the format expected by signer
            output = {}
            if isinstance(b_obj, list):
                for i, v in enumerate(b_obj):
                    if v is not None:
                        output[f"b{i}"] = v
            elif isinstance(b_obj, dict):
                output = b_obj
            
            # Also try to extract from __bDataCaptured raw
            raw_b = bridge.evaluate("""
            (function() {
                if (window.__bDataCaptured) return JSON.stringify(window.__bDataCaptured);
                return null;
            })()
            """)
            raw_value = raw_b.get('result', {}).get('value')
            
            with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
                json.dump(json.loads(raw_value) if raw_value else output, f, indent=2, ensure_ascii=False)
            print(f"    Saved to: {OUTPUT_FILE}")
            print(f"    Keys: {list(output.keys())}")
        else:
            print("\n[INFO] No b[] data captured yet.")
            print("    The page may not have triggered H5guard initialization on navigation.")
            print("    Let me try a few more approaches...")
            
            # Try to find H5guard SDK via its known patterns
            print("[7] Searching for H5guard by known code patterns...")
            
            # Look for H5guard's characteristic _0x patterns
            find_h5 = bridge.evaluate("""
            (function() {
                var result = {foundInline: false, foundExternal: false, codeLengths: []};
                
                // Search all inline scripts
                var scripts = document.querySelectorAll('script:not([src])');
                for (var i = 0; i < scripts.length; i++) {
                    var text = scripts[i].textContent || '';
                    if (text.length > 500) {
                        result.codeLengths.push({idx: i, len: text.length});
                        // Check for H5guard patterns
                        if (text.indexOf('function c(n)') !== -1 && text.indexOf('\\u0000') !== -1) {
                            result.foundInline = true;
                            result.h5guardIdx = i;
                            result.h5guardLen = text.length;
                            // Extract first 500 chars
                            result.h5guardPreview = text.substring(0, 300);
                        }
                        // Check for the string table pattern
                        if (text.indexOf('23+') !== -1 || (text.match(/\\\\u[0-9a-f]{4}/g) || []).length > 10) {
                            result.unicodeEscapes = true;
                        }
                    }
                }
                
                // Check external scripts
                var extScripts = document.querySelectorAll('script[src]');
                for (var i = 0; i < extScripts.length; i++) {
                    var src = extScripts[i].src || '';
                    if (src.indexOf('dper') !== -1 || src.indexOf('h5guard') !== -1 || 
                        src.indexOf('sec') !== -1 || src.indexOf('mtgsig') !== -1 ||
                        src.indexOf('_h5') !== -1) {
                        result.foundExternal = true;
                        result.externalSrc = src;
                    }
                }
                
                return JSON.stringify(result);
            })()
            """)
            print(f"    Search result: {find_h5.get('result', {}).get('value', 'N/A')}")
            
            # Try to specifically trigger H5guard by navigating to a page that
            # historically requires mtgsig
            print("[8] Navigating to question list page (known to require mtgsig)...")
            bridge.send("Page.navigate", {"url": "https://m.dianping.com/shop/G7lZQSVUguP43EIT/question"})
            time.sleep(10)
            
            final_check = bridge.evaluate("""
            (function() {
                return JSON.stringify({
                    mtgsig: window.__mtgsigCaptured ? window.__mtgsigCaptured.substring(0, 200) : null,
                    bDataExists: window.__bDataCaptured !== null,
                    logs: window.__captureLogs,
                    url: window.location.href
                });
            })()
            """)
            print(f"    Final check: {final_check.get('result', {}).get('value', 'N/A')}")
        
        bridge.disconnect()
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        bridge.disconnect()


if __name__ == "__main__":
    main()
