var blm5tug = function () {
  var r = String.fromCharCode,
    o = "\u0041\u0042\u0043\u0044\u0045\u0046\u0047\u0048\u0049\u004a\u004b\u004c\u004d\u004e\u004f\u0050\u0051\u0052\u0053\u0054\u0055\u0056\u0057\u0058\u0059\u005a\u0061\u0062\u0063\u0064\u0065\u0066\u0067\u0068\u0069\u006a\u006b\u006c\u006d\u006e\u006f\u0070\u0071\u0072\u0073\u0074\u0075\u0076\u0077\u0078\u0079\u007a\u0030\u0031\u0032\u0033\u0034\u0035\u0036\u0037\u0038\u0039\u002b\u002f\u003d",
    n = "\u0041\u0042\u0043\u0044\u0045\u0046\u0047\u0048\u0049\u004a\u004b\u004c\u004d\u004e\u004f\u0050\u0051\u0052\u0053\u0054\u0055\u0056\u0057\u0058\u0059\u005a\u0061\u0062\u0063\u0064\u0065\u0066\u0067\u0068\u0069\u006a\u006b\u006c\u006d\u006e\u006f\u0070\u0071\u0072\u0073\u0074\u0075\u0076\u0077\u0078\u0079\u007a\u0030\u0031\u0032\u0033\u0034\u0035\u0036\u0037\u0038\u0039\u002b\u002d\u0024",
    e = {};
  function t(r, o) {
    if (!e[r]) {
      e[r] = {};
      for (var n = 0x0; n < r.length; n++) e[r][r.charAt(n)] = n;
    }
    return e[r][o];
  }
  var i = {
    compressToBase64: function (r) {
      function* ledZnZS(zjHMcmn, ehGZRO, IdFWC4h, cF5bYI, yhotaS_ = {
        ["\x64\x74\x62\x41\x4f\x46"]: {}
      }) {
        while (zjHMcmn + ehGZRO + IdFWC4h + cF5bYI !== -0x81) {
          with (yhotaS_.Ieoilnd || yhotaS_) {
            switch (zjHMcmn + ehGZRO + IdFWC4h + cF5bYI) {
              case IdFWC4h - 0x20:
                [yhotaS_.dtbAOF.IF4pHw3, yhotaS_.dtbAOF.HlQ_FBd] = [0x18, 0x2b];
                yhotaS_.Ieoilnd = yhotaS_.gxXO_u, zjHMcmn += -0x119, ehGZRO += 0x2a, IdFWC4h += -0x123, cF5bYI += 0x26d;
                break;
              case -0xb8:
                yhotaS_.Ieoilnd = yhotaS_.Ww3XAVf, zjHMcmn += -0xc, ehGZRO += -0x5, IdFWC4h += -0xe1, cF5bYI += 0x218;
                break;
              default:
              case 0x65:
                [yhotaS_.dtbAOF.IF4pHw3, yhotaS_.dtbAOF.HlQ_FBd] = [0x75, 0x17];
                if (null == r) return FJXea5 = true, "";
                dtbAOF.IUtfptY = i._compress(r, ehGZRO + -0x4b, function (r) {
                  return o.charAt(r);
                });
                switch (dtbAOF.IUtfptY.length % 0x4) {
                  default:
                  case 0x0:
                    return FJXea5 = true, dtbAOF.IUtfptY;
                  case 0x1:
                    return FJXea5 = true, dtbAOF.IUtfptY + "\x3d\x3d\x3d";
                  case 0x2:
                    return FJXea5 = true, dtbAOF.IUtfptY + "\u003d\u003d";
                  case IdFWC4h + 0xf3:
                    return FJXea5 = true, dtbAOF.IUtfptY + "\u003d";
                }
                zjHMcmn += 0x87, ehGZRO += -0x8, IdFWC4h += 0xff, cF5bYI += -0x26d;
                break;
                if (zjHMcmn == IdFWC4h + 0x144) {
                  yhotaS_.Ieoilnd = yhotaS_.dtbAOF, zjHMcmn += 0xc, ehGZRO += 0x5, IdFWC4h += 0xe1, cF5bYI += -0x218;
                  break;
                }
              case cF5bYI - -0xd:
              case 0xb5:
              case 0x9c:
                [yhotaS_.dtbAOF.IF4pHw3, yhotaS_.dtbAOF.HlQ_FBd] = [-0x19, -0x71];
                yhotaS_.Ieoilnd = yhotaS_.dtbAOF, zjHMcmn += -0x7a, ehGZRO += 0x110, cF5bYI += -0xdc;
                break;
              case IdFWC4h - -0x12a:
                yhotaS_.Ieoilnd = yhotaS_.dtbAOF, IdFWC4h += 0xea, cF5bYI += -0x1d3;
                break;
            }
          }
        }
      }
      var FJXea5;
      var xUKSzf = ledZnZS(-0xd0, 0x51, -0xf0, 0x1dd).next().value;
      if (FJXea5) {
        return xUKSzf;
      }
    },
    decompressFromBase64: function (r) {
      return null == r ? "" : "" == r ? null : i._decompress(r.length, 0x20, function (n) {
        return t(o, r.charAt(n));
      });
    },
    compressToUTF16: function (o) {
      return null == o ? "" : i._compress(o, 0xf, function (o) {
        return r(o + 0x20);
      }) + "\x20";
    },
    decompressFromUTF16: function (r) {
      return null == r ? "" : "" == r ? null : i._decompress(r.length, 0x4000, function (o) {
        return r.charCodeAt(o) - 0x20;
      });
    },
    compressToUint8Array: function (r) {
      for (var o = i.compress(r), n = new Uint8Array(0x2 * o.length), e = 0x0, t = o.length; e < t; e++) {
        var s = o.charCodeAt(e);
        n[0x2 * e] = s >>> 0x8, n[0x2 * e + 0x1] = s % 0x100;
      }
      return n;
    },
    decompressFromUint8Array: function (o) {
      if (null == o) return i.decompress(o);
      for (var n = new Array(o.length / 0x2), e = 0x0, t = n.length; e < t; e++) n[e] = 0x100 * o[0x2 * e] + o[0x2 * e + 0x1];
      var s = [];
      return n.forEach(function (o) {
        s.push(r(o));
      }), i.decompress(s.join(""));
    },
    compressToEncodedURIComponent: function (r) {
      return null == r ? "" : i._compress(r, 0x6, function (r) {
        return n.charAt(r);
      });
    },
    decompressFromEncodedURIComponent: function (r) {
      return null == r ? "" : "" == r ? null : (r = r.replace(/ /g, "\x2b"), i._decompress(r.length, 0x20, function (o) {
        return t(n, r.charAt(o));
      }));
    },
    compress: function (o) {
      return i._compress(o, 0x10, function (o) {
        return r(o);
      });
    },
    _compress: function (r, o, n) {
      if (null == r) return "";
      var e,
        t,
        i,
        s = {},
        u = {},
        a = "",
        p = "",
        c = "",
        l = 0x2,
        f = 0x3,
        h = 0x2,
        d = [],
        m = 0x0,
        v = 0x0;
      for (i = 0x0; i < r.length; i += 0x1) if (a = r.charAt(i), Object.prototype.hasOwnProperty.call(s, a) || (s[a] = f++, u[a] = !0x0), p = c + a, Object.prototype.hasOwnProperty.call(s, p)) c = p;else {
        if (Object.prototype.hasOwnProperty.call(u, c)) {
          if (c.charCodeAt(0x0) < 0x100) {
            for (e = 0x0; e < h; e++) m <<= 0x1, v == o - 0x1 ? (v = 0x0, d.push(n(m)), m = 0x0) : v++;
            for (t = c.charCodeAt(0x0), e = 0x0; e < 0x8; e++) m = m << 0x1 | 0x1 & t, v == o - 0x1 ? (v = 0x0, d.push(n(m)), m = 0x0) : v++, t >>= 0x1;
          } else {
            for (t = 0x1, e = 0x0; e < h; e++) m = m << 0x1 | t, v == o - 0x1 ? (v = 0x0, d.push(n(m)), m = 0x0) : v++, t = 0x0;
            for (t = c.charCodeAt(0x0), e = 0x0; e < 0x10; e++) m = m << 0x1 | 0x1 & t, v == o - 0x1 ? (v = 0x0, d.push(n(m)), m = 0x0) : v++, t >>= 0x1;
          }
          0x0 == --l && (l = Math.pow(0x2, h), h++), delete u[c];
        } else for (t = s[c], e = 0x0; e < h; e++) m = m << 0x1 | 0x1 & t, v == o - 0x1 ? (v = 0x0, d.push(n(m)), m = 0x0) : v++, t >>= 0x1;
        0x0 == --l && (l = Math.pow(0x2, h), h++), s[p] = f++, c = String(a);
      }
      if ("" !== c) {
        if (Object.prototype.hasOwnProperty.call(u, c)) {
          if (c.charCodeAt(0x0) < 0x100) {
            for (e = 0x0; e < h; e++) m <<= 0x1, v == o - 0x1 ? (v = 0x0, d.push(n(m)), m = 0x0) : v++;
            for (t = c.charCodeAt(0x0), e = 0x0; e < 0x8; e++) m = m << 0x1 | 0x1 & t, v == o - 0x1 ? (v = 0x0, d.push(n(m)), m = 0x0) : v++, t >>= 0x1;
          } else {
            for (t = 0x1, e = 0x0; e < h; e++) m = m << 0x1 | t, v == o - 0x1 ? (v = 0x0, d.push(n(m)), m = 0x0) : v++, t = 0x0;
            for (t = c.charCodeAt(0x0), e = 0x0; e < 0x10; e++) m = m << 0x1 | 0x1 & t, v == o - 0x1 ? (v = 0x0, d.push(n(m)), m = 0x0) : v++, t >>= 0x1;
          }
          0x0 == --l && (l = Math.pow(0x2, h), h++), delete u[c];
        } else for (t = s[c], e = 0x0; e < h; e++) m = m << 0x1 | 0x1 & t, v == o - 0x1 ? (v = 0x0, d.push(n(m)), m = 0x0) : v++, t >>= 0x1;
        0x0 == --l && (l = Math.pow(0x2, h), h++);
      }
      for (t = 0x2, e = 0x0; e < h; e++) m = m << 0x1 | 0x1 & t, v == o - 0x1 ? (v = 0x0, d.push(n(m)), m = 0x0) : v++, t >>= 0x1;
      for (;;) {
        if (m <<= 0x1, v == o - 0x1) {
          d.push(n(m));
          break;
        }
        v++;
      }
      return d.join("");
    },
    decompress: function (r) {
      return null == r ? "" : "" == r ? null : i._decompress(r.length, 0x8000, function (o) {
        return r.charCodeAt(o);
      });
    },
    _decompress: function (o, n, e) {
      var t,
        i,
        s,
        u,
        a,
        p,
        c,
        l = [],
        f = 0x4,
        h = 0x4,
        d = 0x3,
        m = "",
        v = [],
        g = {
          val: e(0x0),
          position: n,
          index: 0x1
        };
      for (t = 0x0; t < 0x3; t += 0x1) l[t] = t;
      for (s = 0x0, a = Math.pow(0x2, 0x2), p = 0x1; p != a;) u = g.val & g.position, g.position >>= 0x1, 0x0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0x0 ? 0x1 : 0x0) * p, p <<= 0x1;
      switch (s) {
        case 0x0:
          for (s = 0x0, a = Math.pow(0x2, 0x8), p = 0x1; p != a;) u = g.val & g.position, g.position >>= 0x1, 0x0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0x0 ? 0x1 : 0x0) * p, p <<= 0x1;
          c = r(s);
          break;
        case 0x1:
          for (s = 0x0, a = Math.pow(0x2, 0x10), p = 0x1; p != a;) u = g.val & g.position, g.position >>= 0x1, 0x0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0x0 ? 0x1 : 0x0) * p, p <<= 0x1;
          c = r(s);
          break;
        case 0x2:
          return "";
      }
      for (l[0x3] = c, i = c, v.push(c);;) {
        if (g.index > o) return "";
        for (s = 0x0, a = Math.pow(0x2, d), p = 0x1; p != a;) u = g.val & g.position, g.position >>= 0x1, 0x0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0x0 ? 0x1 : 0x0) * p, p <<= 0x1;
        switch (c = s) {
          case 0x0:
            for (s = 0x0, a = Math.pow(0x2, 0x8), p = 0x1; p != a;) u = g.val & g.position, g.position >>= 0x1, 0x0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0x0 ? 0x1 : 0x0) * p, p <<= 0x1;
            l[h++] = r(s), c = h - 0x1, f--;
            break;
          case 0x1:
            for (s = 0x0, a = Math.pow(0x2, 0x10), p = 0x1; p != a;) u = g.val & g.position, g.position >>= 0x1, 0x0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0x0 ? 0x1 : 0x0) * p, p <<= 0x1;
            l[h++] = r(s), c = h - 0x1, f--;
            break;
          case 0x2:
            return v.join("");
        }
        if (0x0 == f && (f = Math.pow(0x2, d), d++), l[c]) m = l[c];else {
          if (c !== h) return null;
          m = i + i.charAt(0x0);
        }
        v.push(m), l[h++] = i + m.charAt(0x0), i = m, 0x0 == --f && (f = Math.pow(0x2, d), d++);
      }
    }
  };
  return i;
}();
"\x66\x75\x6e\x63\x74\x69\x6f\x6e" == typeof define && define.amd ? define(function () {
  return blm5tug;
}) : "\u0075\u006e\u0064\u0065\u0066\u0069\u006e\u0065\u0064" != typeof module && null != module ? module.exports = blm5tug : "\x75\x6e\x64\x65\x66\x69\x6e\x65\x64" != typeof angular && null != angular && angular.module("\u004c\u005a\u0053\u0074\u0072\u0069\u006e\u0067", []).factory("\u004c\u005a\u0053\u0074\u0072\u0069\u006e\u0067", function () {
  return blm5tug;
});
var __p_QVKz_SC;
(function () {
  var compressedString = "ᗡ氩䅬ڀ䬰堣灞䂤ʈੀᄠ㘢⠫ဩ怭\u0021㘠Ⱒ࠭倯䀾嵊Ɉހ෠੭䃪䐡刡䛨ȄƌȈù⠢㵫ဠ㠧⨲䀡呠ૠϪ䛠Ҡ֠পՠޠʠ஠㎽㒠⨠䤠猠彼崠⍕䀢䀥瀥栢䠡ʔ↏ᑠᕱ୆໖䠢డ䓠ܿ哾怭盠Ǩƹ␠䩆㢭\u003a映\u0050ϙ⅑䐼\u0052㘬Ӟ撰²瀣浜▨䶞ᬭ☸昲ᓬ擱䝬䤬䦁泞䐰ძ値㯘欝䍂䦝⅝䀨汩⮊ঢ㌺⫤吠᝟լ᪭䲉咨⁴䕃注ⶵ٣屑㘿䄡䘠✨⏱痌焾⢠ý␠ѹ\u0022砠橈䰠Ǌᅔ㨳痚ʵႳԘₘ㮽授᡼∦䗚ᬜ⦮䄫ၸ塿䈳㉔⮿⛣璀㢧向䀠ಸ๴䢘჎ሧᅬ䱝摭㣑࠸♭૆摉භ桀憱恇़憢䀣禐檑ᠩ䪀祈຦手㤏ᄠÊᔆᣠā◣⢃⠶祒崱ဦஸ繃䂶②㞁䂽ፀ屜哫偐偼㷫䞅栰墅䓤༢݂⒨㉀ρ傸疁ࢦ䥜⨬⣳秼匱惢┵䝖⼀䅨氲⛁啒吡乳Եɳ岄⼼呙䀢天䐵ᣖࣈᅳᢉ⥰慀火䅐ᄸ䬵掵噃孂ংಝ檣ű⑆Щ☼䅰㑕䓠樴⇁ࡍ䛡᤼㘹晟¡渧ސ症曑ࡗ䘡刷̨䒰ㆈ㰿䟼ᰭܑ栬ʕ䌲㚱㸳劕懂ᎀ挨◠㴪䙠䇂咉⢱ሱἣѡ桔䒰儻݀ᱚƨ愱村ૄ䍅栯Հ縻šቇ䌡䁙䎍ᔱ抡ѕ䂡㠩❀㑛䚣࠽㚽ᡐБ摒ߐ偕䈉⸨䉩样Ձ嘧搑㘪䟰撲㏁師⛠樲⁐氧燈ణɬ੖❐⩑䕠㱕暹湀♡㒎ș⑞˥⠫⃓᤯⚱瘷́䘴柠䧀◠䓆≁籘䏁㨺䗤倸˒≐掌偂哈縸⚱൅ુ὆❡㝙叀樳呥敂ጨ䦫㗱ᥝ䍱ࣀ☹䠨ɬ娸⍱⹇敡બͰ恐戈儴戀慉ǹ☧ʔ䇇䒐၄䄩䀨⟰汐搩籔䞐╍䏨ာՑ搨䓠 ∍ભ⊠ㅆƉ憤ߠ礠˴䣤ᄶ漎ᔣ硳䬶墭ׇ㢁㱱唚ᄡ甈ۃ᳡␼Ꮶᣗᗣ೘岠涡ᜲࡁࢰ桮䕤㢮Ს⡧໔㤘ࡦ堼ರ゙డ烤ׅ愄ƠĬᅳ⣗໗ჹ᜶墢ීҵ஦䡤孁⣾ँ⤂ׄ႕䕦ೈፆ₍ᜀ䓻㏡璨ق洖᫢䂻口ˍ䟄攜ᯧᣆᷣ掁߆၅ວᑞ紥塁ᛤ碤ଲࡑޤ㔈ᜱѺȦ擄ل⁕ࡕ拤ಃ嘰Ⴀ点ᓣ㑑ᛤ㤚߄䢵൥嗈Ⴅ梨䀠㎴侠䢴ᄊ㻼ԑ灈吿≂⨢暘⎼䅠☫湊椨Ⅼ٤←䤰ኄⱭੴ戼儔㔲區᭱揘沱ੴ沣㞨医፸㔩硩乬ఠ䨌ՠ䁖ↂ᥄呙灸㘤䠰ୁ㜪ᇌة⟉\u0064⥥搶䁄䜣₪䠀琩ᤒᦑ孆Ȱ♡㑇␐欨䒃č廼⃀ỡ堪䃔➦㆗ܬ㼫ǫ⛰符ၢᣡॉ䋸ョ㢞ʸ笭䢮ྀ涹॑ण\u005b㼄粂Ĩᘯ䁐⦡䌭僸ţࡁ\u0050ᔕ扄䈚緥ṁྡ⠥墩ὡ爽Ǯ㼅ᠸɬ䰨䂹Ͱᰳ\u0029ፁ燂到ኂ䐦А㔫憄䊱⸽Ǫὢ䠽Ţ〢おʨ宩჆ġ⸦傎բ倵̸᥆౲҈☩ၩ丁稦凊䆢㉎ᄖᙅ屶ᓨ⢮ぅ୬疴恤ᜢᅗ䉴㘢䱌∬侣悕亁帴悤ᷠ溾ᨰ℣ѯĨᛩာ઀㲻戇婠ⵟȰࢧဨڰ㲇㱼䈰撢綄᫠娴穔ᣣ硦䔘烦值࿁⸭\u007a߀婞獸〣቉䔘沩ဢ䲀倥凤ঢ㹂剂㢀ሸ׈♭䁕Ԉ⫦ᅞߩ䘬͠⎤硦䌹〪の䤀占䥼ᭁᴵƐ෦ᢐ揨䪣ࣸℰ〢◣ᝡㅌ䂐Ṕі䜰屩䢇䶰਼恠ᇂ〲ㄐṖ恳Ò㛦Ĉء瑪䂘ܑ堾⭀ഠሹ嚌窥燣ݡ昻ƌȡ娤⊄ࠡࡈ噠㔥儕ݡശ憰䲳尻㉂᭣⡌ⓠ笭ၐཱྀ㠦偲ڣ⑞䉘㫡䥝眵อ䢡ԉ瘦偡屣⑕䈄㼇ࡃ矐ᡀ┆৵夦櫠Ӄ㈻ㅆઠቈ䏨猩Ⴒ䛡夡䂂ب䀫⓰ⲧغ䋤㚨䑬ઁĬ㇒Ს䀭⋽᱒桽Ͼݶ汁เ∿珠ᙣဪ⋸ᚣ傁䏠ᔣࠠ䘒᰻ǐ䡡㠽ɘᏁ炚䶌ئᢪ䏱昩ᢛᙠ恍䉔ࠣ偆Ȍ匬\u0078䵁株Ȑચᄪ䅠᥄ၒ∰㨨ࡴ塡䀡⇨ᅚ၎Ȱ㢢ቐʔእᑅԈ㐲⃻ፁ欶ቨ\u0065尥ˁ怨䃤࿘倿㤵ᄠ⁘䀲ౢᱥ䑠〧ⱨ⬁囱\u0042໓䐩䨃ѡ㒌⃝紭᳦ॱ幝怴Ⴀᑘ㉀⋄摄无㔮ャुᓪ䃺᳃Ԙ࿀খ塷Ϧᚫ䒘挍䐪Ⴝᄡ⟇惈ⱡ枏Հ⨎ち䪁咆䨔ᅰ‴碩≄搸Ѥ宫ʿ܅പ჻Ѫ獡ጬ⋂䑑䄲尣℅̡睩ᢼ惫س匈ࢡे檨ᝋ䂌墡簦ႁᔣŕ竚戥ႉĺ㫫䂀Ʌ㈪㶠ᆺ愻䮀㈦䗤݈ⓥ惨ಠ娾恤匡䥗唥澹慎Ȱ搮⡤亁࠿ż஠桖⎦㸥我͆挥₨ԡ㷳ᇐ༹㐱所ጥ㠨䇖Ω⑻㯭ⱑ\u006a၂ᄰ㈤ᜡ潤\u0044伧ⳕ➭憫㠐ᐕጬɀᔤ≳አ怫䑻㬁㜳㥐Σ䰶浤ຓҏېᯗ䢨䗠᣶熔ߓ㈭⁩圢㩯̨䐬ヹแ㨤ᆒ圡䙐悐㼄吢∈急¾ࢩ㈷᩠೻⋀㼁倥ܺ䐪䜲㭁⣛โణ氤⁤ᣡ偺⩘䜠債ྐ倸⠗Ꮱ㑞ɀࢧ湎ܤ刬穄㺠䰭䄋ء剋㐎Ꮑ\u0038䋰縭䡩䦰㰤⃂Ს吰㇐፛җѤᣰ儁ࢡ穏Ⴃწถⅰҫ㐢⑴搯岨䁨氬䧨ፂဴ⃴⍤硌☠㥈䂾ඡᠤᄜᣣ偖Ẅ㖥䡌⒔䂥朡盨ҳ熐׃皻ȃ㊠٧Ь㔨桐ͱ渪䇤ᬿⱍ寋曚矜䅗㎑㝶玎省溹眱➫⍀⍧ᠰ䔑ɡ\u0062ୁ堩樐໒ᣵǰࢤ⩹ 瘛ㄘਐ∥偤ଳ埱愔ㇲɎࠀ嬫㣸੡戸ゐ䂲ࡎኧẵႀπ烡惣Ԡ磪たȃᥐ姄瑄抩ਠ樤橳⥤Š愮₋ńᣠਯ婎፭᨜∤䱕´ᩡឫ㢑ǈᩩ渊獰㥄ޠ┡\u004aɨᖹ渪瀨ϟ䙁攫䑩\u0060Õ庫㡉玼ڠᒨ呲È御␢ၤŚᤠ⪬㠲䉯囡䈩砼⬼߁瘬ф䂠ά扇䙹ńࢱ刢ቯ䌬ءḣ怵ੀ᱑搧䚛窰壡ࠨ桖䅚ᣜҥṠ䆏଱ศ䀮ɔޠ怢㠺Ťᄠ礥傊㉕䙁ĩ灖䉀㢠亣⠱如ᛡ箠偽稃ඡ綮羛Ť໐ㄩၽðᢠ䤧䙧ㄦΠ⴯倲䆈ැⶡ摽寸ᯠ墨儝搐ᙣഢࡖ扈⣍⃬ₐ推ᜍ嘨ㅉ煤ᅱ⸪瀶战ୡ⸬\u006f䉀ರ⚬…䓰ᅣᠩ瀵ɔᄠ఩䁧̀ἠ㔦桤˵͢㴫䁖挈ᡑ㢪〰犄೵䠥⁁Ϗ崡⸭灚̸ੀ〤綋ǰ޵搢ࡁᆐᗠద簸ᄈ几愧ⱪ䆬ᦌ䜯悒àƠ嗥₉Ќ弡箢桸ঐँ䀦沉ʘ因ᰪ灐䃴ἡ㘠㤜Ơມ搥䌾̫ࢰ斣࠵Ƃܩ㘬䁢ㆲ᳁ḯ尿戄ව䯪䂔䣴ہ滄䡫ↀ㣡Ἥီỡ栣穻̠ੀᵨ䁇̰容央⠲慰ැ挦⑤ɴᎌ䰥\u0032䉊໭箫偯᪉ᱡ⪨⁻䁐彠噆ࡻ㡠↡戧灒ℯᝡ攧Ⱘ䎤㽔岧ᑩƐඡ䔬攝拒⪘吧灬䉘ᛡᩭ炒Ĳມ瘬も᧒僄຺‣䞦ᾡ渣Ʉ䍣䢱⌉䁘➊⭠亦潹Ôᭀᰥ䒂儠求栦ð΂琩䁞㉀ģ䀨䑈ɀᓠ嗇䢒˨Ȣⴭၜ䌈ᠡ㜬噪䐐ᝡ䲆☨䃚ᩡ䘩႞Ħᄡ穭႒䋿岅ね䡬δᇀ个ቡ᯸ᓠ挡ɤĲš痈⁴䮂䦪㚂㋀Ꮴ樭を䏸׀礧瀬夨ޣࠦ亀˨ᄠ⨫䂱䂠ᒠ䈧簨ðᄱ扥粨䉦α㨬ᡐ䃠୹㲢汥⎦׀㷥恄䅰ᜡ䘭ၕƲΠ䮃䣢ńມ㈦桖䏀ᔰ涡䴶拂啳⇦ᠱ˨᩠⨡\u0061Φຠ倮⁤⊩ᗔ儨グ䄖Ơ䆤⑭䒠ࡴ䰦桪䉔ᆹࢢ⠥ō䉫╈僈䄨ቡബ䀺穓Π┭Ṃ奤ᆹമൖ䂐ᙡࢨ晃䉂ᜠ洧″ቓۀⶅࢀǔՀ䒣′䎘ઘ癍ၛૼс␮婃䊨䩜䰭ą㬈డ੸桭ҧᱠᄦ汼Žၡᯅ㵄ˁ吀ஸ咝䅄፩渮ₒᩀဈ䆢瑥⌀ᒌ䤢࢛ˀࡐ䦤ၱ寜㭀ض怦ʭ勀䦭䡥⏘ඡ㢬⾕⃠ව撧⁒⊭儰㴠攰ΘΡⶡ㭇⌀ᅰ⨬⼵̀ᛠ嵾哗ᫀᢠ氡\u0071寊ጡ嘢剄䊭䘡ᔤ䠲䂩䆡ࢢ\u0028猰༔∹䢌⫀ 䠠倥̀ᗡ㨦沐Ρ凡☫䂑ÿड⸢楯爰ዀ䠧‸Ƭੀဢ傕篵ᔠ䷅罤嬬ᝠ尦ܼ㢴ᄺ疮䁄憠ᠹ庴䂛µ㜼叨灼⃦䗊䠫䁿嚑఺䠢\u0028䅠ᛰ䆧灆㚢㷡ᮈ䁖䐞ැ⢶勜㊐䪘磤恪昃ơ堩灧᮰ᴠ䈪炜¤஌撫䐮ǖԝ㏄㲁尀஍箥䒈㟐᱐‫偱㔔ᇡ㨭䁭桊ᄠ⴫⽀揶䰠洫ぇ≠ᰩ䌤␨䆍䍼‪瀺Èව䓼纟㋨Ἅࠨ灔牲ա惸䂝ē㳡᤬ᡆʰ័ㄨₐ慐Ἀ䧴瑍ȃ᳠亭်Ėᾐ㔢\u006cɊᔠ䈤伕䖬ీ௦⑄瞘ࡠ管挲䈄ඡ填偖Ƃ㘱ฤ伞˼ኹࠩ硩Ǘ߀㦵孽ɴঠ䈯䁬ô஍ᱴ掆⫨ᑻ኎ひ˘ୡᤥ嬦ʘό㜡\u0022⃖ေ席䁈ôѠ䞄ဤ懔Ṥⶢ䍍Ƕ༹䮋〰Đ៣ᨶ缋ᗡؠ涠ᛁ㒫ⱺድᚦɦ⬫☠ȃŚᗡᠣ急Ȥ༥嘥ࡕ̠݌嚌ᙕϘઘ䴌Јੀ句灆㨰ᚁ界ɓᤠ涭禋̈ą㈀傞̀၁ἢ挎㞀ᢀ琇䡼œ䡠娬䀿ѐậ㱸梌Ź㑛懻盃ᢤ⎸守⁼λ㽒Ҡ⑃懖ᢡ氊瀸Ѐᜠ榄㎘䅚ᱠ宋䑳痔ἠ尩䁍ĔᏡ瘨ࡍ婊ᾙ栯屻䂴༹渥䑜㟘ᐌᩎ䀶䃠Ს搯屧π͌䰦ᤱơ㩡咾灌硠ᇠ涯䁖ǖⰡ㘤႔Ȅἡ搩㳧䕰暫䔆泲ðᑆ䚥嬺àᠠ㍧ᕐϮ㇘䰩䡻ᖠἡ憧䘨זᚑḨ呞㙴憒ᣡ浜䁤ȡ刽ဩ剂Ỡ䰧ₗᮠ䈠㔭呖揙䗆ᄧ灅壙傠ா皐折᐀㒍Ⴭȸ䆒懶ࠨ畨淀ᳫ䐾䂩䏐疫䑻䅰ۀㄭ၍ńᓡ堨ㆀⅲ圀礩∮楰ୠ℥\u0044䁤ᄠ溩㴨䂤ᮈ㷆㼌̞⡐䜫停ㅰᅱ㜤杼ņ̍䌤䡯œ兰琢⠨䌬Ꮱ戫紁㣴᱐⸿䂉筸ᓡબみ曂⛀疭灤␂硑☠⒒Ψᄰ䤫紌䅯ৰ癤౷\u0032\u0036洭䂀攐ށ挲੻ʜँ傼ブ䉘睠䤯恿暜Ს䌤ర⢤ঽ喪ᦖ甪ઁ搣灖ĔΠ娦泜㟨尭䠩灟˘კ⌁縸̀઀఼䁜䌠䛁⠨᪒Θࡑ罚◦䎲緆紾ず΄ፁ罔▫ᥐড帨ࡼ䑨᫠匧䚄Џ⟀䆥࠰䈄ੁ㈡ቿ敐ରᰫ㠪⾸᠓ᠬ〼檽䐺۴㛱㗊篠猽灆\u0048၅昪嘔θ܀宏偸॥Ƞ儥宄ó䨚⨨䐩㤻㭀㶩⢟䅤༁䤄泴Ŧ䆤⤠桩ϸༀ⤩䁂⏸ἡ䂷ぼ≣㛠墯䁗拽ⰻ⠥恮ڜᓠ⨬\u007c᧶ऀ樦ᡄ䇖᨜亨核Ωᜀ≯䀱Ë⑬ᰢే拈濠䦧䙴ǔۀ愯偼ƤР愦ࡘ㬁俠尨䑐ɘᄰ䦹⢒\u0042┇擉㴰Ʋᔝ㢀墻琜έⓖ永䆬Р礤枟।ດ㩈僈ʰ᳡倬圸䆲ᯠ㴡੥֠ಀ⨪⁃䅪ే෪䝈㛨Ⴂ疬う̸ᩢ∫痢ůಈɍჽ歀໐听䗜䄭◀ŌₔГឫ⠣格犢✁ࠪ䁲Ɉᗚ吨僯䌸ᷡ嬇紅᎘ৰ礤䒖媄ޫ≮慹Ģա⺞珄⋄Ⴁ筫̿窻㭵堭㐥Ƭᕪ挨ࡷ垄ţ➁淊Аର௥ோ᳹涠ᚗ䡜䂴ᕓ䀧ⱥܴ亡䐭ၩ癈㿤㔮䂒畄ᅣ渮ၖΘ໩嶌坥ⅅ珠῭㛲đ摠氢桥ࠀᐊ䙮぀剗ડĨ炌Èഹࠤ緣㙊ᾑ帣⢄âⷀ䧿岓±ᗠ樯恕湘ᜠ਩灬ᔻీⴣࠣ嫀ᤥ෮⁌⊂糁㠠恲Ǆ摀㰮⁃䉴ઙ⸧洎厸ରਭきƈ°䠨梐恐ᅤ娦ᠾ䈄᳁渢ࡄ୆䟁☯岔慠ි⚘琨䊨ᅢ氭䁎ᳲ垫ᠪ搟姥煢⴬健⎸ڡ⦔䱉焑摸㌺例䬂ੀ綗䙹⌂ѹ㱵\u004e旾⿏砮ၑ䏲緡熛༦ࡠຠ䆤毤͸ա憫䑖䎄੾磤䌥ů②਼\u0064ᜱ罟煎Ӳ䶿Ш咇໽區ॐ盉㷰ـਥ却ㄡ灤㡇畯ౠ⾽が༸㻠磫⍯幋梱ᔡ愥©๯昣⍊ď㋁ᡑ\u002eˀी伛偊Èߓ㢄䱖掌戠亩⡼᧺䚠樯傊䛘၀⴨࠮灜᪁嗉碌ȤƎ䈤ీ㎸ൡ्ぢŤߣ撥偼␀ᇁ㢎౯䆲௱ሥÿ戃ᗠㄤᘃ̠ᒡራ၃䏎ఒ娠恦䌬ᄰ磭ᄝ后ေ䃉睙咨ᯠ扰港冈ᠠ഍䠦獚ō簳\u0026焔˔ᄮ⁴ǘҥ欱Őᬠ⏫㊓ƈ࿘∡搡ᐱ恗ಷ惫᱐⪨㠪ᄣ㤄䨜殴々⇑\u0066䁁Ǩੀ㼡ㄣ⁍䁄灗ઠ➡㵓Т୷ِؔᇀ挣砬ᠧ纸Ϙ༅Ⲙ泷ت㱎ǌۦ櫱熯й繁⎨ঌ৘Õ呲ඓƛ䉸䕠ဨ樮ု\u002d慭䆟ᐡ渤怡局惢ـ᪲刣ᐵ䐲⁢Ũᢠడ²戲ᐥ̰Ȁ᱐ᬻ柆ࡃₛグᒐᠡ❕唸\u0040⃃愠ڠ傃氼嬽ゕᥠ࿀၀亦➥慚戗όॐⲋ䐣甤\u0045˦Ґʕࠧ㠨ᒁⒶ┐ᅾ䜠吡怰䃝䃋䚅ጠЭफ䂒Ǆጀض◒ࠥ洢䁓挬гṑ⌒楨炏Ⴛ᝸䅠䜣牄স↡ɔذᜡ刲␳͉冇䈩彂㸻㇣灢Ი懘ϸС䀧䗱瀸\u003a⌬䪠爣䨦绀⫲妈䪠ፘ磤㠰䥀ɿ◰᱐簩忉孍悂₥䜝໨怣携℮ǄҐᠤԢ渦纥慷ـޅ㸠涥㠤ྀ∀䚨䈠ء忊灁\u0060磔恅㣥Р╤偣散嗐᮶㛡堦䁱㜘̬ɰᬡ⠢晴በ咂ʸ๴ࠣ琧ḽ櫴煐ؠ≀䒧ا堰惏┑ᙠⴢ〭ၞ\u005c̜ᵦኁ撆ࡠ徒䁚ᇀڠ䱧瀯㼯ㄜð౐㺡䈴怿粑\u0062ӌ堠䰣୪ล塲⭤ᶠ壝ἣ搨ࠢ₳ہᅰ氢⥇糎ူ\u0044ᒸዂㄡ琿區ℙ犀Π䐒␤Я㊍ľ⧚㜉㯁⏰䁳䇬䑠ᓂ氠纫㡙䂵Ɋ֗ᾠ匢䐯偧Ƭή偔夡囬ᡝ䂃ⅆो㞠皕宭䉚\u0064ᘠļ愨ᐭ㴪≤䁁愠ΐ嚩溧䁻Ƅܐᬼ㧙㾥㗄䂹Є⢠ᤀ味惦҂ưנр嶠䈈䐫⁧ɨȃ⹀搮㌼悒䇉ᗘᏠ廉☧⁞⇘ϸ਀በ၀Ӣ∽АҰؠ戢ȭြⰷݛ䵐ᚠ墥䙌཈䂋ƃ䏂ⓢ朶䙗䄝∁䱠㰰檴寢橈䅰נὬ᪣婨࠱ၳ揸࿆ᮀ涥 ဵŌ盌䅠ᚡᖁ棘๔Șဖ㌹䈤栳䠭䓘ՠؠ盘㩊篘〪ϊ☛ᾡ戦ᠿ‮䗄ʥ俠ᨢ愂ࡇ悺₍䩠⎠⤢㨻煜䄼ɘቮ汣ဥ粃⃤Ʊ᠌በ縥尨灎⦃攟䯈Ῠ㩏炯\u0072ቡᢠქ㈤㠯ႏƔĈ䢂䂡怅Ṁঁ楤ՠʠ䦧∸¢⇼̀\u006a晦嬫㡍悍䏘฀᥀ᴲ〬唻䵝惄⩁㒲␥ ࡅ̩ᮐའ䒳嘬䓬\u0042ȕग़〣䷅怿䁜Éᠶᐠ尧䜸䂿圣䔦帳ạ梡惦ʜ╜᭠ᮬ‷⡋ቘƾς㒲瀩䀷¡Ʊᶠ≱㱃\u0037࠮䒺⑴ཀ体㈩筅ڮ\u0061ძ㗔㒫砭碾䈔Թ䘦ᕇ䄉ၑ१ɟ䡴晰๠䐣农䒝≬શຨ竃੼⦨ǉᥤ甲ᴰࢱ側ë䑴ς礲㲸硻〤䈘଄䅲礧栫磒灺狸几ᚠ∧ᄻ\u002d悠৽ᬍᠥ戡岄䏖䬄ʺ椘ᠬ〣㠼寝溠〠筮戥硪䵐Ưݤ䮺ᄨ桞\u002d捉栀「℧ᶳ悋Ñƒᝠ栺瀢ၞ䳄Ś್ኁ䘖总ႜƄуᱠ䄢倪ぃ⃗ǐ࿘℠෦砡䂞煭お㉠䤠䀯䀳偬͸\u0068Ѡ䒥愱Ⅹሠ䇄㾠㼣ါ䑆\u003d஘ɰۂਡኯၐ沸ƪ嬠ㆢ罅̲ツȨØᑡᔣ搸\u0037֛✽\u0071᪢㒥‭ㇷ䕠ŀⰰ娦怷⁻ô\u0044΂⒣Ⱛ䐹ᣥ狮䏌廒嬦砲娺䇐ĨԐṰᠫ㠻ಸ䇄䶠ᜠ澪早䵇⇪ࠞᇑ曤㲍䀱ၕ䇐ࠀ᭡Ḣ䀬ၬ\u002bᏣȠ笣\u002c \u0020\u0033氧簫䉗婘Ӗ⭹漧䗬ぶ妵曃乤戣\u002b垸惤ɀ୺⬥悀䀤\u004bಶ戬Ƞ欣氡周䂃ɠ๼剠瀧堼ᠸ䆨ـፀ塄栭✴\u0030ηᒗㄠ瀠⑗崞玀䪠ᗘ犱宿槚ᓷ⭍作劀吤搸䁄愷䱠ᾐ昇⣡\u004b㦰ˏᙐ஁瘣఼㳩猰ؠᗨ\u0022桤柰ἀ洪\u002b惾䝩粦ĠȀ洠\u0020\u0020";
  var utf8String = blm5tug.decompressFromUTF16(compressedString);
  var stringArray = utf8String.split("\u007c");
  __p_QVKz_SC = function (index) {
    return stringArray[index];
  };
})();
function __p_Qk7l_MAIN_STR_decode(str) {
  var table = "\u0055\u007b\u004d\u006d\u0042\u006a\u0051\u0053\u0041\u0073\u004f\u005a\u0043\u0078\u0044\u0039\u003a\u007a\u003e\u003f\u005e\u004e\u0052\u0059\u0070\u0063\u0028\u0057\u0045\u0064\u0065\u003c\u0074\u0047\u0069\u007e\u0040\u0026\u002a\u007d\u0021\u0033\u0058\u0075\u0030\u0054\u0035\u0060\u0022\u006c\u0038\u003b\u005f\u006b\u0048\u0031\u0046\u0066\u0076\u0067\u0023\u0037\u0061\u0049\u0071\u002c\u0056\u006e\u0029\u0034\u007c\u0062\u005b\u0032\u002f\u004c\u0072\u0025\u004a\u004b\u0077\u002b\u006f\u003d\u0050\u0024\u0036\u002e\u0079\u0068\u005d";
  var raw = "" + (str || "");
  var len = raw.length;
  var ret = [];
  var b = 0x0;
  var n = 0x0;
  var v = -0x1;
  for (var i = 0x0; i < len; i++) {
    var p = table.indexOf(raw[i]);
    if (p === -0x1) continue;
    if (v < 0x0) {
      v = p;
    } else {
      v += p * 0x5b;
      b |= v << n;
      n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
      do {
        ret.push(b & 0xff);
        b >>= 0x8;
        n -= 0x8;
      } while (n > 0x7);
      v = -0x1;
    }
  }
  if (v > -0x1) {
    ret.push((b | v << n) & 0xff);
  }
  return __p_FOXm_bufferToString(ret);
}
function __p_Qk7l_MAIN_STR(index) {
  if (typeof __p_uEa2_cache[index] === "undefined") {
    return __p_uEa2_cache[index] = __p_Qk7l_MAIN_STR_decode(__p_nukQ_array[index]);
  }
  return __p_uEa2_cache[index];
}
var __p_uEa2_cache = {};
var __p_nukQ_array = ["\u0065\u0043\u005a\u0064\u0035\u007c\u0076\u0077\u006c\u0049\u0022\u0072\u0062\u006d\u0059\u0064\u0077\u0067\u004f\u003b\u003e\u0040\u0071\u0035\u0047\u0043\u003c\u0069\u0053\u0038\u0034\u003c\u003f\u007b", "_!YE\"lRMr,@\"hB[>^YhQ7;JQS", "\u006f\u007c\u004c\u0041\u006c\u006c\u0054\u0024\u0044\u003e\u0073\u0048\u007b\u0023\u002a\u0070\u0066\u0062\u0058\u0057\u0030\u004c\u0054\u0066\u0023\u0041\u0072\u005a\u006e\u007c\u0079\u0052\u0041\u0035\u006a\u004f\u007b\u0040\u004a\u0070\u0057\u0067\u0072\u002f\u003b\u007c\u006a\u003f\u004c\u0054\u0033\u0065\u0039\u0066\u0055", "Kc_Om/6!y,_pWMfX", "5<!Q$42fpxPts[/*Ig}lF51x(z]%A[K}%U", "6zx/a#u?7F4t{\"N3,)^OBkd`wfEr7&\"i{tUH;og{", "MfSQ)i$zcaaBo4U>mH6<n1>5qI)FHcm<Mtbr3wKdakpr!:Spz!#kW", "1,,t_P!_IA\"Sno9(&&xO?", "v,D_=+%dV9BY:b13KE:e\"lIIw>;", "BbkS4[(_vzSK#B*<\"<dO&FdLdNmJ(Dn@4Ebr+*vezVSK{", "_,#<eHqQSOsHy~;WOuaE?f[QLD}", "\u003e\u0062\u0038\u0041\u0035\u0029\u0030\u005f\u0071\u003e\u0026\u0034\u0042\u006d\u003b\u0045\u0054\u0026\u0046\u0051\u007c\u0040\u004b\u0024\u0058\u0044\u0032\u007e\u0045\u0057\u0049\u007a\u006f\u0067\u0067\u0074\u0069\u0024\u007c\u0070\u0029\u0066\u0031", "\u0043\u0042\u0047\u0048\u002f\u0022\u003f\u0033\u0063\u005e\u0029\u0046\u0037\u0070\u005d\u0033\u007c\u003c\u0063\u0048\u0046\u0076\u003c\u003f\u0064\u0067\u005f\u0072\u0025\u002b\u002f\u002a\u0068\u0046\u007c\u006c\u0063", "\u0068\u0022\u0062\u0051\u0053\u0034\u0055\u003e\u0062\u0078\u0050\u007c\u0049\u0057\u0030\u0028\u0028\u0035\u0066\u003b\u005b\u0072\u0025\u0053\u0058\u005e\u0045\u005b\u0050\u006d\u004e\u0021\u0068\u0046\u0045\u0031\u0072\u0072\u0046\u0029\u0046\u005e\u0079\u0025\u0078\u0026\u002b\u0021\u0063\u002f\u0071\u0051\u0031\u006b\u002b\u007b", "T!y2o8U", "8!_k1}a5+C2Fq=VebH=/_;?45>fDID#Y(HvAGJe@m", "9(.B^J(M", "/ghAkFI4q>ULs#Ie,\"UW)a!5<NzL=~$W)s!2jKrp5>zp]4H3hzTS", "\x50\x45\x63\x4a\x39\x66\x62\x53\x23\x6b\x2a\x4b\x35\x26\x36\x33\x2a\x64\x78\x4f\x5f\x35\x42\x40\x7d\x71\x24\x7c\x4a\x6c\x50\x57\x2b\x63\x73\x48\x6c\x6c\x7e\x4c\x6b\x78\x24\x2f\x3b\x57\x48\x33\x42\x2f\x31\x45\x6c\x29\x34\x7b", "l^]Av;Nxq#(v>jhih,E14/6pBxEW%B", "P\"a1}H2SeI7IG:x", "}u/;z+T`JFj7B}Yi~HC/}l~~89Qo(l&p_TLk&&+K:>", "\x68\x3b\x59\x6c\x78\x38\x79\x5f\x7b\x43\x58\x31\x51\x6a\x57\x40\x2a\x66\x53\x72\x34\x6b\x72\x69\x5f\x3f\x6e\x63\x24\x77\x4e\x7e\x46\x48\x4a\x6c\x25\x2f\x5b\x43\x30\x6b\x52\x2c\x7c\x63\x25\x57\x7a\x28\x7d\x73\x4e\x5f\x55", "Y/m%Q@7YAzq2LmVYJ,FQ", "_mgdu2.3qfMxel{@BI%B", "\x31\x62\x21\x3b\x56\x69\x49\x64\x5b\x76\x73\x48\x4b\x2a\x38\x21\x49\x67\x26\x72\x26\x32\x5f\x71\x7c\x71\x60\x34\x5a\x39\x75\x3f\x25\x46\x48\x6c\x22\x29\x47\x3f\x22\x66\x69\x61\x69\x26\x6b\x7e\x57\x75\x74\x6c\x26\x7e\x57\x7e\x6b\x78", "G#IEuF@_tfx&*cUY;,xr!FPp<VC[}`\"WU5<Qq#)>>Cy#2p$!J<M", "\x40\x64\x7c\x31\x42\x2f\x44\x41\x76\x2c\x3a\x70\x65\x26\x4c\x3f\x36\x69\x7b\x57\x36\x24\x55", "\x61\x5e\x6d\x5b\x7c\x4b\x36\x43\x48\x71\x54\x44\x54\x5b\x50\x21\x68\x22\x31\x5f\x57\x60\x7a\x60\x72\x41\x5d\x41\x7b", "MI1_~HlSp,Rv!`{@a&/t;;${", "\u0065\u0059\u0079\u006c\u0075\u007c\u002a\u0040\u0053", "RC1l+aRMSO[5WDfdBIcH.fL3Fz/kB}h:aYb_,[W~9N9zCm", "5atW91H_nCXzW*:!LiWdH&%{", "Jz,H647~Tgsem(u(<QH1S/I{P?ei4@cEn&M", "\x71\x61\x26\x3c\x40\x60\x71\x43\x79\x7a\x5b\x7c\x46\x6d\x6e\x65\x68\x7a\x54\x4f\x23\x7d\x62\x49\x3d\x66\x7c\x25\x74\x6d\x61\x70\x6e\x54\x48\x3c\x37\x25\x7a\x2b\x72\x44\x35\x4f\x61\x34\x45\x59\x7e\x39\x3a\x51", "L)fAE`8eR?Zmr9$WI!Fs#vxk`IC[#B)<", "&Y)dd2U", "7g$b*oD@zC1DK(+WM~pss@pqGsRKx7V>?dJr`l@>h,>LWbG@#DxS", "\u004f\u006c\u002a\u0042\u0076\u0050\u0030\u0065\u002b\u0048\u0060\u0045\u0055\u007d\u0071\u0059\u0033\u005e\u005b\u0048\u003d\u004a\u0052\u0040\u0030\u004e\u002b\u007c\u0050\u0062\u0035\u0021\u0023\u003c\u0022\u0051\u0042\u004b\u0076\u003e\u0063\u0044", ".z3;/+#p}qpO`MGpH!a_wb]5ag&", "\x2c\x69\x50\x6a\x37\x5b\x45\x4d\x79\x7a\x42\x73\x5f\x67\x46\x45\x26\x6d\x24\x3c\x4c\x2f\x47\x33\x62\x78\x68\x6e\x6d\x3d\x66\x59\x61\x32\x6a\x4f\x6e\x2b\x7c\x70\x35\x39\x3c\x5e\x78\x3a\x3b\x57\x6f\x55", "A>mtxf=~g,t", "9&aS}24IZz&r{[N!aYP(PgMvKAJkYD(Xe#,A", ")TDroGeM7a4wAPs<&m3W;;!M590N:={&", "\x45\x26\x51\x72\x68\x24\x3b\x78\x6c\x66\x2b\x46\x7c\x78\x53", "\u0060\u0061\u0074\u003b\u0036\u0066\u006f\u0036\u0071\u0043\u0075\u0034\u0024\u0077\u0050\u0069\u006e\u0022\u0040\u0064\u007d\u0032\u0047\u007e\u007e\u0071\u004a\u007c\u0071\u006d\u006e\u0070\u0052\u0043\u007b\u004c\u0060\u007c\u0029\u0035\u0070\u002c\u0076\u0077\u003f\u006d\u0065\u0064", "0baS3wy!<9h{@gq@f^pHL/K{", "KEc;m1av&x3rN&W3_HqsI#93#zCO4#xW:CFs>=tpn#vV3:=i$QUe6b%xB", "\x76\x67\x26\x31\x4a\x54\x55\x65\x5e\x78\x34\x7c\x53\x39\x56\x7a\x75\x28\x7b\x65\x47\x60\x46\x77\x78\x67\x79\x74\x40\x57\x28\x45\x4a\x51\x3d\x41\x42\x4b\x38\x35\x73\x76\x48\x49\x21\x57\x72\x2a\x37\x45\x6e\x74\x3f", "0,]t{#u`=sBLF[C?a!.EMa`~Fx9o+#H!OftQp`g~8I8F3:W~w<nA($+4PHIS{", "t#st._JC+>+#j:r(^YRB", "EHwQyrM>0DUsej0(R!m", "+<?[,\"j4iCE", "\u003c\u0043\u0073\u0057\u002e\u005f\u006d\u0063\u007e\u0073\u006c\u0034\u0076\u0078\u007e\u007a\u0024\u007d\u005f\u004f\u0079\u0038\u0053\u0053\u003d\u003f\u006a\u004d\u0062\u007c\u007b\u0026\u0077\u002c\u0052\u0045\u0039\u003d\u0056\u003e\u0069\u0023\u004a\u0040\u0068\u0040\u0033\u003c\u003e\u007b", "a)7E=aZLMC%>FWF3VU", "*YN<,[!_u^h%bm4e*)Mtp!h$VH,k^mC}<)/t>aDM", "vb9Qa%2{ICG4cl9}3\"{", "\u0057\u005e\u0044\u0072\u0075\u0037\u0041\u007c\u004c\u007a\u0043\u004f\u005d\u0063\u0041\u003f\u0053\u0062\u0062\u005f\u0024\u0034\u0074\u0070\u0077\u0049\u0065\u003c\u0054\u003a\u006e\u0063\u0047\u0026\u0048\u0031\u0069\u0032\u0055", "\x52\x35\x47\x51\x33\x7e\x4c\x78\x7c\x78\x44\x61\x6c\x3a\x36\x52\x79\x54\x3b\x25\x7e\x48\x2b\x3b\x6e\x23\x43\x76\x4e\x23\x72\x3f\x39\x35\x78\x31\x3e", "\x55\x64\x6b\x2f\x3c\x48\x50\x69\x67\x46\x53\x51\x31\x7c\x21\x3c\x6f\x22\x4d\x3b\x6d\x31\x78\x3f\x45\x7a\x3d\x38\x6b\x5b\x65\x40\x35\x61\x7e\x64\x73\x23\x4b\x34\x6d\x66\x24\x6e\x7b\x22\x5f\x45\x6a\x59\x44\x3c\x2a\x60\x6b\x64\x4b\x41", "vT:JG2}4KIiWZMMzg(m", "\x22\x69\x5e\x25\x25\x54\x5e\x41\x4d\x73\x68\x3f\x40\x60\x41\x3c\x62\x54\x40\x31\x6f\x4a\x68\x33\x4f\x2c\x5f\x53\x43\x6d\x7c\x3c\x25\x3b\x4f\x25\x32\x40\x34\x3b\x6d", "\x4a\x54\x36\x45\x30\x48\x6f\x21\x77\x49\x36\x6e\x76\x2a\x59\x69\x3e\x3b\x3c\x6c\x32\x4b\x3c\x60\x28\x44\x49\x7c\x7b\x6a\x59\x45\x40\x66\x25\x45\x7d\x24\x61\x4d", "m>4bk}={/,#SMc@e/ZTS", "B(V;m6x`0koFk:8W7<*_!`&`jxuV{", ":#m[($f`O^:L98=i,):e\")~x7A:Y;oiefsgkG2d4~skB=*#~h;Mt$8?3Ax", "]im%85v67Z1wODazp#y2nkECJZ\"4{@.dYdC/hJhzQ1__B=h:@m^O", "\u0033\u0075\u007c\u005f\u0068\u0062\u0064\u0053\u0059\u0076\u0029\u006b\u0072\u0067\u0043\u0028\u0077\u003c\u006d", "aH[2\"Pew]anc\"W_WX^O[kP2SVI.9wWvEt/itl)U", "B/<so47Y@fZ\"7#1~t)H1O/x?jOL/tB", "\u003a\u003e\u0036\u0053\u002e\u0062\u0071\u003e\u0068\u0061\u0051\u0029\u007c\u0078\u0077\u007d\u002a\u0022\u004c\u0025\u0062\u002f\u0051\u0076\u005b\u0078\u002e\u0049\u0056\u0034\u003f\u0033", "\u0050\u0063\u0078\u0031\u004b\u0034\u005b\u003e\u0036\u0078\u007c\u0023\u002e\u004d", "=2O[#[kd{#.Cp=%?2m*<Q#>AB", "na%B68)vw9^41o#@d)Wd4@X5@fVI.(Oc:#nd6_U", "PX[H\"lpA#kjx7\"x", "K;[s~JDM", "9>oL&2CM", "6iPkn[^M", "4uv/YfR09pfVMVK[1$8Muy@S}", "\u0079\u0055\u007c\u0062\u0021\u0054\u004d\u0034\u007d\u0048\u004f\u0056\u0078\u0044\u002f\u0077\u0069\u0044\u006f\u002b\u003f\u002e\u0038\u0055\u005d", "lMO+d~{<\"{~Bm.aGvmF5bya`u", "rjfjL", "eO=Aq$z", "dGH2*.z", "]GOMxZ]`", "\x6b\x7c\x54\x4c\x25", "v6i<#I$3a)IyMy8", "LaClW2HmvxhwNy8", "lYvKx*Z`DZqpr%~", "0:p%AN!},02T4", "d:b<Le0>", "9ai9b", "P:fxk%.>", "{#=HL%o>", "lBNiH&C>", "9.3H~5c>", "v/%_tl67", "SAIA!", "1avWv", ",/fLGld>", "60u<", "A\"fx\"_C>", "NC;__Xt>", "EVtlL%.>", "};K_N+2", "\x40\x2a\x31\x7c\x36\x5b\x32", "R*;B#8Ru", "O!F$h", "fwAa\"ZXq", "^*]z3KVq", "b*tQ", "{19T1;gq", "=gG;;Z8q", "RpfCi", "h9xefuDq", "*b=~E72q", "%N!z}xgq", "?9;AEb5M", "#)Cl;~gz", "$#O5(I1loH7j3=&ufg96lJ/", "0w!jByFz", "#)Cl6:Yz", "\x4b\x37\x6a\x6c\x7c", "]dt]]oB3Aqsy3brfy8jgXR", "cj;t_,Jz", "eY^QGi6z", "9j~nAXS#CaJc%@WTQ/", "zI9)Hy(z", "Hw?T0:6z", "#hHIw=L_j9=QV@a", "%)kgvuAz", "g\"E(F$Yz", "ax6vHy1", "#hHIw=:l`91QZ,_D}s}", "Wki)IhOz", "x3;t_,Jz", "x3?nAXS#CaJc%@WTQ/", "D0`_k2(E", "=eK6\"~RG", "]h[cL6eG", "PR:c`cvG", "q&nCW", ";SPb\",OH", "}=MD", "Au2,u[87HfZ4FZ+C#[~C", "YfWC1nc%yz@xU$y91&pB}hH", "cCW{/4HbOW@7hOi972UJ{ehm)dI*eD", "ANDmeCp?fb0FHBV9L,+>S,c", "~_dN5q{0`P", "K:kG5q&t", "1Un`", "4PZ6U+/>", ":HigJ+>", "8@Zb\"?a$", "kw~1", "=01h{vs", "\u002c\u007a\u007c\u0047\u0066", "7kJdqIB%", "?Xk`", "NA1gw@xr~)+2vPjy6eZQghD", "t%GAm5BrUZ#pT7`<{X.m", "\u005a\u004d\u002a\u005d\u007c\u005b\u005a\u0074", ">;*]t}vt", "jS:kk(.t", "/f1Sr8O", "=xQy0%L**m", "FX*u:", "VVSrk(Bt", "Egpk", ">Es_R)w", "\u003f\u004d\u006d\u007c\u0055\u0042\u0072\u005d\u0034\u002b\u0050\u0023\u005f\u0072\u002e\u0031\u005e\u0076\u0055", "\u0072\u0051\u0071\u0066\u0073\u0045\u007c\u0042", ";;6U&l.5", "TD4&", "ac\"_hKG", "Y*}[$%iv/x[Da@(K:;*>NxB", "RBszG3o", "fqS@i>D(h/@eRj`3:;qu./E", "P7*z)RP5", "\u003b\u007c\u0026\u0056\u0049\u004f\u0076\u0035", "Rd[@byJ1D+DIApv", "}P_mrVNgj>j?w0b!bm))EtU#<cC$:/77tYsePu%SO", "ts[Cg$#N>fh.oV", "3Xq^f{L<Lj5:fQ", "ONmMbo+<j0z%@C", ">OFV&m5NG]r~.C", "BO&m;Q4tj>j?w0hFasPQ", "}@+[t$L", "67$VV&,5", "8SIB", "U}x+oBERjf{X~Ih6`#7vrmF", "\x7d\x79\x3e\x2b\x7e\x23\x67\x3f\x6a\x66\x53\x21\x7c\x49\x42\x79\x74\x6c\x4a\x76\x30\x76\x46", "Qp`>B)w[E*o", "z@u9f", "4>A?@6C", "`/?5ubKx3S5GO!F]~;/$mST", "2./NSP2}", "P#ENkts", "YyMt4oxE", "+yB6M!CE", ";CG@9$!E", "WxNt`?F", "\x6e\x7c\x5e\x74\x65\x75\x3d\x5a", "SKBV", "Zzu6", "p{/UHn,KhieB9/m", "Z]8U>;5HziJrkSm", "L8`4w;Uhl$/WV7h", "UZMU[6wwY&&.2Om", ":YoV", "Aoc6/peS", "8[f@9", "Y9^%J+(M", ">T+w", "nnk^w3k<", "9{yh", "nnk^t", "%Kmk_QZ<", "7{90/f%<", "k7#w769<", "q9lw[Mx<", ");_%uwU", "+B{}0!m/!mb(,9zq+4V@^WC", "c5dyhkU+&", "O].l!LS", "K;Pkd", "aG:T", "Ln1UQ", "I@=A", "m(T~;Ll2", "U(t!TCK2", "(K#gJQ>2", "3C#LIQD1", "J(iwV[V2", "9&]in}7", "99T~lLp1", "plPLI", "39b!rQe2", "J(ExVYU2", "i3U{8", ">9ntxr^M", "~agk!(ud", "yyl*5.nd", "ls4lOv&d", "*a%93M3d", "[io%epG", "${!)v,uc>H5;2q", "${!)GYCdQH;Qd", "\u007c\u0051\u004c\u0046\u002e\u0059\u0069\u006c\u003b\u0051\u0048\u0031\u0057\u0055\u0067\u0065\u0062\u0022\u006a\u0064", "tT~$#0sD)HQ>d", "\x23\x61\x21\x22\x53\x7c\x37\x64", "ls4l&M3d", "\u005b\u0069\u0031\u002e\u0059\u007c\u0062\u0064", "n]fqQTF]fqSIXq", "wih.u.%KZg~0Z^", "QZ>\"g0>@YK*R(q", "\x77\x4a\x37\x2e\x37\x7c\x4b\x3a\x70\x72\x38\x62\x22\x79", "VD7.`cPXKrN+Rq", "jvo%hQ8n5^", "&s5\"K;Fd", "`Z,TB6dwP~deBxH+]q", ",Jn*Bpwd", "t3_wb6gG", "sZz9Bp3d", "<wi2aH^,", "/AM8^H&,", "~XZ2~/BM", "j)nEL!K,", "\u0079\u0030\u0079\u003a\u007c\u0072\u006c\u0077", "R)oz{&V,", "\x7c\x38\x4b\x2f\x47\x5d\x7d\x77", "}K!2`", "{?Qx", "5Q*zA\"s,", "Sbvx", "\u0046\u0050\u0078\u005a\u0033\u007c\u0055\u0071", ":moG&ERq", "53^KRE)q", "8[]G856^", "lW2,*Xaq", ">g>hbe=m", "kW}\"f)cq", "bKa5wt.m", ".aXGZ", "fPnJ", "\u0030\u006e\u0044\u0022\u0033\u007c\u006a\u0071", "?U+J", "9lP\"i.%KZg~0Z^", "QZ>\"g0>@+Uh4Z^", "$~*EJy1=sx%Wu!", "\u0036\u002a\u0033\u002b\u004f\u007c\u0022\u002f", "T41DWI0/", "uO<%0Ig/", "MSQDMuI<", "_.xux5e/", "%yS_1:6/", "w\"H(E?l/", "KX_%", ">*.9", "\u004e\u002e\u006c\u0028\u004f\u007c\u005f\u002f", "k\"q9", "sZz9Bp:pgw2Uq", "Ml5\"X~==Kr.rG", "*iRll6:p[K~Oq", "D\"fwR;EX&gt1q", "Lf^Yjb{ZIvCdI", "h:rY`i@@jsY", "S^G2ceB/v", "IF$es.RQf", "dPKY?R@CE", "iv.x.2lof", ",BG2cezq", "Biuh:dCdST", ")^aw[dR8ZC", ".e,gL.udST", "AE1o?]eP", "/z/9t^[b", "\u0052\u0045\u007c\u0067\u0061\u004f\u0066\u0050", "tpe)@4.b", ".e]Fh", "aiMT", "`M8g:dGP", "XQyT", "sZz9Bp:pgw2UD&8", ".BGDbh)A/XU4\"Qy", "\u0077\u004a\u0037\u002e\u0037\u007c\u004b\u003a\u0070\u0072\u0038\u0062\u0022\u0079\u0053", "1$8b?B}1ohX(fU]", "WOiP](5ad)f)\"6", "\u0078\u0038\u007c\u0046\u007e\u0054\u002a\u003d", "Tq5ZhLb/", "\x7c\x3b\x35\x5a\x66\x60\x3c\x3d", "lC9THUg/", "L[{]HgO6", "]])8s", "R_kx4L$6", "./)G}9O6", "T4=@O9U6", "#0~G#T*=", "Ww\"FaJH6", "V<VP:qh/", "8wjb5US6", ":@HTf`(/", "(HJGx", "5_v{", "@g}Q&7Xf", "Cdt.", "\x78\x38\x7c\x46\x7e\x54\x75\x68\x5f\x2a\x55\x50\x5f\x7b", "l_gF*PgoB#9i_{", "eD_?CF)!cH@}T]", "R_kx4L.L*2[#a]", ")802^^}1Z#_Ox{", "Z_be&T%(?%6m%6", "\u0079\u0047\u0023\u0062\u007e\u0054\u0056\u006e\u0058\u0051\u007c\u0045\u0031\u005d", "^v7b4L26", "E$d{", "{a%9hQ8n5^", "HT}Eg}^yZL2@HY2Mtq", "<3:\"We%q", "_fgZ", "p9qsn5#M", "3!#%tb5M", "z!~to+U", "OBmttbU", "E+tRo", "xPD[iPvRNxr^M3!;b0:4puu", "GqWoU.H", "~kIATb>", "RcD78", "7T!]A.rFCZ!w)z<lznzz?9u", "F;9ds9,53@`3D&h;iPnVcvu", "pkv&!#`", "R_.Aon?/", "=a%X[RBt", "f,2ef", "\x47\x7c\x37\x50\x5d\x69\x44\x39", "\x62\x7c\x37\x50\x5d\x69\x44\x39", "\x62\x7c\x37\x50\x5d\x69\x26\x39", "cAV}&}`t", "dop,q<\"ce", ")#)io6OWG$^$P", "cT]M03Fw<P", "\x62\x7c\x37\x50\x5d\x69\x62\x7c\x37\x50", "~J_GhC9?V[`aZrYoD9", "!&N!qSMt", "!,!y?Qht", ":$IY^", "pmV}~?o9Xta@9", "\u0062\u007c\u0037\u0050\u005d\u0069\u0062\u007c\u0037\u0050\u005d\u0069", "\x62\x7c\x79\x3a\x79\x35\x54\x43\x44\x31\x53\x76\x3f\x61\x3f\x46\x26\x6e\x30\x66\x78\x6f\x44\x39", "Yp`6W", "pmV}~?o9", "\x62\x7c\x37\x50\x49\x33\x36\x3b\x60\x6f\x48\x67\x50", "6M91~{[8&s", "aH\"eHyot", "%o1yy#&t", "\u0062\u007c\u0037\u0050\u0049\u0033\u0059\u0042\u004c\u0024\u0058\u0057\u0050", "{2MhSv{&&s", "!,!y?QMt", "??{SIuGt", "H,[r/3^t", "=a)Y!KUt", "IOQ}G#Vt", "cL1yg#9", "`,&}cQ`t", "R5.qf2Pp", "\u0063\u007c\u0068\u004b\u0063", ")h1s\"p)f", "oU8nLj})_/@w,", "j2`J*WSttslyg;ULWz`AKV!6b", ")@vL[Nl>,?R(J@q30*`/5W2vyxXX=d", "k8>_JXo&?NI(e6OL&4jq=ff", "!&Hy]Kct", "Q\"V}?39", "E,2Dqyot", "`,_L2B&t", "C0&}DKBt", "g0kD%#9", "ZdODDK9", "f?@!E#9", "ROo}9Iot", "%o+e[TUt", "xp8Dw#ot", "ZBmy^Kct", "u\"]D]", "=a0F?3Bt", "ML{Z", "=aQfdwot", "[Ayf(uvt", "\"aqZ", "0c_`?x0/", "8tZGH(J", "x+3`gy>", "$P2dGh>g3I0e7!Uyf5hp6Cu", "C.XQe~3u", "P2BW<vt*1`1eMr3", "\x64\x43\x4f\x34\x22\x3e\x6d\x7d\x33\x38\x33\x7c\x68\x54\x36\x7e\x36\x34\x65\x65\x28\x52\x7d\x4e\x42\x3c\x53\x49\x75\x47\x22\x26\x72\x6f\x61\x7a\x32\x69\x60\x2e\x4f\x68\x4a\x7b\x36\x6c\x7a", "MAB:\"1p)KT<Q2W[!xM%%", "\u0068\u0046\u003f\u006e\u0021\u0052\u005b\u0041\u007c\u0071\u0054\u0074\u0063\u006c\u0024\u0059\u0078\u007b\u0061\u003e", "\x61\x33\x2a\x40\x60\x5d\x67\x79\x4f\x32\x7e\x6b\x69\x5f\x45\x51\x79\x38\x4d\x34\x63\x52\x6a\x60\x76\x7c\x23\x65\x75", "dVXDRku", "8:VE?mfWjhZ*Aw\"$u,m6qzL", "ZX>kH9ZP", "91jkW$f", "H~lc}+wA", "7~XulJ#A", "y~5c,+iA", "&Q#]@!7A", "=EVc^\"3W", "G2Xj", "@{svCK6", "S8}v7+4A", "+DU]I16", "[#Z+BK@A", "%FvBPoHA", "!g?]z\"6", "7<$k$SHA", "=EI+B", "%F]80;xA", "1qABZSnA", "7<VOxSnA", "WjS[i2wA", ">pZ+)OJA", "B#XufIEA", "Tzrv", ",zrvUKJA", "iG3v`\"EA", "J81qq", "8zk]z\"6", "qd&8;;uW", "V@nB1SuW", "fGw[df<W", "~uAs", "GjGC{!Ol)e{k1qH^", "IPp77(mg", "xsp7K", "/cj76^!g", "Y;@P", ";5Zh", "M#@y0NHY", "\u0042\u0023\u0025\u0035\u0040\u007c\u003e\u0059", "ZRO_QqUY", "zR)ysT7Y", "e{1kz;P", "UI0kBN:Y", "T7X_z", "~u;AZ/*M", "euot3wiM", "vPQh@NJ", ",9qh(^!/", "Zsd[j", "Yf584HbJ", "XqbY/o>J", "SMd?P", "7/sCFybJ", "7/sC", "[MR.*yx", "1\"avPe>J", "*M2v.e%J", "VM].{ox", "sP0~.QK@b4RH{Q!+o%>,9A{", "dCe<:=^M", "uf^d9+8M", "T!PkE", "6XE/RJ*M", "\x3c\x39\x71\x73\x7c\x6b\x21\x4d", "dC=Ac", "3uNO", "\u0033\u0075\u0065\u0031\u0066\u007c\u0053\u007b", "\x33\x75\x65\x31\x66\x7c\x73\x7b", "\x33\x75\x65\x31\x66\x7c\x5a\x7b", "BBe<Rb\"M", "SBH<c", "E#xO(", "QuE%?", "ADx^w", "IvBOo:?W", "=C`~L\"Ap", "\u0039\u0021\u0058\u007c\u0068\u0025\u0063\u0067", "\u0039\u0021\u0058\u007c\u0068\u0025\u0023\u0067", "\x39\x21\x58\x7c\x68\x25\x77\x67", "pDeg", "CC`A&ePW", "DD^7R:mW", "6CwxE", "K;[s~J(eMI)l{", ".m\"seb23Lz`F{", "%&\"s$2a<s6a\"Ht3FCP:}ht%@Qp[", "~u;Ac", "yknt%+z?eA", "K;[s~JP6}z", "s\"3#_gmaT7", "\u0068\u004c\u0059\u0026\u0025\u0029\u007c\u0076", "q>Y&<%B", "r_l(6<yx9`qmI", "\u0052\u0079\u0044\u003b\u0071\u003d\u0060\u0069\u0031\u007c\u0054\u0034\u0035\u0041\u0070\u0050\u0050\u0042", "D<$&Y2Nv", "bgD1{", "[;5ltgUpnjsHI", "iRmir1/H~7/zI", "\u004c\u007c\u0069\u002c\u0058\u006f\u0026\u0075\u003b\u0060\u0052\u004f\u0049", "MXv[", "XX%Hvf,O", "Cr1)f}dB", "\u0065\u0043\u007a\u0037\u0030\u005a\u007c\u0042", "rr\"aV", "L{_W%!l~", "){I1+0t~", "..!?p", "!`>y`S6O", "\u007c\u0036\u0038\u0079\u004e\u0064\u0035\u004f", "!wBFDqGO", "KMf;", ")w;!i}GO", "l>8y", "3b>FO$<O", "\u007d\u007b\u0044\u0065\u0079\u002a\u006b\u006e\u0046\u0077\u004e\u0021\u007d\u0075\u0062\u007c\u006b\u002a\u0040\u0040\u0078\u0074\u0074", "/TqFBzn(:Q", "ZX,sU", "~>N?sq6O", "v_`Skr6O", "_wUFbqwO", "%=E[5u6O", "XkJS{}GO", "FX6s?}5O", "FX1!70GO", "sZ%hyCxO", "@=I;%JNO", "9bb.I}VO", "^Ll)A", "HXEH^", "%bmh`J{O", "Fb&[@G6O", "E]l),", "d5\";FJNO", "\u0073\u004d\u007c\u0045\u003b\u0031\u0036\u004f", "HLf;&auHZ", "!wu!F3JzO", "1>$;*0w%H", "Eb&[70NO", "%blE;16O", "\">>F3dDO", "b9L?:f#", "h_.si}9O", "\u0049\u006b\u003e\u0079\u0068\u007c\u0049\u004f", "\x2a\x58\x2c\x73\x50\x7c\x35\x4f", "`J*Fp", "&<^[EJNO", "!wm?sq,O", "h_!JEu]O", "T7l)C$6O", "QD&[70NO", "bb`Skr6O", "w<k!AJLO", "t.f;", "[.=FFJ#", "?<`SAJIO", ";s`]stQA", "nQ*ttEDA", "\x76\x76\x3b\x64\x5d\x7c\x5a\x41", "p7`]", "BD)2d>$A", "U6,?YuQA", "\x34\x34\x7c\x3f\x51\x74\x5d\x41", "vv;dSEa", "RBDb9kRA", "03FcD(19gxv_t5*Elc~", ",~VDCBW\"#R6fjOS", "!4kbQjMA", "}>PsXf#", "mmnR~^x=]+}ut", "sZ%h,J*SF_DEO", "\x72\x26\x6f\x62\x55\x4d\x7c\x52\x3d", "}{Dey*#?#a^kU\"o6", "O+C,S", "UW%3?us", ")Wc:E#)Q", "h_l){f_O", "PX\"5PW=)wUxD!F1", "PX\"5PW>m}#>)\"(p5Da>bZ]?", "%b\";p", "v{]f~N#x9`qmI", "\"+HvQFwgfzE~I", "\x4d\x72\x38\x4c\x34\x7c\x6d\x62\x7e"];
function __p_64Bo_getGlobal() {
  var array = [function () {
    return globalThis;
  }, function () {
    return global;
  }, function () {
    return window;
  }, function () {
    return new Function("return this")();
  }];
  var bestMatch;
  var itemsToSearch = [];
  try {
    bestMatch = Object;
    itemsToSearch.push("".__proto__.constructor.name);
  } catch (e) {}
  q2yvoG: for (var i = 0x0; i < array.length; i++) {
    try {
      bestMatch = array[i]();
      for (var j = 0x0; j < itemsToSearch.length; j++) {
        if (typeof bestMatch[itemsToSearch[j]] === "undefined") continue q2yvoG;
      }
      return bestMatch;
    } catch (e) {}
  }
  return bestMatch || this;
}
var __globalObject = __p_64Bo_getGlobal() || {};
var __TextDecoder = __globalObject.TextDecoder;
var __Uint8Array = __globalObject.Uint8Array;
var __Buffer = __globalObject.Buffer;
var __String = __globalObject.String || String;
var __Array = __globalObject.Array || Array;
var utf8ArrayToStr = function () {
  var charCache = new __Array(0x80);
  var charFromCodePt = __String.fromCodePoint || __String.fromCharCode;
  var result = [];
  return function (array) {
    var codePt;
    var byte1;
    var buffLen = array.length;
    result.length = 0x0;
    for (var i = 0x0; i < buffLen;) {
      byte1 = array[i++];
      if (byte1 <= 0x7f) {
        codePt = byte1;
      } else if (byte1 <= 0xdf) {
        codePt = (byte1 & 0x1f) << 0x6 | array[i++] & 0x3f;
      } else if (byte1 <= 0xef) {
        codePt = (byte1 & 0xf) << 0xc | (array[i++] & 0x3f) << 0x6 | array[i++] & 0x3f;
      } else if (__String.fromCodePoint) {
        codePt = (byte1 & 0x7) << 0x12 | (array[i++] & 0x3f) << 0xc | (array[i++] & 0x3f) << 0x6 | array[i++] & 0x3f;
      } else {
        codePt = 0x3f;
        i += 0x3;
      }
      result.push(charCache[codePt] || (charCache[codePt] = charFromCodePt(codePt)));
    }
    return result.join("");
  };
}();
function __p_FOXm_bufferToString(buffer) {
  if (typeof __TextDecoder !== "undefined" && __TextDecoder) {
    return new __TextDecoder().decode(new __Uint8Array(buffer));
  } else if (typeof __Buffer !== "undefined" && __Buffer) {
    return __Buffer.from(buffer).toString("utf-8");
  } else {
    return utf8ArrayToStr(buffer);
  }
}
let currentPage = 0x1;
let totalPages = 0x64;
let numbersPerPage = 0xa;
let pageData = {};
let visitedPages = new Set();
let challengeType = "protobuf_challenge";
async function apiInitChallenge(type = challengeType) {
  function __p_zefU_STR_1_decode(str) {
    function* juSSY2(TKhubb, oNUICe, IV0JUa, KZyt9u_, n0qMqAO = {
      ["\u004d\u0043\u0067\u0073\u0079\u0058\u006d"]: {}
    }) {
      while (TKhubb + oNUICe + IV0JUa + KZyt9u_ !== -0xcc) {
        with (n0qMqAO.AKvagS || n0qMqAO) {
          switch (TKhubb + oNUICe + IV0JUa + KZyt9u_) {
            case 0xe6:
            case 0xd0:
            case n0qMqAO.MCgsyXm.wzwx8u + 0x11a:
              _AsY0x.push((Yz_vGp | oxlJQ8x << fNQ3cj) & 0xff);
              n0qMqAO.AKvagS = n0qMqAO.MCgsyXm, TKhubb += 0x8c, oNUICe += -0xd1, IV0JUa += 0x51;
              break;
            case -0xc7:
            case -0x67:
              n0qMqAO.MCgsyXm.oxlJQ8x = -(TKhubb + 0x22);
              for (n0qMqAO.MCgsyXm.yKE6nu = 0x0; yKE6nu < tXMtD3X; yKE6nu++) {
                n0qMqAO.MCgsyXm.kJHVEY = cshofh.indexOf(cR0jMGc[yKE6nu]);
                if (kJHVEY === -0x1) continue;
                if (oxlJQ8x < 0x0) {
                  oxlJQ8x = kJHVEY;
                } else {
                  oxlJQ8x += kJHVEY * 0x5b;
                  Yz_vGp |= oxlJQ8x << fNQ3cj;
                  fNQ3cj += (oxlJQ8x & IV0JUa + 0x20c1) > 0x58 ? IV0JUa + 0xcf : TKhubb + 0x2f;
                  do {
                    _AsY0x.push(Yz_vGp & IV0JUa + 0x1c1);
                    Yz_vGp >>= oNUICe + 0x45;
                    fNQ3cj -= IV0JUa + 0xca;
                  } while (fNQ3cj > TKhubb + 0x28);
                  oxlJQ8x = -0x1;
                }
              }
              if (oxlJQ8x > -0x1) {
                n0qMqAO.AKvagS = n0qMqAO.MCgsyXm, TKhubb += 0xcf, oNUICe += 0xbb;
                break;
              } else {
                n0qMqAO.AKvagS = n0qMqAO.MCgsyXm, TKhubb += 0x15b, oNUICe += -0x16, IV0JUa += 0x51;
                break;
              }
            case 0x3c:
            case n0qMqAO.MCgsyXm.wzwx8u + 0x9b:
              [n0qMqAO.MCgsyXm.wzwx8u] = [0xe6];
              return GhrEoW = true, __p_FOXm_bufferToString(_AsY0x);
              n0qMqAO.AKvagS = n0qMqAO.EC_YBJ, TKhubb += -0x133, oNUICe += -0x41, KZyt9u_ += 0x64;
              break;
            default:
            case 0x2d:
              n0qMqAO.AKvagS = n0qMqAO.MCgsyXm, TKhubb += 0x10c, oNUICe += 0x11d, IV0JUa += -0x3c, KZyt9u_ += -0x94;
              break;
            case IV0JUa - -0x58:
              n0qMqAO.MCgsyXm.tXMtD3X = cR0jMGc.length;
              n0qMqAO.MCgsyXm._AsY0x = [];
              n0qMqAO.MCgsyXm.Yz_vGp = 0x0;
              n0qMqAO.MCgsyXm.fNQ3cj = oNUICe + 0x3d;
              n0qMqAO.AKvagS = n0qMqAO.MCgsyXm, TKhubb += -0x5d, IV0JUa += 0x2;
              break;
            case KZyt9u_ - -0xc1:
              [n0qMqAO.MCgsyXm.wzwx8u] = [-0x57];
              MCgsyXm.cshofh = "\x33\x36\x7d\x75\x5e\x6b\x5d\x4b\x58\x62\x2f\x22\x65\x71\x57\x44\x74\x7b\x67\x2a\x6f\x45\x6e\x69\x3b\x29\x4d\x4c\x3f\x76\x34\x7a\x35\x61\x49\x21\x47\x5b\x77\x64\x24\x32\x59\x39\x7e\x4e\x3d\x3c\x6c\x56\x5a\x55\x4a\x26\x6a\x31\x72\x63\x41\x3a\x2c\x38\x42\x48\x40\x70\x46\x43\x4f\x73\x3e\x2e\x7c\x66\x51\x60\x78\x2b\x54\x79\x30\x28\x25\x5f\x37\x68\x53\x50\x6d\x23\x52";
              MCgsyXm.cR0jMGc = "" + (str || "");
              n0qMqAO.AKvagS = n0qMqAO.MCgsyXm, TKhubb += -0xba, oNUICe += -0x96, IV0JUa += -0x36, KZyt9u_ += 0x73;
              break;
            case n0qMqAO.MCgsyXm.wzwx8u + 0x13a:
            case 0xee:
            case 0x34:
              return GhrEoW = true, __p_FOXm_bufferToString(_AsY0x);
              n0qMqAO.AKvagS = n0qMqAO.Frrtyz, TKhubb += -0xbc, oNUICe += -0x157, KZyt9u_ += 0x64;
              break;
            case oNUICe - -0x122:
              return GhrEoW = true, __p_FOXm_bufferToString(_AsY0x);
              n0qMqAO.AKvagS = n0qMqAO.qYctIxA, TKhubb += -0x186, IV0JUa += -0x15;
              break;
          }
        }
      }
    }
    var GhrEoW;
    var TFGdl3 = juSSY2(0xf6, 0x59, -0x8e, -0x1a).next().value;
    if (GhrEoW) {
      return TFGdl3;
    }
  }
  function __p_zefU_STR_1(index) {
    if (typeof __p_uEa2_cache[index] === "undefined") {
      return __p_uEa2_cache[index] = __p_zefU_STR_1_decode(__p_nukQ_array[index]);
    }
    return __p_uEa2_cache[index];
  }
  const url = "�QkQ�w�^/�=�n��PqX�`>��8kރ��9JG�2�砚;2��\b��_KA>�y�" + encodeURIComponent(type);
  const response = await fetch(url);
  const data = await response["@,"]();
  if (!response.ok) {
    function __p_nDAH_STR_2_decode(str) {
      var table = "\u007a\u0031\u0060\u003b\u0063\u0064\u0068\u0032\u004d\u006d\u004c\u0069\u0049\u0050\u007c\u0051\u0033\u0026\u0040\u0058\u005b\u0077\u002e\u0042\u0061\u0055\u0021\u005f\u007b\u0025\u002c\u004b\u007d\u0076\u005e\u003f\u0074\u0048\u0037\u0044\u0046\u004a\u0073\u0071\u006f\u0039\u0029\u0070\u005d\u0052\u0075\u004f\u003d\u0054\u0043\u0078\u0079\u0047\u0036\u006c\u0038\u0035\u0053\u0056\u003a\u0045\u002a\u007e\u0065\u0034\u0057\u003c\u0028\u0023\u002b\u0066\u004e\u0041\u0030\u003e\u0024\u006a\u005a\u0062\u0067\u006e\u002f\u0072\u0059\u0022\u006b";
      var raw = "" + (str || "");
      var len = raw.length;
      var ret = [];
      var b = 0x0;
      var n = 0x0;
      var v = -0x1;
      for (var i = 0x0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -0x1) continue;
        if (v < 0x0) {
          v = p;
        } else {
          v += p * 0x5b;
          b |= v << n;
          n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
          do {
            ret.push(b & 0xff);
            b >>= 0x8;
            n -= 0x8;
          } while (n > 0x7);
          v = -0x1;
        }
      }
      if (v > -0x1) {
        ret.push((b | v << n) & 0xff);
      }
      return __p_FOXm_bufferToString(ret);
    }
    function __p_nDAH_STR_2(index) {
      if (typeof __p_uEa2_cache[index] === "undefined") {
        return __p_uEa2_cache[index] = __p_nDAH_STR_2_decode(__p_nukQ_array[index]);
      }
      return __p_uEa2_cache[index];
    }
    const errorMessage = data.error || "HTTP " + response.status + "\u003a\u0020" + response["statusText"];
    throw new Error(errorMessage);
  }
  return data;
}
async function apiSubmitAnswer(answer, type = challengeType) {
  function __p_Seb1_STR_3_decode(str) {
    var table = "\x34\x37\x3e\x36\x5b\x7c\x59\x39\x78\x48\x3c\x44\x5d\x7e\x38\x3a\x63\x5a\x30\x50\x43\x62\x5e\x22\x64\x31\x4d\x21\x6b\x69\x76\x57\x4c\x7a\x4a\x28\x46\x42\x6f\x3b\x56\x45\x23\x61\x71\x4f\x2e\x60\x2c\x79\x6e\x66\x67\x6d\x41\x4b\x53\x2f\x3f\x47\x74\x75\x70\x73\x3d\x29\x54\x2a\x32\x52\x77\x25\x40\x49\x35\x7d\x5f\x6c\x65\x26\x33\x58\x4e\x6a\x2b\x7b\x68\x55\x72\x51\x24";
    var raw = "" + (str || "");
    var len = raw.length;
    var ret = [];
    var b = 0x0;
    var n = 0x0;
    var v = -0x1;
    for (var i = 0x0; i < len; i++) {
      var p = table.indexOf(raw[i]);
      if (p === -0x1) continue;
      if (v < 0x0) {
        v = p;
      } else {
        v += p * 0x5b;
        b |= v << n;
        n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
        do {
          ret.push(b & 0xff);
          b >>= 0x8;
          n -= 0x8;
        } while (n > 0x7);
        v = -0x1;
      }
    }
    if (v > -0x1) {
      ret.push((b | v << n) & 0xff);
    }
    return __p_FOXm_bufferToString(ret);
  }
  function __p_Seb1_STR_3(index) {
    if (typeof __p_uEa2_cache[index] === "undefined") {
      return __p_uEa2_cache[index] = __p_Seb1_STR_3_decode(__p_nukQ_array[index]);
    }
    return __p_uEa2_cache[index];
  }
  const response = await fetch("/authentication/api/protobuf_challenge/submit/", {
    ["method"]: "POST",
    ["headers"]: {
      ["Content-Type"]: "application/json"
    },
    ["body"]: JSON["stringify"]({
      ["challenge_type"]: type,
      ["answer"]: answer
    })
  });
  const data = await response.json();
  if (!response.ok) {
    function __p_5cLR_STR_4_decode(str) {
      var table = "\u0032\u007e\u0075\u005d\u0025\u0040\u0029\u007c\u0042\u0058\u0024\u0041\u0071\u0062\u0021\u0055\u006d\u004a\u005e\u0069\u0061\u0072\u005b\u0045\u002f\u006f\u003f\u0065\u002c\u0068\u0063\u0078\u0076\u0070\u0077\u0067\u0060\u0031\u0047\u003c\u0064\u003d\u0028\u004e\u0043\u0057\u0073\u0079\u0052\u0026\u0037\u003b\u004b\u0046\u0044\u0023\u0049\u002a\u0033\u006a\u0066\u0022\u007b\u0056\u0034\u0059\u0036\u006b\u007d\u0050\u003a\u005a\u007a\u0074\u004d\u0054\u0039\u005f\u0053\u0030\u002b\u0035\u0038\u004c\u006e\u003e\u0051\u006c\u0048\u002e\u004f";
      var raw = "" + (str || "");
      var len = raw.length;
      var ret = [];
      var b = 0x0;
      var n = 0x0;
      var v = -0x1;
      for (var i = 0x0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -0x1) continue;
        if (v < 0x0) {
          v = p;
        } else {
          v += p * 0x5b;
          b |= v << n;
          n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
          do {
            ret.push(b & 0xff);
            b >>= 0x8;
            n -= 0x8;
          } while (n > 0x7);
          v = -0x1;
        }
      }
      if (v > -0x1) {
        ret.push((b | v << n) & 0xff);
      }
      return __p_FOXm_bufferToString(ret);
    }
    function __p_5cLR_STR_4(index) {
      if (typeof __p_uEa2_cache[index] === "undefined") {
        return __p_uEa2_cache[index] = __p_5cLR_STR_4_decode(__p_nukQ_array[index]);
      }
      return __p_uEa2_cache[index];
    }
    const errorMessage = data.error || "HTTP " + response.status + "\x3a\x20" + response["statusText"];
    throw new Error(errorMessage);
  }
  return data;
}
function getChallengeTypeFromUrl() {
  function __p_87yK_STR_5_decode(str) {
    var table = "\x5f\x64\x71\x4c\x6e\x73\x42\x57\x54\x65\x51\x63\x32\x5b\x44\x2a\x59\x35\x62\x79\x67\x74\x41\x31\x6c\x69\x56\x6a\x58\x24\x5e\x61\x43\x46\x4e\x66\x4f\x45\x53\x47\x7c\x28\x36\x77\x23\x30\x34\x6d\x49\x2b\x29\x39\x5d\x7a\x7b\x52\x76\x4a\x6b\x26\x38\x60\x6f\x2e\x40\x72\x3f\x7d\x3e\x4b\x2f\x70\x78\x37\x50\x7e\x3b\x22\x75\x68\x2c\x5a\x3d\x3c\x21\x33\x25\x55\x48\x4d\x3a";
    var raw = "" + (str || "");
    var len = raw.length;
    var ret = [];
    var b = 0x0;
    var n = 0x0;
    var v = -0x1;
    for (var i = 0x0; i < len; i++) {
      var p = table.indexOf(raw[i]);
      if (p === -0x1) continue;
      if (v < 0x0) {
        v = p;
      } else {
        v += p * 0x5b;
        b |= v << n;
        n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
        do {
          ret.push(b & 0xff);
          b >>= 0x8;
          n -= 0x8;
        } while (n > 0x7);
        v = -0x1;
      }
    }
    if (v > -0x1) {
      ret.push((b | v << n) & 0xff);
    }
    return __p_FOXm_bufferToString(ret);
  }
  function __p_87yK_STR_5(index) {
    if (typeof __p_uEa2_cache[index] === "undefined") {
      return __p_uEa2_cache[index] = __p_87yK_STR_5_decode(__p_nukQ_array[index]);
    }
    return __p_uEa2_cache[index];
  }
  const urlParams = new URLSearchParams(window["location"].search);
  return urlParams.get("challenge_type") || urlParams.get("type") || "protobuf_challenge";
}
function getChallengeDisplayName(type) {
  function __p_gE9E_STR_6_decode(str) {
    var table = "\u0031\u002f\u007a\u0038\u007d\u0026\u0060\u003d\u0028\u0029\u002b\u005b\u004a\u0071\u004f\u0078\u0041\u0055\u0033\u004e\u0036\u0070\u002a\u0061\u0039\u007c\u0030\u0042\u0048\u002e\u0064\u006c\u0067\u0056\u0059\u0049\u0032\u005f\u0034\u0058\u0037\u0053\u004c\u0062\u0023\u004b\u0046\u0073\u005a\u0052\u0072\u006b\u007b\u0051\u006a\u0054\u0063\u0021\u0050\u005d\u0077\u0035\u0043\u003c\u0025\u004d\u0045\u0047\u0024\u007e\u003f\u0079\u0069\u002c\u0040\u0074\u003a\u0076\u0068\u0057\u0044\u0075\u003b\u006d\u005e\u0066\u0065\u006e\u0022\u003e\u006f";
    var raw = "" + (str || "");
    var len = raw.length;
    var ret = [];
    var b = 0x0;
    var n = 0x0;
    var v = -0x1;
    for (var i = 0x0; i < len; i++) {
      var p = table.indexOf(raw[i]);
      if (p === -0x1) continue;
      if (v < 0x0) {
        v = p;
      } else {
        v += p * 0x5b;
        b |= v << n;
        n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
        do {
          ret.push(b & 0xff);
          b >>= 0x8;
          n -= 0x8;
        } while (n > 0x7);
        v = -0x1;
      }
    }
    if (v > -0x1) {
      ret.push((b | v << n) & 0xff);
    }
    return __p_FOXm_bufferToString(ret);
  }
  function __p_gE9E_STR_6(index) {
    if (typeof __p_uEa2_cache[index] === "undefined") {
      return __p_uEa2_cache[index] = __p_gE9E_STR_6_decode(__p_nukQ_array[index]);
    }
    return __p_uEa2_cache[index];
  }
  const names = {
    ["header_check"]: "请求头检测挑战",
    ["number_challenge"]: "动态数字求和挑战",
    ["js_challenge"]: "JS混淆解析挑战",
    ["slide_puzzle_challenge"]: "滑动拼图",
    ["slide_scratch_challenge"]: "滑动刮刮乐",
    ["protobuf_challenge"]: "protobuf混淆解析挑战"
  };
  return names[type] || type;
}
function updatePageTitle() {
  function __p_Kwxp_STR_7_decode(str) {
    var table = "\u003e\u0045\u0047\u006e\u0041\u0042\u0072\u005a\u0068\u004e\u0067\u006a\u0073\u0058\u0054\u0062\u006c\u0053\u0049\u0056\u004c\u0069\u0064\u0066\u0070\u0057\u0048\u006f\u0055\u0044\u004a\u0063\u0043\u0061\u0065\u004f\u0059\u006b\u0071\u004b\u0052\u006d\u0046\u0051\u0074\u0050\u004d\u0034\u003f\u0039\u0076\u0075\u0040\u005f\u003a\u0024\u0023\u0026\u0079\u005e\u0030\u002a\u005b\u0033\u0035\u007b\u0077\u002e\u003b\u0038\u0078\u002b\u007c\u003c\u0021\u0028\u0036\u0022\u002c\u003d\u0025\u007e\u0031\u007a\u0060\u0032\u005d\u0037\u007d\u0029\u002f";
    var raw = "" + (str || "");
    var len = raw.length;
    var ret = [];
    var b = 0x0;
    var n = 0x0;
    var v = -0x1;
    for (var i = 0x0; i < len; i++) {
      var p = table.indexOf(raw[i]);
      if (p === -0x1) continue;
      if (v < 0x0) {
        v = p;
      } else {
        v += p * 0x5b;
        b |= v << n;
        n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
        do {
          ret.push(b & 0xff);
          b >>= 0x8;
          n -= 0x8;
        } while (n > 0x7);
        v = -0x1;
      }
    }
    if (v > -0x1) {
      ret.push((b | v << n) & 0xff);
    }
    return __p_FOXm_bufferToString(ret);
  }
  function __p_Kwxp_STR_7(index) {
    if (typeof __p_uEa2_cache[index] === "undefined") {
      return __p_uEa2_cache[index] = __p_Kwxp_STR_7_decode(__p_nukQ_array[index]);
    }
    return __p_uEa2_cache[index];
  }
  const titleElement = document["querySelector"](".challenge-title");
  if (titleElement) {
    function __p_oigO_STR_8_decode(str) {
      var table = "\x63\x48\x74\x33\x32\x60\x44\x56\x7a\x25\x6c\x43\x26\x6a\x2e\x34\x65\x54\x51\x50\x4b\x29\x5b\x23\x7c\x3f\x2a\x45\x68\x5a\x2b\x67\x62\x28\x55\x5d\x2f\x3d\x36\x72\x53\x22\x42\x79\x6e\x7d\x4c\x59\x5e\x3b\x3e\x61\x49\x4f\x3c\x46\x58\x78\x6f\x7b\x6b\x6d\x70\x24\x4d\x4a\x37\x52\x21\x30\x69\x47\x4e\x64\x77\x57\x71\x41\x66\x3a\x2c\x39\x38\x7e\x5f\x40\x31\x76\x35\x75\x73";
      var raw = "" + (str || "");
      var len = raw.length;
      var ret = [];
      var b = 0x0;
      var n = 0x0;
      var v = -0x1;
      for (var i = 0x0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -0x1) continue;
        if (v < 0x0) {
          v = p;
        } else {
          v += p * 0x5b;
          b |= v << n;
          n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
          do {
            ret.push(b & 0xff);
            b >>= 0x8;
            n -= 0x8;
          } while (n > 0x7);
          v = -0x1;
        }
      }
      if (v > -0x1) {
        ret.push((b | v << n) & 0xff);
      }
      return __p_FOXm_bufferToString(ret);
    }
    function __p_oigO_STR_8(index) {
      if (typeof __p_uEa2_cache[index] === "undefined") {
        return __p_uEa2_cache[index] = __p_oigO_STR_8_decode(__p_nukQ_array[index]);
      }
      return __p_uEa2_cache[index];
    }
    const displayName = getChallengeDisplayName(challengeType);
    titleElement["innerHTML"] = "🎯 任务: 采集这100页的全部数字，计算加和并提交结果<br/><small>(" + displayName + ")</small>";
  }
  const pageTitle = document["querySelector"](".page-title");
  if (pageTitle) {
    function __p_HuDF_STR_9_decode(str) {
      var table = "\u0073\u0024\u0036\u0072\u0051\u003a\u0031\u0056\u0058\u0041\u0057\u0037\u0050\u0065\u0035\u002c\u0059\u004e\u0079\u005a\u0063\u0048\u0076\u0025\u006e\u002a\u0042\u0021\u002b\u0053\u005e\u0039\u0062\u0066\u0023\u0043\u003b\u0077\u005b\u005d\u0040\u0022\u006d\u002e\u006a\u006b\u0071\u0078\u0067\u0038\u003e\u0075\u0026\u0061\u004a\u004f\u0044\u0034\u0068\u0055\u0064\u003c\u006c\u007c\u007e\u0047\u007a\u0060\u0032\u0033\u005f\u0049\u004d\u0045\u0052\u0069\u007d\u003d\u0046\u0074\u003f\u0028\u004b\u002f\u006f\u0070\u007b\u0029\u004c\u0030\u0054";
      var raw = "" + (str || "");
      var len = raw.length;
      var ret = [];
      var b = 0x0;
      var n = 0x0;
      var v = -0x1;
      for (var i = 0x0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -0x1) continue;
        if (v < 0x0) {
          v = p;
        } else {
          v += p * 0x5b;
          b |= v << n;
          n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
          do {
            ret.push(b & 0xff);
            b >>= 0x8;
            n -= 0x8;
          } while (n > 0x7);
          v = -0x1;
        }
      }
      if (v > -0x1) {
        ret.push((b | v << n) & 0xff);
      }
      return __p_FOXm_bufferToString(ret);
    }
    function __p_HuDF_STR_9(index) {
      if (typeof __p_uEa2_cache[index] === "undefined") {
        return __p_uEa2_cache[index] = __p_HuDF_STR_9_decode(__p_nukQ_array[index]);
      }
      return __p_uEa2_cache[index];
    }
    pageTitle["innerHTML"] = "🔢 " + getChallengeDisplayName(challengeType);
  }
}
async function generateNumbers(page) {
  try {
    function __p_iVbD_STR_10_decode(str) {
      var table = "\x77\x78\x25\x33\x5d\x60\x28\x46\x31\x65\x5e\x62\x7e\x67\x48\x7d\x4f\x34\x4b\x7b\x30\x2f\x2b\x4a\x7c\x66\x7a\x71\x61\x4e\x22\x37\x3b\x47\x44\x6f\x26\x54\x70\x6a\x36\x4c\x4d\x52\x21\x2e\x38\x43\x42\x57\x24\x45\x73\x2c\x79\x76\x3c\x23\x6c\x3f\x6b\x72\x53\x63\x68\x59\x3a\x5a\x3e\x6e\x75\x49\x41\x55\x6d\x50\x64\x5f\x56\x58\x29\x2a\x74\x40\x32\x5b\x3d\x69\x35\x51\x39";
      var raw = "" + (str || "");
      var len = raw.length;
      var ret = [];
      var b = 0x0;
      var n = 0x0;
      var v = -0x1;
      for (var i = 0x0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -0x1) continue;
        if (v < 0x0) {
          v = p;
        } else {
          v += p * 0x5b;
          b |= v << n;
          n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
          do {
            ret.push(b & 0xff);
            b >>= 0x8;
            n -= 0x8;
          } while (n > 0x7);
          v = -0x1;
        }
      }
      if (v > -0x1) {
        ret.push((b | v << n) & 0xff);
      }
      return __p_FOXm_bufferToString(ret);
    }
    function __p_iVbD_STR_10(index) {
      if (typeof __p_uEa2_cache[index] === "undefined") {
        return __p_uEa2_cache[index] = __p_iVbD_STR_10_decode(__p_nukQ_array[index]);
      }
      return __p_uEa2_cache[index];
    }
    if (page === 0x1 && visitedPages.size === 0x0) {
      const initData = await apiInitChallenge(challengeType);
      if (initData["success"]) {
        function __p_dXL2_STR_11_decode(str) {
          var table = "\x4f\x44\x74\x3b\x56\x6d\x40\x7e\x6b\x60\x26\x68\x76\x75\x2e\x4d\x46\x66\x42\x37\x51\x34\x21\x77\x5a\x25\x4e\x63\x35\x64\x45\x72\x47\x4c\x69\x3f\x41\x4b\x22\x36\x48\x50\x23\x58\x78\x71\x2c\x43\x7c\x49\x4a\x70\x32\x73\x53\x6c\x7b\x67\x61\x62\x2a\x6f\x54\x65\x59\x6a\x3d\x28\x5b\x29\x55\x38\x57\x31\x52\x39\x24\x5d\x5e\x7d\x79\x3c\x2b\x3a\x33\x7a\x30\x3e\x6e\x5f\x2f";
          var raw = "" + (str || "");
          var len = raw.length;
          var ret = [];
          var b = 0x0;
          var n = 0x0;
          var v = -0x1;
          for (var i = 0x0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -0x1) continue;
            if (v < 0x0) {
              v = p;
            } else {
              v += p * 0x5b;
              b |= v << n;
              n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
              do {
                ret.push(b & 0xff);
                b >>= 0x8;
                n -= 0x8;
              } while (n > 0x7);
              v = -0x1;
            }
          }
          if (v > -0x1) {
            ret.push((b | v << n) & 0xff);
          }
          return __p_FOXm_bufferToString(ret);
        }
        function __p_dXL2_STR_11(index) {
          if (typeof __p_uEa2_cache[index] === "undefined") {
            return __p_uEa2_cache[index] = __p_dXL2_STR_11_decode(__p_nukQ_array[index]);
          }
          return __p_uEa2_cache[index];
        }
        console.log("挑战初始化成功:", challengeType);
        console.log("初始化信息:", initData["message"]);
        if (initData["has_passed_before"]) {
          function __p_02Mz_STR_12_decode(str) {
            var table = "\x7a\x7e\x78\x2b\x25\x37\x32\x56\x77\x5d\x65\x7b\x7d\x38\x6c\x3d\x60\x28\x66\x47\x5f\x43\x52\x48\x72\x67\x51\x3a\x44\x59\x5a\x73\x7c\x4a\x30\x3b\x3f\x53\x4b\x69\x58\x36\x61\x2f\x39\x68\x62\x2a\x49\x46\x3e\x6f\x6d\x34\x50\x45\x35\x4c\x6a\x3c\x42\x41\x33\x54\x26\x57\x70\x4d\x23\x24\x74\x63\x4f\x31\x2e\x2c\x75\x6e\x40\x55\x6b\x64\x4e\x71\x22\x5b\x21\x29\x5e\x76\x79";
            var raw = "" + (str || "");
            var len = raw.length;
            var ret = [];
            var b = 0x0;
            var n = 0x0;
            var v = -0x1;
            for (var i = 0x0; i < len; i++) {
              var p = table.indexOf(raw[i]);
              if (p === -0x1) continue;
              if (v < 0x0) {
                v = p;
              } else {
                v += p * 0x5b;
                b |= v << n;
                n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
                do {
                  ret.push(b & 0xff);
                  b >>= 0x8;
                  n -= 0x8;
                } while (n > 0x7);
                v = -0x1;
              }
            }
            if (v > -0x1) {
              ret.push((b | v << n) & 0xff);
            }
            return __p_FOXm_bufferToString(ret);
          }
          function __p_02Mz_STR_12(index) {
            if (typeof __p_uEa2_cache[index] === "undefined") {
              return __p_uEa2_cache[index] = __p_02Mz_STR_12_decode(__p_nukQ_array[index]);
            }
            return __p_uEa2_cache[index];
          }
          showResult("提示: " + initData["message"], "info");
        }
        return initData["page_data"];
      } else {
        function __p_yvLX_STR_13_decode(str) {
          var table = "\u004c\u002a\u003f\u0069\u005e\u0055\u006b\u0026\u006e\u0049\u0064\u004e\u0063\u0029\u0041\u0075\u0076\u003d\u0072\u0040\u003b\u0046\u0021\u0068\u002b\u004d\u0077\u0053\u0042\u0061\u005a\u005d\u006d\u0060\u0025\u0051\u007c\u0022\u0067\u006c\u0039\u007e\u0059\u0073\u0043\u005f\u0048\u0078\u0044\u0057\u003a\u0047\u0023\u0058\u0056\u004b\u0054\u0038\u003e\u0070\u0036\u0028\u0062\u006f\u002c\u0079\u0035\u0052\u0024\u0066\u0034\u007d\u007b\u007a\u0045\u002e\u0074\u005b\u0071\u0050\u0030\u0031\u003c\u0037\u006a\u004a\u0065\u004f\u0032\u0033\u002f";
          var raw = "" + (str || "");
          var len = raw.length;
          var ret = [];
          var b = 0x0;
          var n = 0x0;
          var v = -0x1;
          for (var i = 0x0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -0x1) continue;
            if (v < 0x0) {
              v = p;
            } else {
              v += p * 0x5b;
              b |= v << n;
              n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
              do {
                ret.push(b & 0xff);
                b >>= 0x8;
                n -= 0x8;
              } while (n > 0x7);
              v = -0x1;
            }
          }
          if (v > -0x1) {
            ret.push((b | v << n) & 0xff);
          }
          return __p_FOXm_bufferToString(ret);
        }
        function __p_yvLX_STR_13(index) {
          if (typeof __p_uEa2_cache[index] === "undefined") {
            return __p_uEa2_cache[index] = __p_yvLX_STR_13_decode(__p_nukQ_array[index]);
          }
          return __p_uEa2_cache[index];
        }
        throw new Error(initData.error || "初始化失败");
      }
    } else {
      function __p_D6z9_STR_14_decode(str) {
        var table = "\u005f\u0057\u0042\u0068\u004d\u006a\u0029\u0032\u007b\u0034\u007d\u003b\u0035\u0060\u0063\u006d\u007e\u0067\u0079\u004b\u0054\u0038\u0053\u0071\u002f\u003c\u005a\u0073\u004f\u0052\u0048\u0072\u0030\u005d\u0077\u003e\u006f\u0061\u004a\u0044\u0070\u0064\u0047\u0075\u002b\u005b\u0069\u0037\u007c\u004e\u003d\u0078\u002a\u0046\u0023\u0041\u0039\u002c\u006c\u0050\u0051\u0062\u002e\u0025\u0033\u0059\u0022\u0026\u0036\u0055\u0031\u0045\u004c\u007a\u0076\u0024\u0066\u005e\u0065\u006e\u0049\u0021\u0040\u0058\u0028\u006b\u003a\u0056\u003f\u0043\u0074";
        var raw = "" + (str || "");
        var len = raw.length;
        var ret = [];
        var b = 0x0;
        var n = 0x0;
        var v = -0x1;
        for (var i = 0x0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -0x1) continue;
          if (v < 0x0) {
            v = p;
          } else {
            v += p * 0x5b;
            b |= v << n;
            n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
            do {
              ret.push(b & 0xff);
              b >>= 0x8;
              n -= 0x8;
            } while (n > 0x7);
            v = -0x1;
          }
        }
        if (v > -0x1) {
          ret.push((b | v << n) & 0xff);
        }
        return __p_FOXm_bufferToString(ret);
      }
      function __p_D6z9_STR_14(index) {
        if (typeof __p_uEa2_cache[index] === "undefined") {
          return __p_uEa2_cache[index] = __p_D6z9_STR_14_decode(__p_nukQ_array[index]);
        }
        return __p_uEa2_cache[index];
      }
      const pageData = await apiGetPageData(page, challengeType);
      if (pageData["success"]) {
        function __p_K8Xs_STR_15_decode(str) {
          var table = "\x37\x29\x35\x5d\x3b\x77\x7a\x39\x26\x5b\x78\x61\x67\x56\x46\x5a\x2f\x76\x2e\x65\x3d\x69\x73\x7d\x4b\x3a\x53\x32\x2b\x41\x54\x55\x42\x64\x63\x24\x70\x25\x6b\x5f\x66\x31\x68\x50\x79\x59\x33\x4e\x21\x6e\x52\x34\x6a\x2a\x36\x4f\x6d\x44\x3c\x3e\x58\x45\x49\x4a\x43\x23\x47\x6c\x6f\x2c\x3f\x62\x57\x60\x4d\x7b\x7e\x38\x51\x4c\x48\x22\x28\x5e\x40\x71\x75\x72\x30\x7c\x74";
          var raw = "" + (str || "");
          var len = raw.length;
          var ret = [];
          var b = 0x0;
          var n = 0x0;
          var v = -0x1;
          for (var i = 0x0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -0x1) continue;
            if (v < 0x0) {
              v = p;
            } else {
              v += p * 0x5b;
              b |= v << n;
              n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
              do {
                ret.push(b & 0xff);
                b >>= 0x8;
                n -= 0x8;
              } while (n > 0x7);
              v = -0x1;
            }
          }
          if (v > -0x1) {
            ret.push((b | v << n) & 0xff);
          }
          return __p_FOXm_bufferToString(ret);
        }
        function __p_K8Xs_STR_15(index) {
          if (typeof __p_uEa2_cache[index] === "undefined") {
            return __p_uEa2_cache[index] = __p_K8Xs_STR_15_decode(__p_nukQ_array[index]);
          }
          return __p_uEa2_cache[index];
        }
        return pageData["page_data"];
      } else {
        function __p_VRdf_STR_16_decode(str) {
          var table = "\u0047\u0042\u0045\u0038\u0051\u0037\u0069\u006a\u0049\u0065\u0074\u0025\u0032\u004f\u0046\u007a\u0024\u0034\u0072\u0071\u003e\u0029\u005d\u006f\u0023\u006e\u0078\u0033\u0043\u0077\u0031\u006b\u002f\u0036\u006d\u002b\u0021\u0076\u005b\u0052\u0057\u002a\u0062\u0068\u007c\u0075\u0060\u004e\u0058\u003b\u003d\u0063\u0022\u0064\u0044\u0030\u0073\u003a\u007d\u005e\u0039\u004a\u007e\u0079\u0026\u0054\u0067\u0035\u0061\u0028\u0041\u0070\u002e\u0040\u007b\u003f\u005a\u005f\u002c\u0050\u004b\u0055\u0053\u0048\u006c\u0059\u004c\u0066\u0056\u004d\u003c";
          var raw = "" + (str || "");
          var len = raw.length;
          var ret = [];
          var b = 0x0;
          var n = 0x0;
          var v = -0x1;
          for (var i = 0x0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -0x1) continue;
            if (v < 0x0) {
              v = p;
            } else {
              v += p * 0x5b;
              b |= v << n;
              n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
              do {
                ret.push(b & 0xff);
                b >>= 0x8;
                n -= 0x8;
              } while (n > 0x7);
              v = -0x1;
            }
          }
          if (v > -0x1) {
            ret.push((b | v << n) & 0xff);
          }
          return __p_FOXm_bufferToString(ret);
        }
        function __p_VRdf_STR_16(index) {
          if (typeof __p_uEa2_cache[index] === "undefined") {
            return __p_uEa2_cache[index] = __p_VRdf_STR_16_decode(__p_nukQ_array[index]);
          }
          return __p_uEa2_cache[index];
        }
        throw new Error(pageData.error || "获取数据失败");
      }
    }
  } catch (error) {
    function __p_NFtq_STR_17_decode(str) {
      var table = "\x6f\x45\x35\x77\x79\x72\x44\x39\x56\x67\x5e\x3e\x43\x62\x5a\x37\x69\x57\x76\x5d\x75\x55\x78\x25\x50\x36\x2f\x38\x2c\x54\x6e\x3c\x68\x4c\x48\x4a\x4b\x28\x40\x63\x7c\x71\x31\x47\x64\x4d\x22\x2e\x29\x3b\x3d\x42\x73\x49\x65\x41\x34\x3a\x53\x5b\x2a\x51\x46\x4e\x70\x7d\x23\x26\x52\x60\x59\x74\x2b\x6a\x3f\x7b\x6d\x7a\x5f\x6b\x33\x6c\x4f\x24\x30\x66\x58\x61\x7e\x32\x21";
      var raw = "" + (str || "");
      var len = raw.length;
      var ret = [];
      var b = 0x0;
      var n = 0x0;
      var v = -0x1;
      for (var i = 0x0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -0x1) continue;
        if (v < 0x0) {
          v = p;
        } else {
          v += p * 0x5b;
          b |= v << n;
          n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
          do {
            ret.push(b & 0xff);
            b >>= 0x8;
            n -= 0x8;
          } while (n > 0x7);
          v = -0x1;
        }
      }
      if (v > -0x1) {
        ret.push((b | v << n) & 0xff);
      }
      return __p_FOXm_bufferToString(ret);
    }
    function __p_NFtq_STR_17(index) {
      if (typeof __p_uEa2_cache[index] === "undefined") {
        return __p_uEa2_cache[index] = __p_NFtq_STR_17_decode(__p_nukQ_array[index]);
      }
      return __p_uEa2_cache[index];
    }
    console.error("获取数据失败:", error);
    if (error["message"]["includes"]("请先登录")) {
      function __p_Z7cc_STR_18_decode(str) {
        function* HLiIbZb(cKpSDQv, Ml1BDd, Nm6NOPs, uGFbXi1 = {
          ["\u0069\u0054\u0055\u0047\u0054\u0072\u0049"]: {}
        }) {
          while (cKpSDQv + Ml1BDd + Nm6NOPs !== 0xdc) {
            with (uGFbXi1.VByoQYb || uGFbXi1) {
              switch (cKpSDQv + Ml1BDd + Nm6NOPs) {
                case -0x5b:
                case 0xc1:
                  [uGFbXi1.iTUGTrI.WIEtHm, uGFbXi1.iTUGTrI.VLYqEh] = [0xd8, -0xb4];
                  iTUGTrI.IPWrxs = "\u004c\u0047\u0043\u0073\u0056\u0051\u006a\u0062\u004f\u0053\u0066\u004b\u0065\u0072\u0069\u0042\u006c\u0064\u0059\u004a\u0054\u0046\u0063\u0045\u006f\u0071\u006e\u0068\u0049\u0052\u0061\u004d\u0048\u0044\u005a\u004e\u006b\u0058\u006d\u0041\u0055\u0057\u0067\u0074\u0050\u0070\u0034\u0078\u007e\u0037\u003b\u0040\u002b\u003f\u005e\u0077\u0038\u0039\u0079\u005f\u007c\u0033\u0028\u005d\u0030\u003d\u002e\u007b\u007d\u002a\u0025\u003a\u003e\u002f\u0026\u0036\u0076\u005b\u0075\u0032\u0024\u0021\u0031\u0035\u002c\u007a\u003c\u0029\u0060\u0023\u0022";
                  iTUGTrI.CZDc8g = "" + (str || "");
                  uGFbXi1.VByoQYb = uGFbXi1.iTUGTrI, cKpSDQv += -0x32, Ml1BDd += 0x195, Nm6NOPs += -0x15c;
                  break;
                default:
                case 0xd1:
                case -0x8c:
                  uGFbXi1.iTUGTrI.rpkCO_i = -0x1;
                  for (uGFbXi1.iTUGTrI.bSVCvUb = cKpSDQv + -0x84; bSVCvUb < sf97yT; bSVCvUb++) {
                    uGFbXi1.iTUGTrI.QKnIm_Y = IPWrxs.indexOf(CZDc8g[bSVCvUb]);
                    if (QKnIm_Y === -0x1) continue;
                    if (rpkCO_i < Ml1BDd + -0x7c) {
                      rpkCO_i = QKnIm_Y;
                    } else {
                      rpkCO_i += QKnIm_Y * 0x5b;
                      Fr9nTT |= rpkCO_i << VcQHb4Y;
                      VcQHb4Y += (rpkCO_i & 0x1fff) > 0x58 ? Ml1BDd + -0x6f : Ml1BDd + -0x6e;
                      do {
                        DSKwiZ.push(Fr9nTT & cKpSDQv + 0x7b);
                        Fr9nTT >>= cKpSDQv + -0x7c;
                        VcQHb4Y -= 0x8;
                      } while (VcQHb4Y > 0x7);
                      rpkCO_i = -(Ml1BDd + -0x7b);
                    }
                  }
                  if (rpkCO_i > -0x1) {
                    uGFbXi1.VByoQYb = uGFbXi1.iTUGTrI, Nm6NOPs += 0x4e;
                    break;
                  } else {
                    uGFbXi1.VByoQYb = uGFbXi1.iTUGTrI, cKpSDQv += -0x5b, Nm6NOPs += 0xb2;
                    break;
                  }
                case 0xb0:
                case -0x9:
                case cKpSDQv - -0x114:
                  uGFbXi1.iTUGTrI.sf97yT = CZDc8g.length;
                  uGFbXi1.iTUGTrI.DSKwiZ = [];
                  uGFbXi1.VByoQYb = uGFbXi1.iTUGTrI, cKpSDQv += 0xd0, Ml1BDd += -0x14f, Nm6NOPs += -0x110;
                  break;
                case 0xad:
                  return mjVyAIk = true, __p_FOXm_bufferToString(DSKwiZ);
                  uGFbXi1.VByoQYb = uGFbXi1.a3OEh1W, cKpSDQv += 0xb1, Ml1BDd += -0x141, Nm6NOPs += 0xbf;
                  break;
                case uGFbXi1.iTUGTrI.WIEtHm + -0x109:
                case 0x31:
                  [uGFbXi1.iTUGTrI.WIEtHm, uGFbXi1.iTUGTrI.VLYqEh] = [-0x22, 0xd7];
                  uGFbXi1.VByoQYb = uGFbXi1.UpTV52, cKpSDQv += 0x19, Ml1BDd += -0x22, Nm6NOPs += 0xfb;
                  break;
                case -0x89:
                case Ml1BDd != 0x7c && Ml1BDd - 0x26:
                case 0xf0:
                  uGFbXi1.iTUGTrI.Fr9nTT = cKpSDQv + -0x84;
                  uGFbXi1.iTUGTrI.VcQHb4Y = 0x0;
                  uGFbXi1.VByoQYb = uGFbXi1.iTUGTrI, Ml1BDd += 0x11d;
                  break;
                case 0x2f:
                case 0x88:
                case uGFbXi1.iTUGTrI.WIEtHm + -0x34:
                  DSKwiZ.push((Fr9nTT | rpkCO_i << VcQHb4Y) & 0xff);
                  uGFbXi1.VByoQYb = uGFbXi1.iTUGTrI, cKpSDQv += -0x5b, Nm6NOPs += 0x64;
                  break;
              }
            }
          }
        }
        var mjVyAIk;
        var ORfJ46 = HLiIbZb(-0x1a, -0xe7, 0x1c2).next().value;
        if (mjVyAIk) {
          return ORfJ46;
        }
      }
      function __p_Z7cc_STR_18(index) {
        if (typeof __p_uEa2_cache[index] === "undefined") {
          return __p_uEa2_cache[index] = __p_Z7cc_STR_18_decode(__p_nukQ_array[index]);
        }
        return __p_uEa2_cache[index];
      }
      showResult("�(\b_��f�\r��sX�-�*����f�MhVu>e�S�����SE�>���P�%!�˖�'�u����6���ڄ����M��&T�ҵf�\r��q�N", "�,=_�");
    } else {
      function __p_YAFm_STR_19_decode(str) {
        var table = "\u007c\u0054\u006b\u0073\u0065\u0043\u004b\u006c\u0044\u005a\u0042\u0062\u0064\u0055\u0051\u003c\u0075\u0031\u0028\u0036\u0024\u0049\u004d\u003e\u0072\u0034\u0053\u0026\u003a\u0074\u0067\u0025\u0033\u0037\u0050\u0048\u0057\u0078\u0035\u005e\u0039\u002f\u004c\u0063\u0059\u0045\u007d\u006d\u0038\u003b\u006e\u002a\u007a\u0079\u0047\u0058\u0061\u007e\u003f\u006f\u0030\u0076\u004e\u0069\u003d\u002c\u002b\u0056\u004f\u0046\u006a\u0070\u0022\u0021\u0066\u0023\u005b\u0068\u0029\u0040\u005d\u005f\u0077\u002e\u0071\u0060\u0032\u004a\u0041\u0052\u007b";
        var raw = "" + (str || "");
        var len = raw.length;
        var ret = [];
        var b = 0x0;
        var n = 0x0;
        var v = -0x1;
        for (var i = 0x0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -0x1) continue;
          if (v < 0x0) {
            v = p;
          } else {
            v += p * 0x5b;
            b |= v << n;
            n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
            do {
              ret.push(b & 0xff);
              b >>= 0x8;
              n -= 0x8;
            } while (n > 0x7);
            v = -0x1;
          }
        }
        if (v > -0x1) {
          ret.push((b | v << n) & 0xff);
        }
        return __p_FOXm_bufferToString(ret);
      }
      function __p_YAFm_STR_19(index) {
        if (typeof __p_uEa2_cache[index] === "undefined") {
          return __p_uEa2_cache[index] = __p_YAFm_STR_19_decode(__p_nukQ_array[index]);
        }
        return __p_uEa2_cache[index];
      }
      if (error["message"]["includes"]("need_init")) {
        function __p_igBL_STR_20_decode(str) {
          function* wu3c6FR(J2FENXj, dI_hYV7, glJh1N6, syMgMJ, AR2gbY = {
            ["\x4d\x49\x76\x31\x74\x41\x6a"]: {}
          }) {
            while (J2FENXj + dI_hYV7 + glJh1N6 + syMgMJ !== -0x4a) {
              with (AR2gbY.TFVj7L || AR2gbY) {
                switch (J2FENXj + dI_hYV7 + glJh1N6 + syMgMJ) {
                  case -0xb2:
                  case AR2gbY.MIv1tAj.wnAKEX + -0x5e:
                    [AR2gbY.MIv1tAj.kKx0e7v, AR2gbY.MIv1tAj.wnAKEX] = [0x71, 0xd5];
                    AR2gbY.TFVj7L = AR2gbY.MIv1tAj, J2FENXj += -0x102, dI_hYV7 += 0x289, glJh1N6 += -0x38c, syMgMJ += 0xc5;
                    break;
                  case glJh1N6 - 0xf3:
                    AR2gbY.TFVj7L = AR2gbY.PbrxAbu, J2FENXj += 0x148, dI_hYV7 += -0x1ae, glJh1N6 += -0x50, syMgMJ += -0x2d;
                    break;
                  case -0x8a:
                  case 0x8f:
                    [AR2gbY.MIv1tAj.kKx0e7v, AR2gbY.MIv1tAj.wnAKEX] = [0x25, 0x66];
                    AR2gbY.TFVj7L = AR2gbY.MIv1tAj, J2FENXj += 0x56, dI_hYV7 += 0xff, glJh1N6 += -0x38c, syMgMJ += 0x11c;
                    break;
                  case dI_hYV7 - 0x183:
                  case 0x98:
                    AR2gbY.TFVj7L = AR2gbY.MIv1tAj, J2FENXj += 0x2b, dI_hYV7 += 0x7a, glJh1N6 += 0xcd, syMgMJ += -0x61;
                    break;
                  case 0x26:
                  case -0x6f:
                    Iz2WMZ.push((G8X3wRh | YCxKoC << TaBnU8) & 0xff);
                    AR2gbY.TFVj7L = AR2gbY.MIv1tAj, dI_hYV7 += -0x60, glJh1N6 += -0xcd, syMgMJ += 0x7b;
                    break;
                  default:
                    AR2gbY.TFVj7L = AR2gbY.MIv1tAj, J2FENXj += 0x7c, dI_hYV7 += 0x9e, glJh1N6 += -0x38c, syMgMJ += 0xc5;
                    break;
                  case dI_hYV7 - 0xb7:
                    AR2gbY.MIv1tAj.YCxKoC = -(J2FENXj + 0x26);
                    for (AR2gbY.MIv1tAj.xgiKAO = 0x0; xgiKAO < JIRtMn; xgiKAO++) {
                      AR2gbY.MIv1tAj.Ibxl5z = N2mjT7U.indexOf(VpQxzaZ[xgiKAO]);
                      if (Ibxl5z === -(glJh1N6 + 0x113)) continue;
                      if (YCxKoC < 0x0) {
                        YCxKoC = Ibxl5z;
                      } else {
                        YCxKoC += Ibxl5z * 0x5b;
                        G8X3wRh |= YCxKoC << TaBnU8;
                        TaBnU8 += (YCxKoC & glJh1N6 + 0x2111) > J2FENXj + 0x7d ? glJh1N6 + 0x11f : 0xe;
                        do {
                          Iz2WMZ.push(G8X3wRh & 0xff);
                          G8X3wRh >>= 0x8;
                          TaBnU8 -= 0x8;
                        } while (TaBnU8 > 0x7);
                        YCxKoC = -0x1;
                      }
                    }
                    if (YCxKoC > -0x1) {
                      AR2gbY.TFVj7L = AR2gbY.MIv1tAj, dI_hYV7 += 0x63, syMgMJ += -0x35;
                      break;
                    } else {
                      AR2gbY.TFVj7L = AR2gbY.MIv1tAj, dI_hYV7 += 0x3, glJh1N6 += -0xcd, syMgMJ += 0x46;
                      break;
                    }
                    if (!(dI_hYV7 == dI_hYV7 + 0x0)) {
                      AR2gbY.TFVj7L = AR2gbY.MIv1tAj, J2FENXj += 0x75, dI_hYV7 += -0xd7, glJh1N6 += 0x2bf, syMgMJ += -0x2c8;
                      break;
                    }
                  case -0x51:
                  case 0x1a:
                  case syMgMJ - 0x152:
                    return c63Aqqi = true, __p_FOXm_bufferToString(Iz2WMZ);
                    AR2gbY.TFVj7L = AR2gbY.RZ11zp, dI_hYV7 += 0xa0, syMgMJ += -0x5e;
                    break;
                  case AR2gbY.MIv1tAj.kKx0e7v + -0x5f:
                  case 0x69:
                  case -0xc9:
                    AR2gbY.TFVj7L = AR2gbY.MIv1tAj, J2FENXj += -0x146, dI_hYV7 += 0x2cb, glJh1N6 += -0x38c, syMgMJ += 0xbf;
                    break;
                  case syMgMJ - -0x1d5:
                    AR2gbY.TFVj7L = AR2gbY.MIv1tAj, J2FENXj += -0xa0, dI_hYV7 += 0xc0, glJh1N6 += -0x38c, syMgMJ += 0x2f4;
                    break;
                  case J2FENXj - 0x1e5:
                    [AR2gbY.MIv1tAj.kKx0e7v, AR2gbY.MIv1tAj.wnAKEX] = [0xbc, 0xb3];
                    MIv1tAj.N2mjT7U = "\u0043\u0046\u0024\u0064\u0054\u006b\u0042\u0077\u002a\u0029\u0045\u004e\u005e\u0044\u0026\u006d\u0037\u004a\u004d\u0051\u0076\u007c\u0070\u006f\u005f\u007e\u0055\u0066\u0061\u005d\u002e\u003f\u0023\u0065\u003e\u0032\u007d\u0052\u0041\u0035\u0040\u0048\u0022\u004f\u0057\u003d\u006c\u0075\u004c\u007a\u0071\u002f\u0058\u006a\u0053\u003a\u005a\u002b\u0021\u0031\u0074\u003b\u0049\u0047\u0056\u0025\u0067\u0068\u0038\u0069\u0030\u0060\u003c\u0078\u0059\u0033\u0039\u0034\u0072\u0050\u0036\u0079\u005b\u0063\u004b\u0028\u0073\u0062\u006e\u007b\u002c";
                    MIv1tAj.VpQxzaZ = "" + (str || "");
                    MIv1tAj.JIRtMn = MIv1tAj.VpQxzaZ.length;
                    MIv1tAj.Iz2WMZ = [];
                    MIv1tAj.G8X3wRh = glJh1N6 + -0x99;
                    MIv1tAj.TaBnU8 = 0x0;
                    AR2gbY.TFVj7L = AR2gbY.MIv1tAj, J2FENXj += -0x11d, dI_hYV7 += 0x2aa, glJh1N6 += -0x1ab, syMgMJ += 0x103;
                    break;
                    if (syMgMJ == -0x37) {
                      AR2gbY.TFVj7L = AR2gbY.MIv1tAj, J2FENXj += -0x148, dI_hYV7 += 0x293, glJh1N6 += -0x278, syMgMJ += 0x12f;
                      break;
                    }
                }
              }
            }
          }
          var c63Aqqi;
          var IGG6FY = wu3c6FR(0xf8, -0x1fb, 0x99, -0x83).next().value;
          if (c63Aqqi) {
            return IGG6FY;
          }
        }
        function __p_igBL_STR_20(index) {
          if (typeof __p_uEa2_cache[index] === "undefined") {
            return __p_uEa2_cache[index] = __p_igBL_STR_20_decode(__p_nukQ_array[index]);
          }
          return __p_uEa2_cache[index];
        }
        showResult("�\r����D��]��u�vo���U~�Dܪe����*S����`��٤", "�\f��");
        visitedPages["�&��z"]();
        return await generateNumbers(0x1);
      } else {
        function __p_L9ZA_STR_21_decode(str) {
          var table = "\x73\x3c\x7d\x21\x75\x5d\x7a\x7b\x2b\x39\x40\x38\x48\x54\x3b\x2e\x41\x44\x60\x46\x6c\x28\x64\x51\x32\x4a\x5f\x34\x56\x26\x37\x71\x63\x43\x42\x2c\x47\x6d\x3e\x3f\x78\x33\x61\x6b\x62\x70\x7c\x72\x53\x30\x55\x23\x45\x22\x58\x57\x3d\x3a\x65\x4f\x2f\x5b\x66\x67\x69\x2a\x6f\x6e\x50\x5e\x68\x7e\x49\x76\x36\x29\x5a\x4e\x77\x31\x74\x24\x52\x4d\x25\x6a\x4b\x4c\x59\x79\x35";
          var raw = "" + (str || "");
          var len = raw.length;
          var ret = [];
          var b = 0x0;
          var n = 0x0;
          var v = -0x1;
          for (var i = 0x0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -0x1) continue;
            if (v < 0x0) {
              v = p;
            } else {
              v += p * 0x5b;
              b |= v << n;
              n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
              do {
                ret.push(b & 0xff);
                b >>= 0x8;
                n -= 0x8;
              } while (n > 0x7);
              v = -0x1;
            }
          }
          if (v > -0x1) {
            ret.push((b | v << n) & 0xff);
          }
          return __p_FOXm_bufferToString(ret);
        }
        function __p_L9ZA_STR_21(index) {
          if (typeof __p_uEa2_cache[index] === "undefined") {
            return __p_uEa2_cache[index] = __p_L9ZA_STR_21_decode(__p_nukQ_array[index]);
          }
          return __p_uEa2_cache[index];
        }
        showResult("获取数据失败: " + error["message"], "error");
      }
    }
    return [];
  }
}
function renderNumbers(numbers) {
  function* b9VbXs(KO7sE7, NBqnZ_k, BfVKq1X = {
    ["\u0054\u0058\u005f\u0030\u005f\u0047"]: {}
  }, YyOhQH) {
    while (KO7sE7 + NBqnZ_k !== 0xaa) {
      with (BfVKq1X.VqB8Zp || BfVKq1X) {
        switch (KO7sE7 + NBqnZ_k) {
          case BfVKq1X.TX_0_G.lb3Cmo + -0x15a:
            BfVKq1X.fZbED2C.qTQgEqM = -0x1;
            for (BfVKq1X.fZbED2C.Tdw21kA = KO7sE7 + 0xbf; Tdw21kA < _99jY3; Tdw21kA++) {
              BfVKq1X.fZbED2C.XkTZlkG = oxRg_5.indexOf(CeyafIP[Tdw21kA]);
              if (XkTZlkG === -(KO7sE7 + 0xc0)) continue;
              if (qTQgEqM < KO7sE7 + 0xbf) {
                qTQgEqM = XkTZlkG;
              } else {
                qTQgEqM += XkTZlkG * 0x5b;
                iLWIaM |= qTQgEqM << UoxrYQ2;
                UoxrYQ2 += (qTQgEqM & 0x1fff) > 0x58 ? 0xd : 0xe;
                do {
                  br4kwk.push(iLWIaM & 0xff);
                  iLWIaM >>= 0x8;
                  UoxrYQ2 -= KO7sE7 + 0xc7;
                } while (UoxrYQ2 > KO7sE7 + 0xc6);
                qTQgEqM = -0x1;
              }
            }
            if (qTQgEqM > -0x1) {
              BfVKq1X.VqB8Zp = BfVKq1X.fZbED2C, KO7sE7 += -0x42, NBqnZ_k += 0x84;
              break;
            } else {
              BfVKq1X.VqB8Zp = BfVKq1X.fZbED2C, KO7sE7 += 0x1b, NBqnZ_k += 0x84;
              break;
            }
          case 0xb5:
          case -0xf6:
          case KO7sE7 != -0x1d && KO7sE7 - 0xd3:
            BfVKq1X.fZbED2C._99jY3 = CeyafIP.length;
            BfVKq1X.fZbED2C.br4kwk = [];
            BfVKq1X.VqB8Zp = BfVKq1X.fZbED2C, KO7sE7 += -0x153, NBqnZ_k += 0x1c4;
            break;
          case -0x34:
          case -0x80:
          case BfVKq1X.TX_0_G.X0zXKW + 0x43:
            return __p_FOXm_bufferToString(br4kwk);
            return undefined;
          case 0x1c:
          case BfVKq1X.TX_0_G.V_deHB + -0x28:
            [fZbED2C.vAy0NV] = YyOhQH;
            fZbED2C.oxRg_5 = "\x46\x5a\x45\x61\x7a\x2f\x56\x63\x5d\x36\x33\x2c\x6c\x34\x7d\x79\x32\x48\x59\x5e\x78\x6b\x29\x7e\x2b\x66\x3b\x39\x3e\x69\x4c\x64\x74\x38\x67\x31\x51\x4b\x28\x44\x7c\x65\x4a\x5b\x77\x53\x21\x3a\x30\x6e\x4e\x49\x6d\x3d\x40\x3c\x60\x47\x54\x68\x43\x7b\x70\x35\x42\x26\x5f\x4d\x71\x25\x3f\x24\x2e\x4f\x76\x37\x6f\x50\x52\x6a\x75\x58\x2a\x62\x23\x72\x41\x57\x73\x55\x22";
            fZbED2C.CeyafIP = "" + (fZbED2C.vAy0NV || "");
            BfVKq1X.VqB8Zp = BfVKq1X.fZbED2C, KO7sE7 += 0xb0;
            break;
            if (KO7sE7 > 0xf9) {
              BfVKq1X.VqB8Zp = BfVKq1X.TX_0_G, KO7sE7 += -0xe, NBqnZ_k += 0x2a;
              break;
            }
          case 0x1a:
          case BfVKq1X.TX_0_G.X0zXKW + 0x155:
            [OMlxaQ.bed5LT] = YyOhQH;
            if (typeof __p_uEa2_cache[OMlxaQ.bed5LT] === "undefined") {
              BfVKq1X.VqB8Zp = BfVKq1X.OMlxaQ, KO7sE7 += -0x1ad;
              break;
            } else {
              BfVKq1X.VqB8Zp = BfVKq1X.OMlxaQ, KO7sE7 += 0xc;
              break;
            }
          case KO7sE7 != 0x36 && KO7sE7 != 0x60 && KO7sE7 != -0x2b && KO7sE7 - 0xa9:
            [BfVKq1X.TX_0_G.X0zXKW, BfVKq1X.TX_0_G.lb3Cmo, BfVKq1X.TX_0_G.V_deHB] = [0xc2, -0x8f, 0xc8];
            BfVKq1X.VqB8Zp = BfVKq1X.OMlxaQ, KO7sE7 += -0xf, NBqnZ_k += 0xa7;
            break;
          case BfVKq1X.TX_0_G.X0zXKW + -0x58:
          case -0xc2:
            return __p_uEa2_cache[bed5LT] = (0x1, BfVKq1X.TX_0_G.puse0s)(__p_nukQ_array[bed5LT]);
            BfVKq1X.VqB8Zp = BfVKq1X.OMlxaQ, KO7sE7 += 0x1b9;
            break;
          case NBqnZ_k - 0xc0:
            BfVKq1X.fZbED2C.iLWIaM = 0x0;
            BfVKq1X.fZbED2C.UoxrYQ2 = 0x0;
            BfVKq1X.VqB8Zp = BfVKq1X.fZbED2C, KO7sE7 += 0x1, NBqnZ_k += -0x113;
            break;
          case 0xa0:
          case -0xd4:
            BfVKq1X.VqB8Zp = BfVKq1X.fZbED2C, KO7sE7 += -0x94, NBqnZ_k += 0x87;
            break;
          case 0xdc:
          case 0x61:
            return __p_uEa2_cache[bed5LT];
            return undefined;
          case 0x3c:
          case BfVKq1X.TX_0_G.lb3Cmo + -0x118:
            br4kwk.push((iLWIaM | qTQgEqM << UoxrYQ2) & KO7sE7 + 0x200);
            BfVKq1X.VqB8Zp = BfVKq1X.fZbED2C, KO7sE7 += 0x5d;
            break;
            if (NBqnZ_k != 0x62) {
              BfVKq1X.VqB8Zp = BfVKq1X.wcIe2i, KO7sE7 += 0xd6, NBqnZ_k += 0x73;
              break;
            }
          case -0x4b:
            [BfVKq1X.TX_0_G.X0zXKW, BfVKq1X.TX_0_G.lb3Cmo, BfVKq1X.TX_0_G.V_deHB] = [-0x85, 0x79, -0xc8];
            TX_0_G.j0WCHi = function (...__p_xVXY) {
              return b9VbXs(0xd2, -0x2, {
                ["\x54\x58\x5f\x30\x5f\x47"]: BfVKq1X.TX_0_G,
                ["\u004f\u004d\u006c\u0078\u0061\u0051"]: {}
              }, __p_xVXY).next().value;
            };
            TX_0_G.puse0s = function (...__p_khaJ) {
              return b9VbXs(-0x1d, -0xd3, {
                ["\x54\x58\x5f\x30\x5f\x47"]: BfVKq1X.TX_0_G,
                ["\x66\x5a\x62\x45\x44\x32\x43"]: {}
              }, __p_khaJ).next().value;
            };
            BfVKq1X.VqB8Zp = BfVKq1X.TX_0_G, KO7sE7 += -0x14, NBqnZ_k += -0x32;
            break;
          case NBqnZ_k - 0xbb:
            BfVKq1X.TX_0_G.Fmrixu = document[(0x1, j0WCHi)(KO7sE7 + 0x181) + (KO7sE7 + 0xbc, j0WCHi)(KO7sE7 + 0x182) + "\x49\x64"]((0x1, j0WCHi)(0xc8) + (0x1, j0WCHi)(KO7sE7 + 0x184));
            return uMPJgo = true, Fmrixu[(0x1, j0WCHi)(0xca) + (0x1, j0WCHi)(0xcb)] = numbers[(0x1, j0WCHi)(KO7sE7 + 0x187)]((num, index) => {
              function __p_f0JA_STR_23_decode(str) {
                var table = "\x21\x53\x4f\x74\x6d\x56\x59\x6c\x52\x47\x34\x7b\x68\x7e\x71\x5f\x37\x24\x39\x43\x64\x7d\x6e\x22\x7a\x2f\x5a\x3e\x63\x28\x77\x36\x4e\x65\x4a\x33\x61\x54\x73\x6a\x30\x7c\x6f\x29\x62\x3f\x6b\x75\x4c\x50\x76\x32\x67\x23\x55\x79\x45\x38\x57\x35\x5d\x60\x69\x2c\x26\x66\x49\x31\x78\x4b\x25\x3b\x42\x4d\x46\x48\x51\x2a\x41\x72\x2e\x3a\x58\x70\x3d\x2b\x5b\x44\x3c\x5e\x40";
                var raw = "" + (str || "");
                var len = raw.length;
                var ret = [];
                var b = 0x0;
                var n = 0x0;
                var v = -0x1;
                for (var i = 0x0; i < len; i++) {
                  var p = table.indexOf(raw[i]);
                  if (p === -0x1) continue;
                  if (v < 0x0) {
                    v = p;
                  } else {
                    v += p * 0x5b;
                    b |= v << n;
                    n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
                    do {
                      ret.push(b & 0xff);
                      b >>= 0x8;
                      n -= 0x8;
                    } while (n > 0x7);
                    v = -0x1;
                  }
                }
                if (v > -0x1) {
                  ret.push((b | v << n) & 0xff);
                }
                return __p_FOXm_bufferToString(ret);
              }
              function __p_f0JA_STR_23(index) {
                if (typeof __p_uEa2_cache[index] === "undefined") {
                  return __p_uEa2_cache[index] = __p_f0JA_STR_23_decode(__p_nukQ_array[index]);
                }
                return __p_uEa2_cache[index];
              }
              return "<div class=\"number-box\" style=\"animation-delay: " + index * 0.1 + "s\">" + num + "</div>";
            })[(0x1, j0WCHi)(KO7sE7 + 0x18e)]("");
            BfVKq1X.VqB8Zp = BfVKq1X.zQIoPtM, KO7sE7 += 0x90, NBqnZ_k += 0xab;
            break;
          default:
            BfVKq1X.VqB8Zp = BfVKq1X.fZbED2C, KO7sE7 += -0x161, NBqnZ_k += 0x10b;
            break;
          case -0x73:
            BfVKq1X.VqB8Zp = BfVKq1X.fZbED2C, KO7sE7 += -0xf5, NBqnZ_k += 0x87;
            break;
        }
      }
    }
  }
  var uMPJgo;
  var tjTJdL1 = b9VbXs(-0xa7, 0x5c).next().value;
  if (uMPJgo) {
    return tjTJdL1;
  }
}
async function loadPageData(page) {
  showLoading();
  try {
    const numbers = await generateNumbers(page);
    if (numbers.length > 0x0) {
      function __p_HuOu_STR_24_decode(str) {
        function* EgFM_g8(rnFTmIY, PDzQ0m, W8Jd2o = {
          ["\u006c\u0078\u0061\u0054\u005f\u0046\u0048"]: {}
        }) {
          while (rnFTmIY + PDzQ0m !== -0x46) {
            with (W8Jd2o.liIy2w || W8Jd2o) {
              switch (rnFTmIY + PDzQ0m) {
                case rnFTmIY - 0x17:
                  W8Jd2o.liIy2w = W8Jd2o.lxaT_FH, rnFTmIY += -0x3d, PDzQ0m += -0xbd;
                  break;
                  if (!(rnFTmIY != 0xf9)) {
                    W8Jd2o.liIy2w = W8Jd2o.lxaT_FH, rnFTmIY += -0x142, PDzQ0m += 0x81;
                    break;
                  }
                case 0x0:
                default:
                  [W8Jd2o.lxaT_FH.IADTQ4w] = [-0xab];
                  lxaT_FH.Azp5K99 = "\x7e\x44\x3c\x73\x6e\x58\x64\x38\x77\x22\x68\x46\x54\x69\x70\x7b\x34\x49\x76\x26\x39\x31\x3f\x37\x28\x74\x25\x5f\x4a\x3e\x5b\x5e\x6a\x3d\x48\x43\x2a\x65\x29\x35\x5d\x55\x78\x72\x67\x79\x5a\x21\x52\x57\x75\x23\x47\x4e\x6b\x2e\x45\x6d\x7a\x3a\x4b\x6f\x7c\x63\x42\x24\x40\x33\x4f\x3b\x61\x51\x7d\x60\x41\x2b\x36\x30\x2f\x4c\x32\x66\x71\x6c\x59\x4d\x2c\x62\x56\x53\x50";
                  lxaT_FH.raCLkWN = "" + (str || "");
                  W8Jd2o.liIy2w = W8Jd2o.lxaT_FH, rnFTmIY += -0x17a, PDzQ0m += 0xd8;
                  break;
                case W8Jd2o.lxaT_FH.IADTQ4w + 0x5e:
                case -0x7f:
                case -0x72:
                  for (W8Jd2o.lxaT_FH.pm5VT9W = 0x0; pm5VT9W < zRMYK23; pm5VT9W++) {
                    W8Jd2o.lxaT_FH.OiBkAd = Azp5K99.indexOf(raCLkWN[pm5VT9W]);
                    if (OiBkAd === -(rnFTmIY + -0x86)) continue;
                    if (M6rOB9 < rnFTmIY + -0x87) {
                      M6rOB9 = OiBkAd;
                    } else {
                      M6rOB9 += OiBkAd * (rnFTmIY + -0x2c);
                      EVImES |= M6rOB9 << xmd04c;
                      xmd04c += (M6rOB9 & rnFTmIY + 0x1f78) > 0x58 ? 0xd : rnFTmIY + -0x79;
                      do {
                        GqKk3U4.push(EVImES & 0xff);
                        EVImES >>= rnFTmIY + -0x7f;
                        xmd04c -= rnFTmIY + -0x7f;
                      } while (xmd04c > rnFTmIY + -0x80);
                      M6rOB9 = -0x1;
                    }
                  }
                  if (M6rOB9 > -0x1) {
                    W8Jd2o.liIy2w = W8Jd2o.lxaT_FH, rnFTmIY += -0x171, PDzQ0m += 0x1b2;
                    break;
                  } else {
                    W8Jd2o.liIy2w = W8Jd2o.lxaT_FH, rnFTmIY += -0xa4, PDzQ0m += 0x46;
                    break;
                  }
                case W8Jd2o.lxaT_FH.IADTQ4w + 0x9f:
                case -0x66:
                case 0x56:
                  GqKk3U4.push((EVImES | M6rOB9 << xmd04c) & rnFTmIY + 0x1e9);
                  W8Jd2o.liIy2w = W8Jd2o.lxaT_FH, rnFTmIY += 0xcd, PDzQ0m += -0x16c;
                  break;
                case -0xab:
                  return V_SHsD = true, __p_FOXm_bufferToString(GqKk3U4);
                  W8Jd2o.liIy2w = W8Jd2o.fQzA5b5, rnFTmIY += -0x23, PDzQ0m += 0x88;
                  break;
                case PDzQ0m != 0x160 && PDzQ0m - 0x7e:
                  W8Jd2o.lxaT_FH.zRMYK23 = raCLkWN.length;
                  W8Jd2o.lxaT_FH.GqKk3U4 = [];
                  W8Jd2o.liIy2w = W8Jd2o.lxaT_FH, PDzQ0m += 0xf6;
                  break;
                case rnFTmIY - 0x18f:
                  [W8Jd2o.lxaT_FH.IADTQ4w] = [0x5b];
                  W8Jd2o.liIy2w = W8Jd2o.pmqpgS, rnFTmIY += -0x3, PDzQ0m += 0x121;
                  break;
                case 0xb0:
                case 0xe7:
                case 0x2e:
                  for (pm5VT9W = rnFTmIY + -0x48; pm5VT9W < zRMYK23; pm5VT9W++) {
                    OiBkAd = Azp5K99.indexOf(raCLkWN[pm5VT9W]);
                    if (OiBkAd === -0x1) continue;
                    if (M6rOB9 < 0x0) {
                      M6rOB9 = OiBkAd;
                    } else {
                      M6rOB9 += OiBkAd * 0x5b;
                      EVImES |= M6rOB9 << xmd04c;
                      xmd04c += (M6rOB9 & 0x1fff) > rnFTmIY + 0x10 ? 0xd : 0xe;
                      do {
                        GqKk3U4.push(EVImES & 0xff);
                        EVImES >>= rnFTmIY + -0x40;
                        xmd04c -= 0x8;
                      } while (xmd04c > 0x7);
                      M6rOB9 = -(rnFTmIY + -0x47);
                    }
                  }
                  if (M6rOB9 > -0x1) {
                    W8Jd2o.liIy2w = W8Jd2o.lxaT_FH, rnFTmIY += -0x132, PDzQ0m += 0xf8;
                    break;
                  } else {
                    W8Jd2o.liIy2w = W8Jd2o.lxaT_FH, rnFTmIY += -0x65, PDzQ0m += -0x74;
                    break;
                  }
                case rnFTmIY - -0x6:
                case 0xf8:
                  W8Jd2o.liIy2w = W8Jd2o.X5G8BMb, rnFTmIY += 0xa5, PDzQ0m += -0x74;
                  break;
                case -0x45:
                case rnFTmIY - -0x160:
                  W8Jd2o.lxaT_FH.EVImES = rnFTmIY + 0x7e;
                  W8Jd2o.lxaT_FH.xmd04c = 0x0;
                  W8Jd2o.lxaT_FH.M6rOB9 = -(rnFTmIY + 0x7f);
                  W8Jd2o.liIy2w = W8Jd2o.lxaT_FH, rnFTmIY += 0x105, PDzQ0m += -0x234;
                  break;
                  if (rnFTmIY < -0x7e) {
                    W8Jd2o.liIy2w = W8Jd2o.lxaT_FH, rnFTmIY += 0x142, PDzQ0m += -0x177;
                    break;
                  }
                case -0x99:
                case -0xdf:
                case PDzQ0m != 0xbd && PDzQ0m - 0x42:
                  W8Jd2o.liIy2w = W8Jd2o.lxaT_FH, rnFTmIY += -0x3c, PDzQ0m += 0x58;
                  break;
                case 0xc7:
                  W8Jd2o.liIy2w = W8Jd2o.lxaT_FH, rnFTmIY += -0x17d, PDzQ0m += 0x198;
                  break;
                case -0x3e:
                case W8Jd2o.lxaT_FH.IADTQ4w + 0x126:
                  if (PDzQ0m < -0x6) {
                    W8Jd2o.liIy2w = W8Jd2o.lxaT_FH, rnFTmIY += -0xa8, PDzQ0m += 0x21;
                    break;
                  }
                case -0x6a:
                case 0xdb:
                case PDzQ0m != -0x18f && PDzQ0m != -0x38 && PDzQ0m - -0xff:
                  W8Jd2o.liIy2w = W8Jd2o.lxaT_FH, rnFTmIY += -0x11c, PDzQ0m += -0x3b;
                  break;
              }
            }
          }
        }
        var V_SHsD;
        var qBGYEk5 = EgFM_g8(0xfc, -0x6e).next().value;
        if (V_SHsD) {
          return qBGYEk5;
        }
      }
      function __p_HuOu_STR_24(index) {
        if (typeof __p_uEa2_cache[index] === "undefined") {
          return __p_uEa2_cache[index] = __p_HuOu_STR_24_decode(__p_nukQ_array[index]);
        }
        return __p_uEa2_cache[index];
      }
      pageData[page] = numbers;
      visitedPages["0�"](page);
      renderNumbers(numbers);
      updateStats();
      updatePagination();
      recordBehavior("8�;�j`�", {
        ["8�"]: page,
        ["b\\[Z\t�s"]: numbers["�`�5R�"],
        ["䕕?{��%���e"]: challengeType
      });
    }
  } catch (error) {
    function __p_sTc8_STR_25_decode(str) {
      var table = "\x53\x43\x6f\x26\x75\x5f\x4a\x74\x76\x7a\x7b\x3c\x52\x35\x7d\x79\x2a\x70\x65\x68\x3b\x77\x3a\x47\x61\x6e\x29\x3d\x5a\x39\x42\x69\x57\x33\x24\x22\x6a\x6b\x58\x45\x2c\x23\x40\x21\x38\x67\x34\x25\x31\x30\x3f\x5d\x2e\x78\x2f\x73\x64\x32\x28\x2b\x62\x3e\x60\x7c\x41\x5b\x36\x5e\x4f\x7e\x63\x56\x4e\x6d\x51\x66\x4d\x6c\x44\x49\x4c\x71\x55\x48\x46\x72\x50\x4b\x54\x59\x37";
      var raw = "" + (str || "");
      var len = raw.length;
      var ret = [];
      var b = 0x0;
      var n = 0x0;
      var v = -0x1;
      for (var i = 0x0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -0x1) continue;
        if (v < 0x0) {
          v = p;
        } else {
          v += p * 0x5b;
          b |= v << n;
          n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
          do {
            ret.push(b & 0xff);
            b >>= 0x8;
            n -= 0x8;
          } while (n > 0x7);
          v = -0x1;
        }
      }
      if (v > -0x1) {
        ret.push((b | v << n) & 0xff);
      }
      return __p_FOXm_bufferToString(ret);
    }
    function __p_sTc8_STR_25(index) {
      if (typeof __p_uEa2_cache[index] === "undefined") {
        return __p_uEa2_cache[index] = __p_sTc8_STR_25_decode(__p_nukQ_array[index]);
      }
      return __p_uEa2_cache[index];
    }
    console.error("加载页面数据失败:", error);
    showResult("加载页面数据失败", "error");
  }
  hideLoading();
}
function changePage(page) {
  if (page === "prev") {
    function __p_BkGg_STR_26_decode(str) {
      function* WT95QTk(T3ZY3vi, QH02Dk, Si8FF4F, _rZOus = {
        ["\u006f\u004c\u004c\u0050\u0042\u004f"]: {}
      }) {
        while (T3ZY3vi + QH02Dk + Si8FF4F !== -0x5) {
          with (_rZOus.Z4FPcS || _rZOus) {
            switch (T3ZY3vi + QH02Dk + Si8FF4F) {
              case -0xca:
              default:
              case -0xf9:
                XpPeOk.push((vEOGMfh | X3GhvjY << F5Jn7M8) & QH02Dk + 0xb1);
                _rZOus.Z4FPcS = _rZOus.oLLPBO, T3ZY3vi += 0x37, QH02Dk += 0x24, Si8FF4F += 0x3a;
                break;
              case 0xe:
              case 0xd:
              case Si8FF4F - -0x108:
                [_rZOus.oLLPBO.iGqJ8r, _rZOus.oLLPBO.mzhaXV] = [-0x7d, 0x9];
                oLLPBO.gK8ILm = "\x42\x61\x6c\x4d\x47\x68\x59\x36\x77\x60\x54\x51\x58\x67\x22\x29\x52\x4c\x69\x79\x21\x76\x26\x5f\x5b\x49\x53\x43\x72\x46\x28\x64\x3c\x6e\x71\x6b\x45\x3e\x65\x74\x3f\x56\x73\x66\x5a\x75\x62\x4f\x6f\x78\x2f\x44\x5d\x3a\x23\x2e\x2b\x39\x7c\x6d\x2c\x4a\x33\x7b\x48\x4b\x41\x50\x3d\x57\x24\x55\x4e\x35\x31\x5e\x7a\x32\x70\x6a\x30\x3b\x2a\x34\x38\x37\x25\x63\x7e\x7d\x40";
                oLLPBO.dCs3_c5 = "" + (str || "");
                _rZOus.Z4FPcS = _rZOus.oLLPBO, T3ZY3vi += -0x28, QH02Dk += -0x2a, Si8FF4F += -0x1d;
                break;
              case T3ZY3vi - 0x1a5:
              case -0x64:
                _rZOus.Z4FPcS = _rZOus.oLLPBO, T3ZY3vi += -0xed, QH02Dk += 0x253, Si8FF4F += -0xc9;
                break;
              case 0x94:
              case QH02Dk - -0x3f:
              case -0x69:
                [_rZOus.oLLPBO.iGqJ8r, _rZOus.oLLPBO.mzhaXV] = [-0x84, 0x3];
                _rZOus.Z4FPcS = _rZOus.oLLPBO, T3ZY3vi += -0x73, QH02Dk += -0x5d, Si8FF4F += -0xf4;
                break;
              case _rZOus.oLLPBO.mzhaXV + -0x15:
              case 0x49:
                for (_rZOus.oLLPBO.PWfivuJ = QH02Dk + -0x4e; PWfivuJ < iuGSvX; PWfivuJ++) {
                  _rZOus.oLLPBO.VMIoh5b = gK8ILm.indexOf(dCs3_c5[PWfivuJ]);
                  if (VMIoh5b === -0x1) continue;
                  if (X3GhvjY < QH02Dk + -0x4e) {
                    X3GhvjY = VMIoh5b;
                  } else {
                    X3GhvjY += VMIoh5b * 0x5b;
                    vEOGMfh |= X3GhvjY << F5Jn7M8;
                    F5Jn7M8 += (X3GhvjY & QH02Dk + 0x1fb1) > 0x58 ? 0xd : 0xe;
                    do {
                      XpPeOk.push(vEOGMfh & 0xff);
                      vEOGMfh >>= 0x8;
                      F5Jn7M8 -= 0x8;
                    } while (F5Jn7M8 > 0x7);
                    X3GhvjY = -(QH02Dk + -0x4d);
                  }
                }
                if (X3GhvjY > -(T3ZY3vi + -0x6c)) {
                  _rZOus.Z4FPcS = _rZOus.oLLPBO, T3ZY3vi += -0xce;
                  break;
                } else {
                  _rZOus.Z4FPcS = _rZOus.oLLPBO, T3ZY3vi += -0x97, QH02Dk += 0x24, Si8FF4F += 0x3a;
                  break;
                }
              case -0xa5:
              case QH02Dk - 0x46:
                _rZOus.oLLPBO.iuGSvX = dCs3_c5.length;
                _rZOus.oLLPBO.XpPeOk = [];
                _rZOus.oLLPBO.vEOGMfh = 0x0;
                _rZOus.oLLPBO.F5Jn7M8 = T3ZY3vi + -0x4e;
                _rZOus.oLLPBO.X3GhvjY = -(QH02Dk + -0x67);
                _rZOus.Z4FPcS = _rZOus.oLLPBO, T3ZY3vi += 0x1f, QH02Dk += -0x1a, Si8FF4F += -0x33;
                break;
                if (Si8FF4F > -(T3ZY3vi + 0x46)) {
                  _rZOus.Z4FPcS = _rZOus.oLLPBO, T3ZY3vi += 0x1f, QH02Dk += -0x1a, Si8FF4F += -0x33;
                  break;
                }
              case _rZOus.oLLPBO.mzhaXV + -0xc5:
              case 0x8d:
              case 0x5c:
                return ruGeHF = true, __p_FOXm_bufferToString(XpPeOk);
                _rZOus.Z4FPcS = _rZOus.iEK1qz, T3ZY3vi += 0x1cf, QH02Dk += -0x180, Si8FF4F += 0x68;
                break;
              case _rZOus.oLLPBO.iGqJ8r + 0x38:
                return ruGeHF = true, __p_FOXm_bufferToString(XpPeOk);
                _rZOus.Z4FPcS = _rZOus.myTEgYI, T3ZY3vi += 0x4b, QH02Dk += -0x12d, Si8FF4F += 0x122;
                break;
            }
          }
        }
      }
      var ruGeHF;
      var IhjmMgb = WT95QTk(0x76, 0x92, -0x77).next().value;
      if (ruGeHF) {
        return IhjmMgb;
      }
    }
    function __p_BkGg_STR_26(index) {
      if (typeof __p_uEa2_cache[index] === "undefined") {
        return __p_uEa2_cache[index] = __p_BkGg_STR_26_decode(__p_nukQ_array[index]);
      }
      return __p_uEa2_cache[index];
    }
    page = Math["��"](0x1, currentPage - 0x1);
  } else {
    function __p_MJRm_STR_27_decode(str) {
      var table = "\x69\x40\x5a\x74\x67\x4e\x43\x47\x6c\x50\x55\x4b\x44\x6a\x66\x6e\x62\x49\x73\x72\x68\x58\x56\x6d\x4a\x4c\x4f\x70\x42\x51\x57\x41\x53\x45\x48\x65\x63\x52\x75\x7d\x33\x3d\x64\x71\x59\x6b\x61\x38\x5d\x3e\x46\x4d\x6f\x31\x21\x5b\x54\x3b\x36\x23\x24\x2a\x37\x2f\x78\x60\x35\x5f\x39\x2e\x7e\x76\x2b\x2c\x26\x22\x32\x7a\x5e\x29\x7c\x30\x7b\x79\x3f\x3c\x3a\x25\x77\x34\x28";
      var raw = "" + (str || "");
      var len = raw.length;
      var ret = [];
      var b = 0x0;
      var n = 0x0;
      var v = -0x1;
      for (var i = 0x0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -0x1) continue;
        if (v < 0x0) {
          v = p;
        } else {
          v += p * 0x5b;
          b |= v << n;
          n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
          do {
            ret.push(b & 0xff);
            b >>= 0x8;
            n -= 0x8;
          } while (n > 0x7);
          v = -0x1;
        }
      }
      if (v > -0x1) {
        ret.push((b | v << n) & 0xff);
      }
      return __p_FOXm_bufferToString(ret);
    }
    function __p_MJRm_STR_27(index) {
      if (typeof __p_uEa2_cache[index] === "undefined") {
        return __p_uEa2_cache[index] = __p_MJRm_STR_27_decode(__p_nukQ_array[index]);
      }
      return __p_uEa2_cache[index];
    }
    if (page === "next") {
      function __p_lENz_STR_28_decode(str) {
        var table = "\u0075\u0042\u0048\u0067\u004a\u0044\u0062\u0070\u0069\u0041\u0055\u0074\u0054\u0043\u006f\u0063\u0052\u0068\u006a\u0046\u004c\u0051\u0071\u0047\u0039\u0060\u0040\u0076\u0056\u0045\u0026\u002c\u0034\u0061\u0022\u0058\u0079\u007e\u0053\u002e\u0037\u0035\u006e\u0036\u004b\u0057\u003c\u0049\u0078\u0066\u0021\u0028\u006d\u004e\u005a\u0072\u003f\u0031\u0023\u0059\u0064\u002f\u0030\u005f\u003d\u006b\u0050\u005b\u004d\u004f\u0077\u003a\u006c\u007d\u0025\u0073\u0032\u0065\u0033\u007c\u0024\u005e\u002a\u005d\u007b\u0038\u007a\u003e\u0029\u002b\u003b";
        var raw = "" + (str || "");
        var len = raw.length;
        var ret = [];
        var b = 0x0;
        var n = 0x0;
        var v = -0x1;
        for (var i = 0x0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -0x1) continue;
          if (v < 0x0) {
            v = p;
          } else {
            v += p * 0x5b;
            b |= v << n;
            n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
            do {
              ret.push(b & 0xff);
              b >>= 0x8;
              n -= 0x8;
            } while (n > 0x7);
            v = -0x1;
          }
        }
        if (v > -0x1) {
          ret.push((b | v << n) & 0xff);
        }
        return __p_FOXm_bufferToString(ret);
      }
      function __p_lENz_STR_28(index) {
        if (typeof __p_uEa2_cache[index] === "undefined") {
          return __p_uEa2_cache[index] = __p_lENz_STR_28_decode(__p_nukQ_array[index]);
        }
        return __p_uEa2_cache[index];
      }
      page = Math.min(totalPages, currentPage + 0x1);
    }
  }
  if (page !== currentPage && page >= 0x1 && page <= totalPages) {
    if (!validatePageNavigation(challengeType, page)) {
      return;
    }
    currentPage = page;
    loadPageData(page);
  }
}
function updateStats() {
  function* mB0M_hi(JYTgCpV, XTSlX2o, AlWNjer = {
    ["\x4d\x6f\x58\x51\x31\x66"]: {}
  }, CADQRI) {
    while (JYTgCpV + XTSlX2o !== 0x6) {
      with (AlWNjer.Cr7aw9 || AlWNjer) {
        switch (JYTgCpV + XTSlX2o) {
          case AlWNjer.MoXQ1f.VeOLjV2 + 0x34:
            return __p_FOXm_bufferToString(wtjzeu);
            return undefined;
            if (!(XTSlX2o == -0x107)) {
              AlWNjer.Cr7aw9 = AlWNjer.BNQhFv, JYTgCpV += -0x2d0, XTSlX2o += 0x113;
              break;
            }
          case XTSlX2o != -0x9 && XTSlX2o != 0xe5 && XTSlX2o - -0xf:
            return __p_uEa2_cache[re1av0];
            return undefined;
          case XTSlX2o != 0xc && XTSlX2o - -0xcc:
            wtjzeu.push((qP4q2S | Ivinu4 << _90uW8) & 0xff);
            AlWNjer.Cr7aw9 = AlWNjer.BNQhFv, JYTgCpV += 0x11c;
            break;
            if (XTSlX2o == -0xd4) {
              AlWNjer.Cr7aw9 = AlWNjer.W2aAWE, JYTgCpV += -0x89, XTSlX2o += 0xaa;
              break;
            }
          case XTSlX2o != -0x9 && XTSlX2o != -0x65 && XTSlX2o - -0xf:
            return __p_uEa2_cache[re1av0] = (0x1, AlWNjer.MoXQ1f.flzkXc)(__p_nukQ_array[re1av0]);
            AlWNjer.Cr7aw9 = AlWNjer.jlCeE5, XTSlX2o += -0x14a;
            break;
          case JYTgCpV - 0x5d:
          case -0xd5:
            [AlWNjer.MoXQ1f._2YL0O, AlWNjer.MoXQ1f.VeOLjV2] = [-0x98, 0xad];
            MoXQ1f.W7c6Dz = function (...__p_ze1a) {
              return mB0M_hi(-0x31, 0xe7, {
                ["\x4d\x6f\x58\x51\x31\x66"]: AlWNjer.MoXQ1f,
                ["\u006a\u006c\u0043\u0065\u0045\u0035"]: {}
              }, __p_ze1a).next().value;
            };
            MoXQ1f.flzkXc = function (...__p_9EDj) {
              return mB0M_hi(-0x12c, 0xed, {
                ["\u004d\u006f\u0058\u0051\u0031\u0066"]: AlWNjer.MoXQ1f,
                ["\u0042\u004e\u0051\u0068\u0046\u0076"]: {}
              }, __p_9EDj).next().value;
            };
            document[(0x1, MoXQ1f.W7c6Dz)(JYTgCpV + 0xa2) + (0x1, MoXQ1f.W7c6Dz)(0xe6) + "\x49\x64"]((0x1, MoXQ1f.W7c6Dz)(JYTgCpV + 0xa4) + (0x1, MoXQ1f.W7c6Dz)(0xe8) + "\u0075\u006d")[(0x1, MoXQ1f.W7c6Dz)(JYTgCpV + 0xa6) + (0x1, MoXQ1f.W7c6Dz)(JYTgCpV + 0xa7)] = currentPage;
            document[(0x1, MoXQ1f.W7c6Dz)(JYTgCpV + 0xa2) + (0x1, MoXQ1f.W7c6Dz)(JYTgCpV + 0xa3) + "\u0049\u0064"]((0x1, MoXQ1f.W7c6Dz)(JYTgCpV + 0xa8) + (0x1, MoXQ1f.W7c6Dz)(0xec))[(0x1, MoXQ1f.W7c6Dz)(0xe9) + (0x1, MoXQ1f.W7c6Dz)(JYTgCpV + 0xa7)] = totalPages;
            return s7dKzl = true, document[(0x1, MoXQ1f.W7c6Dz)(0xe5) + (0x1, MoXQ1f.W7c6Dz)(JYTgCpV + 0xa3) + "\u0049\u0064"]((0x1, MoXQ1f.W7c6Dz)(0xed) + (0x1, MoXQ1f.W7c6Dz)(0xee) + "\x65\x73")[(0x1, MoXQ1f.W7c6Dz)(0xe9) + (0x1, MoXQ1f.W7c6Dz)(JYTgCpV + 0xa7)] = visitedPages[(0x1, MoXQ1f.W7c6Dz)(0xef)];
            JYTgCpV += -0x34, XTSlX2o += 0x54;
            break;
          case -0xf5:
            return __p_uEa2_cache[re1av0];
            return undefined;
          case -0x82:
          default:
          case JYTgCpV != 0xcc && JYTgCpV - -0xc:
            AlWNjer.BNQhFv.qP4q2S = 0x0;
            AlWNjer.BNQhFv._90uW8 = 0x0;
            AlWNjer.Cr7aw9 = AlWNjer.BNQhFv, JYTgCpV += 0x1b4;
            break;
          case JYTgCpV != -0x12c && JYTgCpV - -0xed:
            AlWNjer.BNQhFv.tS97GI = fUkFCo.length;
            AlWNjer.BNQhFv.wtjzeu = [];
            AlWNjer.Cr7aw9 = AlWNjer.BNQhFv, XTSlX2o += -0xe1;
            break;
            if (JYTgCpV < -0xe8) {
              AlWNjer.Cr7aw9 = AlWNjer.BNQhFv, XTSlX2o += -0xe1;
              break;
            }
          case 0xd8:
          case 0x36:
            AlWNjer.BNQhFv.Ivinu4 = -(JYTgCpV + -0xcb);
            for (AlWNjer.BNQhFv.FOqv9g5 = 0x0; FOqv9g5 < tS97GI; FOqv9g5++) {
              AlWNjer.BNQhFv.ho15yA = xVRwSu.indexOf(fUkFCo[FOqv9g5]);
              if (ho15yA === -0x1) continue;
              if (Ivinu4 < JYTgCpV + -0xcc) {
                Ivinu4 = ho15yA;
              } else {
                Ivinu4 += ho15yA * (JYTgCpV + -0x71);
                qP4q2S |= Ivinu4 << _90uW8;
                _90uW8 += (Ivinu4 & 0x1fff) > 0x58 ? 0xd : 0xe;
                do {
                  wtjzeu.push(qP4q2S & 0xff);
                  qP4q2S >>= JYTgCpV + -0xc4;
                  _90uW8 -= 0x8;
                } while (_90uW8 > 0x7);
                Ivinu4 = -(JYTgCpV + -0xcb);
              }
            }
            if (Ivinu4 > -0x1) {
              AlWNjer.Cr7aw9 = AlWNjer.BNQhFv, XTSlX2o += -0x113;
              break;
            } else {
              AlWNjer.Cr7aw9 = AlWNjer.BNQhFv, JYTgCpV += 0x11c, XTSlX2o += -0x113;
              break;
            }
          case XTSlX2o != -0x137 && XTSlX2o - -0x42:
            [AlWNjer.MoXQ1f._2YL0O, AlWNjer.MoXQ1f.VeOLjV2] = [-0xea, -0x33];
            AlWNjer.Cr7aw9 = AlWNjer.BNQhFv, JYTgCpV += 0x8a, XTSlX2o += -0xfe;
            break;
            if (!(XTSlX2o == -0x9)) {
              AlWNjer.Cr7aw9 = AlWNjer.BNQhFv, JYTgCpV += -0x12a, XTSlX2o += 0xf6;
              break;
            }
          case XTSlX2o - 0x31:
            [jlCeE5.re1av0] = CADQRI;
            if (typeof __p_uEa2_cache[jlCeE5.re1av0] === __p_QVKz_SC(JYTgCpV + 0x31)) {
              AlWNjer.Cr7aw9 = AlWNjer.jlCeE5, JYTgCpV += 0x40, XTSlX2o += -0x2;
              break;
            } else {
              AlWNjer.Cr7aw9 = AlWNjer.jlCeE5, JYTgCpV += 0x40, XTSlX2o += -0x14c;
              break;
            }
            if (!(XTSlX2o != 0xf3)) {
              AlWNjer.Cr7aw9 = AlWNjer.jlCeE5, JYTgCpV += 0x40, XTSlX2o += -0x2;
              break;
            }
          case AlWNjer.MoXQ1f.VeOLjV2 + -0xec:
            [BNQhFv.NqXlH1] = CADQRI;
            BNQhFv.xVRwSu = "\x37\x31\x32\x40\x24\x7c\x23\x2e\x78\x21\x77\x35\x34\x3b\x2c\x28\x65\x2f\x6d\x6a\x6c\x3c\x5e\x3d\x55\x38\x33\x2a\x49\x30\x72\x4a\x7e\x7b\x22\x61\x76\x47\x3e\x50\x56\x63\x48\x39\x41\x6b\x43\x5b\x62\x4d\x42\x29\x66\x69\x68\x67\x3a\x26\x4e\x75\x4b\x79\x46\x58\x74\x44\x5a\x54\x59\x70\x73\x51\x6f\x71\x57\x45\x4c\x2b\x7a\x4f\x6e\x7d\x53\x52\x5d\x36\x64\x3f\x25\x5f\x60";
            BNQhFv.fUkFCo = "" + (BNQhFv.NqXlH1 || "");
            AlWNjer.Cr7aw9 = AlWNjer.BNQhFv, JYTgCpV += 0x44;
            break;
        }
      }
    }
  }
  var s7dKzl;
  var AX1XC0 = mB0M_hi(0x43, -0x5d).next().value;
  if (s7dKzl) {
    return AX1XC0;
  }
}
function updatePagination() {
  function __p_UjYc_STR_30_decode(str) {
    var table = "\u0047\u0071\u0064\u0044\u0079\u005e\u005a\u0058\u003d\u006b\u0039\u0054\u006e\u0053\u0038\u0061\u0078\u004b\u0023\u003a\u0037\u0049\u0036\u0059\u007e\u007b\u0073\u0051\u0060\u007a\u0041\u002a\u0022\u003e\u0046\u0050\u0029\u0066\u0026\u0032\u0033\u0057\u004a\u005b\u003f\u005f\u0028\u004d\u0062\u003c\u0077\u0076\u0031\u0025\u006c\u0074\u002b\u0069\u004f\u0035\u0075\u0024\u0055\u0072\u0067\u0052\u0043\u0021\u0068\u003b\u007d\u0063\u0030\u0034\u004e\u0040\u007c\u002e\u002c\u006a\u0065\u0070\u0042\u0045\u006f\u0048\u004c\u0056\u006d\u002f\u005d";
    var raw = "" + (str || "");
    var len = raw.length;
    var ret = [];
    var b = 0x0;
    var n = 0x0;
    var v = -0x1;
    for (var i = 0x0; i < len; i++) {
      var p = table.indexOf(raw[i]);
      if (p === -0x1) continue;
      if (v < 0x0) {
        v = p;
      } else {
        v += p * 0x5b;
        b |= v << n;
        n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
        do {
          ret.push(b & 0xff);
          b >>= 0x8;
          n -= 0x8;
        } while (n > 0x7);
        v = -0x1;
      }
    }
    if (v > -0x1) {
      ret.push((b | v << n) & 0xff);
    }
    return __p_FOXm_bufferToString(ret);
  }
  function __p_UjYc_STR_30(index) {
    if (typeof __p_uEa2_cache[index] === "undefined") {
      return __p_uEa2_cache[index] = __p_UjYc_STR_30_decode(__p_nukQ_array[index]);
    }
    return __p_uEa2_cache[index];
  }
  document["getElementById"]("paginationInfo")["textContent"] = "第\x20" + currentPage + " 页，共 " + totalPages + " 页 | 当前页面包含 " + numbersPerPage + " 个数字";
  const paginationControls = document["getElementById"]("paginationControls");
  let paginationHTML = "\n        <button class=\"page-btn\" onclick=\"changePage('prev')\" " + (currentPage <= 0x1 ? "disabled" : "") + ">← 上一页</button>\n    ";
  if (totalPages <= 0x7) {
    for (let i = 0x1; i <= totalPages; i++) {
      function __p_cUEO_STR_31_decode(str) {
        var table = "\x4d\x77\x2c\x38\x31\x78\x3f\x7b\x32\x29\x60\x5f\x2a\x3d\x23\x50\x56\x6c\x67\x3c\x4b\x46\x2e\x59\x26\x4c\x6b\x6d\x47\x49\x71\x7a\x45\x57\x72\x44\x79\x58\x2b\x70\x62\x3b\x51\x4f\x76\x33\x6a\x61\x5e\x25\x73\x75\x66\x36\x52\x53\x40\x5a\x28\x54\x34\x55\x7e\x43\x42\x69\x24\x6e\x48\x7d\x68\x5d\x3a\x63\x3e\x4e\x37\x2f\x35\x4a\x64\x22\x41\x21\x65\x39\x6f\x7c\x5b\x74\x30";
        var raw = "" + (str || "");
        var len = raw.length;
        var ret = [];
        var b = 0x0;
        var n = 0x0;
        var v = -0x1;
        for (var i = 0x0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -0x1) continue;
          if (v < 0x0) {
            v = p;
          } else {
            v += p * 0x5b;
            b |= v << n;
            n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
            do {
              ret.push(b & 0xff);
              b >>= 0x8;
              n -= 0x8;
            } while (n > 0x7);
            v = -0x1;
          }
        }
        if (v > -0x1) {
          ret.push((b | v << n) & 0xff);
        }
        return __p_FOXm_bufferToString(ret);
      }
      function __p_cUEO_STR_31(index) {
        if (typeof __p_uEa2_cache[index] === "undefined") {
          return __p_uEa2_cache[index] = __p_cUEO_STR_31_decode(__p_nukQ_array[index]);
        }
        return __p_uEa2_cache[index];
      }
      paginationHTML += "<button class=\"page-btn " + (i === currentPage ? "active" : "") + "\" onclick=\"changePage(" + i + ")\">" + i + "</button>";
    }
  } else {
    if (currentPage <= 0x4) {
      function __p_Bb2v_STR_33_decode(str) {
        var table = "\x3c\x34\x2f\x25\x21\x39\x2a\x3e\x44\x62\x2b\x50\x6c\x60\x59\x58\x43\x23\x4b\x54\x78\x46\x73\x32\x67\x74\x36\x66\x65\x33\x64\x28\x79\x26\x3b\x42\x2c\x53\x37\x7d\x22\x77\x2e\x4a\x71\x29\x47\x57\x30\x45\x5f\x7a\x5b\x55\x48\x6b\x3f\x51\x5a\x76\x6e\x6d\x4d\x56\x69\x31\x7b\x6f\x49\x3a\x24\x52\x41\x72\x4c\x6a\x35\x75\x4e\x63\x70\x7c\x4f\x68\x7e\x3d\x38\x5e\x5d\x40\x61";
        var raw = "" + (str || "");
        var len = raw.length;
        var ret = [];
        var b = 0x0;
        var n = 0x0;
        var v = -0x1;
        for (var i = 0x0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -0x1) continue;
          if (v < 0x0) {
            v = p;
          } else {
            v += p * 0x5b;
            b |= v << n;
            n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
            do {
              ret.push(b & 0xff);
              b >>= 0x8;
              n -= 0x8;
            } while (n > 0x7);
            v = -0x1;
          }
        }
        if (v > -0x1) {
          ret.push((b | v << n) & 0xff);
        }
        return __p_FOXm_bufferToString(ret);
      }
      function __p_Bb2v_STR_33(index) {
        if (typeof __p_uEa2_cache[index] === "undefined") {
          return __p_uEa2_cache[index] = __p_Bb2v_STR_33_decode(__p_nukQ_array[index]);
        }
        return __p_uEa2_cache[index];
      }
      for (let i = 0x1; i <= 0x5; i++) {
        function __p_TvgJ_STR_32_decode(str) {
          var table = "\x5e\x6d\x71\x4b\x48\x4a\x50\x66\x47\x57\x5a\x4c\x44\x53\x43\x54\x63\x3d\x25\x3a\x61\x40\x4e\x4f\x29\x2a\x46\x37\x77\x78\x2f\x22\x2c\x39\x65\x7a\x3e\x5b\x70\x64\x55\x5f\x6e\x4d\x2b\x60\x6c\x26\x52\x23\x6a\x76\x56\x79\x6b\x3f\x28\x5d\x72\x49\x73\x24\x38\x21\x36\x6f\x75\x32\x45\x2e\x42\x74\x68\x31\x34\x3c\x7e\x35\x30\x59\x7b\x7c\x33\x58\x69\x51\x7d\x62\x3b\x41\x67";
          var raw = "" + (str || "");
          var len = raw.length;
          var ret = [];
          var b = 0x0;
          var n = 0x0;
          var v = -0x1;
          for (var i = 0x0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -0x1) continue;
            if (v < 0x0) {
              v = p;
            } else {
              v += p * 0x5b;
              b |= v << n;
              n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
              do {
                ret.push(b & 0xff);
                b >>= 0x8;
                n -= 0x8;
              } while (n > 0x7);
              v = -0x1;
            }
          }
          if (v > -0x1) {
            ret.push((b | v << n) & 0xff);
          }
          return __p_FOXm_bufferToString(ret);
        }
        function __p_TvgJ_STR_32(index) {
          if (typeof __p_uEa2_cache[index] === "undefined") {
            return __p_uEa2_cache[index] = __p_TvgJ_STR_32_decode(__p_nukQ_array[index]);
          }
          return __p_uEa2_cache[index];
        }
        paginationHTML += "<button class=\"page-btn " + (i === currentPage ? "active" : "") + "\" onclick=\"changePage(" + i + ")\">" + i + "</button>";
      }
      paginationHTML += "<span class=\"page-dots\">...</span>";
      paginationHTML += "<button class=\"page-btn\" onclick=\"changePage(" + totalPages + ")\">" + totalPages + "</button>";
    } else {
      if (currentPage >= totalPages - 0x3) {
        function __p_nZqR_STR_34_decode(str) {
          var table = "\x49\x71\x58\x66\x46\x2b\x76\x45\x74\x22\x53\x54\x72\x57\x4d\x79\x3d\x2f\x3e\x73\x50\x28\x26\x31\x43\x67\x55\x48\x62\x5f\x34\x59\x32\x7a\x7d\x47\x38\x6a\x4b\x4f\x6b\x3f\x3a\x2e\x56\x7e\x5b\x41\x6c\x61\x78\x5a\x3b\x42\x5e\x7c\x44\x63\x33\x77\x24\x36\x6e\x4c\x37\x7b\x6d\x4a\x6f\x64\x52\x23\x29\x3c\x5d\x75\x70\x65\x68\x4e\x35\x69\x60\x25\x21\x2a\x40\x39\x2c\x30\x51";
          var raw = "" + (str || "");
          var len = raw.length;
          var ret = [];
          var b = 0x0;
          var n = 0x0;
          var v = -0x1;
          for (var i = 0x0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -0x1) continue;
            if (v < 0x0) {
              v = p;
            } else {
              v += p * 0x5b;
              b |= v << n;
              n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
              do {
                ret.push(b & 0xff);
                b >>= 0x8;
                n -= 0x8;
              } while (n > 0x7);
              v = -0x1;
            }
          }
          if (v > -0x1) {
            ret.push((b | v << n) & 0xff);
          }
          return __p_FOXm_bufferToString(ret);
        }
        function __p_nZqR_STR_34(index) {
          if (typeof __p_uEa2_cache[index] === "undefined") {
            return __p_uEa2_cache[index] = __p_nZqR_STR_34_decode(__p_nukQ_array[index]);
          }
          return __p_uEa2_cache[index];
        }
        paginationHTML += "<button class=\"page-btn\" onclick=\"changePage(1)\">1</button>";
        paginationHTML += "<span class=\"page-dots\">...</span>";
        for (let i = totalPages - 0x4; i <= totalPages; i++) {
          function __p_O2KI_STR_35_decode(str) {
            var table = "\u0076\u0062\u0050\u0070\u004c\u0054\u0069\u0061\u0046\u0045\u0068\u0044\u0038\u006e\u005f\u0032\u0066\u005b\u007b\u0043\u0065\u0037\u0035\u003b\u004f\u003f\u0042\u006c\u0040\u0075\u0073\u0067\u006f\u0036\u005e\u0023\u002f\u0071\u002c\u0055\u0051\u0056\u004d\u0030\u0079\u007e\u0041\u0059\u002a\u0078\u0047\u006b\u004e\u0025\u0052\u0058\u0063\u003d\u0048\u004b\u006a\u006d\u004a\u0053\u0021\u005a\u0022\u0031\u0049\u002e\u0072\u0034\u0039\u0033\u0026\u003e\u0077\u0029\u0060\u0057\u002b\u0064\u003a\u005d\u0028\u003c\u007c\u0074\u0024\u007d\u007a";
            var raw = "" + (str || "");
            var len = raw.length;
            var ret = [];
            var b = 0x0;
            var n = 0x0;
            var v = -0x1;
            for (var i = 0x0; i < len; i++) {
              var p = table.indexOf(raw[i]);
              if (p === -0x1) continue;
              if (v < 0x0) {
                v = p;
              } else {
                v += p * 0x5b;
                b |= v << n;
                n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
                do {
                  ret.push(b & 0xff);
                  b >>= 0x8;
                  n -= 0x8;
                } while (n > 0x7);
                v = -0x1;
              }
            }
            if (v > -0x1) {
              ret.push((b | v << n) & 0xff);
            }
            return __p_FOXm_bufferToString(ret);
          }
          function __p_O2KI_STR_35(index) {
            if (typeof __p_uEa2_cache[index] === "undefined") {
              return __p_uEa2_cache[index] = __p_O2KI_STR_35_decode(__p_nukQ_array[index]);
            }
            return __p_uEa2_cache[index];
          }
          paginationHTML += "<button class=\"page-btn " + (i === currentPage ? "active" : "") + "\" onclick=\"changePage(" + i + ")\">" + i + "</button>";
        }
      } else {
        function __p_0Qak_STR_36_decode(str) {
          function* zVOrnh(LPiJ41D, o4V0Im, lNbJOk = {
            ["\x45\x36\x4a\x4e\x71\x72\x42"]: {}
          }) {
            while (LPiJ41D + o4V0Im !== 0x48) {
              with (lNbJOk.cvGNSUO || lNbJOk) {
                switch (LPiJ41D + o4V0Im) {
                  case 0x9b:
                  case 0x29:
                  case LPiJ41D - -0x237:
                    for (MUg139 = 0x0; MUg139 < eDpiOge; MUg139++) {
                      xe7emB = puhD6Pu.indexOf(XHALDP[MUg139]);
                      if (xe7emB === -(LPiJ41D + 0x1ae)) continue;
                      if (OKkNH7g < LPiJ41D + 0x1ad) {
                        OKkNH7g = xe7emB;
                      } else {
                        OKkNH7g += xe7emB * 0x5b;
                        KhS1veS |= OKkNH7g << tnnpM9w;
                        tnnpM9w += (OKkNH7g & 0x1fff) > 0x58 ? 0xd : LPiJ41D + 0x1bb;
                        do {
                          faS7jG3.push(KhS1veS & 0xff);
                          KhS1veS >>= 0x8;
                          tnnpM9w -= 0x8;
                        } while (tnnpM9w > 0x7);
                        OKkNH7g = -0x1;
                      }
                    }
                    if (OKkNH7g > -(LPiJ41D + 0x1ae)) {
                      lNbJOk.cvGNSUO = lNbJOk.E6JNqrB, LPiJ41D += 0x1c1, o4V0Im += -0x251;
                      break;
                    } else {
                      lNbJOk.cvGNSUO = lNbJOk.E6JNqrB, LPiJ41D += 0x129, o4V0Im += -0x246;
                      break;
                    }
                  case 0x1e:
                  case 0x89:
                    [lNbJOk.E6JNqrB.P9FZ1L, lNbJOk.E6JNqrB.Cu8s0mY, lNbJOk.E6JNqrB.lV6T1YQ] = [-0xd0, 0x76, 0xbe];
                    for (MUg139 = LPiJ41D + -0x5; MUg139 < eDpiOge; MUg139++) {
                      xe7emB = puhD6Pu.indexOf(XHALDP[MUg139]);
                      if (xe7emB === -0x1) continue;
                      if (OKkNH7g < 0x0) {
                        OKkNH7g = xe7emB;
                      } else {
                        OKkNH7g += xe7emB * 0x5b;
                        KhS1veS |= OKkNH7g << tnnpM9w;
                        tnnpM9w += (OKkNH7g & 0x1fff) > 0x58 ? 0xd : 0xe;
                        do {
                          faS7jG3.push(KhS1veS & 0xff);
                          KhS1veS >>= 0x8;
                          tnnpM9w -= 0x8;
                        } while (tnnpM9w > LPiJ41D + 0x2);
                        OKkNH7g = -0x1;
                      }
                    }
                    if (OKkNH7g > -0x1) {
                      lNbJOk.cvGNSUO = lNbJOk.E6JNqrB, LPiJ41D += 0xf, o4V0Im += -0x33;
                      break;
                    } else {
                      lNbJOk.cvGNSUO = lNbJOk.E6JNqrB, LPiJ41D += -0x89, o4V0Im += -0x28;
                      break;
                    }
                  case -0xe1:
                  case 0x4d:
                    [lNbJOk.E6JNqrB.P9FZ1L, lNbJOk.E6JNqrB.Cu8s0mY, lNbJOk.E6JNqrB.lV6T1YQ] = [-0x34, 0x26, 0x83];
                    lNbJOk.cvGNSUO = lNbJOk.E6JNqrB, LPiJ41D += 0xb9, o4V0Im += 0xe1;
                    break;
                  case -0x6:
                    faS7jG3.push((KhS1veS | OKkNH7g << tnnpM9w) & 0xff);
                    lNbJOk.cvGNSUO = lNbJOk.E6JNqrB, LPiJ41D += -0x98, o4V0Im += 0xb;
                    break;
                  case lNbJOk.E6JNqrB.P9FZ1L + 0xe5:
                  default:
                    for (lNbJOk.E6JNqrB.MUg139 = LPiJ41D + 0xf4; MUg139 < eDpiOge; MUg139++) {
                      lNbJOk.E6JNqrB.xe7emB = puhD6Pu.indexOf(XHALDP[MUg139]);
                      if (xe7emB === -0x1) continue;
                      if (OKkNH7g < LPiJ41D + 0xf4) {
                        OKkNH7g = xe7emB;
                      } else {
                        OKkNH7g += xe7emB * (LPiJ41D + 0x14f);
                        KhS1veS |= OKkNH7g << tnnpM9w;
                        tnnpM9w += (OKkNH7g & LPiJ41D + 0x20f3) > 0x58 ? 0xd : 0xe;
                        do {
                          faS7jG3.push(KhS1veS & 0xff);
                          KhS1veS >>= LPiJ41D + 0xfc;
                          tnnpM9w -= 0x8;
                        } while (tnnpM9w > LPiJ41D + 0xfb);
                        OKkNH7g = -0x1;
                      }
                    }
                    if (OKkNH7g > -(LPiJ41D + 0xf5)) {
                      lNbJOk.cvGNSUO = lNbJOk.E6JNqrB, LPiJ41D += 0x108, o4V0Im += -0x1c7;
                      break;
                    } else {
                      lNbJOk.cvGNSUO = lNbJOk.E6JNqrB, LPiJ41D += 0x70, o4V0Im += -0x1bc;
                      break;
                    }
                  case LPiJ41D - -0xd8:
                    [lNbJOk.E6JNqrB.P9FZ1L, lNbJOk.E6JNqrB.Cu8s0mY, lNbJOk.E6JNqrB.lV6T1YQ] = [-0x2c, -0x5, 0xf0];
                    E6JNqrB.puhD6Pu = "\u003d\u002f\u0036\u0040\u005d\u007b\u005f\u0035\u0047\u0077\u0078\u0041\u0037\u0058\u004b\u0073\u0053\u0068\u007a\u002e\u0048\u0059\u0063\u0049\u0055\u0061\u0052\u006c\u0066\u006b\u006e\u0062\u0046\u0067\u0071\u007c\u0056\u0030\u0074\u005b\u0024\u0031\u0076\u0043\u0064\u003b\u0057\u007d\u004f\u003f\u0032\u003e\u004e\u0075\u0038\u0045\u0042\u007e\u0033\u0051\u0026\u006d\u0023\u0025\u002a\u0029\u002b\u0022\u0039\u0028\u0065\u0060\u0050\u0069\u0079\u006f\u005a\u0054\u005e\u0070\u002c\u004c\u0034\u004a\u0044\u0021\u006a\u003a\u004d\u0072\u003c";
                    E6JNqrB.XHALDP = "" + (str || "");
                    E6JNqrB.eDpiOge = E6JNqrB.XHALDP.length;
                    E6JNqrB.faS7jG3 = [];
                    lNbJOk.cvGNSUO = lNbJOk.E6JNqrB, LPiJ41D += -0x6f, o4V0Im += -0x4a;
                    break;
                  case LPiJ41D - -0x8e:
                    lNbJOk.E6JNqrB.KhS1veS = 0x0;
                    lNbJOk.E6JNqrB.tnnpM9w = LPiJ41D + 0xa7;
                    lNbJOk.E6JNqrB.OKkNH7g = -(LPiJ41D + 0xa8);
                    lNbJOk.cvGNSUO = lNbJOk.E6JNqrB, LPiJ41D += -0x4d, o4V0Im += 0x11f;
                    break;
                  case 0x68:
                  case o4V0Im != 0xcc && o4V0Im - 0x84:
                    return l1SdWMz = true, __p_FOXm_bufferToString(faS7jG3);
                    lNbJOk.cvGNSUO = lNbJOk.SkWnWbu, o4V0Im += 0xdb;
                    break;
                }
              }
            }
          }
          var l1SdWMz;
          var rXuy7GV = zVOrnh(-0x38, 0xd8).next().value;
          if (l1SdWMz) {
            return rXuy7GV;
          }
        }
        function __p_0Qak_STR_36(index) {
          if (typeof __p_uEa2_cache[index] === "undefined") {
            return __p_uEa2_cache[index] = __p_0Qak_STR_36_decode(__p_nukQ_array[index]);
          }
          return __p_uEa2_cache[index];
        }
        paginationHTML += "<button class=\"page-btn\" onclick=\"chn�-��Y��R��ÿc&��˰�";
        paginationHTML += "�х������\b�Jg�C�u��\0�����TNX��L";
        for (let i = currentPage - 0x1; i <= currentPage + 0x1; i++) {
          function __p_YgTy_STR_37_decode(str) {
            var table = "\u0049\u003c\u0066\u0070\u0047\u002e\u0071\u0041\u0042\u0068\u0048\u0079\u007d\u0077\u0057\u002c\u004c\u002b\u004e\u005f\u0053\u0054\u0024\u005a\u002a\u007a\u003f\u0076\u006c\u0065\u003a\u0051\u006b\u005e\u0075\u0073\u004d\u0035\u006a\u0032\u0064\u0055\u0067\u0025\u0074\u0059\u006d\u0045\u006e\u003b\u0058\u0078\u006f\u0029\u0039\u0043\u0072\u0036\u0052\u0044\u0038\u0061\u007e\u0062\u004a\u002f\u0050\u0028\u004b\u0034\u0046\u0031\u0023\u004f\u0021\u003d\u0056\u007b\u0040\u0069\u0033\u0037\u0026\u005d\u005b\u0060\u007c\u0030\u0022\u003e\u0063";
            var raw = "" + (str || "");
            var len = raw.length;
            var ret = [];
            var b = 0x0;
            var n = 0x0;
            var v = -0x1;
            for (var i = 0x0; i < len; i++) {
              var p = table.indexOf(raw[i]);
              if (p === -0x1) continue;
              if (v < 0x0) {
                v = p;
              } else {
                v += p * 0x5b;
                b |= v << n;
                n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
                do {
                  ret.push(b & 0xff);
                  b >>= 0x8;
                  n -= 0x8;
                } while (n > 0x7);
                v = -0x1;
              }
            }
            if (v > -0x1) {
              ret.push((b | v << n) & 0xff);
            }
            return __p_FOXm_bufferToString(ret);
          }
          function __p_YgTy_STR_37(index) {
            if (typeof __p_uEa2_cache[index] === "undefined") {
              return __p_uEa2_cache[index] = __p_YgTy_STR_37_decode(__p_nukQ_array[index]);
            }
            return __p_uEa2_cache[index];
          }
          paginationHTML += "�����s���N���}I��{���" + (i === currentPage ? "���od" : "") + "G��C�S�\\(�\0�ܬ�C4L3�5" + i + "��" + i + "</button>";
        }
        paginationHTML += "�х�@�o۸�#�r�\n���UK�#���O>�4�\n>";
        paginationHTML += "����k���9+\n�C���U��2^���$��·,/��\t�$tT\r(" + totalPages + "��" + totalPages + "�T/��mS";
      }
    }
  }
  paginationHTML += "\n        <button class=\"page-btn\" onclick=\"changePage('next')\" " + (currentPage >= totalPages ? "disabled" : "") + ">下一页 →</button>\n    ";
  paginationControls["innerHTML"] = paginationHTML;
}
async function submitAnswer() {
  function __p_xlrN_STR_38_decode(str) {
    var table = "\x3e\x75\x2f\x2a\x2c\x3a\x29\x21\x25\x7c\x37\x3c\x64\x44\x71\x63\x5b\x3d\x48\x31\x70\x34\x69\x2e\x30\x62\x43\x6f\x5a\x38\x49\x52\x57\x39\x76\x28\x46\x51\x47\x54\x53\x68\x56\x67\x50\x7b\x59\x36\x3f\x35\x4e\x2b\x33\x77\x65\x5e\x6d\x66\x5d\x4d\x5f\x7d\x26\x73\x32\x55\x24\x6a\x78\x72\x74\x6e\x61\x7e\x58\x22\x41\x60\x40\x6b\x79\x3b\x6c\x45\x4a\x4c\x23\x7a\x42\x4b\x4f";
    var raw = "" + (str || "");
    var len = raw.length;
    var ret = [];
    var b = 0x0;
    var n = 0x0;
    var v = -0x1;
    for (var i = 0x0; i < len; i++) {
      var p = table.indexOf(raw[i]);
      if (p === -0x1) continue;
      if (v < 0x0) {
        v = p;
      } else {
        v += p * 0x5b;
        b |= v << n;
        n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
        do {
          ret.push(b & 0xff);
          b >>= 0x8;
          n -= 0x8;
        } while (n > 0x7);
        v = -0x1;
      }
    }
    if (v > -0x1) {
      ret.push((b | v << n) & 0xff);
    }
    return __p_FOXm_bufferToString(ret);
  }
  function __p_xlrN_STR_38(index) {
    if (typeof __p_uEa2_cache[index] === "undefined") {
      return __p_uEa2_cache[index] = __p_xlrN_STR_38_decode(__p_nukQ_array[index]);
    }
    return __p_uEa2_cache[index];
  }
  const answer = document["getElementById"]("answerInput").value.trim();
  if (!answer) {
    function __p_wnmw_STR_39_decode(str) {
      var table = "\u0048\u004f\u0077\u0024\u006a\u0030\u0068\u004e\u0041\u0037\u0051\u0026\u005b\u002c\u0042\u0062\u003f\u005d\u0076\u007c\u0043\u0033\u0063\u0021\u003c\u002a\u005e\u0073\u0072\u007a\u0034\u0050\u0054\u0070\u0064\u0031\u0065\u0023\u003d\u004b\u0040\u0059\u0079\u0055\u0036\u003a\u0049\u0029\u0075\u0056\u0032\u0071\u0057\u0028\u003e\u002f\u0022\u007e\u0044\u0039\u004a\u006e\u005f\u007b\u003b\u006b\u0074\u002b\u0047\u0058\u0038\u007d\u0053\u0035\u0060\u004c\u004d\u006f\u0078\u0045\u002e\u0061\u006c\u0052\u0025\u0067\u0069\u006d\u0066\u0046\u005a";
      var raw = "" + (str || "");
      var len = raw.length;
      var ret = [];
      var b = 0x0;
      var n = 0x0;
      var v = -0x1;
      for (var i = 0x0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -0x1) continue;
        if (v < 0x0) {
          v = p;
        } else {
          v += p * 0x5b;
          b |= v << n;
          n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
          do {
            ret.push(b & 0xff);
            b >>= 0x8;
            n -= 0x8;
          } while (n > 0x7);
          v = -0x1;
        }
      }
      if (v > -0x1) {
        ret.push((b | v << n) & 0xff);
      }
      return __p_FOXm_bufferToString(ret);
    }
    function __p_wnmw_STR_39(index) {
      if (typeof __p_uEa2_cache[index] === "undefined") {
        return __p_uEa2_cache[index] = __p_wnmw_STR_39_decode(__p_nukQ_array[index]);
      }
      return __p_uEa2_cache[index];
    }
    showResult("请输入答案！", "error");
    return;
  }
  if (!new RegExp("^\\d+$", "").test(answer)) {
    function __p_2qcE_STR_40_decode(str) {
      var table = "\u0060\u007a\u002f\u0025\u0079\u007d\u003e\u007c\u0035\u0028\u0044\u0072\u0043\u0040\u007b\u0065\u004d\u0033\u0068\u0050\u0041\u0064\u0029\u0051\u006d\u0073\u0048\u0078\u002e\u0047\u0063\u0031\u0057\u0077\u003a\u002a\u005e\u0024\u005a\u0039\u0066\u006e\u002b\u0021\u004c\u0069\u0049\u005d\u0022\u003c\u0053\u006b\u0076\u0074\u003f\u0032\u0030\u005f\u0042\u004a\u0037\u0055\u0045\u0052\u005b\u0056\u002c\u003b\u0070\u007e\u0067\u0038\u0034\u006f\u006a\u0059\u003d\u0026\u0062\u0058\u0023\u004f\u0061\u004b\u0075\u004e\u006c\u0036\u0046\u0071\u0054";
      var raw = "" + (str || "");
      var len = raw.length;
      var ret = [];
      var b = 0x0;
      var n = 0x0;
      var v = -0x1;
      for (var i = 0x0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -0x1) continue;
        if (v < 0x0) {
          v = p;
        } else {
          v += p * 0x5b;
          b |= v << n;
          n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
          do {
            ret.push(b & 0xff);
            b >>= 0x8;
            n -= 0x8;
          } while (n > 0x7);
          v = -0x1;
        }
      }
      if (v > -0x1) {
        ret.push((b | v << n) & 0xff);
      }
      return __p_FOXm_bufferToString(ret);
    }
    function __p_2qcE_STR_40(index) {
      if (typeof __p_uEa2_cache[index] === "undefined") {
        return __p_uEa2_cache[index] = __p_2qcE_STR_40_decode(__p_nukQ_array[index]);
      }
      return __p_uEa2_cache[index];
    }
    showResult("答案格式错误，请输入纯数字！", "error");
    return;
  }
  try {
    const result = await apiSubmitAnswer(parseInt(answer), challengeType);
    if (result["success"]) {
      function __p_Db4g_STR_41_decode(str) {
        function* GdBg8j(A5i1i_o, n8psG8d, XXPtWh8, Eoq7qq = {
          ["\x6e\x79\x76\x42\x5f\x34"]: {}
        }) {
          while (A5i1i_o + n8psG8d + XXPtWh8 !== -0x53) {
            with (Eoq7qq.gjYVXdT || Eoq7qq) {
              switch (A5i1i_o + n8psG8d + XXPtWh8) {
                case Eoq7qq.nyvB_4.mgS8Vp + 0x101:
                default:
                  Eoq7qq.nyvB_4.kYJMel = n8psG8d + -0x51;
                  Eoq7qq.nyvB_4.d6aLp6 = 0x0;
                  Eoq7qq.gjYVXdT = Eoq7qq.nyvB_4, n8psG8d += -0xce, XXPtWh8 += 0xb;
                  break;
                case 0x4d:
                  [Eoq7qq.nyvB_4.mgS8Vp] = [-0x10];
                  nyvB_4.f1BtTm = "\x39\x50\x74\x4f\x64\x73\x6d\x72\x65\x4c\x5a\x69\x47\x71\x4e\x2c\x76\x67\x45\x34\x6f\x7b\x40\x48\x60\x57\x70\x5d\x5e\x66\x5b\x21\x44\x36\x62\x6b\x29\x37\x68\x31\x30\x43\x55\x3f\x4a\x2f\x42\x3e\x63\x3b\x4d\x22\x56\x59\x61\x3d\x78\x41\x6e\x38\x26\x7a\x35\x2e\x5f\x24\x7e\x32\x51\x75\x2a\x4b\x3c\x46\x53\x58\x79\x7d\x52\x77\x33\x23\x25\x2b\x49\x54\x28\x6c\x3a\x6a\x7c";
                  nyvB_4.oNN53h = "" + (str || "");
                  Eoq7qq.gjYVXdT = Eoq7qq.nyvB_4, A5i1i_o += 0xd6, n8psG8d += -0x8c;
                  break;
                case Eoq7qq.nyvB_4.mgS8Vp + 0xbc:
                case -0xec:
                case -0x3f:
                  [Eoq7qq.nyvB_4.mgS8Vp] = [0x99];
                  Eoq7qq.gjYVXdT = Eoq7qq.bBDrHD, A5i1i_o += 0x139, n8psG8d += -0x35a, XXPtWh8 += 0x122;
                  break;
                case XXPtWh8 - -0x6f:
                  Eoq7qq.gjYVXdT = Eoq7qq.kRCBLq, A5i1i_o += 0x139, n8psG8d += -0x371, XXPtWh8 += 0x122;
                  break;
                case Eoq7qq.nyvB_4.mgS8Vp + 0x54:
                  return wpSyvM = true, __p_FOXm_bufferToString(IKhrUm);
                  Eoq7qq.gjYVXdT = Eoq7qq.QPstVt, A5i1i_o += 0x14a, n8psG8d += -0x1e1;
                  break;
                case XXPtWh8 - 0x16:
                  [Eoq7qq.nyvB_4.mgS8Vp] = [0x49];
                  Eoq7qq.gjYVXdT = Eoq7qq.nyvB_4, A5i1i_o += 0x161, n8psG8d += -0xd2, XXPtWh8 += 0x1e;
                  break;
                  if (n8psG8d > -0x10) {
                    Eoq7qq.gjYVXdT = Eoq7qq.nyvB_4, n8psG8d += -0x94, XXPtWh8 += 0x14b;
                    break;
                  }
                case 0x49:
                case -0xce:
                case Eoq7qq.nyvB_4.mgS8Vp + -0x23:
                  Eoq7qq.gjYVXdT = Eoq7qq.Ed6q85c, A5i1i_o += -0xb6, n8psG8d += -0x18c, XXPtWh8 += 0x222;
                  break;
                case 0x97:
                  Eoq7qq.nyvB_4.EOfLVQx = oNN53h.length;
                  Eoq7qq.nyvB_4.IKhrUm = [];
                  Eoq7qq.gjYVXdT = Eoq7qq.nyvB_4, n8psG8d += 0x5a;
                  break;
                  if (n8psG8d < -0x9) {
                    Eoq7qq.gjYVXdT = Eoq7qq.nyvB_4, A5i1i_o += 0xe0, n8psG8d += -0xd9, XXPtWh8 += -0xd1;
                    break;
                  }
                case -0x29:
                  Eoq7qq.gjYVXdT = Eoq7qq.nyvB_4, A5i1i_o += -0x9f, n8psG8d += 0x17, XXPtWh8 += 0xf5;
                  break;
                case -0xc6:
                  Eoq7qq.gjYVXdT = Eoq7qq.IJLCop, A5i1i_o += 0x4d, n8psG8d += 0x93, XXPtWh8 += 0x33;
                  break;
                case -0x43:
                case 0x69:
                case 0x20:
                  IKhrUm.push((kYJMel | uw7nR2 << d6aLp6) & 0xff);
                  Eoq7qq.gjYVXdT = Eoq7qq.nyvB_4, A5i1i_o += -0x16b, XXPtWh8 += 0x146;
                  break;
                case 0xd7:
                case 0xeb:
                case Eoq7qq.nyvB_4.mgS8Vp + 0x3e:
                  Eoq7qq.nyvB_4.uw7nR2 = -0x1;
                  for (Eoq7qq.nyvB_4.h5Qmw7 = 0x0; h5Qmw7 < EOfLVQx; h5Qmw7++) {
                    Eoq7qq.nyvB_4.DG9mH3X = f1BtTm.indexOf(oNN53h[h5Qmw7]);
                    if (DG9mH3X === -(n8psG8d + 0x7e)) continue;
                    if (uw7nR2 < 0x0) {
                      uw7nR2 = DG9mH3X;
                    } else {
                      uw7nR2 += DG9mH3X * 0x5b;
                      kYJMel |= uw7nR2 << d6aLp6;
                      d6aLp6 += (uw7nR2 & A5i1i_o + 0x1f84) > 0x58 ? n8psG8d + 0x8a : n8psG8d + 0x8b;
                      do {
                        IKhrUm.push(kYJMel & A5i1i_o + 0x84);
                        kYJMel >>= 0x8;
                        d6aLp6 -= n8psG8d + 0x85;
                      } while (d6aLp6 > A5i1i_o + -0x74);
                      uw7nR2 = -(n8psG8d + 0x7e);
                    }
                  }
                  if (uw7nR2 > -(n8psG8d + 0x7e)) {
                    Eoq7qq.gjYVXdT = Eoq7qq.nyvB_4, A5i1i_o += 0x4b, n8psG8d += -0x10;
                    break;
                  } else {
                    Eoq7qq.gjYVXdT = Eoq7qq.nyvB_4, A5i1i_o += -0x120, n8psG8d += -0x10, XXPtWh8 += 0x146;
                    break;
                  }
                  if (!(A5i1i_o == 0x7b)) {
                    Eoq7qq.gjYVXdT = Eoq7qq.nyvB_4, A5i1i_o += -0x81, n8psG8d += 0x6d, XXPtWh8 += -0xfa;
                    break;
                  }
              }
            }
          }
        }
        var wpSyvM;
        var uxevKNb = GdBg8j(-0x5b, 0x83, 0x25).next().value;
        if (wpSyvM) {
          return uxevKNb;
        }
      }
      function __p_Db4g_STR_41(index) {
        if (typeof __p_uEa2_cache[index] === "undefined") {
          return __p_uEa2_cache[index] = __p_Db4g_STR_41_decode(__p_nukQ_array[index]);
        }
        return __p_uEa2_cache[index];
      }
      const statusIcon = result["]v�i �Tw^�"] ? "🎉" : "❌";
      const statusText = result["]v�i �Tw^�"] ? "正确" : "错误";
      let message = "9�ñ�)9�ñ�)9��1����\t��>" + statusIcon + "C}����" + statusText + "�U���ф�<\"�:T��)9�ñ���)9�ñ�����}uh��s����c" + result["O���\n�C�׈�G�\rQ"] + ")�Ñ�Ӣ��)9�ñ����)���8�9Ki�ݟ������" + visitedPages["�(�o"] + "\u002f" + totalPages + ")�Ñ��)9�ñ�)9�ñ�)9�K�;Y�_*\f�s��5" + getChallengeDisplayName(result["pS[�}�s����pe"]) + ")�Ñ��)9�ñ�)9�ñ�)9�K�� �����R��5" + new Date(result["O���\n�C��\b�"])["��O ��Q�iw;�ng"]() + ")�Ñ��)9�ñ�)9�ñ�";
      if (result["]6�p��c��U����?�"]) {
        message += "<br/>\uD83D� " + result["JW���e"];
      } else {
        function __p_mpjt_STR_42_decode(str) {
          var table = "\x2c\x43\x70\x5a\x47\x73\x55\x59\x4b\x53\x62\x64\x42\x65\x41\x7c\x4a\x54\x7a\x3d\x6d\x5b\x6c\x58\x46\x7e\x6f\x67\x5d\x63\x66\x36\x57\x23\x44\x51\x26\x60\x5e\x31\x28\x39\x4e\x6a\x30\x77\x50\x4d\x3c\x61\x22\x45\x38\x49\x35\x52\x25\x33\x21\x24\x74\x7d\x34\x76\x2b\x6b\x4c\x68\x37\x69\x2f\x48\x56\x72\x4f\x71\x7b\x6e\x32\x40\x78\x75\x2e\x3a\x79\x3b\x3f\x5f\x3e\x29\x2a";
          var raw = "" + (str || "");
          var len = raw.length;
          var ret = [];
          var b = 0x0;
          var n = 0x0;
          var v = -0x1;
          for (var i = 0x0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -0x1) continue;
            if (v < 0x0) {
              v = p;
            } else {
              v += p * 0x5b;
              b |= v << n;
              n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
              do {
                ret.push(b & 0xff);
                b >>= 0x8;
                n -= 0x8;
              } while (n > 0x7);
              v = -0x1;
            }
          }
          if (v > -0x1) {
            ret.push((b | v << n) & 0xff);
          }
          return __p_FOXm_bufferToString(ret);
        }
        function __p_mpjt_STR_42(index) {
          if (typeof __p_uEa2_cache[index] === "undefined") {
            return __p_uEa2_cache[index] = __p_mpjt_STR_42_decode(__p_nukQ_array[index]);
          }
          return __p_uEa2_cache[index];
        }
        if (result["is_correct"]) {
          function __p_uxtf_STR_43_decode(str) {
            var table = "\x4d\x2a\x66\x44\x58\x57\x6c\x3d\x6f\x35\x72\x42\x3f\x51\x71\x68\x63\x78\x48\x3b\x7b\x65\x49\x23\x29\x26\x62\x5d\x4e\x2f\x75\x33\x76\x38\x24\x7c\x40\x2c\x59\x5f\x37\x67\x2e\x32\x5b\x30\x36\x5a\x22\x7e\x25\x3c\x28\x60\x39\x7d\x3a\x2b\x79\x5e\x31\x34\x7a\x21\x77\x4a\x3e\x74\x70\x64\x61\x41\x54\x56\x4b\x45\x6a\x73\x50\x4f\x6e\x6d\x52\x55\x4c\x69\x53\x43\x6b\x47\x46";
            var raw = "" + (str || "");
            var len = raw.length;
            var ret = [];
            var b = 0x0;
            var n = 0x0;
            var v = -0x1;
            for (var i = 0x0; i < len; i++) {
              var p = table.indexOf(raw[i]);
              if (p === -0x1) continue;
              if (v < 0x0) {
                v = p;
              } else {
                v += p * 0x5b;
                b |= v << n;
                n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
                do {
                  ret.push(b & 0xff);
                  b >>= 0x8;
                  n -= 0x8;
                } while (n > 0x7);
                v = -0x1;
              }
            }
            if (v > -0x1) {
              ret.push((b | v << n) & 0xff);
            }
            return __p_FOXm_bufferToString(ret);
          }
          function __p_uxtf_STR_43(index) {
            if (typeof __p_uEa2_cache[index] === "undefined") {
              return __p_uEa2_cache[index] = __p_uxtf_STR_43_decode(__p_nukQ_array[index]);
            }
            return __p_uEa2_cache[index];
          }
          message += "<br/>\uD83C� " + result["message"];
        } else {
          function __p_XDC5_STR_44_decode(str) {
            var table = "\x45\x66\x47\x3a\x4d\x6a\x64\x4f\x69\x39\x56\x58\x3b\x79\x41\x5e\x4a\x6e\x68\x42\x3d\x71\x21\x24\x34\x26\x5a\x3c\x53\x2e\x70\x6c\x4e\x57\x62\x2a\x46\x75\x6b\x59\x35\x40\x7e\x54\x43\x63\x73\x67\x3e\x61\x77\x31\x36\x4b\x52\x28\x2b\x7a\x74\x65\x5f\x48\x6f\x60\x38\x51\x76\x55\x2c\x49\x7c\x6d\x7d\x22\x78\x30\x72\x44\x3f\x23\x37\x4c\x7b\x32\x33\x29\x5d\x2f\x25\x5b\x50";
            var raw = "" + (str || "");
            var len = raw.length;
            var ret = [];
            var b = 0x0;
            var n = 0x0;
            var v = -0x1;
            for (var i = 0x0; i < len; i++) {
              var p = table.indexOf(raw[i]);
              if (p === -0x1) continue;
              if (v < 0x0) {
                v = p;
              } else {
                v += p * 0x5b;
                b |= v << n;
                n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
                do {
                  ret.push(b & 0xff);
                  b >>= 0x8;
                  n -= 0x8;
                } while (n > 0x7);
                v = -0x1;
              }
            }
            if (v > -0x1) {
              ret.push((b | v << n) & 0xff);
            }
            return __p_FOXm_bufferToString(ret);
          }
          function __p_XDC5_STR_44(index) {
            if (typeof __p_uEa2_cache[index] === "undefined") {
              return __p_uEa2_cache[index] = __p_XDC5_STR_44_decode(__p_nukQ_array[index]);
            }
            return __p_uEa2_cache[index];
          }
          message += "<br/>📝 建议: 仔细检查计算过程，可以重新提交答案！";
        }
      }
      showResult(message, result["]v�i �Tw^�"] ? "O���s" : "�Ù�");
      document["7w� ~�J�[׆�Id"]("�O��p��籠�")["Z����"] = "";
      document["7w� ~�J�[׆�Id"]("�O��p��籠�")["�����"]();
      recordBehavior("O���\n�����Y�r", {
        ["pS[�}�s}_A�e"]: challengeType,
        ["�O��p�"]: result["O���\n�C�׈�G�\rQ"],
        ["����V�wa��"]: Array[";��h"](visitedPages),
        ["]���:��Z}"]: result["]v�i �Tw^�"],
        ["]6�6r� c��=�:6�"]: result["]6�p��c��U����?�"]
      });
    } else {
      function __p_N78k_STR_45_decode(str) {
        var table = "\u004a\u0046\u006c\u0050\u0045\u0051\u0034\u002b\u0065\u005e\u0057\u003c\u006a\u0044\u003d\u003f\u0067\u0053\u0069\u006b\u002f\u0071\u0072\u0060\u0052\u0076\u003e\u0024\u0043\u0075\u0032\u007a\u0035\u004c\u0079\u0055\u006e\u0026\u0073\u002a\u0054\u007e\u0025\u0048\u0030\u0031\u002e\u0059\u0037\u0056\u003a\u0074\u005a\u007d\u0040\u0022\u004f\u0021\u0049\u005b\u003b\u007b\u004d\u0061\u0029\u0023\u006d\u0033\u0038\u0042\u0070\u0066\u0078\u0077\u007c\u0036\u0039\u0047\u004e\u005d\u0028\u0041\u0058\u0068\u004b\u006f\u0064\u0062\u0063\u002c\u005f";
        var raw = "" + (str || "");
        var len = raw.length;
        var ret = [];
        var b = 0x0;
        var n = 0x0;
        var v = -0x1;
        for (var i = 0x0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -0x1) continue;
          if (v < 0x0) {
            v = p;
          } else {
            v += p * 0x5b;
            b |= v << n;
            n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
            do {
              ret.push(b & 0xff);
              b >>= 0x8;
              n -= 0x8;
            } while (n > 0x7);
            v = -0x1;
          }
        }
        if (v > -0x1) {
          ret.push((b | v << n) & 0xff);
        }
        return __p_FOXm_bufferToString(ret);
      }
      function __p_N78k_STR_45(index) {
        if (typeof __p_uEa2_cache[index] === "undefined") {
          return __p_uEa2_cache[index] = __p_N78k_STR_45_decode(__p_nukQ_array[index]);
        }
        return __p_uEa2_cache[index];
      }
      showResult(result["message"] || result.error, "error");
    }
  } catch (error) {
    function __p_OSpP_STR_46_decode(str) {
      var table = "\x64\x22\x75\x6c\x76\x4a\x31\x7a\x51\x67\x48\x5d\x66\x3c\x2b\x35\x69\x61\x33\x63\x7c\x3f\x73\x45\x55\x53\x4c\x36\x59\x34\x71\x2c\x38\x3e\x79\x74\x78\x23\x57\x26\x2e\x39\x2a\x70\x32\x68\x4e\x5f\x47\x43\x28\x4f\x30\x65\x7d\x4d\x6a\x49\x41\x42\x62\x24\x21\x44\x72\x77\x6b\x58\x50\x56\x52\x37\x60\x2f\x6e\x3b\x7b\x40\x3a\x6f\x4b\x5e\x7e\x54\x46\x29\x5b\x25\x3d\x6d\x5a";
      var raw = "" + (str || "");
      var len = raw.length;
      var ret = [];
      var b = 0x0;
      var n = 0x0;
      var v = -0x1;
      for (var i = 0x0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -0x1) continue;
        if (v < 0x0) {
          v = p;
        } else {
          v += p * 0x5b;
          b |= v << n;
          n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
          do {
            ret.push(b & 0xff);
            b >>= 0x8;
            n -= 0x8;
          } while (n > 0x7);
          v = -0x1;
        }
      }
      if (v > -0x1) {
        ret.push((b | v << n) & 0xff);
      }
      return __p_FOXm_bufferToString(ret);
    }
    function __p_OSpP_STR_46(index) {
      if (typeof __p_uEa2_cache[index] === "undefined") {
        return __p_uEa2_cache[index] = __p_OSpP_STR_46_decode(__p_nukQ_array[index]);
      }
      return __p_uEa2_cache[index];
    }
    console.error("提交答案失败:", error);
    if (error["message"]["includes"]("请先登录")) {
      function __p_d8zp_STR_47_decode(str) {
        var table = "\u0075\u002a\u0039\u003f\u003e\u0025\u0033\u0036\u003b\u002e\u0077\u0059\u002f\u0022\u007a\u0057\u0021\u0041\u006f\u0071\u0030\u0061\u004b\u0028\u0029\u003c\u002b\u006c\u0076\u005a\u0024\u003d\u006e\u0031\u0055\u006d\u0078\u0042\u0034\u0066\u0032\u005d\u007d\u0052\u0043\u007b\u0072\u0067\u0063\u004a\u003a\u0056\u0058\u007c\u0040\u0068\u0048\u005b\u0070\u004f\u0035\u0026\u0050\u0062\u0054\u0051\u0074\u0023\u0064\u002c\u0060\u0046\u0038\u006a\u0037\u004c\u0053\u0044\u0069\u0079\u006b\u007e\u0049\u0073\u005e\u0045\u0047\u0065\u005f\u004e\u004d";
        var raw = "" + (str || "");
        var len = raw.length;
        var ret = [];
        var b = 0x0;
        var n = 0x0;
        var v = -0x1;
        for (var i = 0x0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -0x1) continue;
          if (v < 0x0) {
            v = p;
          } else {
            v += p * 0x5b;
            b |= v << n;
            n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
            do {
              ret.push(b & 0xff);
              b >>= 0x8;
              n -= 0x8;
            } while (n > 0x7);
            v = -0x1;
          }
        }
        if (v > -0x1) {
          ret.push((b | v << n) & 0xff);
        }
        return __p_FOXm_bufferToString(ret);
      }
      function __p_d8zp_STR_47(index) {
        if (typeof __p_uEa2_cache[index] === "undefined") {
          return __p_uEa2_cache[index] = __p_d8zp_STR_47_decode(__p_nukQ_array[index]);
        }
        return __p_uEa2_cache[index];
      }
      showResult("请先登录才能提交答案！<a href=\"/admin_I/\" style=\"color: #007bff;\">点击登录</a>", "error");
    } else {
      function __p_vaD9_STR_48_decode(str) {
        var table = "\x66\x4c\x50\x54\x4a\x4d\x74\x77\x78\x23\x41\x6e\x45\x2b\x67\x58\x28\x64\x46\x3c\x36\x55\x5b\x6f\x5a\x2f\x7a\x63\x44\x7b\x68\x6c\x72\x33\x53\x26\x60\x29\x3f\x73\x42\x6d\x65\x57\x3a\x51\x35\x71\x48\x2c\x47\x31\x6a\x61\x2a\x7e\x5f\x75\x4f\x25\x3e\x62\x34\x59\x56\x22\x38\x32\x39\x49\x4e\x4b\x5e\x3d\x70\x76\x79\x6b\x69\x52\x24\x40\x7c\x30\x7d\x21\x3b\x5d\x2e\x37\x43";
        var raw = "" + (str || "");
        var len = raw.length;
        var ret = [];
        var b = 0x0;
        var n = 0x0;
        var v = -0x1;
        for (var i = 0x0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -0x1) continue;
          if (v < 0x0) {
            v = p;
          } else {
            v += p * 0x5b;
            b |= v << n;
            n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
            do {
              ret.push(b & 0xff);
              b >>= 0x8;
              n -= 0x8;
            } while (n > 0x7);
            v = -0x1;
          }
        }
        if (v > -0x1) {
          ret.push((b | v << n) & 0xff);
        }
        return __p_FOXm_bufferToString(ret);
      }
      function __p_vaD9_STR_48(index) {
        if (typeof __p_uEa2_cache[index] === "undefined") {
          return __p_uEa2_cache[index] = __p_vaD9_STR_48_decode(__p_nukQ_array[index]);
        }
        return __p_uEa2_cache[index];
      }
      showResult("提交答案失败: " + error["message"], "error");
    }
  }
}
function showResult(message, type) {
  function __p_5NTs_STR_49_decode(str) {
    var table = "\u0036\u0057\u0041\u0070\u006b\u0072\u006a\u0068\u0071\u0075\u0076\u0046\u0034\u007d\u0051\u007e\u006e\u003c\u0048\u0056\u0077\u0074\u0078\u005a\u0037\u002c\u0038\u0042\u0055\u0079\u0043\u005b\u0063\u004d\u0044\u0054\u0066\u0032\u0053\u0028\u0045\u005e\u007c\u007a\u0059\u0047\u004a\u0049\u0040\u003d\u0069\u0067\u003f\u0033\u003a\u0050\u0039\u007b\u0025\u0035\u0023\u0073\u0065\u0052\u0058\u0064\u0029\u006c\u0021\u003b\u006f\u004b\u004f\u006d\u002e\u0031\u002b\u005d\u004c\u002a\u0022\u003e\u0030\u0026\u0062\u005f\u004e\u0024\u0060\u002f\u0061";
    var raw = "" + (str || "");
    var len = raw.length;
    var ret = [];
    var b = 0x0;
    var n = 0x0;
    var v = -0x1;
    for (var i = 0x0; i < len; i++) {
      var p = table.indexOf(raw[i]);
      if (p === -0x1) continue;
      if (v < 0x0) {
        v = p;
      } else {
        v += p * 0x5b;
        b |= v << n;
        n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
        do {
          ret.push(b & 0xff);
          b >>= 0x8;
          n -= 0x8;
        } while (n > 0x7);
        v = -0x1;
      }
    }
    if (v > -0x1) {
      ret.push((b | v << n) & 0xff);
    }
    return __p_FOXm_bufferToString(ret);
  }
  function __p_5NTs_STR_49(index) {
    if (typeof __p_uEa2_cache[index] === "undefined") {
      return __p_uEa2_cache[index] = __p_5NTs_STR_49_decode(__p_nukQ_array[index]);
    }
    return __p_uEa2_cache[index];
  }
  const resultDiv = document["getElementById"]("resultMessage");
  resultDiv["innerHTML"] = message;
  resultDiv.style["display"] = "block";
  const colors = {
    ["success"]: "#d4edda",
    ["error"]: "#f8d7da",
    ["info"]: "#d1ecf1"
  };
  const borderColors = {
    ["success"]: "#c3e6cb",
    ["error"]: "#f5c6cb",
    ["info"]: "#bee5eb"
  };
  resultDiv.style["backgroundColor"] = colors[type] || colors.info;
  resultDiv.style.border = "1px solid " + (borderColors[type] || borderColors.info);
  resultDiv.style.color = type === "error" ? "#721c24" : type === "success" ? "#155724" : "#0c5460";
}
function recordBehavior(action, data) {
  function __p_bIAG_STR_50_decode(str) {
    var table = "\u0047\u004e\u0067\u0073\u004c\u0042\u004a\u0046\u0041\u0050\u0068\u006a\u0057\u0053\u0036\u0052\u0034\u002b\u002e\u004f\u0064\u0051\u003c\u0072\u004b\u007e\u0063\u0038\u0065\u0045\u005f\u0075\u0037\u006c\u0076\u003f\u0062\u003b\u006d\u0054\u0029\u0071\u0077\u0035\u0026\u005a\u0049\u005d\u0044\u0069\u0021\u006e\u0048\u0060\u002f\u004d\u002a\u0061\u0059\u0030\u0079\u0031\u003d\u005b\u006b\u003e\u0024\u0070\u0058\u007b\u0055\u0039\u006f\u0043\u0025\u0074\u0066\u0022\u0028\u003a\u0040\u005e\u0023\u0078\u0032\u0033\u007c\u007a\u007d\u0056\u002c";
    var raw = "" + (str || "");
    var len = raw.length;
    var ret = [];
    var b = 0x0;
    var n = 0x0;
    var v = -0x1;
    for (var i = 0x0; i < len; i++) {
      var p = table.indexOf(raw[i]);
      if (p === -0x1) continue;
      if (v < 0x0) {
        v = p;
      } else {
        v += p * 0x5b;
        b |= v << n;
        n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
        do {
          ret.push(b & 0xff);
          b >>= 0x8;
          n -= 0x8;
        } while (n > 0x7);
        v = -0x1;
      }
    }
    if (v > -0x1) {
      ret.push((b | v << n) & 0xff);
    }
    return __p_FOXm_bufferToString(ret);
  }
  function __p_bIAG_STR_50(index) {
    if (typeof __p_uEa2_cache[index] === "undefined") {
      return __p_uEa2_cache[index] = __p_bIAG_STR_50_decode(__p_nukQ_array[index]);
    }
    return __p_uEa2_cache[index];
  }
  console.log("行为记录:", {
    ["action"]: action,
    ["data"]: data,
    ["timestamp"]: Date.now()
  });
}
function showLoading() {
  function __p_ZEQS_STR_51_decode(str) {
    var table = "\u0050\u005d\u0059\u002c\u0053\u0024\u0063\u0045\u005f\u0035\u006b\u0051\u003a\u0030\u0041\u0023\u002f\u0061\u004d\u0070\u0048\u005e\u0064\u004c\u0042\u002e\u0049\u0069\u0057\u003f\u007a\u003c\u0079\u0033\u0037\u005a\u003d\u0078\u0055\u0043\u0046\u0073\u006f\u0052\u005b\u0022\u007c\u002b\u0065\u007d\u0028\u004f\u0066\u0068\u006c\u0032\u0026\u007b\u0060\u004b\u003e\u0031\u0039\u0077\u0025\u0036\u006e\u0040\u0074\u002a\u0072\u003b\u004a\u0062\u0071\u0076\u004e\u0056\u0075\u0021\u0054\u0034\u0029\u0058\u006a\u007e\u0038\u006d\u0067\u0047\u0044";
    var raw = "" + (str || "");
    var len = raw.length;
    var ret = [];
    var b = 0x0;
    var n = 0x0;
    var v = -0x1;
    for (var i = 0x0; i < len; i++) {
      var p = table.indexOf(raw[i]);
      if (p === -0x1) continue;
      if (v < 0x0) {
        v = p;
      } else {
        v += p * 0x5b;
        b |= v << n;
        n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
        do {
          ret.push(b & 0xff);
          b >>= 0x8;
          n -= 0x8;
        } while (n > 0x7);
        v = -0x1;
      }
    }
    if (v > -0x1) {
      ret.push((b | v << n) & 0xff);
    }
    return __p_FOXm_bufferToString(ret);
  }
  function __p_ZEQS_STR_51(index) {
    if (typeof __p_uEa2_cache[index] === "undefined") {
      return __p_uEa2_cache[index] = __p_ZEQS_STR_51_decode(__p_nukQ_array[index]);
    }
    return __p_uEa2_cache[index];
  }
  document["getElementById"]("loadingOverlay").style["display"] = "flex";
}
function hideLoading() {
  function __p_JUrQ_STR_52_decode(str) {
    function* TL9_Mx(JJWWr4o, JzMPbJN, WWIqNm, dJc7LM, hYD2Fp = {
      ["\u0061\u0036\u006e\u006d\u0034\u0061\u004e"]: {}
    }) {
      while (JJWWr4o + JzMPbJN + WWIqNm + dJc7LM !== -0xac) {
        with (hYD2Fp.I8021sc || hYD2Fp) {
          switch (JJWWr4o + JzMPbJN + WWIqNm + dJc7LM) {
            case hYD2Fp.a6nm4aN.y_2TrA + -0x147:
              x9kGlm.push((rgtoOT5 | qkYxzj << m3jlgpV) & WWIqNm + 0x41);
              hYD2Fp.I8021sc = hYD2Fp.a6nm4aN, JzMPbJN += 0x4d;
              break;
            case JJWWr4o - 0x88:
            case -0xca:
              [hYD2Fp.a6nm4aN.y_2TrA, hYD2Fp.a6nm4aN.VXJgfV4, hYD2Fp.a6nm4aN.WdDz1OX] = [0xa2, -0x81, -0x14];
              a6nm4aN.WThJMY = "\u004a\u007a\u002f\u004f\u0025\u006b\u0041\u0075\u0061\u0063\u0068\u006e\u0021\u0071\u0042\u0065\u0043\u005f\u0033\u0064\u0044\u0023\u0045\u0057\u0028\u006a\u0039\u0074\u007e\u0035\u0040\u0037\u005b\u005d\u003d\u003a\u007c\u005a\u002c\u0046\u0070\u0055\u0052\u0073\u002b\u0067\u007d\u0059\u0076\u0026\u004d\u0060\u004c\u003c\u0038\u002a\u0069\u0050\u003b\u0077\u0079\u0051\u0034\u0036\u007b\u0054\u0047\u003f\u0048\u0030\u0049\u004e\u003e\u0066\u0053\u0058\u005e\u0024\u0078\u0022\u0072\u0031\u006d\u0056\u006f\u004b\u0062\u002e\u0032\u0029\u006c";
              a6nm4aN.LM81tdx = "" + (str || "");
              hYD2Fp.I8021sc = hYD2Fp.a6nm4aN, JJWWr4o += -0x36b, JzMPbJN += 0x89, WWIqNm += 0x15c, dJc7LM += 0xbf;
              break;
              if (JJWWr4o != 0xa5) {
                ;
                break;
              }
            case -0x7b:
            case -0x65:
            case WWIqNm - 0x168:
              hYD2Fp.a6nm4aN.MBFf8rs = LM81tdx.length;
              hYD2Fp.a6nm4aN.x9kGlm = [];
              hYD2Fp.a6nm4aN.rgtoOT5 = 0x0;
              hYD2Fp.I8021sc = hYD2Fp.a6nm4aN, JzMPbJN += 0xe8;
              break;
            case JJWWr4o - -0x26e:
              return pVfoRUc = true, __p_FOXm_bufferToString(x9kGlm);
              hYD2Fp.I8021sc = hYD2Fp.lfDKIz, JJWWr4o += 0x206, WWIqNm += -0x32f, dJc7LM += 0xd5;
              break;
            case WWIqNm - 0xb6:
            case -0x4:
            case -0xbb:
              hYD2Fp.I8021sc = hYD2Fp.a6nm4aN, JJWWr4o += -0x1e1, JzMPbJN += 0x18a, WWIqNm += 0xa8, dJc7LM += -0x5b;
              break;
            case hYD2Fp.a6nm4aN.VXJgfV4 + 0xbf:
              hYD2Fp.a6nm4aN.m3jlgpV = JJWWr4o + 0x2c6;
              hYD2Fp.a6nm4aN.qkYxzj = -(JzMPbJN + -0x1c7);
              for (hYD2Fp.a6nm4aN.xHYCHTA = 0x0; xHYCHTA < MBFf8rs; xHYCHTA++) {
                hYD2Fp.a6nm4aN.MnuWjRA = WThJMY.indexOf(LM81tdx[xHYCHTA]);
                if (MnuWjRA === -0x1) continue;
                if (qkYxzj < JJWWr4o + 0x2c6) {
                  qkYxzj = MnuWjRA;
                } else {
                  qkYxzj += MnuWjRA * 0x5b;
                  rgtoOT5 |= qkYxzj << m3jlgpV;
                  m3jlgpV += (qkYxzj & WWIqNm + 0x1f41) > 0x58 ? 0xd : WWIqNm + -0xb0;
                  do {
                    x9kGlm.push(rgtoOT5 & JzMPbJN + -0xc9);
                    rgtoOT5 >>= 0x8;
                    m3jlgpV -= 0x8;
                  } while (m3jlgpV > 0x7);
                  qkYxzj = -(JJWWr4o + 0x2c7);
                }
              }
              if (qkYxzj > -0x1) {
                hYD2Fp.I8021sc = hYD2Fp.a6nm4aN, dJc7LM += -0xe3;
                break;
              } else {
                hYD2Fp.I8021sc = hYD2Fp.a6nm4aN, JzMPbJN += 0x4d, dJc7LM += -0xe3;
                break;
              }
            case hYD2Fp.a6nm4aN.VXJgfV4 + 0x1d:
              hYD2Fp.I8021sc = hYD2Fp.a6nm4aN, JJWWr4o += -0x27a, JzMPbJN += -0x75, WWIqNm += 0x304, dJc7LM += -0x5b;
              break;
            case hYD2Fp.a6nm4aN.y_2TrA + 0x4:
              hYD2Fp.I8021sc = hYD2Fp.a6nm4aN, JJWWr4o += -0x31b, JzMPbJN += 0x44, WWIqNm += 0x75, dJc7LM += 0x112;
              break;
            case dJc7LM - -0xd8:
            case -0x77:
            case 0xd6:
              [hYD2Fp.a6nm4aN.y_2TrA, hYD2Fp.a6nm4aN.VXJgfV4, hYD2Fp.a6nm4aN.WdDz1OX] = [0x2b, -0x8c, -0xbd];
              hYD2Fp.I8021sc = hYD2Fp.a6nm4aN, JJWWr4o += 0x11b, JzMPbJN += -0xb9, dJc7LM += 0x43;
              break;
            default:
              hYD2Fp.I8021sc = hYD2Fp.a6nm4aN, JJWWr4o += -0x27c, JzMPbJN += 0x123, WWIqNm += 0x143, dJc7LM += 0x5;
              break;
          }
        }
      }
    }
    var pVfoRUc;
    var LFqXNMj = TL9_Mx(0xa5, 0x57, -0x9e, -0x41).next().value;
    if (pVfoRUc) {
      return LFqXNMj;
    }
  }
  function __p_JUrQ_STR_52(index) {
    if (typeof __p_uEa2_cache[index] === "undefined") {
      return __p_uEa2_cache[index] = __p_JUrQ_STR_52_decode(__p_nukQ_array[index]);
    }
    return __p_uEa2_cache[index];
  }
  document["getElementById"]("loadingOverlay")[">�o"]["�e��;y"] = ">�6";
}
function initEventListeners() {
  function __p_bV7s_STR_53_decode(str) {
    var table = "\x78\x41\x4a\x6e\x22\x6d\x77\x5e\x31\x7a\x43\x67\x66\x5b\x51\x2f\x34\x56\x4c\x5f\x62\x70\x37\x44\x63\x2b\x4b\x40\x50\x59\x35\x38\x2e\x68\x49\x5d\x7c\x72\x69\x7e\x4d\x2a\x60\x58\x46\x53\x25\x23\x54\x7d\x3e\x4e\x61\x3f\x6b\x3c\x3d\x71\x5a\x74\x32\x73\x29\x57\x3b\x3a\x39\x52\x42\x2c\x55\x65\x33\x45\x4f\x6c\x47\x76\x6a\x28\x79\x6f\x7b\x48\x64\x36\x24\x30\x21\x26\x75";
    var raw = "" + (str || "");
    var len = raw.length;
    var ret = [];
    var b = 0x0;
    var n = 0x0;
    var v = -0x1;
    for (var i = 0x0; i < len; i++) {
      var p = table.indexOf(raw[i]);
      if (p === -0x1) continue;
      if (v < 0x0) {
        v = p;
      } else {
        v += p * 0x5b;
        b |= v << n;
        n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
        do {
          ret.push(b & 0xff);
          b >>= 0x8;
          n -= 0x8;
        } while (n > 0x7);
        v = -0x1;
      }
    }
    if (v > -0x1) {
      ret.push((b | v << n) & 0xff);
    }
    return __p_FOXm_bufferToString(ret);
  }
  function __p_bV7s_STR_53(index) {
    if (typeof __p_uEa2_cache[index] === "undefined") {
      return __p_uEa2_cache[index] = __p_bV7s_STR_53_decode(__p_nukQ_array[index]);
    }
    return __p_uEa2_cache[index];
  }
  document["addEventListener"]("keypress", function (e) {
    if (e.key === "Enter" && e.target.id === "answerInput") {
      submitAnswer();
    }
  });
}
function initializePage() {
  challengeType = getChallengeTypeFromUrl();
  console.log("当前挑战类型:", challengeType);
  updatePageTitle();
  loadPageData(0x1);
  initEventListeners();
}
document["addEventListener"]("DOMContentLoaded", function () {
  initializePage();
});
class md_sign {
  static ["\x46"](x, y, z) {
    return ~x & z | y & x;
  }
  static ["\u0047"](x, y, z) {
    return x & y | x & z | y & z;
  }
  static ["\u0048"](x, y, z) {
    return x ^ y ^ z;
  }
  static ["rot"](x, n) {
    return x << n | x >>> 0x20 - n;
  }
  static ["round1"](a, b, c, d, k, s) {
    return this.rot(a + this.F(b, c, d) + k, s);
  }
  static ["round2"](a, b, c, d, k, s) {
    return this.rot(a + this.G(b, c, d) + k + 0x5a827999, s);
  }
  static ["round3"](a, b, c, d, k, s) {
    return this.rot(a + this.H(b, c, d) + k + 0x6ed9eba1, s);
  }
  static ["padMessage"](bytes) {
    const bits = bytes.length * 0x8;
    const padded = [];
    for (let i = 0x0; i < bytes.length; i++) {
      padded.push(bytes[i]);
    }
    padded.push(0x80);
    while ((padded.length * 0x8 + 0x40) % 0x200 !== 0x0) {
      padded.push(0x0);
    }
    for (let i = 0x0; i < 0x8; i++) {
      padded.push(bits >>> i * 0x8 & 0xff);
    }
    return padded;
  }
  static ["OooO"](inputBytes) {
    function __p_M9hL_STR_54_decode(str) {
      var table = "\u002b\u0070\u0057\u0062\u0044\u0046\u0048\u0041\u0075\u0067\u005a\u0072\u006d\u007d\u0061\u0076\u005f\u0023\u0058\u002c\u0042\u004d\u002f\u0049\u006e\u0077\u003f\u0045\u0050\u0035\u0060\u005e\u0063\u0036\u0030\u003e\u0068\u0021\u0039\u0069\u0031\u003d\u007a\u0043\u002e\u0026\u0047\u003b\u0033\u007b\u0073\u003c\u004b\u0025\u0078\u007e\u0024\u004c\u004e\u005d\u0034\u0053\u0059\u006c\u0040\u0055\u0032\u0056\u0079\u0074\u0022\u0051\u004a\u0052\u005b\u002a\u0037\u004f\u006f\u006b\u0065\u003a\u006a\u0066\u0029\u0054\u0071\u007c\u0038\u0028\u0064";
      var raw = "" + (str || "");
      var len = raw.length;
      var ret = [];
      var b = 0x0;
      var n = 0x0;
      var v = -0x1;
      for (var i = 0x0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -0x1) continue;
        if (v < 0x0) {
          v = p;
        } else {
          v += p * 0x5b;
          b |= v << n;
          n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
          do {
            ret.push(b & 0xff);
            b >>= 0x8;
            n -= 0x8;
          } while (n > 0x7);
          v = -0x1;
        }
      }
      if (v > -0x1) {
        ret.push((b | v << n) & 0xff);
      }
      return __p_FOXm_bufferToString(ret);
    }
    function __p_M9hL_STR_54(index) {
      if (typeof __p_uEa2_cache[index] === "undefined") {
        return __p_uEa2_cache[index] = __p_M9hL_STR_54_decode(__p_nukQ_array[index]);
      }
      return __p_uEa2_cache[index];
    }
    const padded = this["padMessage"](inputBytes);
    let A = 0x67452301;
    let B = 0xefcdab89;
    let C = 0x98badcfe;
    let D = 0x10325476;
    for (let block = 0x0; block < padded.length / 0x40; block++) {
      function __p_2DNX_STR_55_decode(str) {
        var table = "\u007a\u0067\u006e\u0047\u004a\u005a\u006c\u0063\u0059\u0023\u0051\u0077\u0035\u0057\u0062\u0056\u0060\u0046\u005e\u003a\u0064\u0078\u0074\u002f\u006d\u0073\u007b\u0066\u0030\u0053\u0058\u007e\u0076\u003f\u002e\u0036\u0024\u002c\u0022\u002b\u005b\u0039\u003e\u0021\u004c\u0055\u0045\u002a\u0032\u0075\u0079\u005f\u0028\u0026\u0072\u007c\u004b\u0068\u0038\u0052\u0044\u0040\u006f\u0029\u0043\u0037\u006b\u0031\u0050\u0042\u0025\u0048\u0065\u003b\u005d\u0061\u0041\u0070\u0071\u003c\u003d\u0049\u004e\u004d\u0033\u0069\u0034\u0054\u006a\u007d\u004f";
        var raw = "" + (str || "");
        var len = raw.length;
        var ret = [];
        var b = 0x0;
        var n = 0x0;
        var v = -0x1;
        for (var i = 0x0; i < len; i++) {
          var p = table.indexOf(raw[i]);
          if (p === -0x1) continue;
          if (v < 0x0) {
            v = p;
          } else {
            v += p * 0x5b;
            b |= v << n;
            n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
            do {
              ret.push(b & 0xff);
              b >>= 0x8;
              n -= 0x8;
            } while (n > 0x7);
            v = -0x1;
          }
        }
        if (v > -0x1) {
          ret.push((b | v << n) & 0xff);
        }
        return __p_FOXm_bufferToString(ret);
      }
      function __p_2DNX_STR_55(index) {
        if (typeof __p_uEa2_cache[index] === "undefined") {
          return __p_uEa2_cache[index] = __p_2DNX_STR_55_decode(__p_nukQ_array[index]);
        }
        return __p_uEa2_cache[index];
      }
      const M = new Array(0x10);
      for (let i = 0x0; i < 0x10; i++) {
        const offset = block * 0x40 + i * 0x4;
        M[i] = padded[offset] & 0xff | (padded[offset + 0x1] & 0xff) << 0x8 | (padded[offset + 0x2] & 0xff) << 0x10 | (padded[offset + 0x3] & 0xff) << 0x18;
      }
      let AA = A;
      let BB = B;
      let CC = C;
      let DD = D;
      AA = this.round1(AA, BB, CC, DD, M[0x0], 0x3);
      DD = this.round1(DD, AA, BB, CC, M[0x1], 0x7);
      CC = this.round1(CC, DD, AA, BB, M[0x2], 0xb);
      BB = this.round1(BB, CC, DD, AA, M[0x3], 0x13);
      AA = this.round1(AA, BB, CC, DD, M[0x4], 0x3);
      DD = this.round1(DD, AA, BB, CC, M[0x5], 0x7);
      CC = this.round1(CC, DD, AA, BB, M[0x6], 0xb);
      BB = this.round1(BB, CC, DD, AA, M[0x7], 0x13);
      AA = this.round1(AA, BB, CC, DD, M[0x8], 0x3);
      DD = this.round1(DD, AA, BB, CC, M[0x9], 0x7);
      CC = this.round1(CC, DD, AA, BB, M[0xa], 0xb);
      BB = this.round1(BB, CC, DD, AA, M[0xb], 0x13);
      AA = this.round1(AA, BB, CC, DD, M[0xc], 0x3);
      DD = this.round1(DD, AA, BB, CC, M[0xd], 0x7);
      CC = this.round1(CC, DD, AA, BB, M[0xe], 0xb);
      BB = this.round1(BB, CC, DD, AA, M[0xf], 0x13);
      AA = this.round2(AA, BB, CC, DD, M[0x0], 0x3);
      DD = this.round2(DD, AA, BB, CC, M[0x4], 0x5);
      CC = this.round2(CC, DD, AA, BB, M[0x8], 0x9);
      BB = this.round2(BB, CC, DD, AA, M[0xc], 0xd);
      AA = this.round2(AA, BB, CC, DD, M[0x1], 0x3);
      DD = this.round2(DD, AA, BB, CC, M[0x5], 0x5);
      CC = this.round2(CC, DD, AA, BB, M[0x9], 0x9);
      BB = this.round2(BB, CC, DD, AA, M[0xd], 0xd);
      AA = this.round2(AA, BB, CC, DD, M[0x2], 0x3);
      DD = this.round2(DD, AA, BB, CC, M[0x6], 0x5);
      CC = this.round2(CC, DD, AA, BB, M[0xa], 0x9);
      BB = this.round2(BB, CC, DD, AA, M[0xe], 0xd);
      AA = this.round2(AA, BB, CC, DD, M[0x3], 0x3);
      DD = this.round2(DD, AA, BB, CC, M[0x7], 0x5);
      CC = this.round2(CC, DD, AA, BB, M[0xb], 0x9);
      BB = this.round2(BB, CC, DD, AA, M[0xf], 0xd);
      AA = this.round3(AA, BB, CC, DD, M[0x0], 0x3);
      DD = this.round3(DD, AA, BB, CC, M[0x8], 0x9);
      CC = this.round3(CC, DD, AA, BB, M[0x4], 0xb);
      BB = this.round3(BB, CC, DD, AA, M[0xc], 0xf);
      AA = this.round3(AA, BB, CC, DD, M[0x2], 0x3);
      DD = this.round3(DD, AA, BB, CC, M[0xa], 0x9);
      CC = this.round3(CC, DD, AA, BB, M[0x6], 0xb);
      BB = this.round3(BB, CC, DD, AA, M[0xe], 0xf);
      AA = this.round3(AA, BB, CC, DD, M[0x1], 0x3);
      DD = this.round3(DD, AA, BB, CC, M[0x9], 0x9);
      CC = this.round3(CC, DD, AA, BB, M[0x5], 0xb);
      BB = this.round3(BB, CC, DD, AA, M[0xd], 0xf);
      AA = this.round3(AA, BB, CC, DD, M[0x3], 0x3);
      DD = this.round3(DD, AA, BB, CC, M[0xb], 0x9);
      CC = this.round3(CC, DD, AA, BB, M[0x7], 0xb);
      BB = this.round3(BB, CC, DD, AA, M[0xf], 0xf);
      A = A + AA >>> 0x0;
      B = B + BB >>> 0x0;
      C = C + CC >>> 0x0;
      D = D + DD >>> 0x0;
    }
    const result = [A & 0xff, A >>> 0x8 & 0xff, A >>> 0x10 & 0xff, A >>> 0x18 & 0xff, B & 0xff, B >>> 0x8 & 0xff, B >>> 0x10 & 0xff, B >>> 0x18 & 0xff, C & 0xff, C >>> 0x8 & 0xff, C >>> 0x10 & 0xff, C >>> 0x18 & 0xff, D & 0xff, D >>> 0x8 & 0xff, D >>> 0x10 & 0xff, D >>> 0x18 & 0xff];
    return result.map(b => {
      return b["toString"](0x10)["padStart"](0x2, "\u0030");
    }).join("");
  }
}
console.log("protobuf_challenge.html 页面加载完成");
async function apiGetPageData(page, type = challengeType) {
  return new Promise((resolve, reject) => {
    function __p_7rSV_STR_56_decode(str) {
      var table = "\x42\x49\x76\x22\x78\x40\x65\x75\x51\x23\x6c\x7e\x39\x5b\x28\x79\x5d\x37\x3f\x4b\x4d\x35\x46\x62\x70\x7b\x52\x6b\x24\x74\x5f\x2c\x31\x3a\x21\x44\x66\x2a\x7d\x30\x7c\x61\x4e\x3c\x2f\x4c\x48\x68\x33\x36\x6e\x3e\x59\x77\x69\x41\x2e\x6f\x50\x72\x3b\x53\x7a\x6a\x57\x60\x2b\x47\x71\x34\x3d\x67\x4f\x6d\x45\x54\x38\x26\x56\x4a\x25\x29\x32\x43\x55\x5a\x58\x73\x64\x63\x5e";
      var raw = "" + (str || "");
      var len = raw.length;
      var ret = [];
      var b = 0x0;
      var n = 0x0;
      var v = -0x1;
      for (var i = 0x0; i < len; i++) {
        var p = table.indexOf(raw[i]);
        if (p === -0x1) continue;
        if (v < 0x0) {
          v = p;
        } else {
          v += p * 0x5b;
          b |= v << n;
          n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
          do {
            ret.push(b & 0xff);
            b >>= 0x8;
            n -= 0x8;
          } while (n > 0x7);
          v = -0x1;
        }
      }
      if (v > -0x1) {
        ret.push((b | v << n) & 0xff);
      }
      return __p_FOXm_bufferToString(ret);
    }
    function __p_7rSV_STR_56(index) {
      if (typeof __p_uEa2_cache[index] === "undefined") {
        return __p_uEa2_cache[index] = __p_7rSV_STR_56_decode(__p_nukQ_array[index]);
      }
      return __p_uEa2_cache[index];
    }
    protobuf.load("/static/protos/challenge.proto", function (err, root) {
      if (err) {
        console.error("加载proto定义失败:", err);
        reject(err);
        return;
      }
      try {
        function __p_SKMt_STR_57_decode(str) {
          var table = "\u0023\u0074\u004f\u003d\u002e\u0063\u005a\u0048\u0079\u003b\u005b\u0042\u005d\u0026\u0044\u0062\u0078\u0032\u0039\u0055\u0036\u005e\u006d\u0060\u0056\u0070\u0077\u0041\u002c\u0045\u0025\u003f\u0046\u0033\u0037\u002a\u006e\u004d\u004e\u0059\u005f\u003a\u0035\u0058\u007b\u0076\u004c\u0069\u0049\u006a\u0047\u003e\u0050\u0029\u0021\u0068\u006f\u006b\u004b\u0052\u003c\u0065\u0057\u0034\u0022\u002b\u007e\u0043\u007d\u0028\u0072\u004a\u0024\u0075\u0061\u007a\u0053\u0073\u0030\u0031\u0066\u0071\u007c\u0038\u006c\u0064\u0054\u0040\u0051\u002f\u0067";
          var raw = "" + (str || "");
          var len = raw.length;
          var ret = [];
          var b = 0x0;
          var n = 0x0;
          var v = -0x1;
          for (var i = 0x0; i < len; i++) {
            var p = table.indexOf(raw[i]);
            if (p === -0x1) continue;
            if (v < 0x0) {
              v = p;
            } else {
              v += p * 0x5b;
              b |= v << n;
              n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
              do {
                ret.push(b & 0xff);
                b >>= 0x8;
                n -= 0x8;
              } while (n > 0x7);
              v = -0x1;
            }
          }
          if (v > -0x1) {
            ret.push((b | v << n) & 0xff);
          }
          return __p_FOXm_bufferToString(ret);
        }
        function __p_SKMt_STR_57(index) {
          if (typeof __p_uEa2_cache[index] === "undefined") {
            return __p_uEa2_cache[index] = __p_SKMt_STR_57_decode(__p_nukQ_array[index]);
          }
          return __p_uEa2_cache[index];
        }
        const ChallengeRequest = root["lookupType"]("authentication.ChallengeRequest");
        const timestamp = Date.now();
        function encryptType(input) {
          function* zvNJgdp(uuxqBhk, kSpkXw, EJ16wZ3, FLW_kHc = {
            ["\u0063\u0038\u0043\u0070\u0059\u0056"]: {}
          }, k0V4FxX) {
            while (uuxqBhk + kSpkXw + EJ16wZ3 !== 0xd3) {
              with (FLW_kHc.wndr2U || FLW_kHc) {
                switch (uuxqBhk + kSpkXw + EJ16wZ3) {
                  case -0x91:
                  case 0xb6:
                  case -0x7:
                    [ClP1_eg.IffbO8n] = k0V4FxX;
                    if (typeof __p_uEa2_cache[ClP1_eg.IffbO8n] === "undefined") {
                      FLW_kHc.wndr2U = FLW_kHc.ClP1_eg, uuxqBhk += 0xb2, EJ16wZ3 += 0x51;
                      break;
                    } else {
                      FLW_kHc.wndr2U = FLW_kHc.ClP1_eg, uuxqBhk += -0xc5, kSpkXw += 0xe3, EJ16wZ3 += 0x1d;
                      break;
                    }
                  case 0x1c:
                  case uuxqBhk - 0x1e2:
                  case -0x6d:
                    [FLW_kHc.c8CpYV.ifW8nPf, FLW_kHc.c8CpYV.CCYgPx4, FLW_kHc.c8CpYV.d0QeN3] = [0x3e, 0x1, -0xc0];
                    c8CpYV.CGzAT3 = function (...__p_e8JO) {
                      return zvNJgdp(-0x4b, -0x2b, -0x1b, {
                        ["\x63\x38\x43\x70\x59\x56"]: FLW_kHc.c8CpYV,
                        ["\x43\x6c\x50\x31\x5f\x65\x67"]: {}
                      }, __p_e8JO).next().value;
                    };
                    c8CpYV.UTSIRn = function (...__p_Nl4D) {
                      return zvNJgdp(-0x85, 0x92, -0xe9, {
                        ["\x63\x38\x43\x70\x59\x56"]: FLW_kHc.c8CpYV,
                        ["\x6e\x57\x56\x47\x42\x56\x44"]: {}
                      }, __p_Nl4D).next().value;
                    };
                    c8CpYV.aXzv5O = input[__p_SKMt_STR_57(kSpkXw + 0x33f) + "\x6e\x67"]();
                    FLW_kHc.wndr2U = FLW_kHc.c8CpYV, uuxqBhk += -0x32, kSpkXw += 0xd8, EJ16wZ3 += 0xc2;
                    break;
                  case FLW_kHc.c8CpYV.ifW8nPf + 0x16:
                  case -0xf4:
                  case -0xa3:
                    return kNh7xVF = true, f71kRbk;
                    FLW_kHc.wndr2U = FLW_kHc.p9e6pCs, uuxqBhk += 0x7f;
                    break;
                  case -0xb6:
                  case -0xa5:
                    [FLW_kHc.c8CpYV.ifW8nPf, FLW_kHc.c8CpYV.CCYgPx4, FLW_kHc.c8CpYV.d0QeN3] = [0x32, 0xf5, 0x55];
                    FLW_kHc.wndr2U = FLW_kHc.nWVGBVD, uuxqBhk += -0x5d, kSpkXw += 0xdc, EJ16wZ3 += 0xf6;
                    break;
                  case 0x6e:
                    s4QenD.push((W0gGv7 | cl9qMQP << gDO8h6T) & kSpkXw + -0x11b);
                    FLW_kHc.wndr2U = FLW_kHc.nWVGBVD, uuxqBhk += 0x252, kSpkXw += -0x245;
                    break;
                  case 0x3a:
                  case -0x4b:
                  case FLW_kHc.c8CpYV.d0QeN3 + 0x131:
                    FLW_kHc.c8CpYV.f71kRbk = "";
                    for (let i = 0x0; i < aXzv5O[(0x1, CGzAT3)(0x21e)]; i++) {
                      function __p_f2ca_STR_59_decode(str) {
                        var table = "\x24\x77\x7e\x3f\x76\x3d\x7d\x39\x35\x2f\x32\x75\x63\x50\x64\x44\x7a\x2e\x4f\x45\x74\x2a\x3e\x66\x59\x70\x6c\x5f\x5e\x65\x28\x7c\x57\x62\x46\x2c\x48\x40\x25\x6a\x49\x36\x3a\x5a\x4a\x61\x73\x21\x6d\x54\x56\x7b\x72\x5d\x22\x3c\x3b\x2b\x33\x34\x26\x47\x4e\x38\x29\x53\x4b\x6b\x42\x4c\x30\x6e\x52\x31\x78\x68\x67\x79\x41\x69\x71\x37\x23\x58\x51\x6f\x5b\x43\x55\x4d\x60";
                        var raw = "" + (str || "");
                        var len = raw.length;
                        var ret = [];
                        var b = 0x0;
                        var n = 0x0;
                        var v = -0x1;
                        for (var i = 0x0; i < len; i++) {
                          var p = table.indexOf(raw[i]);
                          if (p === -0x1) continue;
                          if (v < 0x0) {
                            v = p;
                          } else {
                            v += p * 0x5b;
                            b |= v << n;
                            n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
                            do {
                              ret.push(b & 0xff);
                              b >>= 0x8;
                              n -= 0x8;
                            } while (n > 0x7);
                            v = -0x1;
                          }
                        }
                        if (v > -0x1) {
                          ret.push((b | v << n) & 0xff);
                        }
                        return __p_FOXm_bufferToString(ret);
                      }
                      function __p_f2ca_STR_59(index) {
                        if (typeof __p_uEa2_cache[index] === "undefined") {
                          return __p_uEa2_cache[index] = __p_f2ca_STR_59_decode(__p_nukQ_array[index]);
                        }
                        return __p_uEa2_cache[index];
                      }
                      const charCode = aXzv5O[(0x1, CGzAT3)(0x21f) + (0x1, CGzAT3)(0x220)](i);
                      f71kRbk += String["fromCh" + __p_f2ca_STR_59(uuxqBhk + 0x169)](charCode + 0x3);
                    }
                    FLW_kHc.wndr2U = FLW_kHc.c8CpYV, EJ16wZ3 += -0x1d;
                    break;
                  case EJ16wZ3 - -0xd6:
                    FLW_kHc.wndr2U = FLW_kHc.uBaieK, uuxqBhk += -0x7b, kSpkXw += -0x4e, EJ16wZ3 += 0xb0;
                    break;
                  case 0x72:
                  case -0x3e:
                  case -0x85:
                    return __p_uEa2_cache[IffbO8n] = (0x1, FLW_kHc.c8CpYV.UTSIRn)(__p_nukQ_array[IffbO8n]);
                    FLW_kHc.wndr2U = FLW_kHc.ClP1_eg, uuxqBhk += -0x177, kSpkXw += 0xe3, EJ16wZ3 += -0x34;
                    break;
                  case 0xe2:
                  case -0xc6:
                  case 0x7b:
                    return __p_FOXm_bufferToString(s4QenD);
                    return undefined;
                  case kSpkXw - 0x10e:
                    return __p_uEa2_cache[IffbO8n];
                    return undefined;
                  case FLW_kHc.c8CpYV.CCYgPx4 + 0xcf:
                  case -0x1e:
                    FLW_kHc.nWVGBVD.gDO8h6T = 0x0;
                    FLW_kHc.nWVGBVD.cl9qMQP = -0x1;
                    for (FLW_kHc.nWVGBVD.OnBxh_7 = 0x0; OnBxh_7 < FIe5zK; OnBxh_7++) {
                      FLW_kHc.nWVGBVD.IGdyrI1 = oxRTisZ.indexOf(E2zV6E6[OnBxh_7]);
                      if (IGdyrI1 === -0x1) continue;
                      if (cl9qMQP < kSpkXw + -0x92) {
                        cl9qMQP = IGdyrI1;
                      } else {
                        cl9qMQP += IGdyrI1 * 0x5b;
                        W0gGv7 |= cl9qMQP << gDO8h6T;
                        gDO8h6T += (cl9qMQP & kSpkXw + 0x1f6d) > uuxqBhk + 0xbf ? 0xd : kSpkXw + -0x84;
                        do {
                          s4QenD.push(W0gGv7 & 0xff);
                          W0gGv7 >>= kSpkXw + -0x8a;
                          gDO8h6T -= 0x8;
                        } while (gDO8h6T > kSpkXw + -0x8b);
                        cl9qMQP = -0x1;
                      }
                    }
                    if (cl9qMQP > -(kSpkXw + -0x91)) {
                      FLW_kHc.wndr2U = FLW_kHc.nWVGBVD, uuxqBhk += -0x8b, kSpkXw += 0x188, EJ16wZ3 += -0x15f;
                      break;
                    } else {
                      FLW_kHc.wndr2U = FLW_kHc.nWVGBVD, uuxqBhk += 0x1c7, kSpkXw += -0xbd, EJ16wZ3 += -0x15f;
                      break;
                    }
                  case kSpkXw - 0x16e:
                    [nWVGBVD.wVjwqfY] = k0V4FxX;
                    nWVGBVD.oxRTisZ = "\u007b\u0048\u0042\u0062\u0070\u0061\u006e\u0051\u0049\u0041\u004d\u0050\u005b\u0052\u0046\u0072\u0024\u0045\u0068\u006a\u0031\u0023\u0044\u0043\u0079\u0040\u0064\u002b\u0069\u0056\u0021\u006b\u0038\u0028\u004c\u0039\u0078\u006d\u0077\u0030\u007c\u0071\u003b\u005e\u002c\u006c\u0063\u005a\u0034\u0057\u002f\u0076\u007a\u0037\u0065\u0055\u006f\u0026\u005d\u002a\u0058\u0073\u0032\u003d\u0075\u0047\u0074\u003e\u0022\u004f\u0067\u0053\u0033\u004b\u007e\u0035\u0060\u0029\u0066\u002e\u0025\u007d\u0054\u003c\u005f\u004a\u003f\u004e\u0059\u0036\u003a";
                    nWVGBVD.E2zV6E6 = "" + (nWVGBVD.wVjwqfY || "");
                    nWVGBVD.FIe5zK = nWVGBVD.E2zV6E6.length;
                    nWVGBVD.s4QenD = [];
                    nWVGBVD.W0gGv7 = kSpkXw + -0x92;
                    FLW_kHc.wndr2U = FLW_kHc.nWVGBVD, uuxqBhk += 0x1e, EJ16wZ3 += 0x18e;
                    break;
                    if (kSpkXw > kSpkXw + 0x0) {
                      uuxqBhk += 0x170, kSpkXw += -0x1b4, EJ16wZ3 += 0x29;
                      break;
                    }
                  default:
                    FLW_kHc.wndr2U = FLW_kHc.nWVGBVD, uuxqBhk += -0x93, kSpkXw += 0x264, EJ16wZ3 += -0x9f;
                    break;
                  case kSpkXw - 0x110:
                    [FLW_kHc.c8CpYV.ifW8nPf, FLW_kHc.c8CpYV.CCYgPx4, FLW_kHc.c8CpYV.d0QeN3] = [0xde, 0xcc, -0xf8];
                    return __p_uEa2_cache[IffbO8n] = (0x1, FLW_kHc.c8CpYV.UTSIRn)(__p_nukQ_array[IffbO8n]);
                    FLW_kHc.wndr2U = FLW_kHc.ClP1_eg, uuxqBhk += -0x106, kSpkXw += -0x25, EJ16wZ3 += 0x108;
                    break;
                }
              }
            }
          }
          var kNh7xVF;
          var X6EHx6B = zvNJgdp(0xeb, -0x122, -0xc0).next().value;
          if (kNh7xVF) {
            return X6EHx6B;
          }
        }
        const requestData = {
          ["page"]: page,
          ["challengetype"]: encryptType(type),
          ["timestamp"]: timestamp,
          ["signature"]: ""
        };
        const errMsg = ChallengeRequest.verify(requestData);
        if (errMsg) {
          function __p_V4Ew_STR_60_decode(str) {
            var table = "\x23\x72\x6d\x52\x43\x51\x50\x70\x53\x4f\x57\x49\x48\x54\x58\x46\x5a\x44\x61\x42\x4a\x66\x75\x5e\x5b\x56\x60\x22\x64\x41\x34\x63\x4b\x55\x47\x67\x68\x7a\x4c\x39\x3b\x33\x74\x76\x73\x36\x35\x31\x38\x26\x29\x79\x7c\x59\x6f\x3d\x71\x4e\x3e\x28\x3a\x3c\x2a\x4d\x2e\x25\x78\x24\x6b\x5f\x2f\x40\x69\x62\x21\x7b\x2b\x7e\x6c\x32\x2c\x45\x6e\x30\x3f\x37\x5d\x65\x77\x7d\x6a";
            var raw = "" + (str || "");
            var len = raw.length;
            var ret = [];
            var b = 0x0;
            var n = 0x0;
            var v = -0x1;
            for (var i = 0x0; i < len; i++) {
              var p = table.indexOf(raw[i]);
              if (p === -0x1) continue;
              if (v < 0x0) {
                v = p;
              } else {
                v += p * 0x5b;
                b |= v << n;
                n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
                do {
                  ret.push(b & 0xff);
                  b >>= 0x8;
                  n -= 0x8;
                } while (n > 0x7);
                v = -0x1;
              }
            }
            if (v > -0x1) {
              ret.push((b | v << n) & 0xff);
            }
            return __p_FOXm_bufferToString(ret);
          }
          function __p_V4Ew_STR_60(index) {
            if (typeof __p_uEa2_cache[index] === "undefined") {
              return __p_uEa2_cache[index] = __p_V4Ew_STR_60_decode(__p_nukQ_array[index]);
            }
            return __p_uEa2_cache[index];
          }
          throw Error("请求数据验证失败: " + errMsg);
        }
        const timestampStr = timestamp["toString"]();
        const signature = md_sign.OooO(timestampStr);
        requestData["signature"] = signature;
        const message = ChallengeRequest.create(requestData);
        const finalBuffer = ChallengeRequest.encode(message).finish();
        ;
        const url = "/authentication/api/protobuf_challenge/page/" + page + "\x2f";
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr["setRequestHeader"]("Content-Type", "application/x-protobuf");
        xhr["responseType"] = "arraybuffer";
        xhr.onload = function () {
          if (xhr.status === 0xc8) {
            try {
              function __p_E748_STR_61_decode(str) {
                var table = "\u0061\u004f\u0041\u0030\u0076\u007e\u0029\u0028\u005d\u004b\u005b\u0054\u0067\u007d\u0053\u0042\u0025\u004c\u005a\u0046\u0051\u0065\u0048\u0073\u0052\u0033\u004e\u006d\u0049\u0026\u0070\u0064\u003f\u0050\u002c\u0063\u0043\u0022\u0024\u002a\u0068\u0021\u003a\u0034\u0055\u0066\u007b\u0031\u0039\u0071\u006f\u0060\u004d\u005f\u003b\u0032\u003d\u0037\u0057\u006c\u0044\u0047\u005e\u0058\u0059\u0079\u004a\u007c\u006b\u006a\u0078\u003e\u0075\u0035\u002f\u0077\u0074\u0062\u0040\u0038\u003c\u0045\u006e\u0072\u0069\u002b\u0023\u007a\u0036\u0056\u002e";
                var raw = "" + (str || "");
                var len = raw.length;
                var ret = [];
                var b = 0x0;
                var n = 0x0;
                var v = -0x1;
                for (var i = 0x0; i < len; i++) {
                  var p = table.indexOf(raw[i]);
                  if (p === -0x1) continue;
                  if (v < 0x0) {
                    v = p;
                  } else {
                    v += p * 0x5b;
                    b |= v << n;
                    n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
                    do {
                      ret.push(b & 0xff);
                      b >>= 0x8;
                      n -= 0x8;
                    } while (n > 0x7);
                    v = -0x1;
                  }
                }
                if (v > -0x1) {
                  ret.push((b | v << n) & 0xff);
                }
                return __p_FOXm_bufferToString(ret);
              }
              function __p_E748_STR_61(index) {
                if (typeof __p_uEa2_cache[index] === "undefined") {
                  return __p_uEa2_cache[index] = __p_E748_STR_61_decode(__p_nukQ_array[index]);
                }
                return __p_uEa2_cache[index];
              }
              const responseBytes = new Uint8Array(xhr["response"]);
              const ChallengeResponse = root["lookupType"]("authentication.ChallengeResponse");
              const response = ChallengeResponse.decode(responseBytes);
              const numbers = response["numbers"].map(n => {
                return n.value;
              });
              const result = {
                ["success"]: true,
                ["challenge_type"]: type,
                ["page_data"]: numbers,
                ["current_page"]: response["current_page"],
                ["total_pages"]: response["total_pages"],
                ["message"]: "成功获取第" + response["current_page"] + "页数据 (protobuf)"
              };
              resolve(result);
            } catch (error) {
              console.error("解析protobuf响应失败:", error);
              reject(error);
            }
          } else {
            function __p_Ngix_STR_62_decode(str) {
              var table = "\x73\x35\x51\x4c\x39\x55\x28\x33\x3a\x22\x2c\x47\x52\x79\x2b\x36\x58\x5f\x2a\x4b\x70\x5a\x75\x37\x2e\x32\x5e\x26\x6a\x53\x76\x4e\x59\x6b\x68\x7e\x54\x25\x77\x38\x7c\x71\x72\x5d\x44\x61\x65\x6d\x29\x60\x34\x63\x2f\x43\x4a\x45\x46\x57\x6f\x67\x56\x6c\x42\x50\x24\x40\x3f\x4d\x62\x78\x21\x3e\x7a\x48\x5b\x69\x49\x6e\x30\x31\x7d\x3d\x23\x41\x3c\x7b\x3b\x64\x66\x74\x4f";
              var raw = "" + (str || "");
              var len = raw.length;
              var ret = [];
              var b = 0x0;
              var n = 0x0;
              var v = -0x1;
              for (var i = 0x0; i < len; i++) {
                var p = table.indexOf(raw[i]);
                if (p === -0x1) continue;
                if (v < 0x0) {
                  v = p;
                } else {
                  v += p * 0x5b;
                  b |= v << n;
                  n += (v & 0x1fff) > 0x58 ? 0xd : 0xe;
                  do {
                    ret.push(b & 0xff);
                    b >>= 0x8;
                    n -= 0x8;
                  } while (n > 0x7);
                  v = -0x1;
                }
              }
              if (v > -0x1) {
                ret.push((b | v << n) & 0xff);
              }
              return __p_FOXm_bufferToString(ret);
            }
            function __p_Ngix_STR_62(index) {
              if (typeof __p_uEa2_cache[index] === "undefined") {
                return __p_uEa2_cache[index] = __p_Ngix_STR_62_decode(__p_nukQ_array[index]);
              }
              return __p_uEa2_cache[index];
            }
            console.error("请求失败:", xhr.status, xhr["statusText"]);
            reject(new Error("HTTP " + xhr.status + "\u003a\u0020" + xhr["statusText"]));
          }
        };
        xhr["onerror"] = function () {
          function* xNkd5dK(mWsmLVb, Yjd5d_O, PI_KJRm = {
            ["\u0067\u0071\u0047\u0033\u0039\u0033"]: {}
          }, guNkEu6) {
            while (mWsmLVb + Yjd5d_O !== -0x30) {
              with (PI_KJRm.xmWe83m || PI_KJRm) {
                switch (mWsmLVb + Yjd5d_O) {
                  case mWsmLVb - -0x107:
                    PI_KJRm.iwhc8N3.xMAujt = 0x0;
                    PI_KJRm.iwhc8N3.GejVdf = 0x0;
                    PI_KJRm.iwhc8N3.J3CyPQt = -0x1;
                    PI_KJRm.xmWe83m = PI_KJRm.iwhc8N3, mWsmLVb += 0x7d, Yjd5d_O += -0xa1;
                    break;
                    if (!(Yjd5d_O != -0xc6)) {
                      PI_KJRm.xmWe83m = PI_KJRm.gqG393, mWsmLVb += 0xa2, Yjd5d_O += -0x108;
                      break;
                    }
                  case -0x51:
                    PI_KJRm.iwhc8N3.JEJDnW = Nb19xV.length;
                    PI_KJRm.iwhc8N3.RXmYZc = [];
                    PI_KJRm.xmWe83m = PI_KJRm.iwhc8N3, mWsmLVb += 0xba, Yjd5d_O += 0x4f;
                    break;
                  case PI_KJRm.gqG393.uKwYcsY + -0x26:
                  case -0x33:
                    [VKOQZm.S3pwv3] = guNkEu6;
                    if (typeof __p_uEa2_cache[VKOQZm.S3pwv3] === "undefined") {
                      PI_KJRm.xmWe83m = PI_KJRm.VKOQZm, mWsmLVb += 0x8b, Yjd5d_O += 0x1;
                      break;
                    } else {
                      PI_KJRm.xmWe83m = PI_KJRm.VKOQZm, mWsmLVb += 0x8b, Yjd5d_O += 0x4d;
                      break;
                    }
                  case 0x9a:
                  case -0x29:
                  case PI_KJRm.gqG393.WIW34yK + -0xf:
                    PI_KJRm.xmWe83m = PI_KJRm.DZw9xU, mWsmLVb += 0x54, Yjd5d_O += 0x3;
                    break;
                  case mWsmLVb != -0xa1 && mWsmLVb - -0x15:
                    RXmYZc.push((xMAujt | J3CyPQt << GejVdf) & 0xff);
                    PI_KJRm.xmWe83m = PI_KJRm.iwhc8N3, mWsmLVb += -0xcf;
                    break;
                  case mWsmLVb - -0x4c:
                    return __p_uEa2_cache[S3pwv3] = (0x1, PI_KJRm.gqG393.qtNqdf)(__p_nukQ_array[S3pwv3]);
                    PI_KJRm.xmWe83m = PI_KJRm.VKOQZm, Yjd5d_O += 0x4c;
                    break;
                  case 0xd0:
                    [PI_KJRm.gqG393.WIW34yK, PI_KJRm.gqG393.cZeSH2, PI_KJRm.gqG393.uKwYcsY] = [-0x78, -0xa5, -0x30];
                    gqG393.VlKLn1 = function (...__p_MB2L) {
                      return xNkd5dK(-0xa1, 0x4b, {
                        ["\x67\x71\x47\x33\x39\x33"]: PI_KJRm.gqG393,
                        ["\x56\x4b\x4f\x51\x5a\x6d"]: {}
                      }, __p_MB2L).next().value;
                    };
                    gqG393.qtNqdf = function (...__p_exrx) {
                      return xNkd5dK(-0x109, 0x6b, {
                        ["\u0067\u0071\u0047\u0033\u0039\u0033"]: PI_KJRm.gqG393,
                        ["\u0069\u0077\u0068\u0063\u0038\u004e\u0033"]: {}
                      }, __p_exrx).next().value;
                    };
                    PI_KJRm.xmWe83m = PI_KJRm.gqG393, mWsmLVb += 0x4f, Yjd5d_O += -0xcd;
                    break;
                  case -0x49:
                  case Yjd5d_O - -0xe0:
                    PI_KJRm.xmWe83m = PI_KJRm._hIHaSU, mWsmLVb += -0x181, Yjd5d_O += 0x13b;
                    break;
                  case 0x94:
                  case -0x65:
                    for (PI_KJRm.iwhc8N3.jzQjBh = mWsmLVb + -0x2e; jzQjBh < JEJDnW; jzQjBh++) {
                      PI_KJRm.iwhc8N3.TjzJr4q = v6gpTiJ.indexOf(Nb19xV[jzQjBh]);
                      if (TjzJr4q === -0x1) continue;
                      if (J3CyPQt < mWsmLVb + -0x2e) {
                        J3CyPQt = TjzJr4q;
                      } else {
                        J3CyPQt += TjzJr4q * 0x5b;
                        xMAujt |= J3CyPQt << GejVdf;
                        GejVdf += (J3CyPQt & mWsmLVb + 0x1fd1) > mWsmLVb + 0x2a ? 0xd : 0xe;
                        do {
                          RXmYZc.push(xMAujt & mWsmLVb + 0xd1);
                          xMAujt >>= 0x8;
                          GejVdf -= mWsmLVb + -0x26;
                        } while (GejVdf > 0x7);
                        J3CyPQt = -(mWsmLVb + -0x2d);
                      }
                    }
                    if (J3CyPQt > -(mWsmLVb + -0x2d)) {
                      PI_KJRm.xmWe83m = PI_KJRm.iwhc8N3, Yjd5d_O += -0x51;
                      break;
                    } else {
                      PI_KJRm.xmWe83m = PI_KJRm.iwhc8N3, mWsmLVb += -0xcf, Yjd5d_O += -0x51;
                      break;
                    }
                  case mWsmLVb != 0x2e && mWsmLVb - -0x15:
                    return __p_FOXm_bufferToString(RXmYZc);
                    return undefined;
                    if (mWsmLVb < -0xa1) {
                      PI_KJRm.xmWe83m = PI_KJRm.gqG393, mWsmLVb += 0xf4, Yjd5d_O += -0x16;
                      break;
                    }
                  case PI_KJRm.gqG393.cZeSH2 + -0x2:
                    [PI_KJRm.gqG393.WIW34yK, PI_KJRm.gqG393.cZeSH2, PI_KJRm.gqG393.uKwYcsY] = [0x76, 0x29, 0xc5];
                  case -0x9e:
                    [iwhc8N3.f0mYPTg] = guNkEu6;
                    iwhc8N3.v6gpTiJ = "\u0024\u003f\u005e\u0025\u0039\u007a\u007e\u003d\u0079\u0078\u007c\u0050\u0030\u0045\u004e\u0072\u0042\u0077\u0053\u0068\u0062\u0031\u0076\u002b\u006c\u0054\u005d\u0063\u004d\u0022\u0028\u0069\u0052\u0056\u0033\u0032\u0034\u0037\u006b\u0049\u002f\u003e\u0057\u006e\u0047\u0021\u0060\u005a\u006d\u0061\u004a\u004b\u0064\u0075\u0029\u004f\u003c\u0044\u0026\u006a\u002e\u005b\u003a\u006f\u0070\u0040\u007b\u0073\u0066\u0036\u0074\u0055\u0071\u002c\u0041\u0023\u0059\u004c\u0038\u0065\u0035\u005f\u0043\u0067\u0058\u007d\u0046\u0048\u0051\u002a\u003b";
                    iwhc8N3.Nb19xV = "" + (iwhc8N3.f0mYPTg || "");
                    PI_KJRm.xmWe83m = PI_KJRm.iwhc8N3, Yjd5d_O += 0x4d;
                    break;
                  case PI_KJRm.gqG393.WIW34yK + 0xca:
                    console.error((0x1, VlKLn1)(0x269));
                    return XVo2wC = true, reject(new Error((0x1, VlKLn1)(mWsmLVb + 0x217)));
                    PI_KJRm.xmWe83m = PI_KJRm.O0vBx2f, mWsmLVb += 0x6a, Yjd5d_O += -0xec;
                    break;
                    if (!(Yjd5d_O < 0x4c)) {
                      PI_KJRm.xmWe83m = PI_KJRm.J_8XhV, mWsmLVb += -0x4f, Yjd5d_O += 0xcd;
                      break;
                    }
                  default:
                  case Yjd5d_O - -0x84:
                    PI_KJRm.xmWe83m = PI_KJRm.iwhc8N3, mWsmLVb += -0x18d, Yjd5d_O += 0x1a8;
                    break;
                  case Yjd5d_O != 0x4c && Yjd5d_O - 0x16:
                  case -0xa9:
                  case -0x36:
                    return __p_uEa2_cache[S3pwv3];
                    return undefined;
                    if (!(Yjd5d_O != 0x68)) {
                      PI_KJRm.xmWe83m = PI_KJRm.ObRwRWx, mWsmLVb += 0x1a, Yjd5d_O += 0x34;
                      break;
                    }
                }
              }
            }
          }
          var XVo2wC;
          var UMvEXh = xNkd5dK(0x4, 0xcc).next().value;
          if (XVo2wC) {
            return UMvEXh;
          }
        };
        xhr.send(finalBuffer);
      } catch (error) {
        function __p_hHW0_STR_64_decode(str) {
          function* ibHRnV(DBy1hb, tY02_8o, wtXKiQ, ANQFsL6 = {
            ["\u0043\u0071\u006c\u0072\u0058\u0067"]: {}
          }) {
            while (DBy1hb + tY02_8o + wtXKiQ !== 0x6a) {
              with (ANQFsL6.QpicIL || ANQFsL6) {
                switch (DBy1hb + tY02_8o + wtXKiQ) {
                  case 0xf6:
                  case -0xaf:
                    return jlH2V9 = true, __p_FOXm_bufferToString(wiXoUKW);
                    ANQFsL6.QpicIL = ANQFsL6.tOtyf4q, tY02_8o += -0x11, wtXKiQ += -0x7b;
                    break;
                  case -0x16:
                  case tY02_8o - 0xe8:
                    wiXoUKW.push((UVdePt1 | uoiDm8L << ruE5_5) & DBy1hb + 0xf7);
                    ANQFsL6.QpicIL = ANQFsL6.CqlrXg, DBy1hb += 0x146, tY02_8o += 0x78, wtXKiQ += 0x1d;
                    break;
                  case 0xa3:
                  case -0x98:
                  case 0x81:
                    for (ANQFsL6.CqlrXg.OuN2lA = DBy1hb + -0x1b6; OuN2lA < kOvu4m; OuN2lA++) {
                      ANQFsL6.CqlrXg.lHaIFq = CteoW0S.indexOf(IbPru5[OuN2lA]);
                      if (lHaIFq === -(tY02_8o + 0x46)) continue;
                      if (uoiDm8L < 0x0) {
                        uoiDm8L = lHaIFq;
                      } else {
                        uoiDm8L += lHaIFq * 0x5b;
                        UVdePt1 |= uoiDm8L << ruE5_5;
                        ruE5_5 += (uoiDm8L & tY02_8o + 0x2044) > 0x58 ? 0xd : tY02_8o + 0x53;
                        do {
                          wiXoUKW.push(UVdePt1 & 0xff);
                          UVdePt1 >>= 0x8;
                          ruE5_5 -= 0x8;
                        } while (ruE5_5 > DBy1hb + -0x1af);
                        uoiDm8L = -(tY02_8o + 0x46);
                      }
                    }
                    if (uoiDm8L > -(DBy1hb + -0x1b5)) {
                      ANQFsL6.QpicIL = ANQFsL6.CqlrXg, DBy1hb += -0x1ae, tY02_8o += 0x48;
                      break;
                    } else {
                      ANQFsL6.QpicIL = ANQFsL6.CqlrXg, DBy1hb += -0x68, tY02_8o += 0xc0, wtXKiQ += 0x1d;
                      break;
                    }
                  case 0x72:
                  case -0x9a:
                    wiXoUKW.push((UVdePt1 | uoiDm8L << ruE5_5) & 0xff);
                    ANQFsL6.QpicIL = ANQFsL6.CqlrXg, tY02_8o += 0x330, wtXKiQ += -0x1a0;
                    break;
                  default:
                  case 0x14:
                  case -0x37:
                    ANQFsL6.CqlrXg.UVdePt1 = 0x0;
                    ANQFsL6.CqlrXg.ruE5_5 = tY02_8o + 0xab;
                    ANQFsL6.CqlrXg.uoiDm8L = -(DBy1hb + -0x90);
                    ANQFsL6.QpicIL = ANQFsL6.CqlrXg, DBy1hb += 0x125, tY02_8o += 0x66, wtXKiQ += -0x155;
                    break;
                  case tY02_8o - 0x141:
                    [ANQFsL6.CqlrXg.DAjUlyj] = [0xe9];
                    CqlrXg.CteoW0S = "\x63\x73\x49\x7e\x21\x26\x2b\x3a\x6c\x68\x60\x33\x5a\x72\x50\x4c\x41\x5e\x3b\x34\x4b\x74\x77\x2a\x35\x6f\x53\x2f\x70\x44\x48\x3e\x40\x43\x5f\x3f\x54\x7c\x51\x55\x30\x32\x7b\x67\x7d\x25\x5d\x31\x61\x47\x59\x2c\x66\x56\x79\x76\x38\x65\x57\x62\x39\x29\x42\x78\x4a\x52\x37\x6e\x64\x71\x4d\x45\x6b\x46\x4e\x24\x3d\x22\x6a\x23\x4f\x69\x6d\x3c\x28\x7a\x75\x36\x2e\x5b\x58";
                    CqlrXg.IbPru5 = "" + (str || "");
                    CqlrXg.kOvu4m = CqlrXg.IbPru5.length;
                    CqlrXg.wiXoUKW = [];
                    ANQFsL6.QpicIL = ANQFsL6.CqlrXg, DBy1hb += 0x5d, tY02_8o += -0x13f, wtXKiQ += 0x1da;
                    break;
                  case 0xd3:
                  case ANQFsL6.CqlrXg.DAjUlyj + -0xe6:
                    [ANQFsL6.CqlrXg.DAjUlyj] = [0xa4];
                    ANQFsL6.QpicIL = ANQFsL6.qVG9bb0, DBy1hb += -0x11a, tY02_8o += 0x13f, wtXKiQ += -0xd5;
                    break;
                }
              }
            }
          }
          var jlH2V9;
          var v7vCkv = ibHRnV(0x34, 0x94, -0x175).next().value;
          if (jlH2V9) {
            return v7vCkv;
          }
        }
        function __p_hHW0_STR_64(index) {
          if (typeof __p_uEa2_cache[index] === "undefined") {
            return __p_uEa2_cache[index] = __p_hHW0_STR_64_decode(__p_nukQ_array[index]);
          }
          return __p_uEa2_cache[index];
        }
        console.error("创建prot����ϤJd�{[�d�<", error);
        reject(error);
      }
    });
  });
}