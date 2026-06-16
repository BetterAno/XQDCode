
(async () => {
  try {
    // 1. 加载最新会话 tdc.js
    const resp = await fetch('http://127.0.0.1:8765/current_tdc.js');
    const code = await resp.text();
    eval(code);

    // 2. btoa 补丁
    (function() {
      const _b = window.btoa;
      window.btoa = function(s) {
        try { return _b(s); } catch(e) {
          const a = [];
          for (let i = 0; i < s.length; i++) a.push(s.charCodeAt(i) & 255);
          return _b(String.fromCharCode.apply(null, a));
        }
      };
    })();

    // 3. 注入轨迹
    const b = document.body;
    b.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,clientX:50.0,clientY:186.0,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:50.3,clientY:186.1,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:51.1,clientY:185.7,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:52.4,clientY:185.8,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:54.3,clientY:187.2,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:56.7,clientY:186.2,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:59.6,clientY:185.2,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:63.0,clientY:184.6,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:67.0,clientY:185.1,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:71.6,clientY:186.6,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:76.6,clientY:184.4,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:81.7,clientY:185.2,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:86.2,clientY:185.2,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:90.2,clientY:184.3,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:93.7,clientY:186.4,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:96.6,clientY:186.5,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:99.0,clientY:184.6,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:100.9,clientY:185.8,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:102.2,clientY:184.8,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:103.0,clientY:186.5,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:103.2,clientY:184.8,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:103.3,clientY:186.9,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:103.6,clientY:185.9,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:104.5,clientY:186.8,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:106.1,clientY:186.9,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:108.9,clientY:187.5,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:113.0,clientY:184.7,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:118.8,clientY:188.0,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:126.4,clientY:187.0,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:136.3,clientY:187.6,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:148.5,clientY:187.8,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:163.5,clientY:185.3,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:181.5,clientY:185.2,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:202.7,clientY:186.6,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:227.5,clientY:187.7,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:232.1,clientY:184.5,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:236.8,clientY:187.3,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:241.4,clientY:186.3,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:246.0,clientY:184.1,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:250.7,clientY:187.4,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:255.3,clientY:184.1,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:259.9,clientY:185.2,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:264.5,clientY:187.5,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:269.2,clientY:184.1,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:273.8,clientY:185.8,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:278.4,clientY:186.8,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:283.1,clientY:185.6,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:287.7,clientY:185.0,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:292.3,clientY:184.2,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:297.0,clientY:186.6,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:301.6,clientY:184.7,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:306.2,clientY:187.0,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:310.8,clientY:185.9,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:315.5,clientY:184.1,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:320.1,clientY:187.5,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:324.7,clientY:185.9,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:329.4,clientY:185.2,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:334.0,clientY:185.5,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:353.7,clientY:184.5,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:367.8,clientY:184.4,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:377.3,clientY:185.4,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:383.1,clientY:184.5,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:386.0,clientY:187.3,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:387.1,clientY:187.6,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:387.2,clientY:184.2,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:394.7,clientY:184.0,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:399.7,clientY:184.0,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:402.8,clientY:186.1,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:404.3,clientY:185.6,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:404.9,clientY:184.5,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:405.0,clientY:187.1,button:0,buttons:1}));
b.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,clientX:405.0,clientY:185.53922278077417,button:0,buttons:0}));

    // 4. 获取 TDC 数据
    window.TDC.setData({ft: Date.now()});
    const collect = window.TDC.getData(true);
    const info = window.TDC.getInfo();

    return JSON.stringify({
      collect: collect,
      eks: info?.info || '',
      tokenid: info?.tokenid || 0,
      collectLen: collect?.length || 0,
    });
  } catch(e) {
    return JSON.stringify({ error: e.message, stack: e.stack?.substring(0, 500) });
  }
})()
