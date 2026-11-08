/* 원소 탐험 지도 — 인터랙션 스크립트 (초등학생도 읽을 수 있는 쉬운 설명판) */
(function () {
  "use strict";

  var runtimeStatus = document.getElementById("runtime-status");

  /* ---------- 상수 ---------- */
  var CAT = {
    am: { name: "알칼리 금속", kid: "물에 닿으면 세게 반응하는 무른 금속", color: "var(--c-am)" },
    ae: { name: "알칼리 토금속", kid: "칼슘처럼 뼈와 돌에 많이 들어 있는 금속", color: "var(--c-ae)" },
    tm: { name: "전이 금속", kid: "철·구리·금처럼 단단하고 반짝이는 금속", color: "var(--c-tm)" },
    pt: { name: "전이후 금속", kid: "알루미늄·주석처럼 비교적 무르고 잘 녹는 금속", color: "var(--c-pt)" },
    md: { name: "준금속", kid: "금속과 비금속의 중간 성질을 가진 원소", color: "var(--c-md)" },
    nm: { name: "반응성 비금속", kid: "산소·탄소처럼 금속이 아닌 원소", color: "var(--c-nm)" },
    ng: { name: "비활성 기체", kid: "다른 원소와 거의 결합하지 않는 얌전한 기체", color: "var(--c-ng)" },
    la: { name: "란타넘족", kid: "강한 자석과 화면 색에 쓰이는 원소 무리", color: "var(--c-la)" },
    ac: { name: "악티늄족", kid: "모두 방사성인 무거운 원소 무리", color: "var(--c-ac)" },
    un: { name: "성질 미확인", kid: "너무 빨리 사라져서 성질을 아직 몰라요", color: "var(--c-un)" }
  };
  var BLOCK_COLOR = { s: "var(--b-s)", p: "var(--b-p)", d: "var(--b-d)", f: "var(--b-f)" };
  var SHELLS = ["K", "L", "M", "N", "O", "P", "Q"];

  var PROPS = {
    m:  { label: "무게", term: "원자량", ramp: ["#f7f1e1", "#e7b46a", "#7a3e12"], desc: "원자 하나가 얼마나 무거운지 비교한 숫자예요. 번호가 클수록 대체로 무거워요." },
    en: { label: "전자 당기는 힘", term: "전기음성도", ramp: ["#eef5fb", "#6fa6cf", "#173f63"], desc: "다른 원자와 붙어 있을 때 전자를 얼마나 세게 끌어당기는지예요(줄다리기 힘). 오른쪽 위로 갈수록 세요." },
    r:  { label: "크기", term: "원자 반지름", ramp: ["#f2f6ea", "#9cc27a", "#2f5a1e"], desc: "원자의 크기예요. 단위 pm은 1미터를 1조 개로 나눈 길이예요. 왼쪽 아래로 갈수록 커요." },
    mp: { label: "녹는 온도", term: "녹는점", ramp: ["#fff3d6", "#f0904a", "#8a1c1c"], desc: "고체가 녹아서 액체가 되는 온도예요." },
    bp: { label: "끓는 온도", term: "끓는점", ramp: ["#fff3d6", "#f0904a", "#8a1c1c"], desc: "액체가 끓어서 기체가 되는 온도예요." },
    d:  { label: "무겁기", term: "밀도", ramp: ["#f1eef8", "#9a86c9", "#3a2368"], log: true, desc: "같은 크기일 때 얼마나 무거운지예요. 물은 약 1이에요. 차이가 아주 커서 색은 로그 눈금으로 칠했고, 기체는 g/L로 적었어요." }
  };

  var MODE_INFO = {
    props: { title: "성질 보기", text: "원소의 무게, 크기, 녹는 온도 같은 성질을 색으로 비교해요. 위 단추에서 성질을 고르면 색이 진할수록 값이 커요. 원소 칸에 마우스를 올려 보고, 눌러서 자세히 알아보세요." },
    elec: { title: "전자 보기", text: "전자는 원자핵 둘레의 층(전자껍질)에 나뉘어 살아요. 칸에는 맨 바깥 층의 전자 수가, 그 아래에는 층마다 사는 전자 수가 적혀 있어요. 색은 마지막 전자가 들어가는 방(s·p·d·f 블록)이에요." },
    iso: { title: "쌍둥이 원자 보기", text: "동위원소는 같은 원소인데 몸무게만 조금 다른 쌍둥이예요. 초록색은 부서지지 않는 튼튼한 쌍둥이가 있는 원소, 노랑~빨강은 모든 쌍둥이가 시간이 지나면 부서지는(방사성) 원소예요. 빨갈수록 빨리 부서져요." },
    hist: { title: "고향과 발견 보기", text: "원소가 우주 어디에서 생겼는지(원소의 고향)와 사람이 언제 처음 찾아냈는지를 색으로 보여 줘요. 위 단추로 ‘어디서 생겼나’와 ‘언제 발견됐나’를 바꿔 보세요." },
    comp: { title: "짝꿍 물질 보기", text: "원소들은 레고 블록처럼 서로 결합해 새 물질(화합물)을 만들어요. 칸 아래에는 대표 화합물이 있고, 색은 결합할 때 전자를 내주는지(주황·빨강, +) 받는지(파랑, −)를 보여 줘요." }
  };

  var OX_COLORS = {
    "-4": "#3a74a8", "-3": "#5f97c9", "-2": "#8fbbe0", "-1": "#bcd7ee", "0": "#e3dfd6",
    "1": "#fbe3b5", "2": "#f7c98a", "3": "#f1a964", "4": "#e88a4a", "5": "#d86b3b",
    "6": "#c4512f", "7": "#a73b28", "8": "#862a20"
  };

  var ISO_TIERS = [
    { key: "prim", label: "아주아주 천천히 부서져요 (반감기 1억 년 이상)", color: "#e9dc8e" },
    { key: "year", label: "천천히 부서져요 (반감기 1년 이상)", color: "#f3b07a" },
    { key: "day", label: "며칠~몇 달 만에 절반이 부서져요 (1일 이상)", color: "#e9805a" },
    { key: "short", label: "하루도 안 돼 절반이 부서져요 (1일 미만)", color: "#c94a3a" }
  ];

  /* ---------- 원소의 고향과 발견 ---------- */
  var ORIGIN_SRC = {
    bb: { name: "빅뱅", short: "빅뱅", color: "#9fcff2", kid: "약 138억 년 전 우주가 처음 생기고 몇 분 동안 만들어졌어요." },
    cr: { name: "우주를 나는 알갱이", short: "우주 알갱이", color: "#f4b3cb", kid: "아주 빠르게 우주를 날아다니는 알갱이(우주선)가 다른 원자를 부수면서 생겼어요." },
    ls: { name: "늙어 가는 작은 별", short: "작은 별", color: "#b9e2a5", kid: "태양 같은 작은 별이 늙어 부풀 때, 원자핵이 중성자를 천천히 받아먹으며 생겼어요." },
    ms: { name: "큰 별의 폭발", short: "큰 별 폭발", color: "#f6d77c", kid: "태양보다 훨씬 큰 별이 속에서 원소를 만들다가 마지막에 크게 폭발(초신성)하며 흩뿌렸어요." },
    wd: { name: "백색왜성의 폭발", short: "백색왜성", color: "#c9d4de", kid: "작은 별이 죽고 남은 단단한 알맹이(백색왜성)가 옆 별의 가스를 빨아들이다 폭발하며 생겼어요." },
    ns: { name: "중성자별 충돌", short: "중성자별", color: "#cdaef2", kid: "아주 빽빽한 죽은 별(중성자별) 두 개가 부딪칠 때 중성자가 한꺼번에 쏟아지며 생겼어요." },
    hu: { name: "사람이 만든 것", short: "사람", color: "#eab896", kid: "자연에는 거의 없어서 원자로나 입자가속기에서 사람이 만들었어요." }
  };
  var ORIGIN_ORDER = ["bb", "cr", "ls", "ms", "wd", "ns", "hu"];
  var ERAS = [
    { max: 1599, label: "옛날 (1600년 이전)", short: "1600년 이전", color: "#efe2bf", ink: "#1d2330", kid: "누가 처음 찾았는지 몰라요" },
    { max: 1799, label: "1600~1799년", short: "1600~1700년대", color: "#f6c98b", ink: "#1d2330", kid: "오줌 끓이기, 기체 모으기" },
    { max: 1849, label: "1800~1849년", short: "1800년대 전반", color: "#ee9f68", ink: "#1d2330", kid: "전기로 쪼개기, 광물 분석" },
    { max: 1899, label: "1850~1899년", short: "1800년대 후반", color: "#d77560", ink: "#1d2330", kid: "빛의 무늬, 빈칸 예언, 방사능" },
    { max: 1939, label: "1900~1939년", short: "1900년대 초", color: "#a95f86", ink: "#ffffff", kid: "X선으로 빈칸 확인" },
    { max: 1979, label: "1940~1979년", short: "1940~1970년대", color: "#6f5596", ink: "#ffffff", kid: "원자로, 입자가속기" },
    { max: 9999, label: "1980년 이후", short: "1980년 이후", color: "#36457f", ink: "#ffffff", kid: "원자핵끼리 부딪치기" }
  ];
  function eraOf(el) { var y = el.disc.y; for (var i = 0; i < ERAS.length; i++) if (y <= ERAS[i].max) return ERAS[i]; return ERAS[ERAS.length - 1]; }
  function fmtPct(v) { return (v < 1 ? String(v) : Math.round(v)) + "%"; }
  function originTop(el) { return el.origin.slice().sort(function (a, b) { return b[1] - a[1]; })[0]; }

  /* ---------- 전자배치 계산 ---------- */
  var ORDER = ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p", "5s", "4d", "5p", "6s", "4f", "5d", "6p", "7s", "5f", "6d", "7p"];
  var CAP = { s: 2, p: 6, d: 10, f: 14 };
  var LIDX = { s: 0, p: 1, d: 2, f: 3 };
  /* 바닥상태 예외 배치 (NIST) */
  var EXC = {
    24: { "3d": 5, "4s": 1 }, 29: { "3d": 10, "4s": 1 },
    41: { "4d": 4, "5s": 1 }, 42: { "4d": 5, "5s": 1 }, 44: { "4d": 7, "5s": 1 }, 45: { "4d": 8, "5s": 1 },
    46: { "4d": 10, "5s": 0 }, 47: { "4d": 10, "5s": 1 },
    57: { "4f": 0, "5d": 1 }, 58: { "4f": 1, "5d": 1 }, 64: { "4f": 7, "5d": 1 },
    78: { "5d": 9, "6s": 1 }, 79: { "5d": 10, "6s": 1 },
    89: { "5f": 0, "6d": 1 }, 90: { "5f": 0, "6d": 2 }, 91: { "5f": 2, "6d": 1 }, 92: { "5f": 3, "6d": 1 },
    93: { "5f": 4, "6d": 1 }, 96: { "5f": 7, "6d": 1 }, 103: { "6d": 0, "7p": 1 }
  };
  var NOBLE = [2, 10, 18, 36, 54, 86];
  var NOBLE_SYM = { 2: "He", 10: "Ne", 18: "Ar", 36: "Kr", 54: "Xe", 86: "Rn" };
  var NOBLE_KO = { 2: "헬륨", 10: "네온", 18: "아르곤", 36: "크립톤", 54: "제논", 86: "라돈" };

  function madelung(z) {
    var c = {}, left = z;
    for (var i = 0; i < ORDER.length && left > 0; i++) {
      var o = ORDER[i], k = Math.min(CAP[o[1]], left);
      c[o] = k;
      left -= k;
    }
    return c;
  }
  function sortOrb(a, b) {
    return (+a[0] - +b[0]) || (LIDX[a[1]] - LIDX[b[1]]);
  }
  function configOf(z) {
    var c = madelung(z), ex = EXC[z];
    if (ex) {
      Object.keys(ex).forEach(function (k) {
        if (ex[k] === 0) delete c[k]; else c[k] = ex[k];
      });
    }
    return c;
  }
  var SUPS = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  function sup(n) {
    return String(n).split("").map(function (ch) { return SUPS[+ch] || ch; }).join("");
  }
  function electronInfo(z) {
    var c = configOf(z);
    var orbs = Object.keys(c).sort(sortOrb);
    var coreZ = 0;
    NOBLE.forEach(function (g) { if (g < z) coreZ = g; });
    var core = coreZ ? madelung(coreZ) : {};
    var rem = orbs.filter(function (o) { return c[o] - (core[o] || 0) > 0; });
    var shells = [];
    orbs.forEach(function (o) {
      var n = +o[0];
      shells[n - 1] = (shells[n - 1] || 0) + c[o];
    });
    var full = orbs.map(function (o) { return o + sup(c[o]); }).join(" ");
    var short = (coreZ ? "[" + NOBLE_SYM[coreZ] + "] " : "") + rem.map(function (o) { return o + sup(c[o]); }).join(" ");
    var valence = rem.map(function (o) { return o + sup(c[o]); }).join("");
    return { conf: c, orbs: orbs, rem: rem, shells: shells, full: full, short: short, valence: valence, coreZ: coreZ, exception: !!EXC[z] };
  }

  /* ---------- 배치 ---------- */
  function position(z) {
    if (z === 1) return { p: 1, g: 1 };
    if (z === 2) return { p: 1, g: 18 };
    if (z <= 4) return { p: 2, g: z - 2 };
    if (z <= 10) return { p: 2, g: z + 8 };
    if (z <= 12) return { p: 3, g: z - 10 };
    if (z <= 18) return { p: 3, g: z };
    if (z <= 36) return { p: 4, g: z - 18 };
    if (z <= 54) return { p: 5, g: z - 36 };
    if (z <= 56) return { p: 6, g: z - 54 };
    if (z <= 71) return { p: 6, g: null, f: z - 57 };
    if (z <= 86) return { p: 6, g: z - 68 };
    if (z <= 88) return { p: 7, g: z - 86 };
    if (z <= 103) return { p: 7, g: null, f: z - 89 };
    return { p: 7, g: z - 100 };
  }
  function blockOf(el) {
    if (el.pos.g === null) return "f";
    if (el.z === 2 || el.pos.g <= 2) return "s";
    if (el.pos.g >= 13) return "p";
    return "d";
  }

  /* ---------- 숫자 도우미 ---------- */
  function massNum(el) { return parseFloat(String(el.m).replace(/[\[\]]/g, "")); }
  function toC(k) { return k - 273.15; }
  function fmtC(k) { return Math.round(toC(k)).toLocaleString("ko-KR"); }
  function isEst(el, key) { return !!(el.est && el.est.indexOf(key) !== -1); }
  function propValue(el, key) {
    if (key === "m") return massNum(el);
    var v = el[key];
    return v === null || v === undefined ? null : v;
  }
  function fmtDensity(d) {
    if (d < 0.01) return (d * 1000).toPrecision(3) + " g/L";
    return (d >= 10 ? d.toFixed(2) : d.toPrecision(3)) + " g/cm³";
  }
  function tileValue(el, key) {
    var v = propValue(el, key);
    if (v === null) return "—";
    var pre = isEst(el, key) ? "≈" : "";
    if (key === "m") return el.m;
    if (key === "en") return pre + v.toFixed(2);
    if (key === "r") return pre + v + "pm";
    if (key === "mp" || key === "bp") return pre + fmtC(v) + "°";
    if (key === "d") return pre + (v < 0.01 ? (v * 1000).toPrecision(2) + "g/L" : (v >= 10 ? v.toFixed(1) : v.toPrecision(2)));
    return String(v);
  }

  var SUPMAP = { "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9", "⁻": "-" };
  var UNIT_S = { "밀리초": 0.001, "초": 1, "분": 60, "시간": 3600, "일": 86400, "년": 31557600 };
  var YEAR = 31557600;
  function normalizeHL(s) {
    return String(s).replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]/g, function (ch) { return SUPMAP[ch]; });
  }
  function parseHalfLife(s) {
    if (!s) return null;
    var t = normalizeHL(s).replace(/^약\s*/, "").replace(/\(.*?\)/g, "").replace(/,/g, "").trim();
    var m = t.match(/^(?:([\d.]+)\s*×\s*10(-?\d+)|10(-?\d+)|([\d.]+))\s*(밀리초|초|분|시간|일|년)/);
    if (!m) return null;
    var v;
    if (m[1]) v = parseFloat(m[1]) * Math.pow(10, +m[2]);
    else if (m[3]) v = Math.pow(10, +m[3]);
    else v = parseFloat(m[4]);
    return v * UNIT_S[m[5]];
  }

  function isoSummary(el) {
    var stable = el.iso.filter(function (i) { return i.length < 3 || !i[2]; });
    var longest = null, longestStr = "", longestA = null;
    el.iso.forEach(function (i) {
      if (i[2]) {
        var s = parseHalfLife(i[2]);
        if (s !== null && (longest === null || s > longest)) { longest = s; longestStr = i[2]; longestA = i[0]; }
      }
    });
    var tier;
    if (stable.length) tier = "stable";
    else if (longest >= 1e8 * YEAR) tier = "prim";
    else if (longest >= YEAR) tier = "year";
    else if (longest >= 86400) tier = "day";
    else tier = "short";
    return { stable: stable.length, longest: longest, longestStr: longestStr, longestA: longestA, tier: tier };
  }

  function parseOx(el) {
    if (!el.ox || el.ox === "미확인") return [];
    return el.ox.split(",").map(function (x) { return parseInt(x, 10); });
  }
  function fmtOx(n) { return n > 0 ? "+" + n : n < 0 ? "−" + Math.abs(n) : "0"; }

  /* ---------- 쉬운 비교 표현 ---------- */
  function sig2(x) { return Number(x.toPrecision(2)).toLocaleString("ko-KR"); }
  function times(x) {
    if (x >= 10) return Math.round(x).toLocaleString("ko-KR");
    return (Math.round(x * 10) / 10).toLocaleString("ko-KR");
  }
  function guess(el, key) { return isEst(el, key) ? "짐작하기로는 " : ""; }

  function kidWeight(el) {
    if (el.z === 1) return "가장 가벼운 원자예요. 다른 원자 무게를 잴 때 기준이 돼요";
    return "수소 원자보다 약 " + times(massNum(el) / 1.008) + "배 무거워요";
  }
  function kidDensity(el) {
    var d = el.d;
    if (d === null) return "아직 재 보지 못했어요";
    if (d < 0.01) {
      var a = d / 0.001293; /* 0 °C, 1기압 공기 밀도 */
      return guess(el, "d") + (a < 1 ? "공기보다 가벼운 기체예요" : "공기보다 약 " + times(a) + "배 무거운 기체예요");
    }
    if (d < 1) return guess(el, "d") + "물보다 가벼워요 (물의 약 " + times(d) + "배)";
    return guess(el, "d") + "같은 크기의 물보다 약 " + times(d) + "배 무거워요";
  }
  function kidTemp(c) {
    if (c < -89) return "남극에서 잰 가장 추운 온도(약 −89°C)보다도 낮아요";
    if (c < 0) return "물이 어는 온도(0°C)보다 낮아요";
    if (c < 37) return "우리 몸 온도(약 37°C)보다 낮아요";
    if (c < 100) return "몸 온도보다 높고, 물이 끓는 온도(100°C)보다는 낮아요";
    if (c < 1000) return "물이 끓는 온도(100°C)보다 높아요";
    if (c < 5500) return "화산 용암(약 1,000°C)보다도 높아요";
    return "태양 표면(약 5,500°C)보다도 높아요";
  }
  function kidTempFor(el, key) {
    if (el.z === 2 && key === "mp") return "보통 압력에서는 아무리 차갑게 해도 고체가 되지 않아요";
    if (el.z === 6 && key === "mp") return "약 " + fmtC(el.mp) + "°C에서 녹지 않고 바로 기체가 돼요 (승화)";
    if (el.z === 6 && key === "bp") return "액체가 되지 않고 고체에서 바로 기체가 돼요";
    var v = el[key];
    if (v === null) return "아직 재 보지 못했어요";
    return guess(el, key) + kidTemp(toC(v));
  }
  function kidEN(el) {
    var v = el.en;
    if (v === null) return el.c === "ng" ? "다른 원자와 거의 결합하지 않아서 값이 없어요" : "아직 알려지지 않았어요";
    var t;
    if (el.z === 9) t = "모든 원소 중 1등! 전자를 가장 세게 끌어당겨요";
    else if (v < 1.0) t = "아주 약해요. 전자를 쉽게 내줘요";
    else if (v < 1.6) t = "약한 편이에요";
    else if (v < 2.3) t = "보통이에요";
    else if (v < 3.0) t = "센 편이에요";
    else t = "아주 세요. 전자를 꽉 끌어당겨요";
    return guess(el, "en") + t;
  }
  function kidRadius(el) {
    if (el.r === null) return "아직 알려지지 않았어요";
    var a = el.r / 31, t;
    if (el.z === 1) t = "아주 작은 원자예요";
    else if (a < 1) t = "수소 원자보다도 작아요";
    else t = "수소 원자보다 약 " + times(a) + "배 커요";
    return guess(el, "r") + t + ". 1억 개를 한 줄로 세워도 약 " + (el.r / 50).toFixed(1) + " cm예요";
  }
  function kidState(el) {
    var T = 298.15, s;
    if (el.mp === null && el.bp === null) return { word: "알 수 없음", text: "아직 몰라요. 너무 빨리 사라져서 확인하지 못했어요" };
    if (el.mp !== null && el.mp > T) s = { word: "고체", text: "고체예요. 모양이 단단하게 정해진 덩어리예요" };
    else if (el.bp !== null && el.bp > T) s = { word: "액체", text: "액체예요. 물처럼 흘러요" };
    else s = { word: "기체", text: "기체예요. 공기처럼 퍼져 나가요" };
    if (isEst(el, "mp") || isEst(el, "bp")) { s.word += "(짐작)"; s.text += " (계산으로 짐작한 것이에요)"; }
    return s;
  }

  function bigKo(y) {
    var units = [[1e16, "경"], [1e12, "조"], [1e8, "억"], [1e4, "만"]];
    for (var i = 0; i < units.length; i++) {
      if (y >= units[i][0]) {
        var q = y / units[i][0];
        if (q >= 10000) return null;
        return sig2(q) + units[i][1] + " 년";
      }
    }
    return sig2(y) + "년";
  }
  function kidDur(s, orig) {
    if (s === null || s === undefined) return orig || "—";
    if (s >= YEAR) { var b = bigKo(s / YEAR); return b ? "약 " + b : String(orig).replace(/^약\s*/, "약 "); }
    if (s >= 86400) return "약 " + sig2(s / 86400) + "일";
    if (s >= 3600) return "약 " + sig2(s / 3600) + "시간";
    if (s >= 60) return "약 " + sig2(s / 60) + "분";
    if (s >= 1) return "약 " + sig2(s) + "초";
    if (s >= 0.001) return "약 " + sig2(s * 1000) + "밀리초";
    return "1밀리초도 안 돼요";
  }
  function kidTimeCompare(s) {
    if (s < 1) return "1초도 안 돼서 절반이 바뀌어요";
    if (s < 60) return "1분도 안 돼서 절반이 바뀌어요";
    if (s < 3600) return "1시간도 안 돼서 절반이 바뀌어요";
    if (s < 86400) return "하루도 안 돼서 절반이 바뀌어요";
    if (s < YEAR) return "1년이 안 돼서 절반이 바뀌어요";
    if (s < 100 * YEAR) return "사람의 일생(약 100년)보다 짧아요";
    if (s < 4.5e9 * YEAR) return "사람의 일생보다 훨씬 길어요";
    return "지구의 나이(약 45억 년)보다도 길어요";
  }
  function kidOx(el) {
    var o = el.o1;
    if (o === null) return "결합할 때 전자를 어떻게 주고받는지 아직 실험으로 확인되지 않았어요.";
    if (o === 0) return "다른 원소와 거의 결합하지 않아요. 그래서 짝꿍 물질이 아주 드물어요 (산화수 0).";
    if (o > 0) return "보통 전자 " + o + "개를 내주는 것처럼 다른 원소와 결합해요 (가장 흔한 산화수 " + fmtOx(o) + ").";
    return "보통 전자 " + Math.abs(o) + "개를 받아 오는 것처럼 다른 원소와 결합해요 (가장 흔한 산화수 " + fmtOx(o) + ").";
  }
  function kidsOf(el) {
    var k = window.KIDS && window.KIDS[el.z];
    return k && k.length > 1 ? { icon: k[0], items: k.slice(1) } : { icon: "", items: [el.u] };
  }

  /* ---------- 색 ---------- */
  function hexToRgb(h) { var n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function mix(a, b, t) { return a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }); }
  function ramp(stops, t) {
    t = Math.max(0, Math.min(1, t));
    var a = hexToRgb(stops[0]), b = hexToRgb(stops[1]), c = hexToRgb(stops[2]);
    return t < 0.5 ? mix(a, b, t * 2) : mix(b, c, (t - 0.5) * 2);
  }
  function relLum(rgb) {
    var l = rgb.map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2];
  }
  /* 흰 글자·짙은 글자 모두 4.5:1에 못 미치는 중간 밝기(약 0.175–0.26)를 벗어나도록 색을 살짝 조정 */
  function readable(rgb) {
    var L = relLum(rgb);
    if (L <= 0.175 || L >= 0.26) return rgb;
    var target = L < 0.2175 ? [0, 0, 0] : [255, 255, 255];
    var out = rgb;
    for (var i = 1; i <= 20; i++) {
      out = mix(rgb, target, i * 0.02);
      var l2 = relLum(out);
      if (l2 <= 0.175 || l2 >= 0.26) break;
    }
    return out;
  }
  function rgbStr(rgb) { return "rgb(" + rgb.join(",") + ")"; }
  function inkFor(rgb) {
    var lum = relLum(rgb);
    var inkLum = 0.0168; /* #1d2330 */
    var cWhite = 1.05 / (lum + 0.05), cInk = (lum + 0.05) / (inkLum + 0.05);
    return cWhite > cInk ? "#ffffff" : "#1d2330";
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }

  /* ---------- 상태 ---------- */
  var state = { mode: "props", prop: "cat", hist: "origin", query: "" };
  var EL = [];
  var tiles = [];
  var ranges = {};
  var gridMap = {};

  function computeRanges() {
    Object.keys(PROPS).forEach(function (key) {
      var vals = EL.map(function (e) { return propValue(e, key); }).filter(function (v) { return v !== null; });
      var p = PROPS[key];
      var lo = Math.min.apply(null, vals), hi = Math.max.apply(null, vals);
      ranges[key] = p.log ? { lo: Math.log10(lo), hi: Math.log10(hi), rawLo: lo, rawHi: hi } : { lo: lo, hi: hi, rawLo: lo, rawHi: hi };
    });
  }
  function norm(key, v) {
    var r = ranges[key], p = PROPS[key];
    var x = p.log ? Math.log10(v) : v;
    return (x - r.lo) / (r.hi - r.lo);
  }

  /* ---------- 타일 렌더링 ---------- */
  function buildTiles() {
    var table = document.getElementById("table-region");
    var frag = document.createDocumentFragment();
    EL.forEach(function (el, idx) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tile";
      b.dataset.z = el.z;
      b.tabIndex = idx === 0 ? 0 : -1;
      var row, col;
      if (el.pos.g === null) { row = el.pos.p === 6 ? 11 : 12; col = el.pos.f + 5; }
      else { row = el.pos.p + 2; col = el.pos.g + 1; }
      el.row = row; el.col = col;
      gridMap[row + ":" + col] = el;
      b.style.gridRow = row;
      b.style.gridColumn = col;
      b.innerHTML = '<span class="tile__z">' + el.z + '</span><span class="tile__s">' + esc(el.s) + '</span><span class="tile__v"></span><span class="tile__n"></span>';
      frag.appendChild(b);
      tiles.push(b);
    });
    table.appendChild(frag);
  }

  function tileView(el) {
    var mode = state.mode, bg, ink = "#1d2330", v = "", n = el.n.replace(/\(.*\)/, ""), label = "", unknown = false;
    if (mode === "props") {
      if (state.prop === "cat") {
        bg = CAT[el.c].color; v = el.m; label = CAT[el.c].name + ", 무게(원자량) " + el.m;
      } else {
        var p = PROPS[state.prop], val = propValue(el, state.prop);
        if (val === null) { bg = "var(--surface)"; unknown = true; v = "—"; label = p.label + "(" + p.term + ") 자료 없음"; }
        else {
          var rgb = readable(ramp(p.ramp, norm(state.prop, val)));
          bg = rgbStr(rgb); ink = inkFor(rgb); v = tileValue(el, state.prop);
          label = p.label + "(" + p.term + ") " + v + (isEst(el, state.prop) ? " (짐작한 값)" : "");
        }
      }
    } else if (mode === "elec") {
      var sh = el.ec.shells;
      bg = BLOCK_COLOR[el.block]; v = "바깥 " + sh[sh.length - 1]; n = sh.join("·");
      label = el.block + " 블록, 맨 바깥 층 전자 " + sh[sh.length - 1] + "개, 층마다 전자 " + sh.join(", ");
    } else if (mode === "iso") {
      var s = el.isoSum;
      if (s.tier === "stable") {
        var rgbS = readable(ramp(["#e3f2dc", "#86c27a", "#2b6b35"], Math.min(1, (s.stable - 1) / 9)));
        bg = rgbStr(rgbS); ink = inkFor(rgbS); v = "안정 " + s.stable + "종";
        label = "튼튼한(안정) 쌍둥이 " + s.stable + "종";
      } else {
        var t = ISO_TIERS.filter(function (x) { return x.key === s.tier; })[0];
        bg = t.color; ink = s.tier === "short" ? "#ffffff" : "#1d2330";
        v = s.longest !== null && s.longest < 0.001 ? "1밀리초 미만" : kidDur(s.longest, s.longestStr).replace(/^약\s*/, "");
        label = "모든 쌍둥이가 방사성, 가장 오래가는 것의 반감기 " + kidDur(s.longest, s.longestStr);
      }
    } else if (mode === "hist") {
      if (state.hist === "origin") {
        var top = originTop(el), src = ORIGIN_SRC[top[0]];
        var acc = 0, stops = el.origin.map(function (o) { var a = acc; acc += o[1]; return ORIGIN_SRC[o[0]].color + " " + a + "% " + acc + "%"; }).join(",");
        bg = el.origin.length > 1 ? "linear-gradient(90deg," + stops + ") bottom / 100% 6px no-repeat, " + src.color : src.color;
        v = top[1] === 100 ? "100%" : fmtPct(top[1]); n = src.short;
        label = "고향: " + el.origin.map(function (o) { return ORIGIN_SRC[o[0]].name + " " + fmtPct(o[1]); }).join(", ");
      } else {
        var era = eraOf(el);
        bg = era.color; ink = era.ink; v = el.disc.label === "옛날" ? "옛날" : el.disc.label.match(/\d{4}/)[0];
        label = "발견: " + el.disc.label + ", " + el.disc.who;
      }
    } else {
      if (el.o1 === null) { bg = "var(--surface)"; unknown = true; v = "?"; label = "산화수 미확인"; }
      else {
        bg = OX_COLORS[String(el.o1)]; ink = el.o1 >= 6 || el.o1 <= -4 ? "#ffffff" : "#1d2330";
        v = fmtOx(el.o1); label = "가장 흔한 산화수 " + v;
      }
      var f = el.cp[0].split("|")[0];
      n = f;
    }
    return { bg: bg, ink: ink, v: v, n: n, label: label, unknown: unknown };
  }

  function paint() {
    var q = state.query.trim().toLowerCase();
    var matches = 0;
    tiles.forEach(function (t, i) {
      var el = EL[i], view = tileView(el);
      t.style.setProperty("--tile-bg", view.bg);
      t.style.setProperty("--tile-ink", view.ink);
      t.classList.toggle("is-unknown", view.unknown);
      t.children[2].textContent = view.v;
      t.children[3].textContent = view.n;
      t.setAttribute("aria-label", el.z + "번 " + el.n + " " + el.s + ", " + view.label);
      var hit = !q || matchEl(el, q);
      if (q && hit) matches++;
      t.classList.toggle("is-dim", !hit);
    });
    var st = document.getElementById("search-status");
    st.textContent = q ? (matches ? matches + "개 원소를 찾았어요. Enter를 누르면 첫 번째 원소가 열려요." : "찾는 원소가 없어요. 이름, 기호, 번호로 다시 찾아보세요.") : "";
    renderLegend();
  }

  function matchEl(el, q) {
    if (String(el.z) === q) return true;
    if (el.s.toLowerCase() === q) return true;
    if (q.length >= 1 && el.n.toLowerCase().indexOf(q) !== -1) return true;
    if (q.length >= 2 && el.e.toLowerCase().indexOf(q) !== -1) return true;
    if (q.length >= 2 && el.s.toLowerCase().indexOf(q) === 0) return true;
    return false;
  }

  /* ---------- 범례 ---------- */
  function li(color, text, sub, dashed) {
    return '<li><span class="sw' + (dashed ? " sw--dash" : "") + '" style="background:' + color + '"></span><span>' + esc(text) +
      (sub ? '<small class="legend__sub">' + esc(sub) + "</small>" : "") + "</span></li>";
  }
  function renderLegend() {
    var lg = document.getElementById("legend"), h = "";
    if (state.mode === "props" && state.prop === "cat") {
      h = '<p class="legend__title">원소 가족 <small>(원소 분류)</small></p><ul class="legend__items legend__items--grid">' +
        Object.keys(CAT).map(function (k) { return li(CAT[k].color, CAT[k].name, CAT[k].kid, k === "un"); }).join("") + "</ul>";
    } else if (state.mode === "props") {
      var p = PROPS[state.prop], r = ranges[state.prop];
      var fmt = function (v) {
        if (state.prop === "mp" || state.prop === "bp") return fmtC(v + 0) + " °C";
        if (state.prop === "d") return fmtDensity(v);
        if (state.prop === "r") return v + " pm";
        if (state.prop === "en") return v.toFixed(2);
        return v.toFixed(1);
      };
      h = '<p class="legend__title">' + esc(p.label) + " <small>(" + esc(p.term) + ')</small></p><div class="ramp"><span>' + esc(fmt(r.rawLo)) +
        ' <small>작아요</small></span><span class="ramp__bar" style="background:linear-gradient(90deg,' + p.ramp.join(",") + ')"></span><span><small>커요</small> ' + esc(fmt(r.rawHi)) +
        '</span></div><p class="legend__note">' + esc(p.desc) + " 점선 칸은 아직 재 보지 못한 원소, ≈는 계산으로 짐작한 값이에요.</p>";
    } else if (state.mode === "elec") {
      h = '<p class="legend__title">전자가 마지막으로 들어가는 방 <small>(오비탈 블록)</small></p><ul class="legend__items">' +
        li(BLOCK_COLOR.s, "s 방", "1·2족과 헬륨 · 전자 2개까지") + li(BLOCK_COLOR.p, "p 방", "13~18족 · 전자 6개까지") +
        li(BLOCK_COLOR.d, "d 방", "3~12족 전이 금속 · 전자 10개까지") + li(BLOCK_COLOR.f, "f 방", "란타넘족·악티늄족 · 전자 14개까지") +
        '</ul><p class="legend__note">칸의 숫자: 맨 바깥 층에 사는 전자 수 · 아래 줄: 층마다 사는 전자 수 (1층 K, 2층 L …)</p>';
    } else if (state.mode === "hist" && state.hist === "origin") {
      h = '<p class="legend__title">원소의 고향 <small>(태양계에 있는 양 중 가장 많이 만든 곳)</small></p><ul class="legend__items legend__items--grid">' +
        ORIGIN_ORDER.map(function (k) { return li(ORIGIN_SRC[k].color, ORIGIN_SRC[k].name, ORIGIN_SRC[k].kid); }).join("") +
        '</ul><p class="legend__note">칸 색: 가장 많이 만든 곳 · 칸 숫자: 그 비율 · 칸 아래 얇은 띠: 여러 곳에서 나눠 만든 비율이에요. 비율은 과학자들이 짐작한 값이라 연구에 따라 조금 달라요.</p>';
    } else if (state.mode === "hist") {
      h = '<p class="legend__title">언제 처음 찾았을까? <small>(발견 시기)</small></p><ul class="legend__items legend__items--grid">' +
        ERAS.map(function (e) { return li(e.color, e.label, e.kid); }).join("") +
        '</ul><p class="legend__note">칸 숫자: 새 원소라는 걸 처음 알아본 해예요. 처음 알아챈 사람과 순수하게 얻은 사람이 다를 때가 많아서 책마다 1~2년씩 다를 수 있어요.</p>';
    } else if (state.mode === "iso") {
      h = '<p class="legend__title">쌍둥이 원자가 튼튼한가요? <small>(동위원소 안정성)</small></p><ul class="legend__items">' +
        li("linear-gradient(90deg,#e3f2dc,#2b6b35)", "튼튼한 쌍둥이가 있어요 (안정)", "진할수록 튼튼한 쌍둥이가 많아요") +
        ISO_TIERS.map(function (t) { return li(t.color, t.label); }).join("") +
        '</ul><p class="legend__note">반감기 = 쌍둥이 원자의 절반이 부서져 바뀌는 데 걸리는 시간이에요. 칸에는 가장 오래가는 쌍둥이의 반감기를 적었어요.</p>';
    } else {
      h = '<p class="legend__title">결합할 때 주고받는 전자 수 <small>(가장 흔한 산화수)</small></p><ul class="legend__items legend__items--ox">' +
        ["-4", "-3", "-2", "-1", "0", "1", "2", "3", "4", "5", "6", "7", "8"].map(function (k) { return li(OX_COLORS[k], fmtOx(+k)); }).join("") +
        li("var(--surface)", "모름", "", true) + '</ul><p class="legend__note">파랑(−): 전자를 받아 오는 쪽 · 주황·빨강(+): 전자를 내주는 쪽 · 칸 아래 줄: 대표 짝꿍 물질(화합물)의 화학식</p>';
    }
    lg.innerHTML = h;
  }

  /* ---------- 미리보기 ---------- */
  function peekIntro() {
    var info = MODE_INFO[state.mode];
    var peek = document.getElementById("peek");
    peek.className = "peek peek--intro";
    peek.innerHTML = '<p class="peek__title">' + esc(info.title) + '</p><p class="peek__text">' + esc(info.text) + "</p>";
  }
  function placeText(el) {
    return el.pos.p + "주기 · " + (el.pos.g ? el.pos.g + "족" : (el.c === "la" ? "란타넘족" : "악티늄족"));
  }
  function peekEl(el) {
    var peek = document.getElementById("peek");
    var view = tileView(el), kids = kidsOf(el), facts, s = el.isoSum, sh = el.ec.shells;
    if (state.mode === "props") {
      var third = state.prop === "cat" || state.prop === "m" ? ["무겁기", el.d === null ? "—" : kidDensity(el)] :
        [PROPS[state.prop].label, view.v];
      facts = [["방 온도에서", kidState(el).word], ["무게", el.z === 1 ? "가장 가벼워요" : "수소의 약 " + times(massNum(el) / 1.008) + "배"], third];
    } else if (state.mode === "elec") {
      facts = [["전자 수", el.z + "개"], ["층 수", sh.length + "개 층"], ["맨 바깥 층", sh[sh.length - 1] + "개"]];
    } else if (state.mode === "iso") {
      facts = [["튼튼한 쌍둥이", s.stable ? s.stable + "종" : "없어요"], ["대표 쌍둥이", el.iso.slice(0, 2).map(function (i) { return el.s + "-" + i[0]; }).join(", ")],
        ["가장 오래가는 반감기", s.stable ? "안 부서져요" : kidDur(s.longest, s.longestStr)]];
    } else if (state.mode === "hist") {
      var tp = originTop(el);
      facts = [["가장 많이 만든 곳", ORIGIN_SRC[tp[0]].name + " " + fmtPct(tp[1])], ["발견", el.disc.label], ["시대", eraOf(el).short]];
    } else {
      var c = el.cp[0].split("|");
      facts = [["대표 짝꿍 물질", c[1]], ["화학식", c[0]], ["산화수", el.o1 === null ? "모름" : fmtOx(el.o1)]];
    }
    peek.className = "peek";
    peek.innerHTML =
      '<div class="peek__badge" style="background:' + view.bg + ";color:" + view.ink + '"><span class="z">' + el.z + '</span><span class="s">' + esc(el.s) + '</span><span class="m">' + esc(el.m) + "</span></div>" +
      '<div class="peek__body"><p class="peek__name">' + esc(el.n) + "<small>" + esc(el.e) + '</small></p><p class="peek__meta">' + esc(CAT[el.c].name) + " · " + esc(placeText(el)) + "</p>" +
      '<p class="peek__use">' + (kids.icon ? '<span aria-hidden="true">' + kids.icon + "</span> " : "") + esc(kids.items[0]) + '</p><dl class="peek__facts">' +
      facts.map(function (f) { return "<div><dt>" + esc(f[0]) + "</dt><dd>" + esc(f[1]) + "</dd></div>"; }).join("") +
      '</dl><p class="peek__hint">눌러서 자세히 알아보기</p></div>';
  }

  /* ---------- 상세 패널 ---------- */
  var dialog, dialogBody, openZ = null, returnFocus = null, returnOutside = null, jumpTo = null;

  function more(summary, body) {
    return '<details class="more"><summary>' + esc(summary) + '</summary><div class="more__body">' + body + "</div></details>";
  }

  /* 전자가 들어오는 순서(쌓음 원리 순서, 실제 바닥상태 개수 기준) */
  function electronSeq(el) {
    var seq = [], placed = [];
    ORDER.forEach(function (o) {
      var cnt = el.ec.conf[o] || 0, n = +o[0];
      for (var j = 0; j < cnt; j++) {
        placed[n - 1] = (placed[n - 1] || 0) + 1;
        seq.push({ o: o, n: n, k: placed[n - 1] - 1 });
      }
    });
    return seq;
  }

  function shellSvg(el) {
    var sh = el.ec.shells, n = sh.length, cx = 100, cy = 100;
    var rMin = 26, rMax = 94, step = n > 1 ? (rMax - rMin) / (n - 1) : 0;
    var radius = function (i) { return n > 1 ? rMin + step * i : 50; };
    var out = '<svg class="shell-svg" viewBox="0 0 200 200" role="img" aria-label="전자가 사는 층 그림: ' + sh.map(function (c, i) { return (i + 1) + "층(" + SHELLS[i] + ") " + c + "개"; }).join(", ") + '">';
    sh.forEach(function (count, i) {
      out += '<circle class="ring" cx="100" cy="100" r="' + radius(i).toFixed(1) + '" fill="none" stroke="#c3b9a4" stroke-width="1"/>';
    });
    out += '<circle cx="100" cy="100" r="16" fill="#1d2330"/><text x="100" y="104" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">' + esc(el.s) + "</text>";
    var groups = sh.map(function () { return ""; });
    electronSeq(el).forEach(function (e, idx) {
      var i = e.n - 1, r = radius(i), count = sh[i];
      var a = (e.k / count) * Math.PI * 2 - Math.PI / 2;
      groups[i] += '<circle class="e is-on" data-i="' + idx + '" cx="' + (cx + r * Math.cos(a)).toFixed(1) + '" cy="' + (cy + r * Math.sin(a)).toFixed(1) + '" r="' + (count > 18 ? 2 : 2.8) + '" fill="#2c6288"/>';
    });
    groups.forEach(function (g, i) {
      out += '<g class="orbit' + (i % 2 ? " orbit--rev" : "") + '" style="animation-duration:' + (10 + i * 5) + 's">' + g + "</g>";
    });
    return out + "</svg>";
  }

  function orbitalBoxes(el) {
    return el.ec.rem.map(function (o) {
      var cnt = el.ec.conf[o], boxes = CAP[o[1]] / 2, arr = [];
      for (var i = 0; i < boxes; i++) arr.push(0);
      for (var j = 0; j < cnt; j++) arr[j % boxes]++;
      return '<div class="orb"><span class="orb__label">' + o + sup(cnt) + '</span><span class="orb__boxes">' +
        arr.map(function (v) { return '<span class="orb__box">' + (v === 2 ? "↑↓" : v === 1 ? "↑" : "") + "</span>"; }).join("") + "</span></div>";
    }).join("");
  }

  function sectionWrap(key, title, term, body) {
    var cur = key === state.mode;
    return '<section class="dsec' + (cur ? " is-current" : "") + '"><h3>' + esc(title) + ' <small>(' + esc(term) + ")</small>" + (cur ? '<span class="now">지금 보는 탭</span>' : "") + "</h3>" + body + "</section>";
  }

  function usesSection(el) {
    var k = kidsOf(el);
    return '<section class="dsec dsec--uses"><h3>어디에 쓰일까?</h3><div class="kuses">' +
      (k.icon ? '<span class="kuses__icon" aria-hidden="true">' + k.icon + "</span>" : "") +
      '<ul class="kuses__list">' + k.items.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div>" +
      more("더 자세한 쓰임 보기 (산업·연구)", '<p class="uses">' + esc(el.u) + "</p>") + "</section>";
  }

  function propsSection(el) {
    var e = function (k) { return isEst(el, k) ? "≈" : ""; };
    var kc = function (label, term, say, val) {
      return '<div class="kcard"><dt>' + esc(label) + " <small>(" + esc(term) + ")</small></dt><dd><span class=\"kcard__say\">" + esc(say) + "</span>" +
        (val ? '<span class="kcard__val">' + esc(val) + "</span>" : "") + "</dd></div>";
    };
    var f = function (label, val, sub) { return "<div><dt>" + esc(label) + "</dt><dd>" + esc(val) + (sub ? "<small>" + esc(sub) + "</small>" : "") + "</dd></div>"; };
    var notes = el.nt ? Object.keys(el.nt).map(function (k) { return el.nt[k]; }) : [];
    var body = '<p class="kid-say">방 온도(약 25°C)에서는 <b>' + esc(kidState(el).text) + "</b></p>" +
      '<dl class="kfacts">' +
      kc("무게", "원자량", kidWeight(el), el.m) +
      kc("무겁기", "밀도", kidDensity(el), el.d === null ? "" : e("d") + fmtDensity(el.d)) +
      kc("크기", "원자 반지름", kidRadius(el), el.r === null ? "" : e("r") + el.r + " pm") +
      kc("녹는 온도", "녹는점", kidTempFor(el, "mp"), el.mp === null ? "" : e("mp") + fmtC(el.mp) + " °C") +
      kc("끓는 온도", "끓는점", kidTempFor(el, "bp"), el.bp === null ? "" : e("bp") + fmtC(el.bp) + " °C") +
      kc("전자 당기는 힘", "전기음성도", kidEN(el), el.en === null ? "" : e("en") + el.en.toFixed(2)) +
      "</dl>";
    var tech = '<dl class="facts">' +
      f("원자량", el.m, el.m.charAt(0) === "[" ? "가장 오래가는 동위원소의 질량수" : "g/mol (탄소-12 기준)") +
      f("전기음성도", el.en === null ? "—" : e("en") + el.en.toFixed(2), "폴링 척도") +
      f("원자 반지름", el.r === null ? "—" : e("r") + el.r + " pm", "공유 반지름") +
      f("녹는점", el.mp === null ? "—" : e("mp") + fmtC(el.mp) + " °C", el.mp === null ? "" : el.mp + " K") +
      f("끓는점", el.bp === null ? "—" : e("bp") + fmtC(el.bp) + " °C", el.bp === null ? "" : el.bp + " K") +
      f("밀도", el.d === null ? "—" : e("d") + fmtDensity(el.d), "상온 상태: " + kidState(el).word) +
      "</dl>";
    if (notes.length) tech += '<p class="note">' + esc(notes.join(" · ")) + "</p>";
    if (el.est && el.est.length) tech += '<p class="note">≈ 표시는 아직 측정하지 못해 이론으로 계산한 짐작값이에요.</p>';
    body += more("자세한 숫자 보기 (단위·측정 조건)", tech);
    return sectionWrap("props", "성질", "속성", body);
  }

  function elecSection(el) {
    var sh = el.ec.shells;
    var say = "전자 " + el.z + "개가 " + sh.length + "개 층에 나뉘어 살아요. 맨 바깥 층에는 " + sh[sh.length - 1] + "개가 있어요.";
    var body = '<div class="elec-grid"><figure class="shell-fig">' + shellSvg(el) + '<figcaption>가운데가 원자핵, 파란 점 하나가 전자 하나예요. 전자가 실제로 채워지는 순서대로 하나씩 들어와요.</figcaption>' +
      '<div class="eanim"><p class="eanim__status" aria-hidden="true">전자 ' + el.z + " / " + el.z + '개</p>' +
      '<div class="eanim__btns"><button type="button" class="ibtn ibtn--sm" data-anim="toggle">↻ 처음부터 보기</button>' +
      '<button type="button" class="ibtn ibtn--sm" data-anim="step" aria-label="전자 한 개씩 넣기">⏭ 한 개씩</button></div>' +
      '<p class="sr-only" aria-live="polite" data-anim-live></p></div></figure><div>' +
      '<p class="kid-say">' + esc(say) + "</p>" +
      '<p class="subhead">층마다 사는 전자 수 <small>(전자껍질)</small></p><ul class="shell-list">' +
      sh.map(function (c, i) { return '<li><b>' + (i + 1) + "층 " + SHELLS[i] + '</b><span data-shell-count="' + i + '">' + c + "</span>개</li>"; }).join("") + "</ul>" +
      (el.z >= 104 ? '<p class="note">104번부터는 계산으로 짐작한 배치예요.</p>' : "") +
      "</div></div>" +
      '<p class="why-link"><button type="button" class="linkbtn" data-act="why-shells">🤔 왜 껍질이 여러 개일까? 쉬운 설명 보러 가기</button></p>';
    var notes = [];
    notes.push(el.block + " 블록: 마지막 전자가 " + el.block + " 방(오비탈)에 들어가요.");
    if (el.ec.exception) notes.push("규칙대로라면 다르게 채워져야 하지만, 방을 절반 또는 꽉 채우는 쪽이 더 안정해서 실제 배치가 조금 달라요(쌓음 원리의 예외).");
    if ([57, 71, 89, 103].indexOf(el.z) !== -1) notes.push("La·Lu·Ac·Lr을 어느 블록(3족)에 넣을지는 과학자들이 아직 의논하고 있어요.");
    var tech = '<p class="note">층 안에는 s·p·d·f라는 방(오비탈)이 있어요. 들어갈 수 있는 전자 수는 s 2개, p 6개, d 10개, f 14개예요. 앞 숫자는 층, 글자는 방, 작은 위 숫자는 전자 수예요.' +
      (el.ec.coreZ ? " [" + NOBLE_SYM[el.ec.coreZ] + "]은 " + NOBLE_KO[el.ec.coreZ] + "과 똑같이 채워진 안쪽 부분을 줄여 쓴 거예요." : "") + "</p>" +
      '<p class="subhead">오비탈 표기</p><p class="econf">' + esc(el.ec.short) + '</p><p class="econf-full">' + esc(el.ec.full) + "</p>" +
      '<p class="subhead">바깥쪽 방의 칸 <small>(훈트 규칙)</small></p><p class="note">칸 하나에 전자가 2개까지 들어가요. 화살표 하나가 전자 하나이고, 한 칸에 둘이 있으면 반대 방향(↑↓)으로 그려요.</p>' +
      '<div class="orbitals">' + orbitalBoxes(el) + "</div>" +
      '<p class="note">' + esc(notes.join(" ")) + "</p>";
    body += more("더 알아보기: 방 이름으로 쓴 전자배치 (오비탈 표기)", tech);
    return sectionWrap("elec", "전자", "전자배치", body);
  }

  function isoSection(el) {
    var list = el.iso.slice().sort(function (a, b) { return parseInt(a[0], 10) - parseInt(b[0], 10) || String(a[0]).length - String(b[0]).length; });
    var s = el.isoSum, say;
    if (s.stable) {
      var top = el.iso.filter(function (i) { return typeof i[1] === "number"; }).sort(function (a, b) { return b[1] - a[1]; })[0];
      say = "시간이 지나도 부서지지 않는 튼튼한 쌍둥이(안정 동위원소)가 " + s.stable + "종 있어요.";
      if (top) say += " 가장 흔한 쌍둥이는 " + el.s + "-" + top[0] + " — 자연에 있는 " + el.n.replace(/\(.*\)/, "") + " 원자 100개 중 " +
        (top[1] >= 99.5 ? "거의 전부" : "약 " + Math.round(top[1]) + "개") + "가 이 쌍둥이예요.";
    } else {
      say = "튼튼한 쌍둥이가 없어요. 모든 쌍둥이가 시간이 지나면 스스로 부서지며(방사성) 대개 다른 원소로 바뀌어요. 가장 오래가는 " + el.s + "-" + s.longestA +
        "도 절반이 바뀌는 데 " + kidDur(s.longest, s.longestStr) + " 걸려요. " + kidTimeCompare(s.longest) + ".";
    }
    var items = list.map(function (i) {
      var ab = i[1], hl = i[2], sec = hl ? parseHalfLife(hl) : null;
      var a = parseInt(i[0], 10), nn = a - el.z;
      var abCell;
      if (typeof ab === "number") {
        var w = Math.max(ab, ab > 0 ? 0.6 : 0);
        abCell = '<span class="abar"><span class="abar__track"><span class="abar__fill" style="width:' + Math.min(100, w) + '%"></span></span><span class="abar__val">' + (ab >= 0.01 ? ab : ab.toPrecision(2)) + "%</span></span>";
      } else if (ab === "tr") abCell = '<span class="iso-tag">자연에 아주 조금</span>';
      else abCell = '<span class="iso-tag">사람이 만든 것</span>';
      var stab = hl ? '<span class="stab stab--rad">부서져요 · 반감기 ' + esc(kidDur(sec, hl)) + "</span>" : '<span class="stab stab--ok">튼튼해요 (안정)</span>';
      return '<li class="iso-item"><span class="iso-item__name"><b>' + esc(el.s) + "-" + esc(i[0]) + "</b><small>양성자 " + el.z + " + 중성자 " + nn + "</small></span>" +
        '<span class="iso-item__ab">' + abCell + "</span>" + '<span class="iso-item__st">' + stab + "</span></li>";
    }).join("");
    var rows = list.map(function (i) {
      var ab = i[1], hl = i[2];
      var abTxt = typeof ab === "number" ? (ab >= 0.01 ? ab : ab.toPrecision(2)) + "%" : ab === "tr" ? "미량(자연 생성)" : "인공 합성";
      return "<tr><td><b>" + esc(el.s) + "-" + esc(i[0]) + '</b></td><td class="num">' + (parseInt(i[0], 10) - el.z) + '</td><td class="num">' + abTxt + "</td><td>" + (hl ? "방사성" : "안정") + '</td><td class="num">' + (hl ? esc(hl) : "—") + "</td></tr>";
    }).join("");
    var body = '<p class="kid-say">' + esc(say) + "</p>" +
      '<ul class="iso-list" aria-label="주요 쌍둥이 원자">' + items + "</ul>" +
      '<p class="note">막대: 자연에서 찾은 원자 100개 중 몇 개가 그 쌍둥이인지(자연 존재비) · 반감기: 절반이 부서져 바뀌는 데 걸리는 시간 · 주요 쌍둥이만 보여 줘요.</p>' +
      more("자세한 표 보기 (중성자 수·정확한 반감기)", '<table class="iso-table"><thead><tr><th scope="col">핵종</th><th scope="col">중성자</th><th scope="col">자연 존재비</th><th scope="col">안정성</th><th scope="col">반감기</th></tr></thead><tbody>' + rows + "</tbody></table>");
    return sectionWrap("iso", "쌍둥이 원자", "동위원소", body);
  }

  function compSection(el) {
    var ox = parseOx(el);
    var cells = [];
    for (var k = -4; k <= 8; k++) {
      var on = ox.indexOf(k) !== -1, main = el.o1 === k;
      var col = on ? OX_COLORS[String(k)] : "";
      var ink = on && (k >= 6 || k <= -4) ? "#fff" : "";
      cells.push('<span class="ox' + (on ? " is-on" : "") + (main ? " is-main" : "") + '"' + (on ? ' style="background:' + col + (ink ? ";color:" + ink : "") + '"' : "") + ">" + fmtOx(k) + "</span>");
    }
    var oxText = ox.length ? "가능한 산화수 " + ox.map(fmtOx).join(", ") + (el.o1 !== null ? " · 가장 흔한 산화수 " + fmtOx(el.o1) + "(굵은 테두리)" : "") : "산화수가 아직 실험으로 확인되지 않았어요.";
    var nm = el.n.replace(/\(.*\)/, "");
    var last = nm.charCodeAt(nm.length - 1) - 0xac00;
    var topic = last >= 0 && last < 11172 && last % 28 === 0 ? "는" : "은";
    var body = '<p class="kid-say">' + esc(nm) + topic + " " + esc(kidOx(el)) + "</p>" +
      '<p class="subhead">대표 짝꿍 물질</p><ul class="cplist">' + el.cp.map(function (c) {
        var p = c.split("|");
        return '<li><span class="cp__n">' + esc(p[1]) + '</span><span class="cp__f">' + esc(p[0]) + '</span><span class="cp__d">' + esc(p[2] || "") + "</span></li>";
      }).join("") + "</ul>" +
      more("더 알아보기: 산화수 줄", '<p class="note" style="margin:0 0 8px">산화수는 결합할 때 전자를 몇 개 내주거나(+) 받아 오는(−) 것처럼 셈한 숫자예요. 색칠된 칸이 이 원소가 가질 수 있는 산화수예요.</p>' +
        '<div class="oxline" role="img" aria-label="' + esc(oxText) + '"><div class="oxline__row">' + cells.join("") +
        '</div><div class="oxline__cap"><span>← 전자를 받아 와요 (−)</span><span>전자를 내줘요 (+) →</span></div></div><p class="note">' + esc(oxText) + "</p>");
    return sectionWrap("comp", "짝꿍 물질", "화합물", body);
  }

  function histSection(el) {
    var nm = el.n.replace(/\(.*\)/, ""), top = originTop(el), src = ORIGIN_SRC[top[0]];
    var last = nm.charCodeAt(nm.length - 1) - 0xac00;
    var topic = last >= 0 && last < 11172 && last % 28 === 0 ? "는" : "은";
    var where = top[0] === "hu" ? "자연에는 거의 없어서 사람이 만들었어요" :
      (top[1] === 100 ? "모두 " : top[1] >= 60 ? "대부분 " : "가장 많이(" + fmtPct(top[1]) + ") ") + "‘" + src.name + "’에서 생겼어요";
    var when = el.disc.label === "옛날" ? "아주 옛날부터 사람들이 알고 썼어요" : (/쯤$/.test(el.disc.label) ? el.disc.label : el.disc.label + "년에") + " 처음 " + (el.z >= 93 || el.z === 43 || el.z === 61 || el.z === 85 ? "만들어졌어요" : "발견됐어요");
    var say = nm + topic + " " + where + ". " + when + ".";
    var acc = 0;
    var bar = '<div class="obar" role="img" aria-label="' + esc(el.origin.map(function (o) { return ORIGIN_SRC[o[0]].name + " " + fmtPct(o[1]); }).join(", ")) + '">' +
      el.origin.map(function (o) { var seg = '<span style="width:' + o[1] + "%;background:" + ORIGIN_SRC[o[0]].color + '"></span>'; acc += o[1]; return seg; }).join("") + "</div>";
    var list = '<ul class="olist">' + el.origin.slice().sort(function (a, b) { return b[1] - a[1]; }).map(function (o) {
      var s = ORIGIN_SRC[o[0]];
      return '<li><span class="sw" style="background:' + s.color + '"></span><div><b>' + esc(s.name) + " <em>" + fmtPct(o[1]) + "</em></b><small>" + esc(s.kid) + "</small></div></li>";
    }).join("") + "</ul>";
    var earth = window.HISTORY.earth[el.z] ? '<p class="note note--earth"><b>지금 지구에서는?</b> ' + esc(window.HISTORY.earth[el.z]) + "</p>" : "";
    var era = eraOf(el);
    var disc = '<div class="dcard"><div class="dcard__year" style="background:' + era.color + ";color:" + era.ink + '"><b>' + esc(el.disc.label) + "</b><small>" + esc(era.short) + '</small></div>' +
      '<div class="dcard__body"><p class="dcard__who">' + esc(el.disc.who) + '</p><p class="dcard__how">' + esc(el.disc.how) + "</p></div></div>";
    var body = '<p class="kid-say">' + esc(say) + "</p>" +
      '<p class="subhead">어디서 생겼나 <small>(원소의 고향 · 태양계에 있는 양 기준)</small></p>' + bar + list + earth +
      '<p class="subhead subhead--gap">언제, 어떻게 발견됐나 <small>(발견의 역사)</small></p>' + disc +
      more("더 알아보기: 원소가 생기는 곳과 발견의 역사", '<p class="note" style="margin-top:0">' +
        "빅뱅 때는 수소·헬륨·리튬만 생겼어요. 탄소부터 철까지는 별 속 핵융합으로, 철보다 무거운 원소는 원자핵이 중성자를 받아먹으며 생겼어요. 중성자를 천천히 받아먹는 곳은 늙어 가는 작은 별, 한꺼번에 받아먹는 곳은 중성자별 충돌로 보고 있어요. 2017년 중성자별 충돌이 실제로 관측되면서 근거가 생겼지만, 무거운 원소를 어디서 얼마나 만드는지는 아직 연구 중이에요.</p>" +
        '<p class="note">발견 방법은 시대마다 달랐어요. 옛날에는 자연에서 줍거나 불에 녹였고, 1700년대에는 기체를 모았고, 1800년대에는 전기로 쪼개거나 빛의 무늬로 찾았어요. 1900년대 이후에는 방사능을 따라가거나 원자로·입자가속기로 직접 만들었어요.</p>' +
        '<p class="note">고향 비율: Jennifer A. Johnson(오하이오 주립대)의 태양계 원소 기원 자료(2017·2019). 104번 이후는 이 자료에 없어 ‘사람이 만든 것’으로 표시했어요. 발견 연도: 위키백과 ‘Timeline of chemical element discoveries’와 IUPAC 발표를 바탕으로 정리했어요.</p>');
    return sectionWrap("hist", "고향과 발견", "원소의 역사", body);
  }

  /* ---------- 전자 채우기 애니메이션 ---------- */
  var anim = null;
  var reduceMotion = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  function stopAnim() {
    if (anim) { clearTimeout(anim.timer); if (anim.io) anim.io.disconnect(); }
    anim = null;
  }
  function setupAnim(el) {
    stopAnim();
    var fig = dialogBody.querySelector(".shell-fig");
    if (!fig || !fig.querySelector(".eanim__status")) return;
    var seq = electronSeq(el);
    anim = {
      el: el, seq: seq, svg: fig.querySelector(".shell-svg"),
      dots: fig.querySelectorAll(".e"), rings: fig.querySelectorAll(".ring"),
      status: fig.querySelector(".eanim__status"), live: fig.querySelector("[data-anim-live]"),
      toggle: fig.querySelector('[data-anim="toggle"]'),
      counts: dialogBody.querySelectorAll("[data-shell-count]"), items: dialogBody.querySelectorAll(".shell-list li"),
      shown: seq.length, running: false, timer: 0, io: null,
      delay: Math.max(45, Math.min(550, 5000 / seq.length))
    };
    renderAnim(-1);
    if (reduceMotion.matches) return; /* 움직임 줄이기 설정: 완성된 그림으로 두고 버튼으로만 재생 */
    var a = anim;
    var start = function () { if (anim === a) { resetAnim(); playAnim(); } };
    if ("IntersectionObserver" in window) {
      a.io = new IntersectionObserver(function (ents) {
        if (ents.some(function (x) { return x.isIntersecting; })) { a.io.disconnect(); a.io = null; start(); }
      }, { threshold: 0.4 });
      a.io.observe(a.svg);
    } else start();
  }
  function shellCounts(upto) {
    var c = anim.el.ec.shells.map(function () { return 0; });
    for (var i = 0; i < upto; i++) c[anim.seq[i].n - 1]++;
    return c;
  }
  function renderAnim(lastIdx) {
    var a = anim, c = shellCounts(a.shown), cur = lastIdx >= 0 ? a.seq[lastIdx] : null;
    a.dots.forEach(function (d) {
      var i = +d.getAttribute("data-i");
      d.classList.toggle("is-on", i < a.shown);
      d.classList.toggle("is-new", i === lastIdx);
    });
    a.rings.forEach(function (r, i) { r.classList.toggle("is-active", !!cur && cur.n - 1 === i); });
    a.counts.forEach(function (s, i) { s.textContent = c[i]; });
    a.items.forEach(function (li, i) { li.classList.toggle("is-active", !!cur && cur.n - 1 === i); li.classList.toggle("is-empty", c[i] === 0); });
    var done = a.shown >= a.seq.length;
    a.status.innerHTML = "전자 <b>" + a.shown + "</b> / " + a.seq.length + "개" +
      (cur ? " · 방금 <b>" + cur.n + "층(" + SHELLS[cur.n - 1] + ")</b>의 " + cur.o + " 방에 들어왔어요" : "") +
      (done && !a.running ? " · 다 채웠어요!" : "");
    a.svg.classList.toggle("is-paused", !a.running && !done);
    a.toggle.textContent = a.running ? "⏸ 멈추기" : done ? "↻ 처음부터 보기" : (a.shown ? "▶ 계속 보기" : "▶ 시작");
  }
  function resetAnim() { anim.shown = 0; renderAnim(-1); }
  function tick() {
    var a = anim;
    if (!a || !a.running) return;
    if (a.shown >= a.seq.length) { a.running = false; renderAnim(-1); announce(); return; }
    a.shown++;
    renderAnim(a.shown - 1);
    a.timer = setTimeout(tick, a.delay);
  }
  function playAnim() {
    var a = anim;
    if (a.shown >= a.seq.length) a.shown = 0;
    a.running = true;
    renderAnim(-1);
    a.timer = setTimeout(tick, 250);
  }
  function pauseAnim() { clearTimeout(anim.timer); anim.running = false; renderAnim(anim.shown - 1); announce(); }
  function stepAnim() {
    var a = anim;
    clearTimeout(a.timer); a.running = false;
    if (a.shown >= a.seq.length) a.shown = 0;
    a.shown++;
    renderAnim(a.shown - 1);
    announce();
  }
  function announce() {
    var a = anim, cur = a.seq[a.shown - 1];
    if (!cur) { a.live.textContent = ""; return; }
    a.live.textContent = a.shown >= a.seq.length ? "전자 " + a.seq.length + "개를 다 채웠어요." :
      "전자 " + a.shown + "번째가 " + cur.n + "층 " + cur.o + " 방에 들어왔어요.";
  }
  function animAction(act) {
    if (!anim) return;
    if (anim.io) { anim.io.disconnect(); anim.io = null; }
    if (act === "step") stepAnim();
    else if (anim.running) pauseAnim();
    else playAnim();
  }

  function renderDetail(el) {
    var catBg = CAT[el.c].color;
    var grp = el.pos.g ? "세로 " + el.pos.g + "번째 줄 (" + el.pos.g + "족)" : (el.c === "la" ? "란타넘족 (6주기 3족 자리)" : "악티늄족 (7주기 3족 자리)");
    var sections = { props: propsSection(el), elec: elecSection(el), iso: isoSection(el), comp: compSection(el), hist: histSection(el) };
    var order = [state.mode].concat(["props", "elec", "iso", "comp", "hist"].filter(function (m) { return m !== state.mode; }));
    var prev = el.z > 1 ? EL[el.z - 2] : null, next = el.z < 118 ? EL[el.z] : null;
    dialogBody.innerHTML =
      '<header class="dhead"><div class="dhead__badge" style="background:' + catBg + '"><span class="z">' + el.z + '</span><span class="s">' + esc(el.s) + '</span><span class="m">' + esc(el.m) + "</span></div>" +
      '<div class="dhead__text"><h2 id="detail-title">' + esc(el.n) + "<small>" + esc(el.e) + '</small></h2><p class="dhead__kid">' + esc(CAT[el.c].name) + " — " + esc(CAT[el.c].kid) + '</p><ul class="dhead__tags"><li class="tag">' + el.z + '번 원소</li><li class="tag">가로 ' + el.pos.p + "번째 줄 (" + el.pos.p + '주기)</li><li class="tag">' + esc(grp) + '</li><li class="tag">방 온도에서 ' + esc(kidState(el).word) + "</li></ul></div>" +
      '<div class="dhead__nav"><button type="button" class="ibtn" data-act="prev"' + (prev ? ' aria-label="이전 원소: ' + esc(prev.n) + '"' : " disabled") + ">← " + (prev ? esc(prev.s) : "") + '</button><button type="button" class="ibtn" data-act="next"' + (next ? ' aria-label="다음 원소: ' + esc(next.n) + '"' : " disabled") + ">" + (next ? esc(next.s) : "") + ' →</button><button type="button" class="ibtn ibtn--close" data-act="close">닫기</button></div></header>' +
      usesSection(el) +
      order.map(function (m) { return sections[m]; }).join("");
    setupAnim(el);
  }

  function openDetail(z, focusEl) {
    var el = EL[z - 1];
    if (!el) return;
    openZ = z;
    if (focusEl) { returnFocus = focusEl; returnOutside = null; }
    renderDetail(el);
    afterCloseDone = false;
    if (!dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
    }
    dialog.scrollTop = 0;
    var closeBtn = dialogBody.querySelector('[data-act="close"]');
    if (closeBtn) closeBtn.focus();
  }
  function closeDetail() {
    if (typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open");
    afterClose();
  }
  /* 창이 닫힌 뒤 할 일: 닫기 단추와 Esc(close 이벤트) 어느 쪽으로 닫혀도 한 번만 실행 */
  var afterCloseDone = true;
  function afterClose() {
    if (afterCloseDone) return;
    afterCloseDone = true;
    stopAnim();
    if (jumpTo) {
      var j = jumpTo; jumpTo = null;
      j.scrollIntoView({ block: "start" });
      j.focus({ preventScroll: true });
      return;
    }
    if (returnOutside && document.body.contains(returnOutside)) {
      var r = returnOutside; returnOutside = null;
      r.focus();
      return;
    }
    var t = openZ ? tiles[openZ - 1] : returnFocus;
    if (t) {
      tiles.forEach(function (x) { x.tabIndex = -1; });
      t.tabIndex = 0;
      t.focus();
    }
  }

  /* ---------- 모드 전환 ---------- */
  function setMode(mode, focus) {
    state.mode = mode;
    document.querySelectorAll(".tab").forEach(function (t) {
      var on = t.dataset.mode === mode;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      if (on) {
        document.getElementById("table-region").setAttribute("aria-labelledby", t.id);
        if (focus) t.focus();
      }
    });
    document.getElementById("propbar").hidden = mode !== "props";
    document.getElementById("histbar").hidden = mode !== "hist";
    paint();
    peekIntro();
  }
  function setHist(h) {
    state.hist = h;
    document.querySelectorAll("#histbar .chip").forEach(function (c) { c.setAttribute("aria-pressed", c.dataset.hist === h ? "true" : "false"); });
    paint();
  }
  function setProp(prop) {
    state.prop = prop;
    document.querySelectorAll("#propbar .chip").forEach(function (c) { c.setAttribute("aria-pressed", c.dataset.prop === prop ? "true" : "false"); });
    paint();
  }

  /* ---------- 키보드 이동 ---------- */
  function moveFocus(fromEl, dr, dc) {
    var r = fromEl.row, c = fromEl.col;
    for (var i = 0; i < 20; i++) {
      r += dr; c += dc;
      if (r < 3 || r > 12 || c < 2 || c > 19) break;
      var hit = gridMap[r + ":" + c];
      if (hit) return hit;
    }
    if (dr !== 0) {
      var rr = fromEl.row + dr;
      while (rr >= 3 && rr <= 12) {
        var best = null, bd = 99;
        for (var cc = 2; cc <= 19; cc++) {
          var e = gridMap[rr + ":" + cc];
          if (e && Math.abs(cc - fromEl.col) < bd) { best = e; bd = Math.abs(cc - fromEl.col); }
        }
        if (best) return best;
        rr += dr;
      }
    }
    return null;
  }
  function focusTile(el) {
    tiles.forEach(function (t) { t.tabIndex = -1; });
    var t = tiles[el.z - 1];
    t.tabIndex = 0;
    t.focus();
    if (t.scrollIntoView) t.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  /* ---------- 초기화 ---------- */
  function init() {
    if (!window.ELEMENTS || window.ELEMENTS.length !== 118) throw new Error("원소 데이터를 불러오지 못했습니다.");
    if (!window.HISTORY || !window.HISTORY.disc || !window.HISTORY.origin) throw new Error("원소 역사 데이터를 불러오지 못했습니다.");
    EL = window.ELEMENTS.map(function (e) {
      e.pos = position(e.z);
      e.block = blockOf(e);
      e.ec = electronInfo(e.z);
      e.isoSum = isoSummary(e);
      var d = window.HISTORY.disc[e.z];
      e.disc = { y: d[0] < 0 ? 0 : d[0], label: d[1], who: d[2], how: d[3] };
      e.origin = window.HISTORY.origin[e.z];
      return e;
    });
    computeRanges();
    buildTiles();
    dialog = document.getElementById("detail");
    dialogBody = document.getElementById("detail-body");

    var table = document.getElementById("table-region");
    table.addEventListener("click", function (ev) {
      var t = ev.target.closest(".tile");
      if (t) openDetail(+t.dataset.z, t);
    });
    table.addEventListener("mouseover", function (ev) {
      var t = ev.target.closest(".tile");
      if (t) peekEl(EL[+t.dataset.z - 1]);
    });
    table.addEventListener("mouseleave", function () {
      if (!table.contains(document.activeElement)) peekIntro();
    });
    table.addEventListener("focusin", function (ev) {
      var t = ev.target.closest(".tile");
      if (t) peekEl(EL[+t.dataset.z - 1]);
    });
    table.addEventListener("keydown", function (ev) {
      var t = ev.target.closest(".tile");
      if (!t) return;
      var el = EL[+t.dataset.z - 1], target = null;
      if (ev.key === "ArrowRight") target = moveFocus(el, 0, 1) || EL[Math.min(117, el.z)];
      else if (ev.key === "ArrowLeft") target = moveFocus(el, 0, -1) || EL[Math.max(0, el.z - 2)];
      else if (ev.key === "ArrowDown") target = moveFocus(el, 1, 0);
      else if (ev.key === "ArrowUp") target = moveFocus(el, -1, 0);
      else if (ev.key === "Home") target = EL[0];
      else if (ev.key === "End") target = EL[117];
      else return;
      ev.preventDefault();
      if (target) focusTile(target);
    });

    var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { setMode(t.dataset.mode, false); });
      t.addEventListener("keydown", function (ev) {
        var j = null;
        if (ev.key === "ArrowRight") j = (i + 1) % tabs.length;
        else if (ev.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
        else if (ev.key === "Home") j = 0;
        else if (ev.key === "End") j = tabs.length - 1;
        if (j !== null) { ev.preventDefault(); setMode(tabs[j].dataset.mode, true); }
      });
    });
    document.getElementById("propbar").addEventListener("click", function (ev) {
      var c = ev.target.closest(".chip");
      if (c) setProp(c.dataset.prop);
    });
    document.getElementById("histbar").addEventListener("click", function (ev) {
      var c = ev.target.closest(".chip");
      if (c) setHist(c.dataset.hist);
    });

    var search = document.getElementById("search");
    search.addEventListener("input", function () { state.query = search.value; paint(); });
    search.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") {
        var q = search.value.trim().toLowerCase();
        if (!q) return;
        /* 같은 Enter가 새로 포커스된 '닫기' 버튼을 누르지 않도록 막음 */
        ev.preventDefault();
        var hit = EL.filter(function (e) { return matchEl(e, q); });
        var exact = hit.filter(function (e) { return e.s.toLowerCase() === q || String(e.z) === q || e.n === q; })[0];
        if (exact || hit[0]) openDetail((exact || hit[0]).z, tiles[(exact || hit[0]).z - 1]);
      } else if (ev.key === "Escape") {
        search.value = ""; state.query = ""; paint();
      }
    });

    dialog.addEventListener("click", function (ev) {
      if (ev.target === dialog) { closeDetail(); return; }
      var ab = ev.target.closest("[data-anim]");
      if (ab) { animAction(ab.dataset.anim); return; }
      var b = ev.target.closest("[data-act]");
      if (!b) return;
      if (b.dataset.act === "close") closeDetail();
      else if (b.dataset.act === "why-shells") { jumpTo = document.getElementById("shells-why"); returnOutside = null; closeDetail(); }
      else if (b.dataset.act === "prev" && openZ > 1) { openDetail(openZ - 1); focusAct("prev"); }
      else if (b.dataset.act === "next" && openZ < 118) { openDetail(openZ + 1); focusAct("next"); }
    });
    dialog.addEventListener("close", afterClose);

    setMode("props", false);
    initGuide();
    try { initShellsWhy(); } catch (err) { if (window.console) console.error(err); }
    try { initDeep(); } catch (err) { if (window.console) console.error(err); }
  }
  function focusAct(act) {
    var b = dialogBody.querySelector('[data-act="' + act + '"]');
    if (b && !b.disabled) b.focus();
  }

  /* ---------- 배치 기준 보기 ---------- */
  var SVGNS = "http://www.w3.org/2000/svg";
  function svgEl(name, attrs) {
    var n = document.createElementNS(SVGNS, name);
    Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }
  /* ⑤ 점선 자리(57–71, 89–103) → 아래 두 줄로 잇는 선. 원소 칸 사이 틈과 빈칸으로만 지나가요. */
  function drawGuideLinks() {
    var layer = document.getElementById("guide-layer");
    layer.textContent = "";
    if (!state.guide) return;
    var wrap = document.getElementById("ptable-wrap").getBoundingClientRect();
    var box = function (sel) {
      var r = document.querySelector(sel).getBoundingClientRect();
      return { l: r.left - wrap.left, r: r.right - wrap.left, t: r.top - wrap.top, b: r.bottom - wrap.top, cx: (r.left + r.right) / 2 - wrap.left, cy: (r.top + r.bottom) / 2 - wrap.top };
    };
    var la = box(".ph--la"), ac = box(".ph--ac"), laTile = box('.tile[data-z="57"]'), acTile = box('.tile[data-z="89"]');
    var svg = svgEl("svg", { width: wrap.width, height: wrap.height, viewBox: "0 0 " + wrap.width + " " + wrap.height });
    var defs = svgEl("defs", {});
    [["gl-la", "#a8336c"], ["gl-ac", "#6b3fa0"]].forEach(function (m) {
      var mk = svgEl("marker", { id: m[0], viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "10", markerHeight: "10", markerUnits: "userSpaceOnUse", orient: "auto" });
      mk.appendChild(svgEl("path", { d: "M0,0 L10,5 L0,10 z", fill: m[1] }));
      defs.appendChild(mk);
    });
    svg.appendChild(defs);
    /* 란타넘족: 점선 칸 오른쪽 틈을 따라 내려가 La 줄 왼쪽으로 */
    var gx = (la.r + laTile.l) / 2;
    svg.appendChild(svgEl("path", {
      d: "M" + (la.r - 2) + "," + (la.cy) + " H" + gx + " V" + (laTile.cy - 10) + " Q" + gx + "," + laTile.cy + " " + (laTile.l - 1) + "," + laTile.cy,
      fill: "none", stroke: "#a8336c", "stroke-width": "3", "stroke-linecap": "round", "marker-end": "url(#gl-la)"
    }));
    /* 악티늄족: 점선 칸 아래 빈칸을 곧게 내려가 Ac 줄 왼쪽으로 */
    svg.appendChild(svgEl("path", {
      d: "M" + ac.cx + "," + ac.b + " V" + (acTile.cy - 10) + " Q" + ac.cx + "," + acTile.cy + " " + (ac.cx + 10) + "," + acTile.cy + " H" + (acTile.l - 1),
      fill: "none", stroke: "#6b3fa0", "stroke-width": "3", "stroke-linecap": "round", "marker-end": "url(#gl-ac)"
    }));
    layer.appendChild(svg);
  }
  function setGuide(on) {
    state.guide = on;
    document.querySelector(".explorer").classList.toggle("is-guide", on);
    document.getElementById("guide-toggle").setAttribute("aria-pressed", on ? "true" : "false");
    ["guide-cap", "guide-key", "guide-actions"].forEach(function (id) { document.getElementById(id).hidden = !on; });
    drawGuideLinks();
  }
  function initGuide() {
    state.guide = false;
    document.getElementById("guide-toggle").addEventListener("click", function () { setGuide(!state.guide); });
    document.querySelectorAll("[data-guide-open]").forEach(function (b) {
      b.addEventListener("click", function () {
        setGuide(true);
        var t = document.getElementById("guide-toggle");
        t.scrollIntoView({ block: "start" });
        t.focus();
      });
    });
    var redraw = function () { if (state.guide) drawGuideLinks(); };
    if (window.ResizeObserver) new ResizeObserver(redraw).observe(document.getElementById("ptable-wrap"));
    else window.addEventListener("resize", redraw);
    if (/[?&]guide=1/.test(location.search)) setGuide(true);
  }

  /* ---------- 읽는 법 3번: 왜 전자 껍질이 여러 개일까? ---------- */
  var SW_JUMPS = [
    { from: 3, to: 2, nm: 656, color: "#ff2b1c", name: "빨간 빛", say: "높이 차이가 작아서 에너지가 작은 빨간 빛이 나와요." },
    { from: 4, to: 2, nm: 486, color: "#00b7f0", name: "청록 빛", say: "조금 더 높은 데서 뛰어내려서 청록 빛이 나와요." },
    { from: 5, to: 2, nm: 434, color: "#4a40ff", name: "파란 빛", say: "더 높은 데서 뛰어내려서 파란 빛이 나와요." },
    { from: 6, to: 2, nm: 410, color: "#8a2be2", name: "보라 빛", say: "가장 높은 데서 뛰어내려서 에너지가 큰 보라 빛이 나와요." },
    { from: 2, to: 1, nm: 122, color: "#9a91ad", name: "보이지 않는 빛(자외선)", say: "1층까지 뛰어내리면 높이 차이가 아주 커요. 에너지가 너무 커서 눈에 보이지 않는 빛(자외선)이 나와요." }
  ];
  var SW_LEVEL_Y = [0, 192, 114, 74, 52, 37, 23]; /* 층 번호 → 그림 높이 (보기 쉽게 조절한 간격) */
  var swMotion = function () { return !reduceMotion.matches; };

  function specPos(nm) { return ((nm - 380) / 320 * 100).toFixed(1) + "%"; }
  function wavePath(x0, y, len, amp, wl) {
    var d = "M" + x0 + " " + y, x = x0, up = true;
    while (x + wl / 2 <= x0 + len) { d += " q" + (wl / 4) + " " + (up ? -amp : amp) + " " + (wl / 2) + " 0"; x += wl / 2; up = !up; }
    return d;
  }

  function initJumpLab() {
    var box = document.getElementById("sw-jump");
    if (!box) return;
    var svg = '<svg class="sw-levels" viewBox="0 0 300 206" role="img" aria-label="수소 원자의 전자 층 계단 그림. 1층부터 6층까지 있고, 위로 갈수록 층 사이가 좁아져요.">';
    for (var n = 1; n <= 6; n++) {
      svg += '<line class="sw-level" data-level="' + n + '" x1="48" x2="292" y1="' + SW_LEVEL_Y[n] + '" y2="' + SW_LEVEL_Y[n] + '"/>' +
        '<text class="sw-level-t" x="42" y="' + (SW_LEVEL_Y[n] + 4) + '" text-anchor="end">' + n + "층</text>";
    }
    svg += '<line class="sw-drop" x1="120" x2="120" y1="0" y2="0"/>' +
      '<path class="sw-photon" d="" fill="none" stroke-width="3" stroke-linecap="round"/>' +
      '<text class="sw-photon-t" x="290" y="0" text-anchor="end"></text>' +
      '<g class="sw-electron" transform="translate(120 ' + SW_LEVEL_Y[2] + ')"><circle r="8"/><text y="4" text-anchor="middle">−</text></g></svg>';
    var lines = SW_JUMPS.filter(function (j) { return j.nm > 380; }).map(function (j) {
      return '<i data-nm="' + j.nm + '" style="left:' + specPos(j.nm) + ";background:" + j.color + '"></i>';
    }).join("");
    var wrap = document.createElement("div");
    wrap.className = "sw-jump";
    wrap.innerHTML = '<div class="sw-jump__fig">' + svg + "</div>" +
      '<div class="sw-jump__side">' +
      '<div class="sw-btns" role="group" aria-label="전자가 뛰어내릴 층 고르기">' +
      SW_JUMPS.map(function (j, i) { return '<button type="button" class="ibtn ibtn--sm" data-jump="' + i + '">' + j.from + "층 → " + j.to + "층</button>"; }).join("") +
      '<button type="button" class="ibtn ibtn--sm" data-jump="reset">↻ 지우기</button></div>' +
      '<p class="sw-label">수소가 내는 빛의 무늬 · 찾은 줄 <b data-found>0</b> / 4</p>' +
      '<div class="sw-spec sw-spec--dark sw-spec--lab" aria-hidden="true">' + lines + "</div>" +
      '<div class="sw-spec-scale" aria-hidden="true"><span>← 보라 (에너지 큼)</span><span>빨강 (에너지 작음) →</span></div>' +
      '<p class="sw-uv" hidden>👻 보이지 않는 빛(자외선)도 찾았어요! 눈에는 안 보이지만 특별한 기계로는 잴 수 있어요.</p>' +
      '<p class="sw-msg" aria-live="polite">위의 버튼을 눌러 보세요. 지금 전자는 2층에 있어요.</p></div>';
    box.appendChild(wrap);

    var el = wrap.querySelector(".sw-electron"), drop = wrap.querySelector(".sw-drop"), photon = wrap.querySelector(".sw-photon"),
      photonT = wrap.querySelector(".sw-photon-t"), msg = wrap.querySelector(".sw-msg"), uv = wrap.querySelector(".sw-uv"),
      foundEl = wrap.querySelector("[data-found]"), timers = [], found = {};
    function clearTimers() { timers.forEach(clearTimeout); timers = []; }
    function place(y, animate) {
      el.classList.toggle("is-moving", !!animate);
      el.setAttribute("transform", "translate(120 " + y + ")");
      el.style.transform = "translate(120px," + y + "px)";
    }
    function levels(a, b) {
      wrap.querySelectorAll(".sw-level").forEach(function (l) {
        var n = +l.getAttribute("data-level");
        l.classList.toggle("is-on", n === a || n === b);
      });
    }
    function emit(j) {
      var y = SW_LEVEL_Y[j.to] - 12;
      photon.setAttribute("d", wavePath(134, y, 150, 6, 16));
      photon.setAttribute("stroke", j.color);
      photon.setAttribute("stroke-dasharray", j.nm < 380 ? "4 4" : "none");
      photonT.setAttribute("y", y - 10);
      photonT.textContent = j.nm < 380 ? "안 보이는 빛!" : j.name + "!";
      photon.classList.remove("is-fly"); photonT.classList.remove("is-fly");
      void photon.getBoundingClientRect();
      photon.classList.add("is-fly"); photonT.classList.add("is-fly");
      if (j.nm < 380) uv.hidden = false;
      else {
        found[j.nm] = true;
        var line = wrap.querySelector('.sw-spec--lab i[data-nm="' + j.nm + '"]');
        wrap.querySelectorAll(".sw-spec--lab i").forEach(function (x) { x.classList.remove("is-new"); });
        line.classList.add("is-on", "is-new");
      }
      var cnt = Object.keys(found).length;
      foundEl.textContent = cnt;
      msg.innerHTML = "<b>" + j.from + "층 → " + j.to + "층:</b> " + esc(j.say) + " <small>(빛의 길이 " + j.nm + " nm)</small>" +
        (cnt === 4 && j.nm > 380 ? "<br>🎉 4줄을 다 찾았어요! 진짜 수소 빛도 이 4줄로 보여요. 전자가 정해진 층(계단)에만 있을 수 있다는 증거예요." : "");
    }
    function jump(i) {
      clearTimers();
      var j = SW_JUMPS[i];
      levels(j.from, j.to);
      drop.setAttribute("y1", SW_LEVEL_Y[j.from]); drop.setAttribute("y2", SW_LEVEL_Y[j.to]);
      drop.classList.add("is-on");
      if (!swMotion()) { place(SW_LEVEL_Y[j.to], false); emit(j); return; }
      photon.classList.remove("is-fly"); photonT.classList.remove("is-fly");
      msg.textContent = j.from + "층으로 올라갔다가 " + j.to + "층으로 뛰어내려요…";
      place(SW_LEVEL_Y[j.from], false);
      timers.push(setTimeout(function () { place(SW_LEVEL_Y[j.to], true); }, 420));
      timers.push(setTimeout(function () { emit(j); }, 420 + 620));
    }
    wrap.querySelector(".sw-btns").addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-jump]");
      if (!b) return;
      if (b.dataset.jump === "reset") {
        clearTimers(); found = {}; foundEl.textContent = "0"; uv.hidden = true;
        wrap.querySelectorAll(".sw-spec--lab i").forEach(function (x) { x.classList.remove("is-on", "is-new"); });
        photon.classList.remove("is-fly"); photonT.classList.remove("is-fly"); drop.classList.remove("is-on"); levels(0, 0);
        place(SW_LEVEL_Y[2], false);
        msg.textContent = "처음으로 돌아왔어요. 지금 전자는 2층에 있어요.";
        return;
      }
      jump(+b.dataset.jump);
    });
  }

  function initHall() {
    var svg = document.getElementById("sw-hall-svg");
    if (!svg) return;
    var cx = 190, cy = 150, rows = [[2, 34, "#b5532f"], [8, 62, "#2c6288"], [18, 94, "#2f7d5b"], [32, 128, "#6b3fa0"]], s = "";
    rows.forEach(function (row, i) {
      var n = row[0], r = row[1];
      s += '<path d="M' + (cx - r) + " " + cy + " A" + r + " " + r + " 0 0 1 " + (cx + r) + " " + cy + '" fill="none" stroke="#ddd5c4" stroke-width="1.5"/>';
      for (var k = 0; k < n; k++) {
        var a = Math.PI + (k + 0.5) / n * Math.PI;
        s += '<circle cx="' + (cx + r * Math.cos(a)).toFixed(1) + '" cy="' + (cy + r * Math.sin(a)).toFixed(1) + '" r="' + (n > 18 ? 3.8 : 4.6) + '" fill="' + row[2] + '"/>';
      }
      s += '<text x="' + (cx - r) + '" y="' + (cy + 18) + '" text-anchor="middle" font-size="12" fill="' + row[2] + '" font-weight="700">' + (i + 1) + "층</text>" +
        '<text x="' + (cx + r) + '" y="' + (cy + 18) + '" text-anchor="middle" font-size="13" fill="' + row[2] + '" font-weight="800">' + n + "</text>";
    });
    s += '<path d="M' + (cx - 13) + " " + cy + " A13 13 0 0 1 " + (cx + 13) + " " + cy + ' Z" fill="#1d2330"/>' +
      '<text x="' + cx + '" y="' + (cy + 36) + '" text-anchor="middle" font-size="12" fill="#1d2330" font-weight="700">▲ 무대(핵)</text>' +
      '<text x="' + cx + '" y="' + (cy + 54) + '" text-anchor="middle" font-size="11" fill="#545b6a">오른쪽 숫자 = 그 줄의 자리 수</text>';
    svg.innerHTML = s;
  }

  function initFillLab() {
    var box = document.getElementById("sw-fill");
    if (!box) return;
    var MAXZ = 20, CAPS = [2, 8, 18, 32], R = [26, 48, 70, 92], z = 1, timer = 0;
    var wrap = document.createElement("div");
    wrap.className = "sw-fill";
    wrap.innerHTML =
      '<div class="sw-fill__atom"><svg class="sw-atom" viewBox="0 0 200 200" role="img"></svg><p class="sw-fill__name"></p></div>' +
      '<div class="sw-fill__side">' +
      '<div class="sw-btns" role="group" aria-label="전자 넣고 빼기">' +
      '<button type="button" class="ibtn ibtn--sm ibtn--primary" data-fill="plus">＋ 전자 넣기</button>' +
      '<button type="button" class="ibtn ibtn--sm" data-fill="minus">－ 빼기</button>' +
      '<button type="button" class="ibtn ibtn--sm" data-fill="auto">▶ 자동으로</button>' +
      '<button type="button" class="ibtn ibtn--sm" data-fill="reset">↻ 처음부터</button></div>' +
      '<ul class="sw-rows"></ul>' +
      '<p class="sw-msg" aria-live="polite"></p>' +
      '<p class="sw-fill__more"><button type="button" class="linkbtn linkbtn--sm" data-fill="open"></button></p></div>';
    box.appendChild(wrap);
    var atom = wrap.querySelector(".sw-atom"), nameEl = wrap.querySelector(".sw-fill__name"), rowsEl = wrap.querySelector(".sw-rows"),
      msg = wrap.querySelector(".sw-msg"), plus = wrap.querySelector('[data-fill="plus"]'), minus = wrap.querySelector('[data-fill="minus"]'),
      auto = wrap.querySelector('[data-fill="auto"]'), openBtn = wrap.querySelector('[data-fill="open"]');

    function message(el, sh, added, newShell) {
      var name = el.n;
      if (!added) return "전자 하나와 양성자 하나를 뺐어요. 이제 " + name + " 원자예요. 가장 바깥 전자는 " + sh.length + "층에 있어요.";
      switch (el.z) {
        case 1: return "수소: 1층에 전자 1개가 들어왔어요. 1층에는 자리가 2개뿐이에요.";
        case 2: return "헬륨: 1층이 꽉 찼어요! (2/2) 다음 전자는 2층으로 가야 해요.";
        case 3: return "리튬: 1층에 자리가 없어서 2층에 새 껍질이 생겼어요. 이제 껍질이 2개예요.";
        case 10: return "네온: 2층도 꽉 찼어요! (8/8) 다음 전자는 3층으로 가야 해요.";
        case 11: return name + ": 3층에 새 껍질이 생겼어요. 이제 껍질이 3개예요.";
        case 18: return "아르곤: 3층에 8개가 들어갔어요. 3층은 원래 18자리예요. 다음 전자는 어디로 갈까요?";
        case 19: return "어? 3층에 아직 10자리가 남았는데, 19번째 전자는 4층으로 갔어요! 3층 안쪽 방(3d)이 4층 첫 방(4s)보다 살짝 높은 곳에 있어서예요. 아래 ‘비유의 한계’를 보세요.";
        case 20: return name + ": 4층에 2개가 들어갔어요. 3층에 남은 자리는 다음 원소인 스칸듐(21번)부터 채워요.";
      }
      return name + ": " + (newShell + 1) + "층에 전자가 하나 더 들어왔어요. (" + sh[newShell] + " / " + CAPS[newShell] + ")";
    }
    function render(prevZ) {
      var el = EL[z - 1], sh = el.ec.shells, added = prevZ === z - 1, newShell = -1, i, k;
      if (added) {
        var prev = prevZ ? EL[prevZ - 1].ec.shells : [];
        for (i = 0; i < sh.length; i++) if ((sh[i] || 0) > (prev[i] || 0)) newShell = i;
      }
      var s = "";
      for (i = 0; i < sh.length; i++) s += '<circle class="sw-ring' + (i === newShell ? " is-active" : "") + '" cx="100" cy="100" r="' + R[i] + '"/>';
      s += '<circle cx="100" cy="100" r="15" fill="#1d2330"/><text x="100" y="104.5" text-anchor="middle" font-size="12" font-weight="700" fill="#fff">' + esc(el.s) + "</text>";
      for (i = 0; i < sh.length; i++) {
        for (k = 0; k < sh[i]; k++) {
          var a = (k / sh[i]) * Math.PI * 2 - Math.PI / 2, isNew = i === newShell && k === sh[i] - 1;
          s += '<circle class="sw-e' + (isNew ? " is-new" : "") + '" cx="' + (100 + R[i] * Math.cos(a)).toFixed(1) + '" cy="' + (100 + R[i] * Math.sin(a)).toFixed(1) + '" r="' + (isNew ? 6 : 4.4) + '"/>';
        }
      }
      atom.innerHTML = s;
      atom.setAttribute("aria-label", el.n + " 원자 그림: " + sh.map(function (c, j) { return (j + 1) + "층 " + c + "개"; }).join(", "));
      nameEl.innerHTML = "<b>" + el.z + "번 " + esc(el.n) + " (" + esc(el.s) + ")</b><br>전자 " + el.z + "개 · 껍질 " + sh.length + "개 · 가로 " + el.pos.p + "번째 줄";
      rowsEl.innerHTML = CAPS.map(function (cap, j) {
        var c = sh[j] || 0, full = c === cap, seats = "";
        if (cap <= 18) for (k = 0; k < cap; k++) seats += '<span class="sw-seat' + (k < c ? " is-on" : "") + (j === newShell && k === c - 1 ? " is-new" : "") + '"></span>';
        else for (k = 0; k < c; k++) seats += '<span class="sw-seat is-on' + (j === newShell && k === c - 1 ? " is-new" : "") + '"></span>';
        if (cap > 18) seats += '<span class="sw-seat-more">자리 32개</span>';
        return '<li class="' + (c ? "" : "is-empty") + (j === newShell ? " is-active" : "") + '"><b>' + (j + 1) + "층 " + SHELLS[j] + '</b><span class="sw-seats" aria-hidden="true">' + seats + "</span>" +
          '<span class="sw-count">' + (c ? c + " / " + cap + (full ? " 꽉 참!" : "") : "비어 있어요") + "</span></li>";
      }).join("");
      msg.textContent = message(el, sh, added, newShell);
      plus.disabled = z >= MAXZ; minus.disabled = z <= 1;
      openBtn.textContent = el.n + " 자세히 보기 →";
    }
    function stopAuto() { clearTimeout(timer); timer = 0; auto.textContent = "▶ 자동으로"; }
    function step() {
      if (z >= MAXZ) { stopAuto(); return; }
      z++; render(z - 1);
      if (timer) timer = setTimeout(step, 1100);
    }
    wrap.querySelector(".sw-btns").addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-fill]");
      if (!b) return;
      var act = b.dataset.fill;
      if (act === "auto") {
        if (timer) { stopAuto(); return; }
        if (z >= MAXZ) { z = 1; render(0); }
        auto.textContent = "⏸ 멈추기";
        timer = setTimeout(step, 700);
        return;
      }
      stopAuto();
      if (act === "plus" && z < MAXZ) { z++; render(z - 1); }
      else if (act === "minus" && z > 1) { z--; render(z + 1); }
      else if (act === "reset") { z = 1; render(0); }
    });
    openBtn.addEventListener("click", function () { stopAuto(); openDetail(z); returnOutside = openBtn; });
    render(0);
  }

  function initShellsWhy() {
    initJumpLab();
    initHall();
    initFillLab();
    document.querySelectorAll("[data-open-z]").forEach(function (b) {
      b.addEventListener("click", function () { openDetail(+b.dataset.openZ); returnOutside = b; });
    });
  }

  /* ---------- 읽는 법 4~7번: 원자 속 더 깊이 ---------- */
  var LV_NAMES = { 1: "초등학생", 2: "중학생", 3: "고등학생", 4: "성인" };
  function initLevels() {
    var deep = document.getElementById("deep"), bar = document.getElementById("lvbar"), now = document.getElementById("lvbar-now");
    if (!deep || !bar) return;
    function set(n, save) {
      deep.setAttribute("data-show", String(n));
      bar.querySelectorAll("[data-lvset]").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.dataset.lvset === n)); });
      now.textContent = n === 1 ? "초등학생 설명만 보여요." : n === 4 ? "모든 단계의 설명이 다 보여요." : "초등학생부터 " + LV_NAMES[n] + " 설명까지 보여요.";
      if (save) { try { localStorage.setItem("ptable-level", String(n)); } catch (e) { /* 저장 못 해도 괜찮아요 */ } }
    }
    var lv = 4;
    try { lv = +localStorage.getItem("ptable-level") || 4; } catch (e) { lv = 4; }
    var m = /[?&]level=([1-4])/.exec(location.search);
    if (m) lv = +m[1];
    if (!(lv >= 1 && lv <= 4)) lv = 4;
    set(lv, false);
    bar.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-lvset]");
      if (b) set(+b.dataset.lvset, true);
    });
  }

  /* 파장(nm) → 대략의 색 */
  function nmColor(nm) {
    if (nm < 380) return "#9a91ad";
    if (nm > 720) return "#6e2a22";
    var r = 0, g = 0, b = 0;
    if (nm < 440) { r = (440 - nm) / 60; b = 1; }
    else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { g = 1; b = (510 - nm) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
    else if (nm < 645) { r = 1; g = (645 - nm) / 65; }
    else r = 1;
    var f = nm < 420 ? 0.45 + 0.55 * (nm - 380) / 40 : nm > 680 ? 0.45 + 0.55 * (720 - nm) / 40 : 1;
    function h(v) { var x = Math.round(255 * Math.pow(v * f, 0.8)); return (x < 16 ? "0" : "") + x.toString(16); }
    return "#" + h(r) + h(g) + h(b);
  }
  var LT_MIN = 380, LT_MAX = 720;
  function ltPos(nm) { return ((nm - LT_MIN) / (LT_MAX - LT_MIN) * 100).toFixed(2) + "%"; }
  function specHTML(lines, extra) {
    return '<div class="sw-spec sw-spec--dark lt-spec' + (extra ? " " + extra : "") + '">' + lines.map(function (nm) {
      return '<i style="left:' + ltPos(nm) + ";background:" + nmColor(nm) + ";color:" + nmColor(nm) + '"></i>';
    }).join("") + "</div>";
  }

  /* 4번: 벌(전자) 사진 점 찍기 */
  function initOrbitalDots() {
    var box = document.getElementById("ob-dots");
    if (!box) return;
    var ORB = {
      s: { name: "1s 방 (공 모양)", scale: 30, sample: function () {
        var r = -0.5 * (Math.log(1 - Math.random()) + Math.log(1 - Math.random()) + Math.log(1 - Math.random()));
        var u = 2 * Math.random() - 1, ph = 2 * Math.PI * Math.random(), s = Math.sqrt(1 - u * u);
        return [r * s * Math.cos(ph), r * u];
      }, inside: function (p, k) { return p[0] * p[0] + p[1] * p[1] <= k * k; },
        outline: function (k, sc) { return '<circle cx="0" cy="0" r="' + (k * sc).toFixed(1) + '"/>'; } },
      p: { name: "2p 방 (아령 모양)", scale: 8.6, sample: function () {
        var r = 0;
        for (var i = 0; i < 5; i++) r -= Math.log(1 - Math.random());
        var w = Math.pow(Math.random(), 1 / 3), u = Math.random() < 0.5 ? -w : w, ph = 2 * Math.PI * Math.random(), s = Math.sqrt(1 - u * u);
        return [r * s * Math.cos(ph), r * u];
      }, inside: function (p, k) { var a = p[0] / (0.85 * k), b = (Math.abs(p[1]) - k) / k; return a * a + b * b <= 1; },
        outline: function (k, sc) { var rx = (0.85 * k * sc).toFixed(1), ry = (k * sc).toFixed(1), c = (k * sc).toFixed(1); return '<ellipse cx="0" cy="-' + c + '" rx="' + rx + '" ry="' + ry + '"/><ellipse cx="0" cy="' + c + '" rx="' + rx + '" ry="' + ry + '"/>'; } }
    };
    var MAX = 3000, orb = "s", pts = [], showLine = false;
    var wrap = document.createElement("div");
    wrap.className = "ob";
    wrap.innerHTML =
      '<div class="ob__fig"><svg class="ob-svg" viewBox="-115 -115 230 230" role="img" aria-label="전자가 발견된 자리를 점으로 찍은 그림">' +
      '<rect x="-115" y="-115" width="230" height="230" rx="10" fill="#fffdf8"/>' +
      '<g class="ob-axis"><line x1="-108" x2="108" y1="0" y2="0"/><line x1="0" x2="0" y1="-108" y2="108"/></g>' +
      '<g class="ob-pts"></g><g class="ob-line" hidden></g><circle r="4.5" fill="#1d2330"/><text class="ob-bee" x="0" y="0" text-anchor="middle" font-size="18" opacity="0">🐝</text></svg>' +
      '<p class="ob__cap">가운데 검은 점 = 원자핵</p></div>' +
      '<div class="ob__side">' +
      '<div class="sw-btns" role="group" aria-label="어떤 방을 볼까요">' +
      '<button type="button" class="ibtn ibtn--sm" data-orb="s" aria-pressed="true">⚪ 1s 방 (공)</button>' +
      '<button type="button" class="ibtn ibtn--sm" data-orb="p" aria-pressed="false">∞ 2p 방 (아령)</button></div>' +
      '<div class="sw-btns" role="group" aria-label="사진 찍기">' +
      '<button type="button" class="ibtn ibtn--sm ibtn--primary" data-shot="1">📸 1장</button>' +
      '<button type="button" class="ibtn ibtn--sm" data-shot="10">📸 10장</button>' +
      '<button type="button" class="ibtn ibtn--sm" data-shot="100">📸 100장</button>' +
      '<button type="button" class="ibtn ibtn--sm" data-shot="1000">⚡ 1000장</button></div>' +
      '<div class="sw-btns" role="group" aria-label="그림 도구">' +
      '<button type="button" class="ibtn ibtn--sm" data-ob="line" aria-pressed="false">✏️ 90% 경계선 그리기</button>' +
      '<button type="button" class="ibtn ibtn--sm" data-ob="reset">↻ 지우기</button></div>' +
      '<p class="sw-label">찍은 사진 <b data-count>0</b>장</p>' +
      '<p class="sw-msg" aria-live="polite">📸 버튼을 눌러 사진을 찍어 보세요.</p></div>';
    box.appendChild(wrap);
    var gPts = wrap.querySelector(".ob-pts"), gLine = wrap.querySelector(".ob-line"), bee = wrap.querySelector(".ob-bee"),
      countEl = wrap.querySelector("[data-count]"), msg = wrap.querySelector(".sw-msg"), lineBtn = wrap.querySelector('[data-ob="line"]');

    function boundaryK() {
      var o = ORB[orb], lo = 0.05, hi = 30;
      for (var it = 0; it < 40; it++) {
        var mid = (lo + hi) / 2, c = 0;
        for (var i = 0; i < pts.length; i++) if (o.inside(pts[i], mid)) c++;
        if (c / pts.length >= 0.9) hi = mid; else lo = mid;
      }
      return hi;
    }
    function drawLine() {
      gLine.hidden = !showLine;
      lineBtn.setAttribute("aria-pressed", String(showLine));
      if (!showLine) { gLine.innerHTML = ""; return ""; }
      if (pts.length < 30) { gLine.innerHTML = ""; return "점이 30개 이상 모여야 경계선을 그릴 수 있어요. 사진을 더 찍어 보세요."; }
      var k = boundaryK(), o = ORB[orb], c = 0;
      for (var i = 0; i < pts.length; i++) if (o.inside(pts[i], k)) c++;
      gLine.innerHTML = o.outline(k, o.scale);
      return "✏️ 이 선 안에 지금 찍은 점 " + pts.length + "개 중 " + c + "개(" + Math.round(c / pts.length * 100) + "%)가 들어 있어요. 이 선이 책에 나오는 오비탈 그림이에요.";
    }
    function explain() {
      var n = pts.length;
      if (!n) return orb === "s" ? "1s 방을 골랐어요. 📸 버튼을 눌러 사진을 찍어 보세요." : "2p 방을 골랐어요. 📸 버튼을 눌러 사진을 찍어 보세요.";
      if (n === 1) return "사진을 한 장 찍었어요. 한 장만 보면 전자가 어디에 자주 나타나는지 알 수 없어요.";
      if (n < 60) return "점이 " + n + "개 모였어요. 아직 모양이 잘 안 보여요. 더 찍어 보세요!";
      if (orb === "s") return n < 400 ? "가운데(핵) 가까이 점이 빽빽해지고 있어요. 둥근 모양이 보이기 시작해요." :
        "핵 가까이는 빽빽하고 바깥으로 갈수록 드문드문해요. 둥글게 퍼진 이 구름이 1s 오비탈이에요. 끝이 딱 끊기지 않고 점점 옅어지죠?";
      return n < 400 ? "위아래로 두 덩어리가 생기고 있어요." :
        "위아래 두 덩어리, 아령 모양이 보여요! 가운데 가로선 위에는 점이 거의 없어요. 이 방(2p)에서는 그 판 위에서 전자가 발견될 가능성이 0이에요.";
    }
    function update(lastPt) {
      countEl.textContent = pts.length;
      var t = explain(), lt = drawLine();
      msg.textContent = lt ? t + " " + lt : t;
      if (lastPt && swMotion()) {
        var sc = ORB[orb].scale;
        bee.setAttribute("x", (lastPt[0] * sc).toFixed(1));
        bee.setAttribute("y", (-lastPt[1] * sc - 6).toFixed(1));
        bee.classList.remove("is-buzz"); void bee.getBoundingClientRect(); bee.classList.add("is-buzz");
      }
    }
    function shoot(n) {
      var o = ORB[orb], sc = o.scale, html = "", last = null;
      n = Math.min(n, MAX - pts.length);
      if (n <= 0) { msg.textContent = "점이 " + MAX + "개로 가득 찼어요. ↻ 지우기를 누르고 다시 해 보세요."; return; }
      for (var i = 0; i < n; i++) {
        var p = o.sample();
        pts.push(p); last = p;
        html += '<circle cx="' + (p[0] * sc).toFixed(1) + '" cy="' + (-p[1] * sc).toFixed(1) + '" r="1.6"/>';
      }
      gPts.insertAdjacentHTML("beforeend", html);
      update(n === 1 ? last : null);
    }
    function reset() { pts = []; gPts.innerHTML = ""; bee.classList.remove("is-buzz"); update(null); }
    wrap.addEventListener("click", function (ev) {
      var b = ev.target.closest("button");
      if (!b || !wrap.contains(b)) return;
      if (b.dataset.shot) shoot(+b.dataset.shot);
      else if (b.dataset.orb) {
        orb = b.dataset.orb;
        wrap.querySelectorAll("[data-orb]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        reset();
      } else if (b.dataset.ob === "line") { showLine = !showLine; update(null); }
      else if (b.dataset.ob === "reset") reset();
    });
  }

  /* 5번: 빛의 지문 맞히기 */
  var LT_SPECTRA = [
    { k: "H", z: 1, name: "수소", lines: [410, 434, 486, 656], hint: "별과 우주에 가장 많은 원소예요. 3번 실험에서 찾은 4줄을 떠올려 보세요." },
    { k: "He", z: 2, name: "헬륨", lines: [447, 471, 492, 502, 588, 668, 707], hint: "1868년 태양 빛에서 먼저 발견됐어요. 노란 줄(588 nm)이 단서예요." },
    { k: "Na", z: 11, name: "소듐(나트륨)", lines: [589, 589.6], hint: "노란 가로등 빛이에요. 노란 줄 하나만 아주 밝아요." },
    { k: "Ne", z: 10, name: "네온", lines: [540, 585, 588, 594, 597, 603, 607, 614, 616, 622, 627, 633, 638, 640, 651, 660, 693, 703], hint: "주황빛 간판 불빛이에요. 노랑~빨강 쪽에 줄이 아주 많아요." },
    { k: "Hg", z: 80, name: "수은", lines: [405, 436, 546, 577, 579], hint: "옛날 형광등 속에 아주 조금 들어 있었어요. 초록 줄(546 nm)이 단서예요." }
  ];
  function initLightQuiz() {
    var box = document.getElementById("lt-quiz");
    if (!box) return;
    var order = [], idx = 0, score = 0, tried = 0, answered = false, wrongs = 0;
    var wrap = document.createElement("div");
    wrap.className = "ltq";
    wrap.innerHTML =
      '<div class="ltq__mystery"><p class="sw-label">🔭 수수께끼 빛 · <span data-q></span></p><div data-mys></div>' +
      '<div class="sw-spec-scale" aria-hidden="true"><span>380 nm 보라</span><span>빨강 720 nm</span></div></div>' +
      '<p class="sw-label">📖 지문 사전 · 맞는 원소를 눌러 보세요</p>' +
      '<div class="ltq__dict" role="group" aria-label="원소 고르기">' + LT_SPECTRA.map(function (sp, i) {
        return '<button type="button" class="ltq__opt" data-pick="' + i + '"><span class="ltq__name">' + esc(sp.name) + " <small>" + sp.k + "</small></span>" + specHTML(sp.lines, "lt-spec--mini") + "</button>";
      }).join("") + "</div>" +
      '<div class="sw-btns ltq__ctl"><button type="button" class="ibtn ibtn--sm" data-lt="hint">💡 힌트</button>' +
      '<button type="button" class="ibtn ibtn--sm ibtn--primary" data-lt="next" disabled>다음 문제 →</button>' +
      '<span class="ltq__score">맞힌 문제 <b data-score>0</b> / <b data-tried>0</b></span></div>' +
      '<p class="sw-msg" aria-live="polite"></p>';
    box.appendChild(wrap);
    var mys = wrap.querySelector("[data-mys]"), qEl = wrap.querySelector("[data-q]"), msg = wrap.querySelector(".sw-msg"),
      nextBtn = wrap.querySelector('[data-lt="next"]'), scoreEl = wrap.querySelector("[data-score]"), triedEl = wrap.querySelector("[data-tried]");
    function shuffle() {
      order = LT_SPECTRA.map(function (_, i) { return i; });
      for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = order[i]; order[i] = order[j]; order[j] = t; }
    }
    function show() {
      var sp = LT_SPECTRA[order[idx]];
      answered = false; wrongs = 0;
      mys.innerHTML = specHTML(sp.lines, "lt-spec--big");
      mys.firstChild.setAttribute("role", "img");
      mys.firstChild.setAttribute("aria-label", "수수께끼 빛의 줄무늬: " + sp.lines.length + "줄");
      qEl.textContent = "문제 " + (idx + 1) + " / " + order.length;
      wrap.querySelectorAll(".ltq__opt").forEach(function (o) { o.classList.remove("is-right", "is-wrong"); o.disabled = false; });
      nextBtn.disabled = true;
      nextBtn.textContent = idx === order.length - 1 ? "결과 보기 →" : "다음 문제 →";
      msg.textContent = "수수께끼 빛과 줄의 위치가 똑같은 원소를 지문 사전에서 찾아보세요.";
    }
    function start() { shuffle(); idx = 0; score = 0; tried = 0; scoreEl.textContent = "0"; triedEl.textContent = "0"; show(); }
    wrap.addEventListener("click", function (ev) {
      var b = ev.target.closest("button");
      if (!b || !wrap.contains(b)) return;
      var ans = order[idx], sp = LT_SPECTRA[ans];
      if (b.dataset.pick) {
        if (answered) return;
        var pick = +b.dataset.pick;
        if (pick === ans) {
          answered = true; b.classList.add("is-right");
          if (!wrongs) score++;
          tried++; scoreEl.textContent = score; triedEl.textContent = tried;
          wrap.querySelectorAll(".ltq__opt").forEach(function (o) { o.disabled = true; });
          nextBtn.disabled = false;
          msg.innerHTML = "⭕ 맞아요! <b>" + esc(sp.name) + "</b>의 빛이에요. 줄이 " + sp.lines.length + "개" + (sp.k === "Na" ? "(사실은 아주 가까운 2줄이라 1줄처럼 보여요)" : "") + " 있고, 위치가 사전과 똑같아요. 이렇게 빛만 보고 원소를 알아내는 것을 <b>분광 분석</b>이라고 해요.";
        } else {
          wrongs++; b.classList.add("is-wrong"); b.disabled = true;
          msg.textContent = "❌ " + LT_SPECTRA[pick].name + "는 아니에요. 줄의 개수와 위치를 다시 비교해 보세요. 어려우면 💡 힌트를 눌러요.";
        }
      } else if (b.dataset.lt === "hint") {
        if (!answered) msg.textContent = "💡 힌트: " + sp.hint;
      } else if (b.dataset.lt === "next") {
        if (idx < order.length - 1) { idx++; show(); }
        else {
          mys.innerHTML = ""; nextBtn.disabled = true; qEl.textContent = "다 풀었어요";
          msg.innerHTML = "🎉 " + order.length + "문제 중 <b>" + score + "문제</b>를 한 번에 맞혔어요! 과학자들도 이렇게 별빛의 줄무늬를 사전과 맞춰 별의 성분을 알아내요. " +
            '<button type="button" class="linkbtn linkbtn--sm" data-lt="again">↻ 다시 하기</button>';
        }
      } else if (b.dataset.lt === "again") start();
    });
    start();
  }

  /* 6번: 한 번에 vs 나눠서 */
  function hDE(up, low) { return 13.6 * (1 / (low * low) - 1 / (up * up)); }
  function photonInfo(e) {
    var nm = 1239.84 / e, sw = SW_JUMPS.filter(function (j) { return Math.abs(j.nm - nm) < 3; })[0];
    if (nm < 380) return { nm: nm, color: "#8f86a8", name: "자외선", kind: "uv" };
    if (nm > 720) return { nm: nm, color: "#8a3b2c", name: "적외선", kind: "ir" };
    return { nm: nm, color: sw ? sw.color : nmColor(nm), name: sw ? sw.name.replace(" 빛", "") : "보이는 빛", kind: "vis" };
  }
  function initEnergyLab() {
    var box = document.getElementById("es-lab");
    if (!box) return;
    var from = 3, to = 1, done = { once: null, split: null }, timers = [];
    var svg = '<svg class="sw-levels" viewBox="0 0 300 206" role="img" aria-label="수소 원자의 층 계단 그림(간격은 보기 쉽게 조절)">';
    for (var n = 1; n <= 6; n++) {
      svg += '<line class="sw-level" data-level="' + n + '" x1="48" x2="292" y1="' + SW_LEVEL_Y[n] + '" y2="' + SW_LEVEL_Y[n] + '"/>' +
        '<text class="sw-level-t" x="42" y="' + (SW_LEVEL_Y[n] + 4) + '" text-anchor="end">' + n + "층</text>";
    }
    svg += '<g class="es-photons"></g><g class="sw-electron" transform="translate(110 ' + SW_LEVEL_Y[3] + ')"><circle r="8"/><text y="4" text-anchor="middle">−</text></g></svg>';
    var wrap = document.createElement("div");
    wrap.className = "sw-jump es";
    wrap.innerHTML = '<div class="sw-jump__fig">' + svg + '<p class="ob__cap">층 간격은 보기 쉽게 조절했어요. 진짜 비율은 아래 그림을 보세요.</p></div>' +
      '<div class="sw-jump__side">' +
      '<p class="sw-label">출발 층</p><div class="sw-btns" role="group" aria-label="출발 층 고르기" data-grp="from">' +
      [2, 3, 4, 5, 6].map(function (k) { return '<button type="button" class="ibtn ibtn--sm" data-from="' + k + '" aria-pressed="' + (k === from) + '">' + k + "층</button>"; }).join("") + "</div>" +
      '<p class="sw-label">도착 층</p><div class="sw-btns" role="group" aria-label="도착 층 고르기" data-grp="to"></div>' +
      '<div class="sw-btns es-go"><button type="button" class="ibtn ibtn--sm ibtn--primary" data-go="once">⚡ 한 번에</button>' +
      '<button type="button" class="ibtn ibtn--sm ibtn--primary" data-go="split">🪜 한 층씩 나눠서</button>' +
      '<button type="button" class="ibtn ibtn--sm" data-go="reset">↻ 지우기</button></div>' +
      '<div class="es-rows">' +
      '<div class="es-row" data-row="once"><span class="es-row__t">⚡ 한 번에</span><div class="es-bar"></div><b class="es-sum">–</b></div>' +
      '<div class="es-row" data-row="split"><span class="es-row__t">🪜 나눠서</span><div class="es-bar"></div><b class="es-sum">–</b></div>' +
      '<div class="es-scale" aria-hidden="true"><span>0</span><span>막대 끝 = 13.6 (전자가 원자를 떠나는 에너지)</span></div></div>' +
      '<p class="sw-msg" aria-live="polite"></p></div>';
    box.appendChild(wrap);
    var toGrp = wrap.querySelector('[data-grp="to"]'), msg = wrap.querySelector(".sw-msg"), el = wrap.querySelector(".sw-electron"),
      gPh = wrap.querySelector(".es-photons");
    function place(y, animate) {
      el.classList.toggle("is-moving", !!animate);
      el.setAttribute("transform", "translate(110 " + y + ")");
      el.style.transform = "translate(110px," + y + "px)";
    }
    function levels(a, b) {
      wrap.querySelectorAll(".sw-level").forEach(function (l) { var k = +l.getAttribute("data-level"); l.classList.toggle("is-on", k <= a && k >= b); });
    }
    function clearTimers() { timers.forEach(clearTimeout); timers = []; }
    function drawTo() {
      var h = "";
      for (var k = 1; k < from; k++) h += '<button type="button" class="ibtn ibtn--sm" data-to="' + k + '" aria-pressed="' + (k === to) + '">' + k + "층</button>";
      toGrp.innerHTML = h;
    }
    function clearRows() {
      done = { once: null, split: null };
      wrap.querySelectorAll(".es-row").forEach(function (r) { r.querySelector(".es-bar").innerHTML = ""; r.querySelector(".es-sum").textContent = "–"; r.classList.remove("is-done"); });
      gPh.innerHTML = "";
    }
    function fmt(x) { return x.toFixed(2); }
    function segHTML(e) {
      var p = photonInfo(e);
      return '<span class="es-seg es-seg--' + p.kind + '" style="width:' + (e / 13.6 * 100).toFixed(2) + "%;background:" + p.color + '" title="' + p.name + " " + fmt(e) + '"><em>' + (e >= 1.2 ? fmt(e) : "") + "</em></span>";
    }
    function listText(es) {
      return es.map(function (e) { var p = photonInfo(e); return p.name + " " + fmt(e); }).join(" + ");
    }
    function finishRow(mode, es) {
      var row = wrap.querySelector('[data-row="' + mode + '"]'), sum = es.reduce(function (a, b) { return a + b; }, 0);
      row.querySelector(".es-bar").innerHTML = es.map(segHTML).join("");
      row.querySelector(".es-sum").textContent = fmt(sum);
      row.classList.add("is-done");
      done[mode] = sum;
      var t = "<b>" + (mode === "once" ? "⚡ 한 번에" : "🪜 나눠서") + " " + from + "층 → " + to + "층:</b> 빛 " + es.length + "개 (" + esc(listText(es)) + ") = 합계 <b>" + fmt(sum) + "</b>";
      if (done.once !== null && done.split !== null) {
        t += "<br>✅ <b>두 합계가 똑같아요!</b> 몇 번에 나눠 뛰든 처음 층과 마지막 층이 같으면 내놓는 에너지 합계는 같아요.";
        if (from - to > 1) t += " 대신 나눠 뛰면 <b>작은 빛 여러 개</b>, 한 번에 뛰면 <b>큰 빛 하나</b>가 나와요.";
        if (to === 1) t += " 막대를 보면 2층 → 1층 칸이 가장 길어요. 가장 안쪽으로 떨어질 때 에너지가 가장 커요.";
      } else t += "<br>이번엔 " + (mode === "once" ? "🪜 한 층씩 나눠서" : "⚡ 한 번에") + "도 눌러서 비교해 보세요.";
      msg.innerHTML = t;
    }
    function emitWave(lv, color) {
      var y = SW_LEVEL_Y[lv] - 10;
      gPh.insertAdjacentHTML("beforeend", '<path class="sw-photon is-fly" d="' + wavePath(124, y, 160, 5, 14) + '" fill="none" stroke-width="3" stroke-linecap="round" stroke="' + color + '"/>');
    }
    function run(mode) {
      clearTimers(); gPh.innerHTML = "";
      var steps = mode === "once" ? [[from, to]] : [];
      if (mode === "split") for (var k = from; k > to; k--) steps.push([k, k - 1]);
      var es = steps.map(function (s) { return hDE(s[0], s[1]); });
      levels(from, to);
      if (!swMotion()) { place(SW_LEVEL_Y[to], false); steps.forEach(function (s, i) { emitWave(s[1], photonInfo(es[i]).color); }); finishRow(mode, es); return; }
      msg.textContent = "전자를 " + from + "층으로 올렸어요. 이제 " + (mode === "once" ? "한 번에" : "한 층씩") + " 뛰어내려요…";
      place(SW_LEVEL_Y[from], false);
      var t = 380;
      steps.forEach(function (s, i) {
        timers.push(setTimeout(function () { place(SW_LEVEL_Y[s[1]], true); }, t));
        timers.push(setTimeout(function () { emitWave(s[1], photonInfo(es[i]).color); }, t + 600));
        t += 900;
      });
      timers.push(setTimeout(function () { finishRow(mode, es); }, t));
    }
    wrap.addEventListener("click", function (ev) {
      var b = ev.target.closest("button");
      if (!b || !wrap.contains(b)) return;
      if (b.dataset.from) {
        clearTimers(); from = +b.dataset.from; if (to >= from) to = from - 1;
        wrap.querySelectorAll("[data-from]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        drawTo(); clearRows(); levels(0, 0); place(SW_LEVEL_Y[from], false);
        msg.textContent = from + "층에서 " + to + "층까지 내려가 볼게요. ⚡와 🪜를 둘 다 눌러 보세요.";
      } else if (b.dataset.to) {
        clearTimers(); to = +b.dataset.to;
        toGrp.querySelectorAll("[data-to]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        clearRows(); levels(0, 0); place(SW_LEVEL_Y[from], false);
        msg.textContent = from + "층에서 " + to + "층까지 내려가 볼게요. ⚡와 🪜를 둘 다 눌러 보세요.";
      } else if (b.dataset.go === "reset") {
        clearTimers(); clearRows(); levels(0, 0); place(SW_LEVEL_Y[from], false);
        msg.textContent = "막대를 지웠어요. 다시 눌러 보세요.";
      } else if (b.dataset.go) run(b.dataset.go);
    });
    drawTo();
    msg.textContent = "3층에서 1층까지 내려가 볼게요. ⚡ 한 번에와 🪜 한 층씩 나눠서를 둘 다 눌러 보세요.";
  }

  /* 7번: 불꽃놀이 만들기 */
  var FW = [
    { s: "Li", z: 3, n: "리튬", color: "#e8174a", c: "진한 빨강", say: "리튬 원자의 바깥 전자가 671 nm 빨간빛을 내요. 빨간 불꽃 신호와 리튬 확인 실험에 써요." },
    { s: "Na", z: 11, n: "소듐(나트륨)", color: "#ffc61a", c: "노랑", say: "소듐 원자의 바깥 전자가 589 nm 노란빛을 내요. 노란 가로등, 소금을 불에 뿌렸을 때와 같은 색이에요." },
    { s: "K", z: 19, n: "포타슘(칼륨)", color: "#b993f2", c: "연보라", say: "포타슘은 빨간 쪽(766 nm)과 보라 쪽(404 nm) 빛이 섞여 연보라로 보여요. 소듐이 조금만 섞여도 노란빛에 가려져요." },
    { s: "Ca", z: 20, n: "칼슘", color: "#ff7426", c: "주황", say: "칼슘이 든 물질은 주황빛 불꽃을 내요. 불꽃놀이에서 주황색을 낼 때 써요." },
    { s: "Sr", z: 38, n: "스트론튬", color: "#ff2140", c: "빨강", say: "불꽃놀이와 비상 신호탄의 새빨간 색은 스트론튬으로 내요." },
    { s: "Ba", z: 56, n: "바륨", color: "#9be15d", c: "연두·초록", say: "불꽃놀이의 초록색은 바륨으로 내요." },
    { s: "Cu", z: 29, n: "구리", color: "#3b8cff", c: "파랑", say: "불꽃놀이의 파란색은 구리로 내요. 파랑은 만들기 가장 어려운 불꽃 색이라 온도를 잘 맞춰야 해요." }
  ];
  function initFireworks() {
    var box = document.getElementById("fw-lab");
    if (!box) return;
    var wrap = document.createElement("div"), slot = 0, made = {};
    wrap.className = "fw";
    wrap.innerHTML = '<div class="fw-sky" aria-hidden="true"><span class="fw-ground"></span></div>' +
      '<div class="sw-btns fw-btns" role="group" aria-label="불꽃 원소 고르기">' + FW.map(function (f, i) {
        return '<button type="button" class="ibtn ibtn--sm fw-btn" data-fw="' + i + '"><span class="fw-sw" style="background:' + f.color + '"></span>' + esc(f.n) + " " + f.s + "</button>";
      }).join("") + '<button type="button" class="ibtn ibtn--sm" data-fw="all">🎆 한꺼번에</button></div>' +
      '<p class="sw-label">만든 불꽃 색 <b data-made>0</b> / ' + FW.length + "</p>" +
      '<p class="sw-msg" aria-live="polite">원소 단추를 눌러 보세요.</p>';
    box.appendChild(wrap);
    var sky = wrap.querySelector(".fw-sky"), msg = wrap.querySelector(".sw-msg"), madeEl = wrap.querySelector("[data-made]");
    function burst(f, x, y) {
      var b = document.createElement("div"), N = 18, h = "";
      b.className = "fw-b" + (swMotion() ? "" : " is-still");
      b.style.left = x + "%"; b.style.top = y + "%"; b.style.color = f.color;
      for (var i = 0; i < N; i++) h += '<i style="--a:' + (i * 360 / N) + 'deg"></i>';
      b.innerHTML = h + '<b class="fw-label">' + f.s + "</b>";
      sky.appendChild(b);
      var olds = sky.querySelectorAll(".fw-b");
      if (olds.length > 8) olds[0].remove();
      setTimeout(function () { if (b.parentNode) b.remove(); }, swMotion() ? 2200 : 3500);
    }
    function fire(i) {
      var f = FW[i], P = [[14, 30], [50, 30], [86, 30], [32, 62], [68, 62], [14, 72], [86, 72]], pos = P[slot % P.length];
      slot++;
      burst(f, pos[0], pos[1]);
      made[i] = true;
      madeEl.textContent = Object.keys(made).length;
      msg.innerHTML = "<b>" + esc(f.n) + " → " + f.c + "</b> " + esc(f.say) + (Object.keys(made).length === FW.length ? "<br>🎉 7가지 색을 다 만들었어요! 색이 다른 건 원소마다 전자 계단의 높이가 다르기 때문이에요." : "");
    }
    wrap.addEventListener("click", function (ev) {
      var b = ev.target.closest("[data-fw]");
      if (!b) return;
      if (b.dataset.fw === "all") {
        FW.forEach(function (f, i) { setTimeout(function () { fire(i); }, swMotion() ? i * 260 : 0); });
        return;
      }
      fire(+b.dataset.fw);
    });
  }

  function initDeep() {
    initLevels();
    initOrbitalDots();
    initLightQuiz();
    initEnergyLab();
    initFireworks();
  }

  function safeInit() {
    try {
      init();
    } catch (error) {
      runtimeStatus.hidden = false;
      runtimeStatus.textContent = "주기율표를 불러오지 못했어요. 새로 고침을 눌러 다시 해 보세요. 아래 설명은 그대로 읽을 수 있어요.";
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ibtn";
      btn.textContent = "새로 고침";
      btn.addEventListener("click", function () { location.reload(); });
      runtimeStatus.appendChild(btn);
    }
  }

  window.__ptable = { electronInfo: electronInfo, parseHalfLife: parseHalfLife, isoSummary: isoSummary, kidDur: kidDur, kidTemp: kidTemp, kidDensity: kidDensity };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", safeInit, { once: true });
  } else {
    safeInit();
  }
})();
