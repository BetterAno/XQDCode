/**
 * H5guard aS VM 字节码解码器
 * 复现 VM 构造器中的二进制解析逻辑，提取字符串表、浮点表、函数表
 */

// ── 从 k0 函数中提取的 mtgsig VM 字节码 ──
const MTGSIG_BYTECODE = "x303x2173cx401x321x302x20b04x303x20c58x304x3a4x3a4x709x328x3a3x309x20849x328x399x20852x20238x328x39ex20a8ax315030003a3010e073733030105070302030308060304133a000f07030503060703053803070803050802003a020f09030803090802011302021307030a03080802032207030b030908030a081307030c030808030a081d020422070306030908030c0813030c0802051d1307030d03080802022207030e02060308080306081d0202221d07030f03100806031113020702043a020f0312081d0306080208221d07031303140838031508030f083a010f3a0135070316380317080313083a010f070318380319080316083a010f07031a08031b031c08060cx30704031c080207130cx30b031c080207130ax302020712031a08031d031e08031f1312031a080320031c08060cx30704031c080209130cx30b031c080209130ax302020712031a08032103220803231312031a08032403250812031a0803260322080327130cx30b0322080327130ax302032812031a080329031e08032a1312031a08032b031e08032c1312032d031a08032e13031a08032f13031a08033013031a08033113031a08033213031a08033313031a08033413031a08031b13031a08031d13031a08032013031a08032113031a08032413031a08032613031a08032913031a08032b133a0f070335380336083803370803180803380806033913032d083a010f3a020f3a010f07033a033b07033c03380806033d13033a083a010f07033e033c08020a1307033c08020a033c08020b1312033c08020b033e0812033e033c08020c1309033c08020c033c08020d1312033c08020d033e0812033f0318080703c00003280703c10002070703c10008020e190cx37a03c200033f0803c1000813030b0803c100081326033c0803c1000813260703c30003280703c20008020e190cx31b03c30003c40003c200080603c50013020e3a010f1d090ax31203c30003c200080603c50013020e3a010f0903c00003c0000803c300081d0903c10003c1000802091d090affffff7a03c600031208020f270703c7003803c8000803c900080312080306080305081d020d221d3a020f0703ca003803cb000803c700083a010f0703cc0002070703cd00080cx31203cc0003c7000803c6000826090ax30f03cc0003c7000803060802051f260903ce003803cb000803cc00083a010f0703cf003803d0000803ca00080603d1001303ce00083a010f3a010f0703d20039000703d3003803d400083a000f0703d2000803d50003d600081203d2000803d7000312081203d2000803d80003d300081203d2000803d9000335081203d2000803da000310081203d2000803db0003c000081203d2000803dc0003dd00080603de00133a000f03df001d0305081d03df001d0306081d1203d2000803e00003e100081203d2000803e20002021203e30003d2000803e2001303d2000803d500131d03d2000803d700131d03d2000803d800131d03d2000803d900131d03d2000803da00131d03d2000803db00131d03d2000803dc00131d03e000131d03cf00081d0306081d0703e4003803e500080314083803150803e300083a010f3a01353a010f0703e6003803e7000803e400083a010f0703e80003380806033d13033808060339130309080210133a010f3a010f0703e90002070703e90008020e190cx35403ea0003080803e90008020a1f1d020e220703eb00030908030d0803e900081d1303ea000813020e220703e8000803e90008030908030e0803e900081d1303eb0008131203e90003e9000802091d090affffffa003ec003a000703ed0003e600080703ee0002070703ee000803ed000803ef0013190cx36803f0003803070803f10003ed00080603f2001303ee00083a010f1d03ed00080603f2001303ee000802091d3a010f1d3a010f0703f30003f0000803e8000803ee000802052113260703ec00080603f4001303f300083a010f03ee0003ee000802051d090affffff8603f50002070703f60008020f160cx31003f5003803f7000803f600083a010f0903ec0008021003ec000802071303ec00080202132603f50008020713261203ec0008020b03ec000802091303ec00080208132603f50008020913261203ec0008020103ec000802051303ec00080211132603f50008020513261203ec0008021203ec0008020a1303ec0008020c132603f50008020a13261203ec0008021303ec000802021303ec00080208132603ec0008020713260214271203ec0008020403ec000802081303ec00080211132603ec0008020913260215271203ec0008021603ec000802111303ec0008020c132603ec0008020513260217271203f80002070703f90002090703fa0002070703fb0002070703fc0002070703fd00020907039901039a01039e01320003f800080209150cx31103ec0008021303ec00080213130219251203f900080209150cx31103ec0008021303ec00080213130205251203fa00080209150cx31103ec0008020403ec0008020413021a251203fb00080209150cx31103ec0008020403ec00080204130202251203fc00080209150cx31103ec0008021603ec0008021613021b251203fd00080209150cx31103ec0008021603ec00080216130209251203ec0008020d03ec000802131303ec00080204132603ec00080216132603ec00080210132603ec0008020b132603ec00080201132603ec00080212132612039f0103280703a00102070703a0010803ec000803ef0013190cx36b03a10103280703ec000803a0010813020e190cx32003a10103c40003ec000803a00108130603c50013020e3a010f1d090ax31703a10103ec000803a00108130603c50013020e3a010f09039f01039f010803a101081d0903a00103a0010802091d090affffff8303d2000803a201039f01081203d2000811373303fe00030308060304133a000f0703ff00080603c500133a000f06038001130381010382012d03283a020f06038301130384013a010f060385011303283a010f03860116060bx33b0403ff000803c500130603c500133a000f06038001130381010382012d03283a020f06038301130384013a010f060385011303283a010f038701160cx30603f800020909038801080603c500133a000f06038001130381010382012d03283a020f06038301130384013a010f060385011303283a010f03890116060bx33b040388010803c500130603c500133a000f06038001130381010382012d03283a020f06038301130384013a010f060385011303283a010f038701160cx30603f80002090903f900038a01038b01082f060bx30f04038b0108038c0113038a01130017060bx30904038d01038b01082f060bx30904038e01038b01082f060bx30904038f01038b01082f060bx30904039001039101082f060bx30904039201039101082f0cx30702070ax30202090903fa00039301082c03940118060cx309040393010803950113060cx30d040393010803950113039601130cx30702090ax30202070903fb00030308060304133a000f0302081e02181b0cx30702090ax30202070903fc000397010803ef00130cx30702090ax30202070903fd00038a01038c01082f060cx31004038c01080603980113038a013a010f0cx30702070ax302020909373338039b0108039c01039a0108039d01133a020f3733";

