/**
 * 吉祥航空 blackBox 纯 Node.js 生成器 (signer.js)
 * 使用 jsdom 最小补环境 + 同盾设备指纹 SDK v4.2.2
 *
 * 用法: node signer.js
 * 输出: blackBox 字符串值
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function createBrowserEnv() {
  const html = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><title>吉祥航空</title></head><body><div id="__nuxt"></div></body></html>`;

  const dom = new JSDOM(html, {
    url: 'https://www.juneyaoair.com/flightQuery',
    pretendToBeVisual: true,
    runScripts: 'outside-only',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
  });

  const window = dom.window;

  // --- Canvas 2D / WebGL 补丁 ---
  window.HTMLCanvasElement.prototype.getContext = function (type) {
    if (type === '2d') {
      return {
        fillRect(){}, clearRect(){}, getImageData(x,y,w,h){ return { data: new Array(w*h*4).fill(0) }; },
        putImageData(){}, createImageData(){ return []; }, setTransform(){}, drawImage(){},
        save(){}, fillText(){}, restore(){}, beginPath(){}, moveTo(){}, lineTo(){},
        closePath(){}, stroke(){}, translate(){}, scale(){}, rotate(){}, arc(){}, fill(){},
        measureText(){ return { width: 0 }; }, transform(){}, rect(){}, clip(){}, canvas: this,
      };
    }
    if (type === 'webgl' || type === 'experimental-webgl') {
      const noop = () => {};
      return {
        getParameter(p) {
          const m = { 0x1F00:'WebKit', 0x9245:'ANGLE (NVIDIA GeForce RTX 3060 Direct3D11 vs_5_0 ps_5_0)',
            0x1F02:'WebGL 2.0', 0x8B4A:16, 0x0D33:16, 0x851C:16384, 0x8072:32, 0x8B49:256,
            0x8869:16, 0x84E8:32, 0x8DFB:16, 0x8B8C:256 };
          return m[p] || 0;
        },
        getExtension(n) {
          if (n === 'WEBGL_debug_renderer_info') return { UNMASKED_VENDOR_WEBGL: 0x1F00, UNMASKED_RENDERER_WEBGL: 0x9245 };
          return null;
        },
        getSupportedExtensions() { return ['WEBGL_debug_renderer_info','OES_texture_float','OES_standard_derivatives']; },
        createShader(){ return {}; }, shaderSource:noop, compileShader:noop, createProgram(){ return {}; },
        attachShader:noop, linkProgram:noop, useProgram:noop, getShaderParameter(){ return true; },
        getProgramParameter(){ return true; }, getShaderInfoLog(){ return ''; }, getProgramInfoLog(){ return ''; },
        createBuffer(){ return {}; }, bindBuffer:noop, bufferData:noop, createTexture(){ return {}; },
        bindTexture:noop, texImage2D:noop, texParameteri:noop, createFramebuffer(){ return {}; },
        bindFramebuffer:noop, framebufferTexture2D:noop, drawArrays:noop, drawElements:noop,
        viewport:noop, clear:noop, clearColor:noop, enable:noop, disable:noop, blendFunc:noop,
        depthFunc:noop, scissor:noop, colorMask:noop, pixelStorei:noop, activeTexture:noop,
        uniform1i:noop, uniform1f:noop, uniform2f:noop, uniform3f:noop, uniform4f:noop,
        uniformMatrix4fv:noop, getAttribLocation(){ return 0; }, getUniformLocation(){ return {}; },
        vertexAttribPointer:noop, enableVertexAttribArray:noop, deleteShader:noop, deleteProgram:noop,
        readPixels:noop, canvas:{width:1920,height:1080}, drawingBufferWidth:1920, drawingBufferHeight:1080,
      };
    }
    return null;
  };

  // --- AudioContext 补丁 ---
  window.AudioContext = window.AudioContext || class {
    constructor() { this.sampleRate=44100; this.state='running';
      this.destination={numberOfInputs:1,numberOfOutputs:0,channelCount:2,channelCountMode:'explicit',channelInterpretation:'speakers'}; }
    createOscillator() { return { type:'triangle', frequency:{value:10000,setValueAtTime(){}}, connect(){}, start(){}, stop(){} }; }
    createAnalyser() { return { fftSize:2048, frequencyBinCount:1024, connect(){}, getFloatFrequencyData(a){ a.fill(-100); }, getByteFrequencyData(a){ a.fill(128); } }; }
    createDynamicsCompressor() { return { threshold:{value:-50}, knee:{value:40}, ratio:{value:12}, attack:{value:0}, release:{value:0.25}, connect(){} }; }
    createScriptProcessor(bs) { return { bufferSize:bs||4096, connect(){}, disconnect(){}, onaudioprocess:null }; }
    createGain() { return { gain:{value:1}, connect(){} }; }
    close() { return Promise.resolve(); }
    resume() { return Promise.resolve(); }
  };
  window.webkitAudioContext = window.AudioContext;

  window.OfflineAudioContext = class {
    constructor(ch,len,sr) { this.sampleRate=sr||44100; this.length=len||44100; this.numberOfChannels=ch||1; }
    createOscillator() { return { type:'triangle', frequency:{value:10000,setValueAtTime(){}}, connect(){}, start(){} }; }
    createDynamicsCompressor() { return { threshold:{value:-50,setValueAtTime(){}}, knee:{value:40,setValueAtTime(){}}, ratio:{value:12,setValueAtTime(){}}, attack:{value:0,setValueAtTime(){}}, release:{value:0.25,setValueAtTime(){}}, connect(){} }; }
    startRendering() { return Promise.resolve({ getChannelData(){ return new Float32Array(44100).fill(0); }, numberOfChannels:1, length:44100, sampleRate:44100 }); }
  };

  // --- Navigator 补丁 ---
  try { Object.defineProperty(window.navigator,'webdriver',{get:()=>false,configurable:true}); } catch(e){}
  try { Object.defineProperty(window.navigator,'languages',{get:()=>['zh-CN','zh','en-US','en'],configurable:true}); } catch(e){}
  try { Object.defineProperty(window.navigator,'hardwareConcurrency',{get:()=>12,configurable:true}); } catch(e){}
  try { Object.defineProperty(window.navigator,'deviceMemory',{get:()=>8,configurable:true}); } catch(e){}
  try { Object.defineProperty(window.navigator,'maxTouchPoints',{get:()=>0,configurable:true}); } catch(e){}
  try { Object.defineProperty(window.navigator,'platform',{get:()=>'Win32',configurable:true}); } catch(e){}
  try { Object.defineProperty(window.navigator,'vendor',{get:()=>'Google Inc.',configurable:true}); } catch(e){}
  try { Object.defineProperty(window.navigator,'connection',{get:()=>({rtt:50,downlink:10,effectiveType:'4g',saveData:false}),configurable:true}); } catch(e){}
  try {
    Object.defineProperty(window.navigator,'plugins',{
      get:()=>{ const p=[{name:'Chrome PDF Plugin',filename:'internal-pdf-viewer',description:'PDF'},{name:'Chrome PDF Viewer',filename:'mhjfbmdgcfjbbpaeojofohoefgiehjai',description:''},{name:'Native Client',filename:'internal-nacl-plugin',description:''}]; p.length=3; return p; },
      configurable:true
    });
  } catch(e){}

  // --- Screen 补丁 ---
  Object.defineProperty(window,'screen',{value:{width:1920,height:1080,availWidth:1920,availHeight:1040,colorDepth:24,pixelDepth:24,orientation:{angle:0,type:'landscape-primary'}},writable:true,configurable:true});

  // --- 其他 API 补丁 ---
  window.ResizeObserver = class { observe(){} unobserve(){} disconnect(){} };
  window.IntersectionObserver = class { constructor(cb){this._cb=cb;} observe(){} unobserve(){} disconnect(){} };
  window.requestAnimationFrame = window.requestAnimationFrame || ((cb)=>setTimeout(cb,16));
  window.cancelAnimationFrame = window.cancelAnimationFrame || ((id)=>clearTimeout(id));

  return { dom, window };
}


/**
 * 生成 blackBox
 * @returns {Promise<string>} blackBox 值
 */
async function generateBlackBox() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('blackBox 生成超时 (30s)')), 30000);
    const { dom, window } = createBrowserEnv();

    window._fmOpt = {
      partner: 'jxhk',
      appName: 'jxhk_web',
      success: (result) => { clearTimeout(timeout); resolve(result); },
      error: (err) => { clearTimeout(timeout); reject(new Error('同盾 SDK 执行失败')); },
    };

    // 抑制 SDK 的 debug 输出
    const origConsoleLog = console.log;
    console.log = () => {};
    const sdkCode = fs.readFileSync(path.join(__dirname, 'fm.js'), 'utf-8');
    try {
      window.eval(sdkCode);
    } catch (e) {
      // SDK 内部可能有非致命错误, 继续等待回调
    }
    // 500ms 后恢复 console.log
    setTimeout(() => { console.log = origConsoleLog; }, 500);
  });
}

// CLI 入口
if (require.main === module) {
  generateBlackBox()
    .then(bb => { process.stdout.write(bb); process.exit(0); })
    .catch(e => { console.error(e.message); process.exit(1); });
}

module.exports = { generateBlackBox };
