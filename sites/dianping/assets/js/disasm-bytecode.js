/**
 * H5guard aS VM 字节码反汇编器
 *
 * 解析 new aS(bytecode, externals, hash) 中的字节码字符串
 * 
 * 字节码格式（二进制头部）:
 *   [4B] numFunctions (int32)
 *   [4B] _padding
 *   [1B] debugFlag
 *   For each function: [4B] type, [4B] offset
 *   Then function bodies...
 *
 * 指令编码: 单字节 opcode + 可选 varint 操作数
 *
 * 用法: node disasm-bytecode.js
 */
const fs = require("fs");

// ── Opcode 映射表（从 aS VM run 方法逆向还原） ──
const OPCODES = {
  0x00: { name: "PUSH_FALSE",   desc: "push false" },
  0x01: { name: "PUSH_TRUE",    desc: "push true" },
  0x02: { name: "LOAD_FLOAT",   desc: "push floats[varint]", operands: 1 },
  0x03: { name: "LOAD_STRING",  desc: "push strings[varint]", operands: 1 },
  0x04: { name: "POP",          desc: "pop stack top" },
  0x05: { name: "SWAP",         desc: "swap top two" },
  0x06: { name: "DUP",          desc: "duplicate stack top" },
  0x07: { name: "STORE_LOCAL",  desc: "scope[key] = val", operands: 0 },
  0x08: { name: "LOAD_VAR",     desc: "push scope[var]", operands: 0 },
  0x09: { name: "STORE_VAR",    desc: "scope[var] = val", operands: 0 },
  0x0A: { name: "JMP",          desc: "pc += int32", operands: "i32" },
  0x0B: { name: "JMP_SKIP",     desc: "pc += int32 (unconditional skip)", operands: "i32" },
  0x0C: { name: "JMP_FALSE",    desc: "if (!pop) pc += int32", operands: "i32" },
  0x0D: { name: "SWITCH",       desc: "multi-way branch", operands: "varint" },
  0x0E: { name: "MAKE_CLOSURE", desc: "push closure(funcId)", operands: 0 },
  0x0F: { name: "NOP/SKIP",     desc: "skip" },
  0x10: { name: "LOAD_GLOBAL",  desc: "push global[var]", operands: 0 },
  0x11: { name: "STORE_GLOBAL", desc: "global[var] = val", operands: 0 },
  0x12: { name: "LOAD_PROP",    desc: "push obj[key]", operands: 0 },
  0x13: { name: "STORE_PROP",   desc: "obj[key] = val", operands: 0 },
  0x14: { name: "RETURN",       desc: "return pop()", operands: 0 },
  0x15: { name: "CALL",         desc: "push fn.apply(this, args)", operands: 0 },
  0x16: { name: "NEW",          desc: "push new Constructor(args)", operands: 0 },
  0x17: { name: "RETURN_VAL",   desc: "return from try block", operands: 0 },
  0x18: { name: "SET_PROP2",    desc: "obj[key] = val (variant)", operands: 0 },
  0x19: { name: "DELETE",       desc: "push delete obj[key]", operands: 0 },
  0x1A: { name: "GET_PROP",     desc: "push obj[key] (variant)", operands: 0 },
  0x1B: { name: "EQ",           desc: "push a == b", operands: 0 },
  0x1C: { name: "NE",           desc: "push a != b", operands: 0 },
  0x1D: { name: "STRICT_EQ",   desc: "push a === b", operands: 0 },
  0x1E: { name: "STRICT_NE",   desc: "push a !== b", operands: 0 },
  0x1F: { name: "LT",           desc: "push a < b", operands: 0 },
  0x20: { name: "GT",           desc: "push a > b", operands: 0 },
  0x21: { name: "LE",           desc: "push a <= b", operands: 0 },
  0x22: { name: "GE",           desc: "push a >= b", operands: 0 },
  0x23: { name: "ADD",          desc: "push a + b", operands: 0 },
  0x24: { name: "CONCAT",       desc: "push str concat (varint parts)", operands: "varint" },
  0x25: { name: "SUB",          desc: "push a - b", operands: 0 },
  0x26: { name: "MUL",          desc: "push a * b", operands: 0 },
  0x27: { name: "DIV",          desc: "push a / b", operands: 0 },
  0x28: { name: "MOD",          desc: "push a % b", operands: 0 },
  0x29: { name: "POW",          desc: "push Math.pow(a, b)", operands: 0 },
  0x2A: { name: "BIT_NOT",      desc: "push ~a", operands: 0 },
  0x2B: { name: "LOGIC_NOT",    desc: "push !a", operands: 0 },
  0x2C: { name: "BIT_OR",       desc: "push a | b", operands: 0 },
  0x2D: { name: "BIT_AND",      desc: "push a & b", operands: 0 },
  0x2E: { name: "BIT_XOR",      desc: "push a ^ b", operands: 0 },
  0x2F: { name: "SHL",          desc: "push a << b", operands: 0 },
  0x30: { name: "SHR",          desc: "push a >> b", operands: 0 },
  0x31: { name: "TYPEOF",       desc: "push typeof a", operands: 0 },
  0x32: { name: "INSTANCEOF",   desc: "push a instanceof b", operands: 0 },
  0x33: { name: "USHR",         desc: "push a >>> b", operands: 0 },
  0x34: { name: "REGEXP",       desc: "push new RegExp(pattern, flags)", operands: 0 },
  0x35: { name: "MAKE_FUNC",    desc: "push function(closureId)", operands: 0 },
  0x36: { name: "NEW_OBJ",      desc: "push new Constructor(args)", operands: 0 },
  0x37: { name: "PUSH_UNDEFINED", desc: "push undefined", operands: 0 },
  0x38: { name: "PUSH_NULL",    desc: "push null", operands: 0 },
  0x39: { name: "MAKE_ARRAY",   desc: "push [items...]", operands: "varint" },
  0x3A: { name: "MAKE_OBJECT",  desc: "push {key:val,...}", operands: "varint" },
  0x3B: { name: "FOR_IN",       desc: "for (key in obj)", operands: 0 },
  0x3C: { name: "IN",           desc: "push key in obj", operands: 0 },
  0x3D: { name: "TRY_CATCH",    desc: "try/catch/finally", operands: 0 },
  0x3E: { name: "THROW",        desc: "throw pop()", operands: 0 },
  0x3F: { name: "RETURN_TRY",   desc: "return from try", operands: 0 },
};

