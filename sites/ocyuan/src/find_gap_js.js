() => {
  var canvases = Array.from(document.querySelectorAll('canvas'));
  var bgCanvas = canvases.find(c => c.width === 260);
  var slCanvas = canvases.find(c => c.width === 58);
  if (!bgCanvas || !slCanvas) return {error: 'canvas not found'};
  
  var bgCtx = bgCanvas.getContext('2d');
  var slCtx = slCanvas.getContext('2d');
  var bgData = bgCtx.getImageData(0, 0, 260, 160).data;
  var slData = slCtx.getImageData(0, 0, 58, 160).data;
  
  // 滑块图中找有效区域（非透明的alpha）
  var slRowStart = 160, slRowEnd = 0;
  for (var y = 0; y < 160; y++) {
    for (var x = 0; x < 58; x++) {
      var alpha = slData[(y * 58 + x) * 4 + 3];
      if (alpha > 50) {
        if (y < slRowStart) slRowStart = y;
        if (y > slRowEnd) slRowEnd = y;
      }
    }
  }
  
  // 按列计算亮度（只在滑块有效行范围内）
  var colBrightness = [];
  for (var x = 0; x < 260; x++) {
    var sum = 0, cnt = 0;
    for (var y = slRowStart; y <= slRowEnd; y++) {
      var idx = (y * 260 + x) * 4;
      sum += bgData[idx] * 0.299 + bgData[idx+1] * 0.587 + bgData[idx+2] * 0.114;
      cnt++;
    }
    colBrightness.push(cnt > 0 ? sum / cnt : 0);
  }
  
  // 找最暗的连续50px区域（缺口通常比周围暗）
  var sliceW = 50;
  var minAvg = 9999, minX = 0;
  for (var x = 0; x <= 260 - sliceW; x++) {
    var avg = 0;
    for (var i = 0; i < sliceW; i++) avg += colBrightness[x+i];
    avg /= sliceW;
    if (avg < minAvg) { minAvg = avg; minX = x; }
  }
  
  // 另一种方法：找标准差最大的区域（缺口边缘有强边缘）
  var maxStd = 0, maxStdX = 0;
  for (var x = 1; x < 259; x++) {
    var left = colBrightness[x-1], cur = colBrightness[x], right = colBrightness[x+1];
    var edgeScore = Math.abs(cur - left) + Math.abs(cur - right);
    if (edgeScore > maxStd) { maxStd = edgeScore; maxStdX = x; }
  }
  
  return {
    slRowRange: [slRowStart, slRowEnd],
    darkestGapX: minX,
    darkestGapBrightness: Math.round(minAvg),
    maxEdgeX: maxStdX,
    maxEdgeScore: Math.round(maxStd),
    brightnessProfile: colBrightness.map(v => Math.round(v))
  };
}