// ── 外部函数名 ──
const EXTERNALS = [
  "jT", "lW", "lN", "k9", "aO", "k7", "jO", "eU", "eR", "gV",
  "iP", "cW", "cO", "ka", "m3", "k6", "jM", "k5", "f9", "jS",
  "aa", "jN", "aP", "aQ", "jP", "k1", "iF", "ao"
];

// ── 复现 VM 的字节码解码逻辑 ──
function decodeBytecode(bytecodeHex, externals) {
  // Step 1: 模拟 VM 的 run 初始化中的解码
  // lw = "3n2l3o2f2" → 用于 XOR 密钥派生
  // lz 函数: parseInt(hexStr.charAt(pos), 16).toString()

  // 解码 hex 字符串: 每2字符为1字节, 用 parseInt(charAt(pos), 16)
  function hexCharToNibble(str, pos) {
    return parseInt(str.charAt(pos), 16);
  }

  // 计算 XOR 密钥
  // key = +new Date() + (parseInt("3n2l3o2f2", 28) >> 21) - new Date()["_getTime2"]()
  // 其中 _getTime2 是 "_getTime" → getTime
  // parseInt("3n2l3o2f2", 28) 在 base 28 下解析
  const lw = "3n2l3o2f2";
  const lwParsed = parseInt(lw, 28);
  const keyComponent = lwParsed >> 21;

  // 实际密钥: 在 VM 中是 +new Date() + keyComponent - Date.getTime()
  // 由于 Date.getTime() === +new Date(), 这两项抵消
  // 所以 key = keyComponent (但经过 XOR 编码处理)
  // 在实际运行中, 密钥是动态的, 但 let's try key = 0 或 keyComponent

  // Step 2: 提取字节
  const bytecodeStr = bytecodeHex;
  const len = bytecodeStr.length;

  // VM 中的解码: 遍历每字符, 偶数位跳过, 奇数位取值
  // lD = lz(bytecode, lF, key)
  // if (lF % 2) lE += lD; else lE += ""
  // 这意味着 lE 收集的是奇数位的值

  // lz(lx, ly, lz_param) = parseInt(lx.charAt(ly), lz_param > 0 ? 28 : 16).toString()
  // 由于 key > 0, 所以 radix = 28... 不对, 让我重新看

  // 实际的 lz 函数(line 1722-1723):
  // function(lx, ly, lz) { return parseInt(lx.charAt(ly), lz > 0 ? 28 : 16).toString() }
  // 第一次调用时 lz_param 是 key 函数返回的值

  // 简化: 直接用 base 16 解析 hex 字符串
  const hexClean = bytecodeHex.replace(/x/g, "");
  const bytes = Buffer.from(hexClean, "hex");

  console.log(`解码后字节数: ${bytes.length}`);
  console.log(`前 64 字节: ${bytes.slice(0, 64).toString("hex")}`);

  // Step 3: 解析头部
  if (bytes.length < 9) {
    console.log("错误: 字节码太短");
    return;
  }

  const numFunctions = bytes.readInt32LE(0);
  const padding = bytes.readInt32LE(4);
  const debugFlag = bytes.readUInt8(8);

  console.log(`\n═══ 头部 ═══`);
  console.log(`函数数量: ${numFunctions}`);
  console.log(`填充: ${padding}`);
  console.log(`调试标志: ${debugFlag}`);

  // Step 4: 读取函数表
  let offset = 9;
  const functions = [];
  for (let i = 0; i < numFunctions; i++) {
    if (offset + 8 > bytes.length) break;
    const type = bytes.readInt32LE(offset);
    const funcOffset = bytes.readInt32LE(offset + 4);
    functions.push({ type, offset: funcOffset });
    offset += 8;
  }

  console.log(`\n═══ 函数表 ═══`);
  functions.forEach((f, i) => {
    console.log(`  Function[${i}]: type=${f.type}, offset=0x${f.offset.toString(16)} (${f.offset})`);
  });

  // Step 5: 读取各函数的数据段
  for (let fi = functions.length - 1; fi >= 0; fi--) {
    const func = functions[fi];
    let pos = func.offset;

    if (func.type < 2) {
      // Type 0/1: 函数体 (包含子函数表)
      const numSubFuncs = bytes.readInt32LE(pos);
      pos += 4;
      const subFuncDataStart = pos;
      console.log(`\n═══ Function[${fi}] 函数体 (type=${func.type}, ${numSubFuncs} 个子函数) ═══`);

      for (let si = 0; si < numSubFuncs; si++) {
        if (pos + 16 > bytes.length) break;
        const sfName = bytes.readInt32LE(pos); pos += 4;
        const sfOffset = bytes.readInt32LE(pos); pos += 4;
        const sfSize = bytes.readInt32LE(pos); pos += 4;
        const sfType = bytes.readInt32LE(pos); pos += 4;

        const funcName = externals[sfName] || `ext_${sfName}`;
        console.log(`  SubFunc[${si}]: name=${funcName}(idx=${sfName}), offset=${sfOffset}, size=${sfSize}, type=${sfType}`);
      }
    } else if (func.type === 2) {
      // Type 2: 浮点常量表
      const numFloats = bytes.readInt32LE(pos);
      pos += 4;
      console.log(`\n═══ Function[${fi}] 浮点表 (${numFloats} 个) ═══`);
      for (let j = 0; j < numFloats && pos + 8 <= bytes.length; j++) {
        const val = bytes.readDoubleLE(pos);
        pos += 8;
        console.log(`  float[${j}] = ${val}`);
      }
    } else {
      // Type 3+: 字符串常量表
      const numStrings = bytes.readInt32LE(pos);
      pos += 4;
      console.log(`\n═══ Function[${fi}] 字符串表 (${numStrings} 个) ═══`);
      for (let j = 0; j < numStrings && pos + 8 <= bytes.length; j++) {
        const strOffset = bytes.readInt32LE(pos); pos += 4;
        const strLen = bytes.readInt32LE(pos); pos += 4;

        // 解码字符串 (XOR with key derived from lE)
        let str = "";
        for (let k = 0; k < strLen && pos + strOffset + k < bytes.length; k++) {
          const byte = bytes.readUInt8(pos + strOffset + k);
          // XOR key byte (简单处理: 用 0)
          const decoded = byte; // XOR key 需要动态计算
          str += String.fromCharCode(decoded);
        }

        if (str.length > 0) {
          // 尝试直接读取 UTF-16
          let str16 = "";
          try {
            const strBuf = bytes.slice(pos + strOffset, pos + strOffset + strLen);
            for (let k = 0; k < strLen; k += 2) {
              const code = strBuf.readUInt16LE(k);
              str16 += String.fromCharCode(code);
            }
          } catch (e) {
            str16 = str;
          }
          console.log(`  string[${j}] = "${str16.substring(0, 100)}" (len=${strLen})`);
        }
      }
    }
  }

  // Step 6: 反汇编第一个函数的指令
  if (functions.length > 0) {
    console.log(`\n═══ 指令反汇编 (Function[0]) ═══`);
    disassembleFunction(bytes, functions[0].offset, externals, 200);
  }
}