// ── 解析 varint（可变长整数） ──
function readVarint(buf, offset) {
  let val = 0, shift = 0;
  let pos = offset;
  while (pos < buf.length) {
    const byte = buf[pos++];
    val |= (byte & 0x7F) << shift;
    shift += 7;
    if (!(byte & 0x80)) break;
  }
  // Sign extension
  if (shift < 32 && (val & (1 << (shift - 1)))) {
    val |= -(1 << shift);
  }
  return { value: val, bytesRead: pos - offset };
}

function readInt32(buf, offset) {
  return buf.readInt32LE(offset);
}

// ── 将 hex 字符串解码为 Buffer ──
function decodeBytecodeHex(hexStr) {
  // 字节码使用 "x" 作为分隔符: "x303x2173cx401..."
  // 实际格式: 每段以 "x" 开头，后跟 hex 数字
  const clean = hexStr.replace(/x/g, "");
  return Buffer.from(clean, "hex");
}

// ── 反汇编主函数 ──
function disassemble(bytecodeHex, externalNames = []) {
  let buf;
  try {
    buf = decodeBytecodeHex(bytecodeHex);
  } catch (e) {
    return { error: "Failed to decode hex: " + e.message };
  }

  const output = [];
  output.push(`; Bytecode size: ${buf.length} bytes`);
  output.push(`; External functions: [${externalNames.join(", ")}]`);
  output.push("");

  // 解析头部
  if (buf.length < 9) {
    output.push("; Too short for header");
    return output.join("\n");
  }

  const numFunctions = buf.readInt32LE(0);
  const padding = buf.readInt32LE(4);
  const debugFlag = buf.readUInt8(8);
  output.push(`; Header: numFunctions=${numFunctions}, padding=${padding}, debug=${debugFlag}`);

  // 读取函数表
  let offset = 9;
  const functions = [];
  for (let i = 0; i < numFunctions; i++) {
    if (offset + 8 > buf.length) break;
    const type = buf.readInt32LE(offset);
    const funcOffset = buf.readInt32LE(offset + 4);
    functions.push({ type, offset: funcOffset });
    output.push(`; Function[${i}]: type=${type}, offset=0x${funcOffset.toString(16)}`);
    offset += 8;
  }
  output.push("");

  // 反汇编每个函数的指令
  for (let fi = 0; fi < functions.length; fi++) {
    const func = functions[fi];
    let pc = func.offset;
    output.push(`; ── Function ${fi} (type=${func.type}, start=0x${pc.toString(16)}) ──`);

    let instrCount = 0;
    const maxInstr = 5000; // Safety limit

    while (pc < buf.length && instrCount < maxInstr) {
      const startPc = pc;
      const opcode = buf.readUInt8(pc++);
      const op = OPCODES[opcode];

      if (!op) {
        output.push(`  0x${startPc.toString(16).padStart(6, "0")}: UNKNOWN_0x${opcode.toString(16).padStart(2, "0")}`);
        instrCount++;
        continue;
      }

      let operands = "";

      if (op.operands === "i32") {
        if (pc + 4 > buf.length) break;
        const val = readInt32(buf, pc);
        pc += 4;
        operands = ` ${val} (0x${(val >= 0 ? startPc + val : startPc + val).toString(16)})`;
      } else if (op.operands === "varint" || op.operands === 1) {
        const { value, bytesRead } = readVarint(buf, pc);
        pc += bytesRead;
        operands = ` ${value}`;
      } else if (opcode === 0x0A || opcode === 0x0B) {
        // JMP / JMP_SKIP: read int32
        if (pc + 4 > buf.length) break;
        const val = readInt32(buf, pc);
        pc += 4;
        operands = ` → 0x${(pc + val).toString(16)}`;
      }

      output.push(`  0x${startPc.toString(16).padStart(6, "0")}: ${op.name.padEnd(18)}${operands}`);
      instrCount++;

      // Stop at RETURN or if we hit end markers
      if (opcode === 0x17 || opcode === 0x3F) break;
    }

    output.push("");
    if (instrCount >= maxInstr) {
      output.push(`  ; ... truncated at ${maxInstr} instructions`);
    }
  }

  return output.join("\n");
}

// ── 入口 ──
function main() {
  // mtgsig 签名 VM 字节码（从 k0 函数中提取）
  const mtgsigBytecode = "x303x2173cx401x321x302x20b04x303x20c58x304x3a4x3a4x709x328x3a3x309x20849x328x399x20852x20238x328x39ex20a8ax315030003a3010e073733030105070302030308060304133a000f07030503060703053803070803050802003a020f09030803090802011302021307030a03080802032207030b030908030a081307030c030808030a081d020422070306030908030c0813030c0802051d1307030d03080802022207030e02060308080306081d0202221d07030f03100806031113020702043a020f0312081d0306080208221d07031303140838031508030f083a010f3a0135070316380317080313083a010f070318380319080316083a010f07031a08031b031c08060cx30704031c080207130cx30b031c080207130ax302020712031a08031d031e08031f1312031a080320031c08060cx30704031c080209130cx30b031c080209130ax302020712031a08032103220803231312031a08032403250812031a0803260322080327130cx30b0322080327130ax302032812031a080329031e08032a1312031a08032b031e08032c1312032d031a08032e13031a08032f13031a08033013031a08033113031a08033213031a08033313031a08033413031a08031b13031a08031d13031a08032013031a08032113031a08032413031a08032613031a08032913031a08032b133a0f070335380336083803370803180803380806033913032d083a010f3a020f3a010f07033a033b07033c03380806033d13033a083a010f07033e033c08020a1307033c08020a033c08020b1312033c08020b033e0812033e033c08020c1309033c08020c033c08020d1312033c08020d033e0812033f0318080703c00003280703c10002070703c10008020e190cx37a03c200033f0803c1000813030b0803c100081326033c0803c1000813260703c30003280703c20008020e190cx31b03c30003c40003c200080603c50013020e3a010f1d090ax31203c30003c200080603c50013020e3a010f0903c00003c0000803c300081d0903c10003c1000802091d090affffff7a03c600031208020f270703c7003803c8000803c900080312080306080305081d020d221d3a020f0703ca003803cb000803c700083a010f0703cc0002070703cd00080cx31203cc0003c7000803c6000826090ax30f03cc0003c7000803060802051f260903ce003803cb000803cc00083a010f0703cf003803d0000803ca00080603d1001303ce00083a010f3a010f0703d20039000703d3003803d400083a000f0703d2000803d50003d600081203d2000803d7000312081203d2000803d80003d300081203d2000803d9000335081203d2000803da000310081203d2000803db0003c000081203d2000803dc0003dd00080603de00133a000f03df001d0305081d03df001d0306081d1203d2000803e00003e100081203d2000803e20002021203e30003d2000803e2001303d2000803d500131d03d2000803d700131d03d2000803d800131d03d2000803d900131d03d2000803da00131d03d2000803db00131d03d2000803dc00131d03e000131d03cf00081d0306081d0703e4003803e500080314083803150803e300083a010f3a01353a010f0703e6003803e7000803e400083a010f0703e80003380806033d13033808060339130309080210133a010f3a010f0703e90002070703e90008020e190cx35403ea0003080803e90008020a1f1d020e220703eb00030908030d0803e900081d1303ea000813020e220703e8000803e90008030908030e0803e900081d1303eb0008131203e90003e9000802091d090affffffa003ec003a000703ed0003e600080703ee0002070703ee000803ed000803ef0013190cx36803f0003803070803f10003ed00080603f2001303ee00083a010f1d03ed00080603f2001303ee000802091d3a010f1d3a010f0703f30003f0000803e8000803ee000802052113260703ec00080603f4001303f300083a010f03ee0003ee000802051d090affffff8603f50002070703f60008020f160cx31003f5003803f7000803f600083a010f0903ec0008021003ec000802071303ec00080202132603f50008020713261203ec0008020b03ec000802091303ec00080208132603f50008020913261203ec0008020103ec000802051303ec00080211132603f50008020513261203ec0008021203ec0008020a1303ec0008020c132603f50008020a13261203ec0008021303ec000802021303ec00080208132603ec0008020713260214271203ec0008020403ec000802081303ec00080211132603ec0008020913260215271203ec0008021603ec000802111303ec0008020c132603ec0008020513260217271203f80002070703f90002090703fa0002070703fb0002070703fc0002070703fd00020907039901039a01039e01320003f800080209150cx31103ec0008021303ec00080213130219251203f900080209150cx31103ec0008021303ec00080213130205251203fa00080209150cx31103ec0008020403ec0008020413021a251203fb00080209150cx31103ec0008020403ec00080204130202251203fc00080209150cx31103ec0008021603ec0008021613021b251203fd00080209150cx31103ec0008021603ec00080216130209251203ec0008020d03ec000802131303ec00080204132603ec00080216132603ec00080210132603ec0008020b132603ec00080201132603ec00080212132612039f0103280703a00102070703a0010803ec000803ef0013190cx36b03a10103280703ec000803a0010813020e190cx32003a10103c40003ec000803a00108130603c50013020e3a010f1d090ax31703a10103ec000803a00108130603c50013020e3a010f09039f01039f010803a101081d0903a00103a0010802091d090affffff8303d2000803a201039f01081203d2000811373303fe00030308060304133a000f0703ff00080603c500133a000f06038001130381010382012d03283a020f06038301130384013a010f060385011303283a010f03860116060bx33b0403ff000803c500130603c500133a000f06038001130381010382012d03283a020f06038301130384013a010f060385011303283a010f038701160cx30603f800020909038801080603c500133a000f06038001130381010382012d03283a020f06038301130384013a010f060385011303283a010f03890116060bx33b040388010803c500130603c500133a000f06038001130381010382012d03283a020f06038301130384013a010f060385011303283a010f038701160cx30603f80002090903f900038a01038b01082f060bx30f04038b0108038c0113038a01130017060bx30904038d01038b01082f060bx30904038e01038b01082f060bx30904038f01038b01082f060bx30904039001039101082f060bx30904039201039101082f0cx30702070ax30202090903fa00039301082c03940118060cx309040393010803950113060cx30d040393010803950113039601130cx30702090ax30202070903fb00030308060304133a000f0302081e02181b0cx30702090ax30202070903fc000397010803ef00130cx30702090ax30202070903fd00038a01038c01082f060cx31004038c01080603980113038a013a010f0cx30702070ax302020909373338039b0108039c01039a0108039d01133a020f3733";

  // 外部函数（从 k0 调用: [jT, lW, lN, k9, aO, k7, jO, eU, eR, gV, iP, cW, cO, ka, m3, k6, jM, k5, f9, jS, aa, jN, aP, aQ, jP, k1, iF, ao]）
  const externals = [
    "jT", "lW", "lN", "k9", "aO", "k7", "jO", "eU", "eR", "gV",
    "iP", "cW", "cO", "ka", "m3", "k6", "jM", "k5", "f9", "jS",
    "aa", "jN", "aP", "aQ", "jP", "k1", "iF", "ao"
  ];

  const result = disassemble(mtgsigBytecode, externals);
  
  const outPath = "e:\\PythonCodeObject1\\Qoder_ObjectProdemo2\\sites\\dianping\\assets\\js\\deob\\mtgsig_bytecode.asm";
  fs.writeFileSync(outPath, result, "utf8");
  console.log(result.substring(0, 3000));
  console.log(`\n... (output saved to ${outPath})`);
}

main();