// ── 简易反汇编器 ──
function disassembleFunction(bytes, startOffset, externals, maxInstr) {
  const OPC_NAMES = {
    0:"PUSH_FALSE",1:"PUSH_TRUE",2:"LOAD_FLOAT",3:"LOAD_STRING",
    4:"POP",5:"SWAP",6:"DUP",7:"STORE_LOCAL",8:"LOAD_VAR",9:"STORE_VAR",
    0xA:"JMP",0xB:"JMP_SKIP",0xC:"JMP_FALSE",0xD:"SWITCH",
    0xE:"MAKE_CLOSURE",0x10:"LOAD_GLOBAL",0x11:"STORE_GLOBAL",
    0x12:"LOAD_PROP",0x13:"STORE_PROP",0x14:"RETURN",
    0x15:"CALL",0x16:"NEW",0x17:"RETURN_VAL",
    0x1D:"STRICT_EQ",0x1E:"STRICT_NE",
    0x23:"ADD",0x25:"SUB",0x26:"MUL",0x27:"DIV",
    0x2B:"LOGIC_NOT",0x33:"USHR",
    0x35:"MAKE_FUNC",0x37:"PUSH_UNDEFINED",0x38:"PUSH_NULL",
    0x39:"MAKE_ARRAY",0x3A:"MAKE_OBJECT",
    0x3C:"IN",0x3E:"THROW",0x3F:"RETURN_TRY"
  };

  let pc = startOffset;
  let count = 0;

  while (pc < bytes.length && count < maxInstr) {
    const startPc = pc;
    const opcode = bytes.readUInt8(pc++);
    const name = OPC_NAMES[opcode] || `OP_0x${opcode.toString(16).padStart(2,"0")}`;

    let extra = "";
    // Opcodes with int32 operand
    if ([0xA, 0xB, 0xC].includes(opcode)) {
      if (pc + 4 <= bytes.length) {
        const val = bytes.readInt32LE(pc); pc += 4;
        extra = ` ${val}`;
      }
    }
    // Opcodes with varint operand
    if ([2, 3, 0xE, 0x35, 0x39, 0x3A].includes(opcode)) {
      let val = 0, shift = 0;
      while (pc < bytes.length) {
        const b = bytes.readUInt8(pc++);
        val |= (b & 0x7F) << shift;
        shift += 7;
        if (!(b & 0x80)) break;
      }
      extra = ` ${val}`;
      if (opcode === 3 || opcode === 0xE || opcode === 0x35) {
        extra += ` (${externals[val] || "?"})`;
      }
    }

    console.log(`  0x${startPc.toString(16).padStart(6,"0")}: ${name.padEnd(16)}${extra}`);
    count++;
    if (opcode === 0x14 || opcode === 0x17 || opcode === 0x3F) break;
  }
}

// ── 执行 ──
decodeBytecode(MTGSIG_BYTECODE, EXTERNALS);
