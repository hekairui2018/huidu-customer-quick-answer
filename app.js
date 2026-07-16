const OFFICIAL = {
  home: "https://www.huidu.cn/",
  hdplayerDownload: "https://www.huidu.cn/CnDownload/index_100000010773135.html",
  hdplayerManual: "https://cdn1.huidu.cn/huidu.cn/WebFiles/Instruction/Software-instruction/HDPlayer%E7%94%A8%E6%88%B7%E6%89%8B%E5%86%8CV3.9.pdf",
  downloadCenter: "https://www.huidu.cn/CnDownload/index_100000010716522.html#download"
};

const LOCAL_DEMO_VIDEOS = [
  {
    title: "节目编辑与发送指导视频",
    desc: "本地微盘指导视频，仅用于在线播放参考，不提供下载按钮。",
    src: "/demo-videos/program-send.mp4",
    keywords: "节目 发送 编辑 屏掌控 APP HDPlayer 操作"
  }
];

const SCREEN_CONTROL_DOCS = [
  {
    title: "屏掌控标准版（全彩）操作说明 V5.2",
    desc: "适合全彩控制卡/播放器客户，包含 APP 安装、Wi-Fi 连接、密码修改、节目编辑与发送。",
    tags: "全彩 APP 安装 Wi-Fi 节目发送"
  },
  {
    title: "屏掌控标准版（单双色）操作说明 V5.0",
    desc: "适合单双色控制卡客户，包含连接控制卡、编辑节目、区域管理和发送节目。",
    tags: "单双色 Wi-Fi 编辑节目"
  },
  {
    title: "屏掌控商显版操作说明书 V2.0",
    desc: "适合商显版本使用场景，重点是 Wi-Fi 寻机、新建节目、节目编辑与发送。",
    tags: "商显 寻机 新建节目"
  },
  {
    title: "屏掌控（LedArt）LCD版说明书 V2.1",
    desc: "适合 LCD 相关客户，包含 APP 安装、Wi-Fi 连接、节目编辑与发送。",
    tags: "LCD LedArt 节目发送"
  },
  {
    title: "屏掌控（VP系列）操作说明 V1.0",
    desc: "适合 VP 系列客户使用手机 APP 做无线控制和基础操作时参考。",
    tags: "VP 手机 APP 无线控制"
  }
];

const SCREEN_CONTROL_VIDEOS = [
  {
    title: "屏掌控标准版 - 全彩卡操作演示",
    desc: "全彩卡客户操作指导视频，仅在线播放参考，不提供下载按钮。",
    src: "/demo-videos/screencontrol-fullcolor.mp4",
    tags: "全彩 屏掌控 APP 发送节目"
  },
  {
    title: "屏掌控标准版 - 单色卡操作演示",
    desc: "单色卡客户操作指导视频，仅在线播放参考，不提供下载按钮。",
    src: "/demo-videos/screencontrol-singlecolor.mp4",
    tags: "单色 单双色 屏掌控 APP 发送节目"
  }
];

const IC_FIRMWARE_SOURCE = "芯片选型-V4.4.pdf";
const RECEIVER_CARD_SUFFIX_NOTE = "接收卡常见尾缀：63 / 65 / 97 / 99";
const ASYNC_CARD_SUFFIX_NOTE = "异步卡固件尾缀：70 / 71 / 73 / 79";
const ASYNC_SUFFIX_MAPPING_NOTE = "已确认对应：63→70（通用/PWM），65→71（65系列），99→79（99系列）；97暂未在现有资料里找到明确对应，先按现场丝印/版本记录核对。";

function normalizeHintText(value) {
  return String(value || "").toLowerCase().replace(/[\s\/、,，()（）\-_.：:]+/g, "");
}

function firmwareTypeFromRow(row) {
  const text = normalizeHintText(`${row.firmware} ${row.category} ${row.chip}`);
  if (text.includes("通用固件") || text.includes("通用")) return "通用固件";
  if (text.includes("65系列")) return "65系列固件";
  if (text.includes("63系列")) return "63系列固件";
  if (text.includes("99系列")) return "99系列固件";
  if (text.includes("2065")) return "65系列固件";
  if (text.includes("6363") || text.includes("fm6363")) return "通用固件";
  if (text.includes("1063")) return "63系列固件";
  if (text.includes("9931") || text.includes("ls99") || text.includes("99")) return "99系列固件";
  return "【待补充】";
}

function deriveFirmwareMap(row) {
  const firmwareType = firmwareTypeFromRow(row);
  if (firmwareType === "通用固件") {
    return {
      firmwareType,
      receiverSuffix: "01",
      asyncSuffixA: "70",
      asyncSuffixB: "00",
      note: "PWM/常规芯片"
    };
  }
  if (firmwareType === "63系列固件") {
    return {
      firmwareType,
      receiverSuffix: "63",
      asyncSuffixA: "73",
      asyncSuffixB: "63",
      note: "63系列芯片"
    };
  }
  if (firmwareType === "65系列固件") {
    return {
      firmwareType,
      receiverSuffix: "65",
      asyncSuffixA: "71",
      asyncSuffixB: "65",
      note: "65系列芯片"
    };
  }
  if (firmwareType === "99系列固件") {
    return {
      firmwareType,
      receiverSuffix: "99",
      asyncSuffixA: "79",
      asyncSuffixB: "99",
      note: "99系列芯片"
    };
  }
  return {
    firmwareType,
    receiverSuffix: "【待补充】",
    asyncSuffixA: "【待补充】",
    asyncSuffixB: "【待补充】",
    note: "【待补充】"
  };
}

function firmwareSuffixNote(mapping) {
  const receiverSuffix = mapping.receiverSuffix || "【待补充】";
  const asyncA = mapping.asyncSuffixA || "【待补充】";
  const asyncB = mapping.asyncSuffixB || "【待补充】";
  if (mapping.firmwareType === "通用固件") {
    return `接收卡尾缀：01；异步卡C08L/C16/C36/D16/D36：70；异步卡C16H/C16L：00`;
  }
  if (mapping.firmwareType === "63系列固件") {
    return `接收卡尾缀：63；异步卡C08L/C16/C36/D16/D36：73；异步卡C16H/C16L：63`;
  }
  if (mapping.firmwareType === "65系列固件") {
    return `接收卡尾缀：65；异步卡C08L/C16/C36/D16/D36：71；异步卡C16H/C16L：65`;
  }
  if (mapping.firmwareType === "99系列固件") {
    return `接收卡尾缀：99；异步卡C08L/C16/C36/D16/D36：79；异步卡C16H/C16L：99`;
  }
  return `接收卡尾缀：${receiverSuffix}；异步卡C08L/C16/C36/D16/D36：${asyncA}；异步卡C16H/C16L：${asyncB}`;
}

const IC_FIRMWARE_ROWS = [
  {
    "category": "SM系列芯片",
    "chip": "SM16206/16126\n16016/16106/16306/16127",
    "setting": "常规芯片",
    "firmware": "通用固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16017S",
    "setting": "SM16017S",
    "firmware": "通用固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16159",
    "setting": "SM16159",
    "firmware": "通用固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16169S/16169SD/16169N",
    "setting": "SM16169",
    "firmware": "通用固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16207S",
    "setting": "SM16207S",
    "firmware": "通用固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16227S",
    "setting": "SM16227S",
    "firmware": "通用固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16237/16238",
    "setting": "SM16237",
    "firmware": "通用固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16259",
    "setting": "SM16259",
    "firmware": "通用固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16359",
    "setting": "SM16359",
    "firmware": "通用固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16369",
    "setting": "SM16369",
    "firmware": "通用固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16380SC/16380SF/16382",
    "setting": "SM16380",
    "firmware": "通用固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16388",
    "setting": "SM16388",
    "firmware": "通用固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16389SC",
    "setting": "SM16389",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16389SF",
    "setting": "SM16389SF",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16208S/SC/SJ/N/SF",
    "setting": "SM16208",
    "firmware": "通用固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16386SA",
    "setting": "SM16380SH",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16169NH/NL",
    "setting": "SM16169SH/SL",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16169SW",
    "setting": "SM16169SW",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16169SH/SL",
    "setting": "SM16169SH/SL",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16189S/SC",
    "setting": "SM16189SC",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16395",
    "setting": "SM16395",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16510",
    "setting": "SM16510",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16510SC/NC",
    "setting": "SM16510SC",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16386S",
    "setting": "SM16386S",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16386SH",
    "setting": "SM16386SH",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "异步卡版本说明",
    "chip": "C/D系列异步发送卡",
    "setting": "接收卡尾缀 63 / 65 / 97 / 99",
    "firmware": `${ASYNC_CARD_SUFFIX_NOTE}；${ASYNC_SUFFIX_MAPPING_NOTE}`
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16380SH/SA\nSM16380NH",
    "setting": "SM16380SH/SA",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16380SW/NW",
    "setting": "SM16380SW",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16269S",
    "setting": "SM16269S",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16269SW",
    "setting": "SM16269SW",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "SM系列芯片",
    "chip": "SM16289S/N",
    "setting": "SM16289",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP5125T/D/E/F",
    "setting": "常规芯片或DP5125",
    "firmware": "通用固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP5135",
    "setting": "DP5135或DP5125",
    "firmware": "通用固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3216",
    "setting": "常规芯片",
    "firmware": "通用固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3246",
    "setting": "DP3246",
    "firmware": "通用固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3264/5425/3265B",
    "setting": "DP3264",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP5220",
    "setting": "常规芯片",
    "firmware": "通用固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3265S/3268S",
    "setting": "DP3265S",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3263",
    "setting": "DP3263",
    "firmware": "DP3263专用固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3256",
    "setting": "DP3256",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3269",
    "setting": "DP3269",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3269S",
    "setting": "DP3269S",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3265I/5525",
    "setting": "DP3265I/5525",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3254/3357/3254S",
    "setting": "DP3254/3357",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3252/3252S",
    "setting": "DP3252",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3153/3153S",
    "setting": "DP3153",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3356",
    "setting": "DP3264",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3364",
    "setting": "DP3364",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3364H",
    "setting": "DP3368",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3364Q",
    "setting": "DP3365S",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3364S\nDP3364SA",
    "setting": "DP3364S",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3365S\nDP3365SA",
    "setting": "DP3365S",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3367S",
    "setting": "DP3367S",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3368",
    "setting": "DP3368",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "DP系列芯片",
    "chip": "DP3369S",
    "setting": "DP3369S",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN2026/2025",
    "setting": "常规芯片",
    "firmware": "通用固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN2028",
    "setting": "ICN2028",
    "firmware": "通用固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN2037",
    "setting": "ICN2037",
    "firmware": "通用固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN2038",
    "setting": "ICN2038",
    "firmware": "通用固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN2038S",
    "setting": "ICN2038S",
    "firmware": "通用固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN2045",
    "setting": "ICN2045",
    "firmware": "通用固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICND2046/2049",
    "setting": "ICN2046",
    "firmware": "通用固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICND2047",
    "setting": "ICN2047",
    "firmware": "通用固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN2053/2058",
    "setting": "ICN2053",
    "firmware": "通用固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN2153/2150S",
    "setting": "ICN2153",
    "firmware": "通用固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICND2055\nICND2065",
    "setting": "ICN2055\nICN2065",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICND2163",
    "setting": "ICN2163",
    "firmware": "通用固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN2153P/2159",
    "setting": "ICN2153P/2159",
    "firmware": "通用固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN2152",
    "setting": "ICN2152",
    "firmware": "ICN1063系列固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN1063/2263",
    "setting": "ICN1063/2263",
    "firmware": "ICN1063系列固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN2595",
    "setting": "常规芯片",
    "firmware": "通用固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN2153S",
    "setting": "ICN2153S",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN1068",
    "setting": "ICN1068",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICND2065L",
    "setting": "ICN1065S",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN2055S",
    "setting": "ICN2055S",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN2165",
    "setting": "ICN2165",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN1065",
    "setting": "ICN1065",
    "firmware": "ICN1063系列固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN1065S",
    "setting": "ICN1065S",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN1065L",
    "setting": "ICN1065L",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "ICN系列芯片",
    "chip": "ICN1069",
    "setting": "ICN1069",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "LS系列芯片",
    "chip": "LS9918S/9917",
    "setting": "常规芯片",
    "firmware": "通用固件"
  },
  {
    "category": "LS系列芯片",
    "chip": "LS9919",
    "setting": "LS9919",
    "firmware": "LS9919旧版固件"
  },
  {
    "category": "LS系列芯片",
    "chip": "LS9929S/9929N",
    "setting": "LS9929",
    "firmware": "LS99系列固件"
  },
  {
    "category": "LS系列芯片",
    "chip": "LS9929C/9929CS",
    "setting": "LS9929C",
    "firmware": "LS99系列固件"
  },
  {
    "category": "LS系列芯片",
    "chip": "LS9930",
    "setting": "LS9930",
    "firmware": "LS99系列固件"
  },
  {
    "category": "LS系列芯片",
    "chip": "LS9935S",
    "setting": "LS9935",
    "firmware": "LS99系列固件"
  },
  {
    "category": "LS系列芯片",
    "chip": "LS9935BS",
    "setting": "LS9935B",
    "firmware": "LS99系列固件"
  },
  {
    "category": "LS系列芯片",
    "chip": "LS9935CS",
    "setting": "LS9936",
    "firmware": "LS99系列固件"
  },
  {
    "category": "LS系列芯片",
    "chip": "LS9926",
    "setting": "LS9926",
    "firmware": "LS99系列固件"
  },
  {
    "category": "LS系列芯片",
    "chip": "LS9928",
    "setting": "LS9928",
    "firmware": "LS99系列固件"
  },
  {
    "category": "LS系列芯片",
    "chip": "LS9931/9931CS",
    "setting": "LS9931",
    "firmware": "LS99系列固件"
  },
  {
    "category": "LS系列芯片",
    "chip": "LS9933",
    "setting": "LS9933",
    "firmware": "LS99系列固件"
  },
  {
    "category": "LS系列芯片",
    "chip": "LS9936",
    "setting": "LS9936",
    "firmware": "LS99系列固件"
  },
  {
    "category": "LS系列芯片",
    "chip": "SC6618BS",
    "setting": "常规芯片",
    "firmware": "通用固件"
  },
  {
    "category": "LS系列芯片",
    "chip": "SC6616S",
    "setting": "常规芯片",
    "firmware": "通用固件"
  },
  {
    "category": "LS系列芯片",
    "chip": "LS9937S",
    "setting": "LS9937",
    "firmware": "LS9937专用固件"
  },
  {
    "category": "LS系列芯片",
    "chip": "LS9937CS",
    "setting": "LS9937或\nLS9937C",
    "firmware": "LS9937专用固件"
  },
  {
    "category": "LS系列芯片",
    "chip": "LS9937DS",
    "setting": "LS9937D",
    "firmware": "LS9937专用固件"
  },
  {
    "category": "LS系列芯片",
    "chip": "LS9932",
    "setting": "LS9932",
    "firmware": "LS9932专用固件"
  },
  {
    "category": "C8/CFD系列芯片",
    "chip": "CFD435A/435C",
    "setting": "CFD435A",
    "firmware": "通用固件"
  },
  {
    "category": "C8/CFD系列芯片",
    "chip": "CFD455A/455B",
    "setting": "CFD455A",
    "firmware": "通用固件"
  },
  {
    "category": "C8/CFD系列芯片",
    "chip": "CFD135A/835A/135B",
    "setting": "CFD135A",
    "firmware": "通用固件"
  },
  {
    "category": "C8/CFD系列芯片",
    "chip": "CS2017",
    "setting": "CS2017",
    "firmware": "通用固件"
  },
  {
    "category": "C8/CFD系列芯片",
    "chip": "CS2033",
    "setting": "CS2033",
    "firmware": "通用固件"
  },
  {
    "category": "C8/CFD系列芯片",
    "chip": "CFD455C/455HA/455DA",
    "setting": "CFD455C",
    "firmware": "通用固件"
  },
  {
    "category": "C8/CFD系列芯片",
    "chip": "C8455QP",
    "setting": "CFD455C",
    "firmware": "通用固件"
  },
  {
    "category": "C8/CFD系列芯片",
    "chip": "C8135QN/8135QP",
    "setting": "CFD135A",
    "firmware": "通用固件"
  },
  {
    "category": "C8/CFD系列芯片",
    "chip": "C8325",
    "setting": "C8325",
    "firmware": "通用固件"
  },
  {
    "category": "C8/CFD系列芯片",
    "chip": "C8365",
    "setting": "C8365",
    "firmware": "通用固件"
  },
  {
    "category": "C8/CFD系列芯片",
    "chip": "C8385",
    "setting": "C8385",
    "firmware": "通用固件"
  },
  {
    "category": "C8/CFD系列芯片",
    "chip": "CFD325A/325D",
    "setting": "CFD325A",
    "firmware": "通用固件"
  },
  {
    "category": "C8/CFD系列芯片",
    "chip": "CFD555A",
    "setting": "CFD555A",
    "firmware": "通用固件"
  },
  {
    "category": "C8/CFD系列芯片",
    "chip": "CFD555B",
    "setting": "CFD555B",
    "firmware": "通用固件"
  },
  {
    "category": "C8/CFD系列芯片",
    "chip": "CFD855A",
    "setting": "CFD855A",
    "firmware": "通用固件"
  },
  {
    "category": "C8/CFD系列芯片",
    "chip": "C8335B/CFD335B",
    "setting": "C8335",
    "firmware": "通用固件"
  },
  {
    "category": "C8/CFD系列芯片",
    "chip": "C8465QP",
    "setting": "C8465",
    "firmware": "C8465专用固件"
  },
  {
    "category": "C8/CFD系列芯片",
    "chip": "C8485",
    "setting": "C8485",
    "firmware": "C8465专用固件"
  },
  {
    "category": "FM系列芯片",
    "chip": "FM6124",
    "setting": "FM6124",
    "firmware": "通用固件"
  },
  {
    "category": "FM系列芯片",
    "chip": "FM6126",
    "setting": "FM6126",
    "firmware": "通用固件"
  },
  {
    "category": "FM系列芯片",
    "chip": "FM6127",
    "setting": "FM6127",
    "firmware": "通用固件"
  },
  {
    "category": "FM系列芯片",
    "chip": "FM6153",
    "setting": "FM6153或MBI5153",
    "firmware": "通用固件"
  },
  {
    "category": "FM系列芯片",
    "chip": "FM6253",
    "setting": "FM6253或MBI5153",
    "firmware": "通用固件"
  },
  {
    "category": "FM系列芯片",
    "chip": "FM6353/6353E/6353Q",
    "setting": "FM6353或ICN2053",
    "firmware": "通用固件"
  },
  {
    "category": "FM系列芯片",
    "chip": "FM6356",
    "setting": "ICN2153",
    "firmware": "通用固件"
  },
  {
    "category": "FM系列芯片",
    "chip": "FM6565E",
    "setting": "FM6565E",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "FM系列芯片",
    "chip": "FM6565A/FM6565C/6655A/6565D",
    "setting": "FM6565或ICN2065",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "FM系列芯片",
    "chip": "FM6363",
    "setting": "FM6363或ICN2163",
    "firmware": "通用固件"
  },
  {
    "category": "FM系列芯片",
    "chip": "FM6047",
    "setting": "FM6047",
    "firmware": "通用固件"
  },
  {
    "category": "FM系列芯片",
    "chip": "FM6182",
    "setting": "FM6182",
    "firmware": "通用固件"
  },
  {
    "category": "FM系列芯片",
    "chip": "FM6128",
    "setting": "FM6128",
    "firmware": "FM6128专用固件"
  },
  {
    "category": "FM系列芯片",
    "chip": "FM6373",
    "setting": "FM6373或FM6565",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "FM系列芯片",
    "chip": "FM6373C",
    "setting": "FM6373C",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "FM系列芯片",
    "chip": "FM6373D",
    "setting": "FM6373D",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "FM系列芯片",
    "chip": "FM6565AH",
    "setting": "FM6565",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "FM系列芯片",
    "chip": "FM6565AL",
    "setting": "FM6565",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "FM系列芯片",
    "chip": "FM6565S",
    "setting": "FM6565S",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "SUM系列芯片",
    "chip": "SUM2016/SUM20167",
    "setting": "常规芯片",
    "firmware": "通用固件"
  },
  {
    "category": "SUM系列芯片",
    "chip": "SUM2030",
    "setting": "SUM2030",
    "firmware": "通用固件"
  },
  {
    "category": "SUM系列芯片",
    "chip": "SUM2130",
    "setting": "SUM2130",
    "firmware": "通用固件"
  },
  {
    "category": "SUM系列芯片",
    "chip": "SUM2017",
    "setting": "SUM2017",
    "firmware": "通用固件"
  },
  {
    "category": "SUM系列芯片",
    "chip": "SUM2017T",
    "setting": "SUM2017T",
    "firmware": "通用固件"
  },
  {
    "category": "SUM系列芯片",
    "chip": "SUM2021",
    "setting": "常规芯片",
    "firmware": "通用固件"
  },
  {
    "category": "SUM系列芯片",
    "chip": "SUM2032",
    "setting": "SUM2032",
    "firmware": "通用固件"
  },
  {
    "category": "SUM系列芯片",
    "chip": "SUM2033",
    "setting": "SUM2033",
    "firmware": "通用固件"
  },
  {
    "category": "SUM系列芯片",
    "chip": "SUM2131",
    "setting": "SUM2131",
    "firmware": "通用固件"
  },
  {
    "category": "SUM系列芯片",
    "chip": "SUM2028",
    "setting": "SUM2028",
    "firmware": "SUM2028专用固件"
  },
  {
    "category": "LYD系列芯片",
    "chip": "LYD6126-C",
    "setting": "ICN2037",
    "firmware": "通用固件"
  },
  {
    "category": "LYD系列芯片",
    "chip": "LYD6128",
    "setting": "SM16237DS",
    "firmware": "通用固件"
  },
  {
    "category": "LYD系列芯片",
    "chip": "LYD6128A",
    "setting": "ICND2046",
    "firmware": "通用固件"
  },
  {
    "category": "LYD系列芯片",
    "chip": "LYD6168B",
    "setting": "SM16169S",
    "firmware": "通用固件"
  },
  {
    "category": "LYD系列芯片",
    "chip": "LYD6168C",
    "setting": "ICN2153",
    "firmware": "通用固件"
  },
  {
    "category": "LYD系列芯片",
    "chip": "LYD6168D",
    "setting": "ICND2163",
    "firmware": "通用固件"
  },
  {
    "category": "LYD系列芯片",
    "chip": "LYD6168E",
    "setting": "ICND2065",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "LYD系列芯片",
    "chip": "LYD6168A",
    "setting": "LS9929",
    "firmware": "LS99系列固件"
  },
  {
    "category": "LYD系列芯片",
    "chip": "LYD6188",
    "setting": "LS9929",
    "firmware": "LS99系列固件"
  },
  {
    "category": "LYD系列芯片",
    "chip": "LYD6188PB",
    "setting": "LS9935",
    "firmware": "LS99系列固件"
  },
  {
    "category": "LYD系列芯片",
    "chip": "LYD6126",
    "setting": "FM6126",
    "firmware": "通用固件"
  },
  {
    "category": "LYD系列芯片",
    "chip": "LYD6168",
    "setting": "MBI5153或LYD6168",
    "firmware": "通用固件"
  },
  {
    "category": "LYD系列芯片",
    "chip": "LYD6268",
    "setting": "MBI5153",
    "firmware": "通用固件"
  },
  {
    "category": "LYD系列芯片",
    "chip": "LYD6188PC",
    "setting": "ICND2065",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "MBI系列芯片",
    "chip": "MBI5153",
    "setting": "MBI5153",
    "firmware": "通用固件"
  },
  {
    "category": "MBI系列芯片",
    "chip": "MBI5041",
    "setting": "MBI5041",
    "firmware": "MBI5041专用固件"
  },
  {
    "category": "MBI系列芯片",
    "chip": "MBI5268",
    "setting": "MBI5268",
    "firmware": "MBI5268专用固件"
  },
  {
    "category": "MBI系列芯片",
    "chip": "MBI5124",
    "setting": "MBI5124",
    "firmware": "通用固件"
  },
  {
    "category": "MBI系列芯片",
    "chip": "MBI5120/5020",
    "setting": "常规芯片",
    "firmware": "通用固件"
  },
  {
    "category": "MBI系列芯片",
    "chip": "MBI5166",
    "setting": "常规芯片",
    "firmware": "通用固件"
  },
  {
    "category": "MBI系列芯片",
    "chip": "MBI5024",
    "setting": "常规芯片",
    "firmware": "通用固件"
  },
  {
    "category": "MBI系列芯片",
    "chip": "MBI5264",
    "setting": "MBI5264",
    "firmware": "MBI5264专用固件"
  },
  {
    "category": "MBI系列芯片",
    "chip": "MBI5066",
    "setting": "常规芯片",
    "firmware": "通用固件"
  },
  {
    "category": "MBI系列芯片",
    "chip": "MBI5253A",
    "setting": "MBI5253A",
    "firmware": "MBI5253A专用固件"
  },
  {
    "category": "MBI系列芯片",
    "chip": "MBI5051B",
    "setting": "MBI5051B",
    "firmware": "通用固件"
  },
  {
    "category": "MBI系列芯片",
    "chip": "MBI5023",
    "setting": "常规芯片",
    "firmware": "通用固件"
  },
  {
    "category": "MBI系列芯片",
    "chip": "MBI5035B",
    "setting": "常规芯片",
    "firmware": "通用固件"
  },
  {
    "category": "其它系列芯片",
    "chip": "CNS7153",
    "setting": "CNS7153",
    "firmware": "通用固件"
  },
  {
    "category": "其它系列芯片",
    "chip": "CNS7253",
    "setting": "CNS7253",
    "firmware": "CNS7253专用固件"
  },
  {
    "category": "其它系列芯片",
    "chip": "CNS7263",
    "setting": "CNS7263",
    "firmware": "CNS7263专用固件"
  },
  {
    "category": "其它系列芯片",
    "chip": "HX8864",
    "setting": "HX8864",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "其它系列芯片",
    "chip": "HX8863/8865",
    "setting": "HX8863/8865",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "其它系列芯片",
    "chip": "HX8055",
    "setting": "ICN2153",
    "firmware": "通用固件"
  },
  {
    "category": "其它系列芯片",
    "chip": "CT9065",
    "setting": "CT9065",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "其它系列芯片",
    "chip": "A5055",
    "setting": "ICN2153",
    "firmware": "通用固件"
  },
  {
    "category": "其它系列芯片",
    "chip": "RUL6024",
    "setting": "ICN2038S",
    "firmware": "通用固件"
  },
  {
    "category": "其它系列芯片",
    "chip": "RUL6022/6020",
    "setting": "常规芯片",
    "firmware": "通用固件"
  },
  {
    "category": "其它系列芯片",
    "chip": "RUL6053",
    "setting": "MBI5153",
    "firmware": "通用固件"
  },
  {
    "category": "其它系列芯片",
    "chip": "MY9868",
    "setting": "MY9868",
    "firmware": "通用固件"
  },
  {
    "category": "其它系列芯片",
    "chip": "JXI5123",
    "setting": "MBI5124",
    "firmware": "通用固件"
  },
  {
    "category": "其它系列芯片",
    "chip": "JXI5020",
    "setting": "常规芯片",
    "firmware": "通用固件"
  },
  {
    "category": "其它系列芯片",
    "chip": "RT5965",
    "setting": "RT5965",
    "firmware": "通用固件"
  },
  {
    "category": "其它系列芯片",
    "chip": "YY6018B/AXS6018",
    "setting": "AXS6018",
    "firmware": "AXS6018专用固件"
  },
  {
    "category": "其它系列芯片",
    "chip": "Rental518",
    "setting": "DP3265",
    "firmware": "ICN2065系列固件"
  },
  {
    "category": "其它系列芯片",
    "chip": "TBS3266A",
    "setting": "TBS3266A",
    "firmware": "TBS3266A/TBS5266A固件"
  },
  {
    "category": "其它系列芯片",
    "chip": "TBS5266A",
    "setting": "TBS5266A",
    "firmware": "TBS3266A/TBS5266A固件"
  },
  {
    "category": "译码芯片",
    "chip": "TC7258/7262A/HX6016",
    "setting": "138",
    "firmware": "译码芯片设置：138"
  },
  {
    "category": "译码芯片",
    "chip": "TC7558EN",
    "setting": "TC7558或5958",
    "firmware": "译码芯片设置：TC7558或5958"
  },
  {
    "category": "译码芯片",
    "chip": "TC7559B",
    "setting": "TC7559B或2018",
    "firmware": "译码芯片设置：TC7559B或2018"
  },
  {
    "category": "译码芯片",
    "chip": "RT5958/D5958SSP/RT5959/5960",
    "setting": "5958",
    "firmware": "译码芯片设置：5958"
  },
  {
    "category": "译码芯片",
    "chip": "RUL5158/5960",
    "setting": "5958",
    "firmware": "译码芯片设置：5958"
  },
  {
    "category": "译码芯片",
    "chip": "RUL5258/ICN2018S/ICN3018/AXS9501S",
    "setting": "ICN2018",
    "firmware": "译码芯片设置：ICN2018"
  },
  {
    "category": "译码芯片",
    "chip": "RUL5358",
    "setting": "SM5266",
    "firmware": "译码芯片设置：SM5266"
  },
  {
    "category": "译码芯片",
    "chip": "HX6058/6158",
    "setting": "5958",
    "firmware": "译码芯片设置：5958"
  },
  {
    "category": "译码芯片",
    "chip": "HX6157",
    "setting": "HX6157",
    "firmware": "译码芯片设置：HX6157"
  },
  {
    "category": "译码芯片",
    "chip": "HX6158H",
    "setting": "HX6158H",
    "firmware": "译码芯片设置：HX6158H"
  },
  {
    "category": "译码芯片",
    "chip": "HX6258",
    "setting": "HX6258",
    "firmware": "译码芯片设置：HX6258"
  },
  {
    "category": "译码芯片",
    "chip": "DP32019",
    "setting": "DP32019",
    "firmware": "译码芯片设置：DP32019"
  },
  {
    "category": "译码芯片",
    "chip": "DP32020",
    "setting": "DP32020",
    "firmware": "译码芯片设置：DP32020"
  },
  {
    "category": "译码芯片",
    "chip": "DP32029",
    "setting": "DP32029",
    "firmware": "译码芯片设置：DP32029"
  },
  {
    "category": "译码芯片",
    "chip": "DP32030/32030B-B",
    "setting": "DP32030",
    "firmware": "译码芯片设置：DP32030"
  },
  {
    "category": "译码芯片",
    "chip": "DP32129",
    "setting": "DP32129/5958",
    "firmware": "译码芯片设置：DP32129/5958"
  },
  {
    "category": "译码芯片",
    "chip": "DP7268/VB5628",
    "setting": "138",
    "firmware": "译码芯片设置：138"
  },
  {
    "category": "译码芯片",
    "chip": "DP7298B",
    "setting": "5958或DP32020",
    "firmware": "译码芯片设置：5958或DP32020"
  },
  {
    "category": "译码芯片",
    "chip": "ICN2012/1012",
    "setting": "ICN2012或138",
    "firmware": "译码芯片设置：ICN2012或138"
  },
  {
    "category": "译码芯片",
    "chip": "ICN2013",
    "setting": "ICN2013或138",
    "firmware": "译码芯片设置：ICN2013或138"
  },
  {
    "category": "译码芯片",
    "chip": "ICN2018/1018/2019/1028",
    "setting": "ICN2018",
    "firmware": "译码芯片设置：ICN2018"
  },
  {
    "category": "译码芯片",
    "chip": "ICND2015/2016/2017",
    "setting": "138",
    "firmware": "译码芯片设置：138"
  },
  {
    "category": "译码芯片",
    "chip": "SM5166P/5188",
    "setting": "SM5166",
    "firmware": "译码芯片设置：SM5166"
  },
  {
    "category": "译码芯片",
    "chip": "SM5368/5388/5369/5378",
    "setting": "SM5368/5388/5369",
    "firmware": "译码芯片设置：SM5368/5388/5369"
  },
  {
    "category": "译码芯片",
    "chip": "SM5366PH",
    "setting": "SM5366",
    "firmware": "译码芯片设置：SM5366"
  },
  {
    "category": "译码芯片",
    "chip": "SM74HC595",
    "setting": "595",
    "firmware": "译码芯片设置：595"
  },
  {
    "category": "译码芯片",
    "chip": "SM5266PH",
    "setting": "SM5266",
    "firmware": "译码芯片设置：SM5266"
  },
  {
    "category": "译码芯片",
    "chip": "MW5566P/TC6960",
    "setting": "5958或ICN2018",
    "firmware": "译码芯片设置：5958或ICN2018"
  },
  {
    "category": "译码芯片",
    "chip": "MW4958/MW4953/SM74HC138D",
    "setting": "138",
    "firmware": "译码芯片设置：138"
  },
  {
    "category": "译码芯片",
    "chip": "VB5658",
    "setting": "VB5658",
    "firmware": "译码芯片设置：VB5658"
  },
  {
    "category": "译码芯片",
    "chip": "C82019/C82318SP1/C82058S",
    "setting": "ICN2018",
    "firmware": "译码芯片设置：ICN2018"
  },
  {
    "category": "译码芯片",
    "chip": "LS9737CS1",
    "setting": "9737_1",
    "firmware": "译码芯片设置：9737_1"
  },
  {
    "category": "译码芯片",
    "chip": "CNS3018DP",
    "setting": "CNS3018",
    "firmware": "译码芯片设置：CNS3018"
  },
  {
    "category": "译码芯片",
    "chip": "RUC7258/RUL7262/RUL7260",
    "setting": "138",
    "firmware": "译码芯片设置：138"
  }
];

let quickTable = [];
let officialLinks = {};
let operationResources = [];
let libraryDocuments = [];
let videoResources = [];

const $ = (selector) => document.querySelector(selector);

function escapeHtml(value) {
  return cleanDisplayText(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function cleanDisplayText(value) {
  return String(value ?? "")
    .replace(/\bHD[-\s]?([A-Z]+)\s*(\d)\s+(\d[A-Z0-9]*)\b/gi, (_match, letters, first, rest) => `HD-${letters.toUpperCase()}${first}${rest.toUpperCase()}`)
    .replace(/\b([A-Z]+)\s*(\d)\s+(\d[A-Z0-9]*)\b/g, (_match, letters, first, rest) => `${letters.toUpperCase()}${first}${rest.toUpperCase()}`)
    .replace(/(\d)\s+(\d)(\s*(?:万|像素|路|个|口|way|channel|Gigabit|Ethernet|K|Hz|hz|MB|GB|mm|%))/g, "$1$2$3")
    .replace(/(\d)\s+(\d)\s*-\s*(channel|way|port|Gigabit)/gi, "$1$2-$3")
    .replace(/(HD)[\s_-]+([A-Z]+\d+[A-Z0-9]*)/gi, (_match, hd, code) => `${hd.toUpperCase()}-${code.toUpperCase()}`);
}

function normalize(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/^hd[-\s]?/, "")
    .replace(/[-_\s/]/g, "");
}

function queryTokens(value) {
  return String(value || "")
    .match(/[a-z0-9-]+|[\u4e00-\u9fa5]+/gi)
    ?.map((item) => item.toLowerCase())
    .filter((item) => item.length > 1) || [];
}

const QUERY_KEYWORDS = [
  "发送卡",
  "接收卡",
  "视频处理器",
  "处理器",
  "控制器",
  "网口",
  "千兆",
  "光口",
  "带载",
  "负载",
  "最大控制",
  "画面",
  "窗口",
  "接口",
  "输入",
  "输出",
  "同步",
  "异步"
];

function keywordTokens(value) {
  const text = String(value || "").toLowerCase();
  return QUERY_KEYWORDS.filter((keyword) => text.includes(keyword));
}

function intentOf(query) {
  if (/带载|负载|最大控制|控制范围|像素|点数/.test(query)) return "load";
  if (/分辨率|画面|窗口|4k|2k|1080|720|宽|高/.test(query)) return "resolution";
  if (/接口|网口|光口|hdmi|dp|usb|输入|输出/.test(query)) return "ports";
  if (/安装|连接|设置|发送|节目|播放|调试|wifi|wi-fi|u盘|软件|hdplayer|屏掌控|ledart|app|手机/i.test(query)) return "operation";
  return "overview";
}

function intentLabel(intent) {
  return {
    load: "带载",
    resolution: "分辨率/画面",
    ports: "接口/输出",
    operation: "操作/连接",
    overview: "产品速查"
  }[intent] || "产品速查";
}

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;
  const row = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let prev = i;
    for (let j = 1; j <= b.length; j += 1) {
      const next = Math.min(
        row[j] + 1,
        prev + 1,
        row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
      row[j - 1] = prev;
      prev = next;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

function productScore(item, rawQuery) {
  const query = normalize(rawQuery);
  const tokens = [...new Set([
    ...queryTokens(rawQuery).map(normalize),
    ...keywordTokens(rawQuery).map(normalize)
  ])];
  const seriesPrefix = /^[a-z]$/i.test(query);
  const numericFragment = /^\d+$/.test(query);
  const aliases = (item.aliases || []).map(normalize).filter(Boolean);
  const rawPool = `${item.product} ${item.displayName || ""} ${(item.aliases || []).join(" ")} ${(item.facts || []).join(" ")} ${JSON.stringify(item.fields || {})} ${JSON.stringify(item.selector || [])}`;
  const haystack = normalize(rawPool);
  const portQuery = portCountFromQuery(rawQuery);
  const itemPorts = portCountsOf(item);
  const modelTokens = modelTokensOf(rawQuery).map(normalize);
  const numberQuery = query.match(/\d+/)?.[0] || "";
  const wantsProModel = /pro/i.test(rawQuery) || query.includes("pro") || /专业版|增强版/.test(rawQuery);
  const hasProModel = /pro/i.test(`${item.product} ${item.displayName || ""} ${(item.aliases || []).join(" ")}`);
  let best = 0;
  let aliasBest = 0;
  const noteAlias = (score) => {
    best = Math.max(best, score);
    aliasBest = Math.max(aliasBest, score);
  };

  for (const alias of aliases) {
    if (!alias) continue;
    if (query === alias || tokens.includes(alias)) noteAlias(1000);
    if (query.includes(alias)) noteAlias(860 - Math.max(0, query.length - alias.length));
    if (seriesPrefix && alias.startsWith(query) && alias.length > 1) noteAlias(430);
    if (numericFragment) noteAlias(numericModelScore(alias, query));
    noteAlias(numericSuffixModelScore(alias, query));
    if (numberQuery && !numericFragment && !modelTokens.length) noteAlias(Math.max(0, numericModelScore(alias, numberQuery) - 30));
    if (wantsProModel && numberQuery && alias.includes("pro")) noteAlias(numericModelScore(alias, numberQuery) + 180);
    if (alias.includes(query) && query.length >= 2) noteAlias(520 - Math.max(0, alias.length - query.length) * 20);
    for (const token of tokens) {
      if (token === alias) noteAlias(1000);
      if (alias.includes(token) && token.length >= 2) noteAlias(480 - Math.max(0, alias.length - token.length) * 18);
      const distance = levenshtein(token, alias);
      if (token.length >= 3 && distance <= 1) noteAlias(420);
    }
  }

  for (const token of tokens) {
    if (haystack.includes(token)) best = Math.max(best, 160);
  }

  if (portQuery && itemPorts.has(portQuery)) {
    best = Math.max(best, 920 + portQuery);
  } else if (portQuery && itemPorts.size) {
    const nearest = Math.min(...[...itemPorts].map((count) => Math.abs(count - portQuery)));
    if (nearest <= 2) best = Math.max(best, 420 - nearest * 60);
  }

  if (/发送卡|网口|输出/.test(rawQuery) && /千兆网口|gigabit|ethernet|network\s+port|网口输出/i.test(rawPool)) {
    best += 120;
  }
  if (/发送卡/.test(rawQuery) && /视频处理器|processor|controller|sender|sending/i.test(rawPool)) {
    best += 80;
  }
  if (wantsProModel) {
    if (hasProModel && best > 0) best += 180;
    if (!hasProModel && numberQuery && best > 0) best = Math.max(0, best - 180);
  } else if (numericFragment && hasProModel && best > 0) {
    best = Math.max(0, best - 35);
  }
  if (modelTokens.length && aliasBest < 300) {
    if (!portQuery || !itemPorts.has(portQuery)) return 0;
  }
  return best;
}

function portCountFromQuery(query) {
  if (!/网口|发送卡|输出口|千兆|口输出|network|gigabit|ethernet|port/i.test(query || "")) return 0;
  const match = String(query || "").match(/(\d{1,3})\s*(?:路|个|口|way|channel)?\s*(?:千兆)?\s*(?:网口|口|输出口|network|gigabit|ethernet|port)?/i);
  return match ? Number(match[1]) : 0;
}

function portCountsOf(item) {
  const text = `${item.product} ${item.displayName || ""} ${(item.facts || []).join(" ")} ${JSON.stringify(item.fields || {})} ${JSON.stringify(item.selector || [])}`;
  const counts = new Set();
  const patterns = [
    /(\d{1,3})\s*路\s*(?:千兆)?网口/g,
    /标配\s*(\d{1,3})\s*路/g,
    /(\d{1,3})\s*way\s*Gigabit/gi,
    /(\d{1,3})\s*channel\s*Gigabit/gi,
    /(\d{1,3})\s*Gigabit Ethernet ports/gi,
    /(\d{1,3})\s*-\s*channel\s*Gigabit/gi
  ];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const count = Number(match[1]);
      if (count > 0 && count <= 80) counts.add(count);
    }
  }
  return counts;
}

function modelTokensOf(value) {
  return queryTokens(value)
    .map(normalize)
    .filter((token) => /[a-z]/i.test(token) && /\d/.test(token));
}

function modelParts(value) {
  const compact = normalize(value);
  const match = compact.match(/^([a-z]+)(\d+)([a-z]*)$/i);
  if (!match) return null;
  return {
    letters: match[1],
    digits: match[2],
    suffix: match[3] || ""
  };
}

function numericModelScore(alias, query) {
  const parts = modelParts(alias);
  if (!parts) return 0;
  if (parts.digits === query) return parts.suffix ? 520 : 640;
  if (parts.digits.startsWith(query)) return Math.max(360, 460 - (parts.digits.length - query.length) * 18);
  const index = parts.digits.indexOf(query);
  if (index >= 0) return Math.max(220, 330 - index * 25 - (parts.digits.length - query.length) * 8);
  return 0;
}

function numericSuffixModelScore(alias, query) {
  const parts = modelParts(alias);
  if (!parts || !query) return 0;
  const compact = normalize(query);
  const suffixToken = `${parts.digits}${parts.suffix}`;
  if (parts.suffix && compact === suffixToken) return 940;
  if (parts.suffix && /[a-z]/i.test(compact) && suffixToken.startsWith(compact) && compact.length >= 2) return 650;
  return 0;
}

function exactProductMatch(item, rawQuery) {
  const modelTokens = modelTokensOf(rawQuery);
  if (!modelTokens.length) return true;
  const aliases = (item.aliases || []).map(normalize).filter(Boolean);
  return modelTokens.some((token) =>
    aliases.includes(token)
    || aliases.some((alias) => numericSuffixModelScore(alias, token) >= 900)
  );
}

function displayModel(value) {
  return modelTokensOf(value)[0]?.toUpperCase() || value;
}

function productName(item) {
  return item.displayName || item.product;
}

function isFalseProductModel(item) {
  const name = normalize(productName(item));
  if (name === "vp1") return true;
  return false;
}

function isSeriesPrefixQuery(query) {
  return /^[a-z]$/i.test(normalize(query));
}

function isNumericFragmentQuery(query) {
  return /^\d+$/.test(normalize(query));
}

function productSeriesLabel(item) {
  return String(item.product || "")
    .toUpperCase()
    .replace(/^HD[-\s]?/, "");
}

function productSortParts(item) {
  const label = productSeriesLabel(item);
  const match = label.match(/^([A-Z]+)(\d+)([A-Z]*)$/);
  if (!match) return { label, letters: label, number: Number.MAX_SAFE_INTEGER, suffix: "" };
  return {
    label,
    letters: match[1],
    number: Number(match[2]),
    suffix: match[3] || ""
  };
}

function compareProductNatural(a, b) {
  const left = productSortParts(a);
  const right = productSortParts(b);
  return left.letters.localeCompare(right.letters, "zh-Hans-CN", { sensitivity: "base" })
    || left.number - right.number
    || left.suffix.length - right.suffix.length
    || left.suffix.localeCompare(right.suffix, "zh-Hans-CN", { sensitivity: "base" })
    || left.label.localeCompare(right.label, "zh-Hans-CN", { numeric: true, sensitivity: "base" });
}

function selectionOrder(item) {
  return Number.isFinite(item.selectionOrder) ? item.selectionOrder : 999999;
}

function numericExactPriority(item, query) {
  const compact = normalize(query);
  if (!/^\d+$/.test(compact)) return 100;
  const priority = compact.length <= 3
    ? { kv: 0, ka: 0, vp: 2, ms: 3, dcs: 4 }
    : { ms: 0, dcs: 1, vp: 2, kv: 3, ka: 3 };
  let best = 100;
  for (const alias of (item.aliases || []).map(normalize).filter(Boolean)) {
    const parts = modelParts(alias);
    if (!parts || parts.digits !== compact) continue;
    if (parts.suffix) {
      best = Math.min(best, 50);
      continue;
    }
    best = Math.min(best, priority[parts.letters] ?? 10);
  }
  return best;
}

function primaryLibraryProduct(item) {
  const candidates = (item.products || [])
    .map((product) => String(product || "").trim())
    .filter(Boolean);
  if (!candidates.length) return "";
  const nameTokens = queryTokens(item.name || item.title || "").map(normalize);
  const namedCandidates = candidates.filter((product) => nameTokens.includes(normalize(product)));
  if (namedCandidates.length) {
    return namedCandidates.sort((a, b) => compareProductNatural({ product: a }, { product: b }))[0];
  }
  return candidates[0];
}

function libraryProductConfidence(item) {
  const products = (item.products || []).filter(Boolean);
  if (!products.length) return 2;
  const nameTokens = queryTokens(item.name || item.title || "").map(normalize);
  return products.some((product) => nameTokens.includes(normalize(product))) ? 0 : 1;
}

function compareLibraryByProduct(a, b, query = "") {
  const confidenceOrder = libraryProductConfidence(a) - libraryProductConfidence(b);
  if (confidenceOrder) return confidenceOrder;
  const leftProduct = primaryLibraryProduct(a);
  const rightProduct = primaryLibraryProduct(b);
  if (leftProduct && !rightProduct) return -1;
  if (!leftProduct && rightProduct) return 1;
  if (leftProduct && rightProduct) {
    const productOrder = compareProductNatural({ product: leftProduct }, { product: rightProduct });
    if (productOrder) return productOrder;
  }
  return languagePriority(b.name, query) - languagePriority(a.name, query)
    || String(a.name).localeCompare(String(b.name), "zh-Hans-CN", { numeric: true, sensitivity: "base" });
}

const CHINESE_RE = /[\u4e00-\u9fff]/;
const ENGLISH_REQUEST_RE = /英文|英语|english|\ben\b|英文版|英文规格书/i;

function wantsEnglish(query) {
  return ENGLISH_REQUEST_RE.test(query || "");
}

function hasChinese(value) {
  return CHINESE_RE.test(String(value || ""));
}

function languagePriority(value, query) {
  const text = String(value || "");
  const chinese = hasChinese(text);
  const englishRequested = wantsEnglish(query);
  if (englishRequested) return chinese ? 5 : 70;
  return chinese ? 90 : -45;
}

function sourcePriority(source, query) {
  const name = String(source?.name || "");
  let score = languagePriority(name, query);
  if (/规格书/.test(name)) score += wantsEnglish(query) ? 2 : 35;
  if (/Specification/i.test(name)) score += wantsEnglish(query) ? 35 : -15;
  if (/说明书|使用手册/.test(name)) score += wantsEnglish(query) ? 1 : 15;
  if (/User Manual|Instruction Manual/i.test(name)) score += wantsEnglish(query) ? 20 : -10;
  if (/已签章|pdf/i.test(name)) score += 2;
  return score;
}

function sortedSources(item, query) {
  return [...(item.sources || [])].sort((a, b) => sourcePriority(b, query) - sourcePriority(a, query));
}

function officialRecord(item) {
  const aliases = [item.product, ...(item.aliases || [])].map(normalizeCodeForOfficial).filter(Boolean);
  for (const alias of aliases) {
    if (officialLinks[alias]) return officialLinks[alias];
  }
  return null;
}

function normalizeCodeForOfficial(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/^HD([A-Z])/, "HD-$1")
    .replace(/[^A-Z0-9-]/g, "");
}

function docScoreForSource(doc, source, query) {
  const label = String(doc?.label || "");
  const sourceName = String(source?.name || "");
  let score = sourcePriority({ name: label }, query);
  const docNorm = normalize(label);
  const sourceNorm = normalize(sourceName);
  if (sourceName && (docNorm.includes(sourceNorm.replace(/docx|pdf|v\d+.*/gi, "")) || sourceNorm.includes(docNorm.replace(/v\d+.*/gi, "")))) score += 80;
  if (source?.type && source.type === doc?.type) score += 35;
  if (source?.typeLabel && label.includes(source.typeLabel)) score += 20;
  return score;
}

function officialDocForSource(record, source, query) {
  if (!record?.docs?.length) return null;
  return [...record.docs].sort((a, b) => docScoreForSource(b, source, query) - docScoreForSource(a, source, query))[0] || null;
}

function docKindLabel(doc) {
  const text = `${doc?.label || ""} ${doc?.type || ""}`;
  if (/规格|specification|spec/i.test(text)) return "规格书";
  if (/说明|手册|manual|instruction/i.test(text)) return "软件使用说明";
  if (/操作|教程|guide|tutorial/i.test(text)) return "指导文档";
  return "资料";
}

function officialDocSummary(record) {
  const groups = {};
  for (const doc of (record?.docs || []).slice(0, 5)) {
    const label = docKindLabel(doc);
    groups[label] ||= [];
    groups[label].push(doc.label);
  }
  return Object.entries(groups)
    .map(([label, names]) => `${label}：${names.slice(0, 2).join("、")}`)
    .join("；");
}

var OFFICIAL_PDF_MAP = {"https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-K12%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-K12规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-K08%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-K08规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-R716%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-R716规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-R712%E8%A7%84%E6%A0%BC%E4%B9%A6%20V3.1.pdf":"official-files/HD-R712规格书 V3.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-R708%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-R708规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-R3210%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-R3210规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-R500S%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-R500S规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-R5S%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-R5S规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Sync/HD-T16%E8%A7%84%E6%A0%BC%E4%B9%A6v1.0.pdf":"official-files/HD-T16规格书v1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Sync/HD-T08%E8%A7%84%E6%A0%BC%E4%B9%A6v1.0.pdf":"official-files/HD-T08规格书v1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Sync/HD-T08F%E8%A7%84%E6%A0%BC%E4%B9%A6v1.0.pdf":"official-files/HD-T08F规格书v1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Sync/HD-T901%E8%A7%84%E6%A0%BC%E4%B9%A6V1.1.pdf":"official-files/HD-T901规格书V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/AS/HD-A8%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.4.pdf":"official-files/HD-A8规格书 V2.4.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/AS/HD-A7%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.4.pdf":"official-files/HD-A7规格书 V2.4.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/HS/HD-H8%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-H8规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/HS/HD-H6%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-H6规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/AS/HD-A6L%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.4.pdf":"official-files/HD-A6L规格书 V1.4.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/AS/HD-A5L%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-A5L规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/AS/HD-A4L%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-A4L规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/HS/HD-H4K%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-H4K规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Instruction/Sync-controller/HD-H4K%E7%94%A8%E6%88%B7%E6%89%8B%E5%86%8CV1.1.pdf":"official-files/HD-H4K用户手册V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/AS/HD-A3L%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-A3L规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Async/HD-C16H%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-C16H规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Async/HD-C16L%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.0.pdf":"official-files/HD-C16L规格书 V2.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Async/HD-C08L%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-C08L规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Async/HD-D16%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.1.pdf":"official-files/HD-D16规格书 V2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Async/HD-D18%E8%A7%84%E6%A0%BC%E4%B9%A6%20V0.2.pdf":"official-files/HD-D18规格书 V0.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Async/HD-B8L%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-B8L规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Async/HD-B6L%E8%A7%84%E6%A0%BC%E4%B9%A6V1.3.pdf":"official-files/HD-B6L规格书V1.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Instruction/Sync-controller/HD-B6L%E7%94%A8%E6%88%B7%E6%89%8B%E5%86%8C.pdf":"official-files/HD-B6L用户手册.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP4060%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.1.pdf":"official-files/HD-VP4060规格书 v1.1.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP4060%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.1.pdf":"official-files/HD-VP4060使用说明书V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP3060%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.1.pdf":"official-files/HD-VP3060规格书 v1.1.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP3060%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.1.pdf":"official-files/HD-VP3060使用说明书V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP2060%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.1.pdf":"official-files/HD-VP2060规格书 v1.1.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP2060%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.4.pdf":"official-files/HD-VP2060使用说明书V1.4.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP2430%E8%A7%84%E6%A0%BC%E4%B9%A6V1.0.pdf":"official-files/HD-VP2430规格书V1.0.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP2430%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.0.pdf":"official-files/HD-VP2430使用说明书V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP1640A%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.2.pdf":"official-files/HD-VP1640A规格书 v1.2.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP1640A%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V0.6.pdf":"official-files/HD-VP1640A使用说明书V0.6.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP1240A%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.2.pdf":"official-files/HD-VP1240A规格书 v1.2.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP1240A%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V0.6.pdf":"official-files/HD-VP1240A使用说明书V0.6.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP1620S%E8%A7%84%E6%A0%BC%E4%B9%A6V1.0.pdf":"official-files/HD-VP1620S规格书V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP1220S%E8%A7%84%E6%A0%BC%E4%B9%A6V1.0.pdf":"official-files/HD-VP1220S规格书V1.0.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP12%E8%A7%84%E6%A0%BC%E4%B9%A6V1.0.pdf":"official-files/HD-VP12规格书V1.0.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP12%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.0.pdf":"official-files/HD-VP12使用说明书V1.0.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP10%E8%A7%84%E6%A0%BC%E4%B9%A6V1.0.pdf":"official-files/HD-VP10规格书V1.0.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP10%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.0.pdf":"official-files/HD-VP10使用说明书V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP830-TP%E8%A7%84%E6%A0%BC%E4%B9%A6%20v2.1.pdf":"official-files/HD-VP830-TP规格书 v2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP830%E8%A7%84%E6%A0%BC%E4%B9%A6%20v2.1.pdf":"official-files/HD-VP830规格书 v2.1.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP630%20&%20VP830%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.0.pdf":"official-files/HD-VP630 & VP830使用说明书V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP630-TP%E8%A7%84%E6%A0%BC%E4%B9%A6%20v2.1.pdf":"official-files/HD-VP630-TP规格书 v2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP630%E8%A7%84%E6%A0%BC%E4%B9%A6%20v2.1.pdf":"official-files/HD-VP630规格书 v2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP820A%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.2.pdf":"official-files/HD-VP820A规格书 v1.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP620A%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.2.pdf":"official-files/HD-VP620A规格书 v1.2.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP820A%20&%20VP620A%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6_V1.0.pdf":"official-files/HD-VP820A & VP620A使用说明书_V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP410H%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.2.pdf":"official-files/HD-VP410H规格书 v1.2.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP410H%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.1.pdf":"official-files/HD-VP410H使用说明书V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP210H%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.2.pdf":"official-files/HD-VP210H规格书 v1.2.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP210H%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.1.pdf":"official-files/HD-VP210H使用说明书V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP410S%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.1.pdf":"official-files/HD-VP410S规格书 v1.1.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP410S%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.0.pdf":"official-files/HD-VP410S使用说明书V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP210S%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.1.pdf":"official-files/HD-VP210S规格书 v1.1.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP210S%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.0.pdf":"official-files/HD-VP210S使用说明书V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-KV410%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.1.pdf":"official-files/HD-KV410规格书 v1.1.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-KV410%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.0.pdf":"official-files/HD-KV410使用说明书V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-KV210%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.1.pdf":"official-files/HD-KV210规格书 v1.1.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-KV210%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.0.pdf":"official-files/HD-KV210使用说明书V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Processor/HD-VP8000M%E8%A7%84%E6%A0%BC%E4%B9%A6V2.2.pdf":"official-files/HD-VP8000M规格书V2.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Instruction/VP/HD-VP8000M%E7%94%A8%E6%88%B7%E6%89%8B%E5%86%8CV2.3.1.pdf":"official-files/HD-VP8000M用户手册V2.3.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Server/HD-MS4000%20Pro%E8%A7%84%E6%A0%BC%E4%B9%A6_V1.3.pdf":"official-files/HD-MS4000 Pro规格书_V1.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Server/HD-MS4000%E8%A7%84%E6%A0%BC%E4%B9%A6_V1.4.pdf":"official-files/HD-MS4000规格书_V1.4.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Server/HD-MS2000%E8%A7%84%E6%A0%BC%E4%B9%A6_V1.4.7.pdf":"official-files/HD-MS2000规格书_V1.4.7.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Server/HD-MS1000%E8%A7%84%E6%A0%BC%E4%B9%A6_V1.4.pdf":"official-files/HD-MS1000规格书_V1.4.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-DCS4000%20Pro%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.0.pdf":"official-files/HD-DCS4000 Pro规格书 v1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-DCS4000%E8%A7%84%E6%A0%BC%E4%B9%A6v1.1.pdf":"official-files/HD-DCS4000规格书v1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-DCS4000%E8%AF%B4%E6%98%8E%E4%B9%A6v1.1.pdf":"official-files/HD-DCS4000说明书v1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-CT800%E8%A7%84%E6%A0%BC%E4%B9%A6v1.3.pdf":"official-files/HD-CT800规格书v1.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-CT800%E8%AF%B4%E6%98%8E%E4%B9%A6v1.3.pdf":"official-files/HD-CT800说明书v1.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-VM8000%E7%B3%BB%E5%88%97%E6%B7%B7%E5%90%88%E7%9F%A9%E9%98%B5%E8%A7%84%E6%A0%BC%E4%B9%A6v1.2.pdf":"official-files/HD-VM8000系列混合矩阵规格书v1.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-VM8000%E7%B3%BB%E5%88%97%E6%B7%B7%E5%90%88%E7%9F%A9%E9%98%B5%E8%AF%B4%E6%98%8E%E4%B9%A6v1.2.pdf":"official-files/HD-VM8000系列混合矩阵说明书v1.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-W3A%E8%A7%84%E6%A0%BC%E4%B9%A6V1.0.pdf":"official-files/HD-W3A规格书V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-W4A%E8%A7%84%E6%A0%BC%E4%B9%A6V8.1.pdf":"official-files/HD-W4A规格书V8.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-W60%E8%A7%84%E6%A0%BC%E4%B9%A6V7.0.pdf":"official-files/HD-W60规格书V7.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-W62%E8%A7%84%E6%A0%BC%E4%B9%A6V7.0.pdf":"official-files/HD-W62规格书V7.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-W63%E8%A7%84%E6%A0%BC%E4%B9%A6V7.1.pdf":"official-files/HD-W63规格书V7.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-W64A%E8%A7%84%E6%A0%BC%E4%B9%A6V7.1.pdf":"official-files/HD-W64A规格书V7.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-W66%E8%A7%84%E6%A0%BC%E4%B9%A6V7.0.pdf":"official-files/HD-W66规格书V7.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-WF1%E8%A7%84%E6%A0%BC%E4%B9%A6V7.0.pdf":"official-files/HD-WF1规格书V7.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-WF2%E8%A7%84%E6%A0%BC%E4%B9%A6V7.1.pdf":"official-files/HD-WF2规格书V7.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-WF4%E8%A7%84%E6%A0%BC%E4%B9%A6V7.0.pdf":"official-files/HD-WF4规格书V7.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-E64%E8%A7%84%E6%A0%BC%E4%B9%A6V2.1.pdf":"official-files/HD-E64规格书V2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-E63%E8%A7%84%E6%A0%BC%E4%B9%A6V6.0.pdf":"official-files/HD-E63规格书V6.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-E62%E8%A7%84%E6%A0%BC%E4%B9%A6V6.0.pdf":"official-files/HD-E62规格书V6.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-U6A%E8%A7%84%E6%A0%BC%E4%B9%A6V7.0.pdf":"official-files/HD-U6A规格书V7.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-U60%E8%A7%84%E6%A0%BC%E4%B9%A6V2.1.pdf":"official-files/HD-U60规格书V2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-U62%E8%A7%84%E6%A0%BC%E4%B9%A6V2.1.pdf":"official-files/HD-U62规格书V2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/Box/HD-3588V-BOX%20%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-3588V-BOX 规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3588V%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-3588V规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/Box/HD-3576V-BOX%20%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-3576V-BOX 规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3576V%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-3576V规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/Box/HD-3399F-BOX%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.2.pdf":"official-files/HD-3399F-BOX规格书 V1.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3399F%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.1.pdf":"official-files/HD-3399F规格书 V2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-733V%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-733V规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-982V%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-982V规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3568V%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.3.pdf":"official-files/HD-3568V规格书 V1.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3568VC%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-3568VC规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3566MV%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-3566MV规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/Box/HD-3568S-BOX%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.3.pdf":"official-files/HD-3568S-BOX规格书 V1.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3568S%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.2.pdf":"official-files/HD-3568S规格书 V2.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3568SC%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-3568SC规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/Box/HD-3566S-BOX%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.2.pdf":"official-files/HD-3566S-BOX规格书 V1.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3566S%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.1.pdf":"official-files/HD-3566S规格书 V2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3566P%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.3.pdf":"official-files/HD-3566P规格书 V1.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/Box/HD-3288S-BOX%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.2.pdf":"official-files/HD-3288S-BOX规格书 V1.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3288S%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.1.pdf":"official-files/HD-3288S规格书 V2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-972S%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.3.pdf":"official-files/HD-972S规格书 V2.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/Box/HD-527S-BOX%20%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-527S-BOX 规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-527S%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-527S规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-133MC%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.2.pdf":"official-files/HD-133MC规格书 V1.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-133M%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.3.pdf":"official-files/HD-133M规格书 V1.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-133TE%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-133TE规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-133T%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.1.pdf":"official-files/HD-133T规格书 V2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-723D%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-723D规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-352C%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-352C规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/Box/HD-40S-BOX%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.3.pdf":"official-files/HD-40S-BOX规格书 V1.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-40S%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.2.pdf":"official-files/HD-40S规格书 V2.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-S1C%E8%A7%84%E6%A0%BC%E4%B9%A6V1.1.pdf":"official-files/HD-S1C规格书V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Accessories/HD-FT08%E8%A7%84%E6%A0%BC%E4%B9%A6%20v2.0.pdf":"official-files/HD-FT08规格书 v2.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Accessories/HD-FT01%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.1.pdf":"official-files/HD-FT01规格书 v1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Instruction/Accessories/HD-HT01%E4%BA%A7%E5%93%81%E6%89%8B%E5%86%8Cv1.0.pdf":"official-files/HD-HT01产品手册v1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Instruction/Accessories/HD-HT02%E4%BA%A7%E5%93%81%E6%89%8B%E5%86%8Cv1.0.pdf":"official-files/HD-HT02产品手册v1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-VS0102%E4%BA%A7%E5%93%81%E6%89%8B%E5%86%8Cv1.1.pdf":"official-files/HD-VS0102产品手册v1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-VS0104%E4%BA%A7%E5%93%81%E6%89%8B%E5%86%8Cv1.1.pdf":"official-files/HD-VS0104产品手册v1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-VS0108%E4%BA%A7%E5%93%81%E6%89%8B%E5%86%8Cv1.1.pdf":"official-files/HD-VS0108产品手册v1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-VS0116%E4%BA%A7%E5%93%81%E6%89%8B%E5%86%8Cv1.1.pdf":"official-files/HD-VS0116产品手册v1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Accessories/HD-SN1%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-SN1规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Accessories/HD-S90%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.4.pdf":"official-files/HD-S90规格书 V1.4.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Accessories/HD-S70%E8%A7%84%E6%A0%BC%E4%B9%A6%20V4.3.pdf":"official-files/HD-S70规格书 V4.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Accessories/HD-S40%E8%A7%84%E6%A0%BC%E4%B9%A6V4.4.pdf":"official-files/HD-S40规格书V4.4.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Accessories/HD-S108%E8%A7%84%E6%A0%BC%E4%B9%A6V2.1.pdf":"official-files/HD-S108规格书V2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-R5s%20Plus%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-R5s Plus规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-RB6%E8%A7%84%E6%A0%BC%E4%B9%A6%20V0.1.pdf":"official-files/HD-RB6规格书 V0.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-W2%E8%A7%84%E6%A0%BC%E4%B9%A6V7.1.pdf":"official-files/HD-W2规格书V7.1.pdf"};
var OFFICIAL_PDF_MAP = {"https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-K12%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-K12规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-K08%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-K08规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-R716%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-R716规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-R712%E8%A7%84%E6%A0%BC%E4%B9%A6%20V3.1.pdf":"official-files/HD-R712规格书 V3.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-R708%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-R708规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-R3210%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-R3210规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-R500S%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-R500S规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-R5S%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-R5S规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Sync/HD-T16%E8%A7%84%E6%A0%BC%E4%B9%A6v1.0.pdf":"official-files/HD-T16规格书v1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Sync/HD-T08%E8%A7%84%E6%A0%BC%E4%B9%A6v1.0.pdf":"official-files/HD-T08规格书v1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Sync/HD-T08F%E8%A7%84%E6%A0%BC%E4%B9%A6v1.0.pdf":"official-files/HD-T08F规格书v1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Sync/HD-T901%E8%A7%84%E6%A0%BC%E4%B9%A6V1.1.pdf":"official-files/HD-T901规格书V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/AS/HD-A8%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.4.pdf":"official-files/HD-A8规格书 V2.4.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/AS/HD-A7%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.4.pdf":"official-files/HD-A7规格书 V2.4.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/HS/HD-H8%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-H8规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/HS/HD-H6%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-H6规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/AS/HD-A6L%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.4.pdf":"official-files/HD-A6L规格书 V1.4.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/AS/HD-A5L%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-A5L规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/AS/HD-A4L%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-A4L规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/HS/HD-H4K%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-H4K规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Instruction/Sync-controller/HD-H4K%E7%94%A8%E6%88%B7%E6%89%8B%E5%86%8CV1.1.pdf":"official-files/HD-H4K用户手册V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/AS/HD-A3L%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-A3L规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Async/HD-C16H%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-C16H规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Async/HD-C16L%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.0.pdf":"official-files/HD-C16L规格书 V2.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Async/HD-C08L%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-C08L规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Async/HD-D16%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.1.pdf":"official-files/HD-D16规格书 V2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Async/HD-D18%E8%A7%84%E6%A0%BC%E4%B9%A6%20V0.2.pdf":"official-files/HD-D18规格书 V0.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Async/HD-B8L%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-B8L规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Async/HD-B6L%E8%A7%84%E6%A0%BC%E4%B9%A6V1.3.pdf":"official-files/HD-B6L规格书V1.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Instruction/Sync-controller/HD-B6L%E7%94%A8%E6%88%B7%E6%89%8B%E5%86%8C.pdf":"official-files/HD-B6L用户手册.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP4060%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.1.pdf":"official-files/HD-VP4060规格书 v1.1.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP4060%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.1.pdf":"official-files/HD-VP4060使用说明书V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP3060%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.1.pdf":"official-files/HD-VP3060规格书 v1.1.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP3060%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.1.pdf":"official-files/HD-VP3060使用说明书V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP2060%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.1.pdf":"official-files/HD-VP2060规格书 v1.1.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP2060%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.4.pdf":"official-files/HD-VP2060使用说明书V1.4.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP2430%E8%A7%84%E6%A0%BC%E4%B9%A6V1.0.pdf":"official-files/HD-VP2430规格书V1.0.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP2430%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.0.pdf":"official-files/HD-VP2430使用说明书V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP1640A%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.2.pdf":"official-files/HD-VP1640A规格书 v1.2.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP1640A%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V0.6.pdf":"official-files/HD-VP1640A使用说明书V0.6.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP1240A%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.2.pdf":"official-files/HD-VP1240A规格书 v1.2.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP1240A%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V0.6.pdf":"official-files/HD-VP1240A使用说明书V0.6.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP1620S%E8%A7%84%E6%A0%BC%E4%B9%A6V1.0.pdf":"official-files/HD-VP1620S规格书V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP1220S%E8%A7%84%E6%A0%BC%E4%B9%A6V1.0.pdf":"official-files/HD-VP1220S规格书V1.0.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP12%E8%A7%84%E6%A0%BC%E4%B9%A6V1.0.pdf":"official-files/HD-VP12规格书V1.0.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP12%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.0.pdf":"official-files/HD-VP12使用说明书V1.0.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP10%E8%A7%84%E6%A0%BC%E4%B9%A6V1.0.pdf":"official-files/HD-VP10规格书V1.0.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP10%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.0.pdf":"official-files/HD-VP10使用说明书V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP830-TP%E8%A7%84%E6%A0%BC%E4%B9%A6%20v2.1.pdf":"official-files/HD-VP830-TP规格书 v2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP830%E8%A7%84%E6%A0%BC%E4%B9%A6%20v2.1.pdf":"official-files/HD-VP830规格书 v2.1.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP630%20&%20VP830%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.0.pdf":"official-files/HD-VP630 & VP830使用说明书V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP630-TP%E8%A7%84%E6%A0%BC%E4%B9%A6%20v2.1.pdf":"official-files/HD-VP630-TP规格书 v2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP630%E8%A7%84%E6%A0%BC%E4%B9%A6%20v2.1.pdf":"official-files/HD-VP630规格书 v2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP820A%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.2.pdf":"official-files/HD-VP820A规格书 v1.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP620A%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.2.pdf":"official-files/HD-VP620A规格书 v1.2.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP820A%20&%20VP620A%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6_V1.0.pdf":"official-files/HD-VP820A & VP620A使用说明书_V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP410H%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.2.pdf":"official-files/HD-VP410H规格书 v1.2.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP410H%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.1.pdf":"official-files/HD-VP410H使用说明书V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP210H%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.2.pdf":"official-files/HD-VP210H规格书 v1.2.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP210H%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.1.pdf":"official-files/HD-VP210H使用说明书V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP410S%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.1.pdf":"official-files/HD-VP410S规格书 v1.1.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP410S%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.0.pdf":"official-files/HD-VP410S使用说明书V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-VP210S%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.1.pdf":"official-files/HD-VP210S规格书 v1.1.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-VP210S%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.0.pdf":"official-files/HD-VP210S使用说明书V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-KV410%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.1.pdf":"official-files/HD-KV410规格书 v1.1.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-KV410%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.0.pdf":"official-files/HD-KV410使用说明书V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/VideoProcessor/HD-KV210%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.1.pdf":"official-files/HD-KV210规格书 v1.1.pdf","https://huidu-software.oss-cn-shenzhen.aliyuncs.com/huidu.cn/WebFiles/Instruction/VP/zh/HD-KV210%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E%E4%B9%A6V1.0.pdf":"official-files/HD-KV210使用说明书V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Processor/HD-VP8000M%E8%A7%84%E6%A0%BC%E4%B9%A6V2.2.pdf":"official-files/HD-VP8000M规格书V2.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Instruction/VP/HD-VP8000M%E7%94%A8%E6%88%B7%E6%89%8B%E5%86%8CV2.3.1.pdf":"official-files/HD-VP8000M用户手册V2.3.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Server/HD-MS4000%20Pro%E8%A7%84%E6%A0%BC%E4%B9%A6_V1.3.pdf":"official-files/HD-MS4000 Pro规格书_V1.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Server/HD-MS4000%E8%A7%84%E6%A0%BC%E4%B9%A6_V1.4.pdf":"official-files/HD-MS4000规格书_V1.4.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Server/HD-MS2000%E8%A7%84%E6%A0%BC%E4%B9%A6_V1.4.7.pdf":"official-files/HD-MS2000规格书_V1.4.7.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Server/HD-MS1000%E8%A7%84%E6%A0%BC%E4%B9%A6_V1.4.pdf":"official-files/HD-MS1000规格书_V1.4.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-DCS4000%20Pro%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.0.pdf":"official-files/HD-DCS4000 Pro规格书 v1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-DCS4000%E8%A7%84%E6%A0%BC%E4%B9%A6v1.1.pdf":"official-files/HD-DCS4000规格书v1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-DCS4000%E8%AF%B4%E6%98%8E%E4%B9%A6v1.1.pdf":"official-files/HD-DCS4000说明书v1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-CT800%E8%A7%84%E6%A0%BC%E4%B9%A6v1.3.pdf":"official-files/HD-CT800规格书v1.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-CT800%E8%AF%B4%E6%98%8E%E4%B9%A6v1.3.pdf":"official-files/HD-CT800说明书v1.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-VM8000%E7%B3%BB%E5%88%97%E6%B7%B7%E5%90%88%E7%9F%A9%E9%98%B5%E8%A7%84%E6%A0%BC%E4%B9%A6v1.2.pdf":"official-files/HD-VM8000系列混合矩阵规格书v1.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-VM8000%E7%B3%BB%E5%88%97%E6%B7%B7%E5%90%88%E7%9F%A9%E9%98%B5%E8%AF%B4%E6%98%8E%E4%B9%A6v1.2.pdf":"official-files/HD-VM8000系列混合矩阵说明书v1.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-W3A%E8%A7%84%E6%A0%BC%E4%B9%A6V1.0.pdf":"official-files/HD-W3A规格书V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-W4A%E8%A7%84%E6%A0%BC%E4%B9%A6V8.1.pdf":"official-files/HD-W4A规格书V8.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-W60%E8%A7%84%E6%A0%BC%E4%B9%A6V7.0.pdf":"official-files/HD-W60规格书V7.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-W62%E8%A7%84%E6%A0%BC%E4%B9%A6V7.0.pdf":"official-files/HD-W62规格书V7.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-W63%E8%A7%84%E6%A0%BC%E4%B9%A6V7.1.pdf":"official-files/HD-W63规格书V7.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-W64A%E8%A7%84%E6%A0%BC%E4%B9%A6V7.1.pdf":"official-files/HD-W64A规格书V7.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-W66%E8%A7%84%E6%A0%BC%E4%B9%A6V7.0.pdf":"official-files/HD-W66规格书V7.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-WF1%E8%A7%84%E6%A0%BC%E4%B9%A6V7.0.pdf":"official-files/HD-WF1规格书V7.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-WF2%E8%A7%84%E6%A0%BC%E4%B9%A6V7.1.pdf":"official-files/HD-WF2规格书V7.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-WF4%E8%A7%84%E6%A0%BC%E4%B9%A6V7.0.pdf":"official-files/HD-WF4规格书V7.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-E64%E8%A7%84%E6%A0%BC%E4%B9%A6V2.1.pdf":"official-files/HD-E64规格书V2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-E63%E8%A7%84%E6%A0%BC%E4%B9%A6V6.0.pdf":"official-files/HD-E63规格书V6.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-E62%E8%A7%84%E6%A0%BC%E4%B9%A6V6.0.pdf":"official-files/HD-E62规格书V6.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-U6A%E8%A7%84%E6%A0%BC%E4%B9%A6V7.0.pdf":"official-files/HD-U6A规格书V7.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-U60%E8%A7%84%E6%A0%BC%E4%B9%A6V2.1.pdf":"official-files/HD-U60规格书V2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-U62%E8%A7%84%E6%A0%BC%E4%B9%A6V2.1.pdf":"official-files/HD-U62规格书V2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/Box/HD-3588V-BOX%20%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-3588V-BOX 规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3588V%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-3588V规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/Box/HD-3576V-BOX%20%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-3576V-BOX 规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3576V%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-3576V规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/Box/HD-3399F-BOX%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.2.pdf":"official-files/HD-3399F-BOX规格书 V1.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3399F%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.1.pdf":"official-files/HD-3399F规格书 V2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-733V%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-733V规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-982V%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-982V规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3568V%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.3.pdf":"official-files/HD-3568V规格书 V1.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3568VC%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-3568VC规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3566MV%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-3566MV规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/Box/HD-3568S-BOX%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.3.pdf":"official-files/HD-3568S-BOX规格书 V1.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3568S%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.2.pdf":"official-files/HD-3568S规格书 V2.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3568SC%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-3568SC规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/Box/HD-3566S-BOX%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.2.pdf":"official-files/HD-3566S-BOX规格书 V1.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3566S%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.1.pdf":"official-files/HD-3566S规格书 V2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3566P%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.3.pdf":"official-files/HD-3566P规格书 V1.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/Box/HD-3288S-BOX%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.2.pdf":"official-files/HD-3288S-BOX规格书 V1.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-3288S%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.1.pdf":"official-files/HD-3288S规格书 V2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-972S%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.3.pdf":"official-files/HD-972S规格书 V2.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/Box/HD-527S-BOX%20%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-527S-BOX 规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-527S%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-527S规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-133MC%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.2.pdf":"official-files/HD-133MC规格书 V1.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-133M%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.3.pdf":"official-files/HD-133M规格书 V1.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-133TE%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-133TE规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-133T%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.1.pdf":"official-files/HD-133T规格书 V2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-723D%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-723D规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-352C%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.1.pdf":"official-files/HD-352C规格书 V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/Box/HD-40S-BOX%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.3.pdf":"official-files/HD-40S-BOX规格书 V1.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-40S%E8%A7%84%E6%A0%BC%E4%B9%A6%20V2.2.pdf":"official-files/HD-40S规格书 V2.2.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/LCD/HD-S1C%E8%A7%84%E6%A0%BC%E4%B9%A6V1.1.pdf":"official-files/HD-S1C规格书V1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Accessories/HD-FT08%E8%A7%84%E6%A0%BC%E4%B9%A6%20v2.0.pdf":"official-files/HD-FT08规格书 v2.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Accessories/HD-FT01%E8%A7%84%E6%A0%BC%E4%B9%A6%20v1.1.pdf":"official-files/HD-FT01规格书 v1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Instruction/Accessories/HD-HT01%E4%BA%A7%E5%93%81%E6%89%8B%E5%86%8Cv1.0.pdf":"official-files/HD-HT01产品手册v1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Instruction/Accessories/HD-HT02%E4%BA%A7%E5%93%81%E6%89%8B%E5%86%8Cv1.0.pdf":"official-files/HD-HT02产品手册v1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-VS0102%E4%BA%A7%E5%93%81%E6%89%8B%E5%86%8Cv1.1.pdf":"official-files/HD-VS0102产品手册v1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-VS0104%E4%BA%A7%E5%93%81%E6%89%8B%E5%86%8Cv1.1.pdf":"official-files/HD-VS0104产品手册v1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-VS0108%E4%BA%A7%E5%93%81%E6%89%8B%E5%86%8Cv1.1.pdf":"official-files/HD-VS0108产品手册v1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/DCS-CT-VM-O/HD-VS0116%E4%BA%A7%E5%93%81%E6%89%8B%E5%86%8Cv1.1.pdf":"official-files/HD-VS0116产品手册v1.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Accessories/HD-SN1%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-SN1规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Accessories/HD-S90%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.4.pdf":"official-files/HD-S90规格书 V1.4.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Accessories/HD-S70%E8%A7%84%E6%A0%BC%E4%B9%A6%20V4.3.pdf":"official-files/HD-S70规格书 V4.3.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Accessories/HD-S40%E8%A7%84%E6%A0%BC%E4%B9%A6V4.4.pdf":"official-files/HD-S40规格书V4.4.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Accessories/HD-S108%E8%A7%84%E6%A0%BC%E4%B9%A6V2.1.pdf":"official-files/HD-S108规格书V2.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-R5s%20Plus%E8%A7%84%E6%A0%BC%E4%B9%A6%20V1.0.pdf":"official-files/HD-R5s Plus规格书 V1.0.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Receiver/HD-RB6%E8%A7%84%E6%A0%BC%E4%B9%A6%20V0.1.pdf":"official-files/HD-RB6规格书 V0.1.pdf","https://cdn1.huidu.cn/huidu.cn/WebFiles/Specification/Single-color/HD-W2%E8%A7%84%E6%A0%BC%E4%B9%A6V7.1.pdf":"official-files/HD-W2规格书V7.1.pdf"};
function officialFileHref(doc) {
  var cdnUrl = doc?.url || "";
  var local = OFFICIAL_PDF_MAP[cdnUrl];
  if (local) return local;
  var name = (doc?.label || "huidu-document") + ".pdf";
  return "/official-file.html?url=" + encodeURIComponent(cdnUrl) + "&name=" + encodeURIComponent(name);
}

function officialLinksHtml(item, query) {
  const record = officialRecord(item);
  if (!record?.pageUrl) {
    return `
      <p class="official-missing">官网暂未找到该型号的公开资料链接，请通过官网右下角联系客服查询。</p>
      <div class="address-row">
        <span>官网：</span>
        <a href="${OFFICIAL.home}" target="_blank" rel="noreferrer">${OFFICIAL.home}</a>
      </div>
    `;
  }

  const docSummary = officialDocSummary(record);
  return `
    <div class="official-source-links">
      <a href="${escapeHtml(record.pageUrl)}" target="_blank" rel="noreferrer">官网</a>
      ${(record.docs || []).slice(0, 4).map((doc) => `
        <a href="${escapeHtml(officialFileHref(doc))}" target="_blank" rel="noreferrer">${escapeHtml(docKindLabel(doc))}</a>
      `).join("")}
    </div>
    ${docSummary ? `
      <p class="official-doc-note">${escapeHtml(docSummary)}。若规格书或说明书直链打不开，请点官网或通过官网右下角联系客服查询。</p>
    ` : ""}
  `;
}

function pickFacts(facts, intent, query, count) {
  return [...(facts || [])]
    .sort((a, b) => factPriority(b, intent, query) - factPriority(a, intent, query))
    .filter((fact, index) => index === 0 || factPriority(fact, intent, query) > 0)
    .slice(0, count);
}

function fieldFacts(item, intent, query = "") {
  const fields = item.fields || {};
  const unique = (items) => [...new Set(items.filter(Boolean))];
  if (intent !== "overview" && fields[intent]?.length) {
    return unique(pickFacts(fields[intent], intent, query, intent === "load" ? 1 : 3));
  }
  return unique([
    ...pickFacts(fields.load, "load", query, 1),
    ...pickFacts(fields.resolution, "resolution", query, 1),
    ...pickFacts(fields.ports, "ports", query, 1),
    ...pickFacts(fields.operation, "operation", query, 1),
    ...pickFacts(item.facts, "overview", query, 2)
  ]).slice(0, 4);
}

function factPriority(fact, intent, query = "") {
  let score = 0;
  const text = String(fact || "");
  score += languagePriority(text, query);
  if (/带载|最大控制|控制范围|万点|像素|maximum control|load/i.test(text)) score += intent === "load" ? 80 : 20;
  if (/最大宽度|最大高度|水平最大|垂直最大|655,?360|1572|65\s*万/i.test(text)) score += 35;
  if (/规格书|Specification/i.test(text)) score += 8;
  if (/screen width|screen setting|select device|click/i.test(text) && intent === "load") score -= 60;
  if (/A3L/i.test(text) && intent === "load") score -= 6;
  if (/HD-A3|A3\s/.test(text)) score += 6;
  return score;
}

function answerText(fact, item, intent, query) {
  const text = String(fact || "").trim();
  if (wantsEnglish(query) || hasChinese(text)) return text;
  if (/maximum loading capacity is\s*([\d.]+)\s*million pixels/i.test(text)) {
    const value = text.match(/maximum loading capacity is\s*([\d.]+)\s*million pixels/i)?.[1];
    const width = text.match(/maximum width is\s*([\d,]+)\s*pixels/i)?.[1];
    const height = text.match(/maximum high is\s*([\d,]+)\s*pixels|maximum height is\s*([\d,]+)\s*pixels/i);
    return `${productName(item)} 最大带载约 ${value} 百万像素${width ? `，水平最大支持 ${width} 像素` : ""}${height ? `，垂直最大支持 ${height[1] || height[2]} 像素` : ""}。`;
  }
  if (/maximum control(?: range)?(?: of| is)?\s*([\d.,]+)\s*(?:million )?pixels/i.test(text)) {
    const value = text.match(/maximum control(?: range)?(?: of| is)?\s*([\d.,]+)\s*(?:million )?pixels/i)?.[1];
    const width = text.match(/horizontal.*?([\d,]+)\s*pixels/i)?.[1];
    const height = text.match(/vertical.*?([\d,]+)\s*pixels/i)?.[1];
    return `${productName(item)} 最大控制范围为 ${value} 像素${width ? `，水平最大支持 ${width} 像素` : ""}${height ? `，垂直最大支持 ${height} 像素` : ""}。`;
  }
  if (/standard\s+(\d+)[-\s]?way gigabit/i.test(text)) {
    const ports = text.match(/standard\s+(\d+)[-\s]?way gigabit/i)?.[1];
    return `${productName(item)} 标配 ${ports} 路千兆网口输出，可直接级联接收卡。`;
  }
  return "";
}

function answerTexts(facts, item, intent, query) {
  const values = facts.map((fact) => answerText(fact, item, intent, query)).filter(Boolean);
  return [...new Set(values)];
}

function commonText(fact, item, intent, query) {
  const direct = answerText(fact, item, intent, query);
  if (direct) return direct;
  const text = String(fact || "").trim();
  if (wantsEnglish(query)) return text;
  if (/supports any layout of three screens/i.test(text)) {
    return "支持三画面任意布局，最大支持 3 x 4K 规格窗口。";
  }
  if (/support six-window free layout|supports free layout of six screens/i.test(text)) {
    return "支持六画面自由布局，最大支持 3×4K、2×4K+4×2K 或 6×2K 规格窗口。";
  }
  if (/2[-\s]?channel 4k input/i.test(text) && /dp/i.test(text) && /hdmi/i.test(text)) {
    return "支持 2 路 4K 输入：1 路 DP 1.2、1 路 HDMI 2.0。";
  }
  if (/4\s*-?channel 2k input/i.test(text) && /hdmi/i.test(text)) {
    return "支持 4 路 2K 输入：4 路 HDMI 1.3。";
  }
  if (/support\s+4[-\s]?channel hdmi.*1[-\s]?channel dp/i.test(text)) {
    return "支持 4 路 HDMI、1 路 DP 信号输入，多路视频信号可任意切换。";
  }
  if (/2\s*\*?\s*hdmi.*1\s*\*?\s*dvi.*1\s*\*?\s*sdi/i.test(text)) {
    return "支持 2 路 HDMI、1 路 DVI、1 路 SDI 信号输入，可任意切换。";
  }
  if (/standard\s+(\d+)[-\s]?way gigabit network output/i.test(text)) {
    const ports = text.match(/standard\s+(\d+)[-\s]?way gigabit network output/i)?.[1];
    return `${productName(item)} 标配 ${ports} 路千兆网口输出，可直接级联接收卡。`;
  }
  if (/(\d+)[-\s]?way gigabit network port output/i.test(text)) {
    const ports = text.match(/(\d+)[-\s]?way gigabit network port output/i)?.[1];
    const optical = text.match(/(\d+)[-\s]?channel optical/i)?.[1];
    return `${productName(item)} 集成 ${ports} 路千兆网口输出${optical ? `、${optical} 路光口输出` : ""}。`;
  }
  if (/supports up to\s*4096\*2160@60hz/i.test(text)) {
    return "最高支持 4096×2160@60Hz 同步信号输入。";
  }
  if (/maximum\s+4096\s*x\s*2160\s*@\s*60hz input resolution/i.test(text)) {
    return "最大输入分辨率支持 4096×2160@60Hz。";
  }
  if (/resolution:\s*vesa.*?1920x1080@60hz/i.test(text)) {
    return "分辨率：VESA 标准，≤1920×1080@60Hz。";
  }
  return "";
}

function bestFact(item, field, patterns, query) {
  const facts = item.fields?.[field] || [];
  const scored = facts
    .filter((fact) => patterns.some((pattern) => pattern.test(fact)))
    .map((fact) => ({
      fact,
      score: languagePriority(fact, query) + patterns.reduce((sum, pattern) => sum + (pattern.test(fact) ? 10 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score);
  return scored[0]?.fact || "";
}

function addRow(rows, seen, label, text) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  const key = `${label}::${clean}`;
  if (!clean || seen.has(key)) return;
  rows.push({ label, text: clean });
  seen.add(key);
}

function selectorPriority(row, intent, query, index) {
  const text = `${row.label || ""} ${row.text || ""}`;
  let score = 100 - index;
  if (intent === "load" && /带载|最大控制|控制范围|像素|万/.test(text)) score += 900;
  if (intent === "resolution" && /宽\/高|分辨率|最宽|最高|整机最大输出|输出分辨率|画面|窗口/.test(text)) score += 900;
  if (intent === "ports" && /接口|网口|光口|输出|输入|HDMI|DP|DVI|SDI|USB|HUB|串口|LAN|PoE/.test(text)) score += 900;
  if (intent === "operation" && /支持|通信|Wi-Fi|U盘|云管理|音频|功能|设备拼控|操作系统|CPU|内存|显存/.test(text)) score += 900;
  if (/带载|最大控制/.test(query) && /带载|最大控制|控制范围/.test(text)) score += 300;
  if (/网口|接口|输入|输出|hdmi|dp|usb/i.test(query) && /接口|网口|输出|输入|HDMI|DP|USB|HUB/.test(text)) score += 300;
  if (/pro/i.test(query) && /Pro/i.test(text)) score += 200;
  return score;
}

function selectorRows(item, intent, query) {
  return (Array.isArray(item.selector) ? item.selector : [])
    .map((row, index) => ({ row, score: selectorPriority(row, intent, query, index) }))
    .sort((a, b) => b.score - a.score)
    .map(({ row }) => row);
}

function quickRows(item, intent, query) {
  const seen = new Set();
  const rows = [];
  for (const row of selectorRows(item, intent, query)) addRow(rows, seen, row.label, row.text);
  const hasSelectorRows = rows.length > 0;
  if (hasSelectorRows) return rows.slice(0, 10);
  const loadFact = bestFact(item, "load", [/带载|最大控制|控制范围|万点|像素|maximum loading|maximum control|load/i], query);
  const windowFact = bestFact(item, "resolution", [/画面|窗口|3\s*x\s*4K|three screens|window/i], query);
  const resolutionFact = bestFact(item, "resolution", [/分辨率|4096|2160|1920|1080|resolution/i], query);
  const inputFact = bestFact(item, "ports", [/输入|HDMI|DP|DVI|SDI|input/i], query);
  const outputFact = bestFact(item, "ports", [/输出|网口|光口|千兆|gigabit|network output|optical/i], query);
  const operationFact = bestFact(item, "operation", [/连接|设置|发送|节目|播放|调试|Wi-Fi|wifi|U盘|connect|setting|program/i], query);

  const portRows = /网口|输出|发送卡|千兆|network|gigabit|ethernet/i.test(query)
    ? [
      ["输出/网口", commonText(outputFact, item, "ports", query)],
      ["输入接口", commonText(inputFact, item, "ports", query)],
      ["带载/范围", commonText(loadFact, item, "load", query)],
      ["画面/窗口", commonText(windowFact, item, "resolution", query)],
    ]
    : [
      ["输入接口", commonText(inputFact, item, "ports", query)],
      ["输出/网口", commonText(outputFact, item, "ports", query)],
      ["带载/范围", commonText(loadFact, item, "load", query)],
      ["画面/窗口", commonText(windowFact, item, "resolution", query)],
    ];

  const ordered = {
    load: [
      ["带载/范围", commonText(loadFact, item, "load", query)],
      ["画面/窗口", commonText(windowFact, item, "resolution", query)],
      ["输入接口", commonText(inputFact, item, "ports", query)],
      ["输出/网口", commonText(outputFact, item, "ports", query)],
      ["分辨率", commonText(resolutionFact, item, "resolution", query)],
    ],
    resolution: [
      ["画面/窗口", commonText(windowFact, item, "resolution", query)],
      ["分辨率", commonText(resolutionFact, item, "resolution", query)],
      ["带载/范围", commonText(loadFact, item, "load", query)],
      ["输入接口", commonText(inputFact, item, "ports", query)],
      ["输出/网口", commonText(outputFact, item, "ports", query)],
    ],
    ports: portRows,
    operation: [
      ["操作/连接", commonText(operationFact, item, "operation", query)],
      ["输入接口", commonText(inputFact, item, "ports", query)],
      ["输出/网口", commonText(outputFact, item, "ports", query)],
      ["带载/范围", commonText(loadFact, item, "load", query)],
    ],
    overview: [
      ["带载/范围", commonText(loadFact, item, "load", query)],
      ["画面/窗口", commonText(windowFact, item, "resolution", query)],
      ["输入接口", commonText(inputFact, item, "ports", query)],
      ["输出/网口", commonText(outputFact, item, "ports", query)],
      ["分辨率", commonText(resolutionFact, item, "resolution", query)],
    ],
  }[intent] || [];

  for (const [label, text] of ordered) addRow(rows, seen, label, text);
  if (!rows.length) {
    for (const text of answerTexts(fieldFacts(item, intent, query), item, intent, query)) {
      addRow(rows, seen, intentLabel(intent), text);
    }
  }
  return rows.slice(0, 5);
}

function searchProducts(query) {
  if (!query.trim()) return [];
  const seriesPrefix = isSeriesPrefixQuery(query);
  const numericFragment = isNumericFragmentQuery(query);
  const useSelectionOrder = numericFragment && normalize(query).length >= 3;
  return quickTable
    .filter((item) => !isFalseProductModel(item))
    .map((item) => ({ item, score: productScore(item, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) =>
      b.score - a.score
      || (numericFragment ? numericExactPriority(a.item, query) - numericExactPriority(b.item, query) : 0)
      || (useSelectionOrder ? selectionOrder(a.item) - selectionOrder(b.item) : 0)
      || (seriesPrefix || numericFragment ? compareProductNatural(a.item, b.item) : 0)
      || (b.item.score || 0) - (a.item.score || 0)
      || compareProductNatural(a.item, b.item)
    )
    .slice(0, 8);
}

function normalizeIcKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/芯片|固件|升级|用|什么|哪个|哪一个|对应|系列|firmware/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function icTerms(value) {
  const text = String(value || "");
  const terms = new Set();
  const add = (item) => {
    const key = normalizeIcKey(item);
    if (key.length >= 2) terms.add(key);
  };
  add(text);
  text.split(/[\s/、,，或和]+/).forEach(add);
  (text.match(/[a-z]{0,5}\d{2,6}[a-z]{0,3}/gi) || []).forEach((item) => {
    add(item);
    const part = normalizeIcKey(item);
    const parsed = part.match(/^([a-z]*)(\d{2,6})([a-z]{0,3})$/i);
    if (parsed) {
      const bareWithSuffix = `${parsed[2]}${parsed[3] || ""}`;
      add(bareWithSuffix);
      if (!parsed[3]) add(parsed[2]);
    }
  });
  return [...terms];
}

function icQueryKeys(query) {
  return icTerms(query).filter((item) => item.length >= 2);
}

function scoreIcFirmware(row, queryKeys) {
  const chipTerms = icTerms(row.chip);
  const settingTerms = icTerms(row.setting);
  const firmwareTerms = icTerms(row.firmware);
  const categoryTerms = icTerms(row.category);
  let score = 0;
  for (const key of queryKeys) {
    const hasSuffix = /\d+[a-z]+$/i.test(key);
    if (chipTerms.includes(key)) score = Math.max(score, hasSuffix ? 1550 : 1000);
    if (settingTerms.includes(key)) score = Math.max(score, hasSuffix ? 1450 : 850);
    if (firmwareTerms.includes(key)) score = Math.max(score, 650);
    if (categoryTerms.includes(key)) score = Math.max(score, 300);
  }
  return score;
}

function searchIcFirmware(query) {
  const keys = icQueryKeys(query);
  if (!keys.length) return [];
  const exactKey = normalizeIcKey(query);
  return IC_FIRMWARE_ROWS
    .map((row) => {
      const chipTerms = icTerms(row.chip);
      const settingTerms = icTerms(row.setting);
      const exactScore = exactKey && chipTerms.includes(exactKey) ? 1600 : exactKey && settingTerms.includes(exactKey) ? 1400 : 0;
      return { ...row, score: Math.max(exactScore, scoreIcFirmware(row, keys)), hit: keys[0] };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.category.localeCompare(b.category, "zh-Hans-CN") || a.chip.localeCompare(b.chip, "zh-Hans-CN"))
    .slice(0, 30);
}

function asyncCardSuffixDetails() {
  return [
    RECEIVER_CARD_SUFFIX_NOTE,
    ASYNC_CARD_SUFFIX_NOTE,
    ASYNC_SUFFIX_MAPPING_NOTE
  ];
}

function renderIcFirmwareAnswer(query, hits) {
  const primary = hits[0];
  const firmwareLabel = primary.firmware || "查看智能设置选择";
  const mapping = deriveFirmwareMap(primary);
  const suffixNote = firmwareSuffixNote(mapping);
  const title = hits.length > 1 && primary.score < 1000
    ? `${escapeHtml(query)} 相关固件：${escapeHtml(firmwareLabel)}`
    : `${escapeHtml(primary.chip.replace(/\n/g, " / "))} 对应：${escapeHtml(firmwareLabel)}`;
  $("#answerPanel").innerHTML = `
    <article class="answer-card firmware-answer">
      <span class="answer-label">IC固件速查</span>
      <h2>${title}</h2>
      <dl class="quick-table firmware-table">
        <div>
          <dt>芯片型号</dt>
          <dd>${escapeHtml(primary.chip.replace(/\n/g, " / "))}</dd>
        </div>
        <div>
          <dt>智能设置</dt>
          <dd>${escapeHtml(primary.setting.replace(/\n/g, " / ") || "按资料表选择")}</dd>
        </div>
        <div>
          <dt>对应固件</dt>
          <dd><strong>${escapeHtml(firmwareLabel)}</strong>（${escapeHtml(suffixNote)}）</dd>
        </div>
      </dl>
      <p class="firmware-reminder">备注：${escapeHtml(mapping.note || "【待补充】")}</p>
      <p class="firmware-reminder">已接入《${escapeHtml(IC_FIRMWARE_SOURCE)}》整表。现场升级前再核对模组芯片丝印、接收卡型号和项目备份，避免同名近似芯片拿错固件。</p>
    </article>
  `;

  $("#matchSummary").textContent = `${hits.length} 条芯片/固件匹配`;
  $("#sourceList").innerHTML = hits.map((hit, index) => {
    const mapping = deriveFirmwareMap(hit);
    return `
    <article class="source-card">
      <div class="source-head">
        <strong>${index + 1}. ${escapeHtml(hit.chip.replace(/\n/g, " / "))}</strong>
        <span>${escapeHtml(hit.category)} · 匹配 ${Math.round(hit.score)}</span>
      </div>
      <p><strong>智能设置：</strong>${escapeHtml(hit.setting.replace(/\n/g, " / ") || "按资料表选择")}</p>
      <p><strong>固件：</strong>${escapeHtml(hit.firmware)}（${escapeHtml(firmwareSuffixNote(mapping))}）</p>
      <p class="local-note">备注：${escapeHtml(mapping.note || "【待补充】")}</p>
      <p class="local-note">来源：${escapeHtml(IC_FIRMWARE_SOURCE)}。输入芯片数字、完整芯片名或固件系列名都可以反查。</p>
    </article>
    `;
  }).join("");
}

function renderQuickRows(rows) {
  if (!rows.length) {
    return `
      <dl class="quick-table">
        <div>
          <dt>速查</dt>
          <dd>已找到该型号资料，但当前问题还没有整理出稳定参数，请优先查看右侧相近资料来源。</dd>
        </div>
      </dl>
    `;
  }
  return `
    <dl class="quick-table">
      ${rows.map((row) => `
        <div>
          <dt>${escapeHtml(row.label)}</dt>
          <dd>${escapeHtml(row.text)}</dd>
        </div>
      `).join("")}
    </dl>
  `;
}

function sourceCard(item, score, query, intent, mode = "匹配") {
  const rows = quickRows(item, intent, query);
  const preview = rows[0]?.text || "已找到该型号的规格书/说明书来源，具体参数请参考来源文件。";
  const record = officialRecord(item);
  return `
    <article class="source-card">
      <div class="source-head">
        <strong>${escapeHtml(productName(item))}</strong>
        <span>${escapeHtml(mode)} ${Math.round(score)}</span>
      </div>
      <p>${escapeHtml(preview)}</p>
      <div class="source-meta">
        ${sortedSources(item, query).slice(0, 3).map((source) => {
          const doc = officialDocForSource(record, source, query);
          const docText = doc ? ` · 官网：${doc.label}` : "";
          return `<span>${escapeHtml(source.typeLabel || "来源")}：${escapeHtml(source.name)}${escapeHtml(docText)}</span>`;
        }).join("")}
      </div>
      ${officialLinksHtml(item, query)}
    </article>
  `;
}

function operationQuery(query) {
  return /软件|app|手机|屏掌控|ledart|hdplayer|hdset|hdsign|hd2020|hd2018|lcdplayer|安装|连接|设置|发送|发布|节目|播放|调试|校时|回读|云平台|u盘|wifi|wi-fi/i.test(query || "");
}

function operationScore(doc, query) {
  const tokens = [...new Set([
    ...queryTokens(query).map(normalize),
    ...keywordTokens(query).map(normalize)
  ])].filter(Boolean);
  const text = `${doc.name} ${doc.category} ${(doc.products || []).join(" ")} ${(doc.keywords || []).join(" ")} ${(doc.summary || []).join(" ")}`;
  const haystack = normalize(text);
  let score = 0;
  for (const token of tokens) {
    if (!token) continue;
    if (haystack.includes(token)) score += token.length > 3 ? 80 : 45;
  }
  if (/屏掌控|ledart/i.test(query) && /屏掌控|ledart|APP操作/i.test(text)) score += 220;
  if (/屏掌控|ledart/i.test(query) && /标准版（全彩）|标准版.*全彩/i.test(doc.name)) score += 60;
  if (/屏掌控|ledart/i.test(query) && /LCD/i.test(doc.name) && !/LCD/i.test(query)) score -= 35;
  if (/屏掌控|ledart/i.test(query) && /单色|单双色/i.test(doc.name) && !/单色|单双色/i.test(query)) score -= 20;
  if (/hdplayer/i.test(query) && /HDPlayer/i.test(text)) score += 220;
  if (/hdset|调屏|屏参/i.test(query) && /HDSet|调屏|屏参/i.test(text)) score += 220;
  if (/云平台|cloud/i.test(query) && /云平台|Cloud|云信息|信息发布系统/i.test(text)) score += 220;
  if (/手机|app|无线|wifi|wi-fi/i.test(query) && /手机|APP|Wi-Fi|wifi|屏掌控|LedArt/i.test(text)) score += 90;
  if (/发送|发布|节目/i.test(query) && /发送|发布|节目/i.test(text)) score += 100;
  if (/安装/i.test(query) && /安装/i.test(text)) score += 80;
  if (/调试/i.test(query) && /调试/i.test(text)) score += 80;
  if (/单色|单双色/i.test(query) && /单色|单双色/i.test(text)) score += 120;
  if (/全彩/i.test(query) && /全彩/i.test(text)) score += 120;
  if (/LCD/i.test(query) && /LCD/i.test(text)) score += 120;
  return score;
}

function searchOperations(query) {
  if (!operationQuery(query)) return [];
  return operationResources
    .map((doc) => ({ doc, score: operationScore(doc, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.doc.score - a.doc.score)
    .slice(0, 8);
}

function allVideos() {
  return videoResources.length
    ? videoResources
    : [...LOCAL_DEMO_VIDEOS, ...SCREEN_CONTROL_VIDEOS];
}

function videoText(video) {
  return `${video.title || ""} ${video.desc || ""} ${video.keywords || ""} ${video.tags || ""} ${video.category || ""} ${video.language || ""}`;
}

function videosForOperation(query, hits) {
  const pool = allVideos();
  const context = `${query} ${hits.map(({ doc }) => `${doc.name} ${doc.category} ${(doc.keywords || []).join(" ")}`).join(" ")}`;
  const needsScreenControl = /屏掌控|ledart/i.test(query);
  const needsHdPlayer = /hdplayer/i.test(query);
  const needsHdSet = /hdset|调屏|屏参|接收卡参数/i.test(query);
  const needsCloud = /云平台|cloud/i.test(query);
  const needsLcd = /lcd/i.test(query);
  const needsWifi = /wifi|wi-fi|密码|热点/i.test(query);
  const needsReadback = /回读/i.test(query);
  return pool
    .map((video) => {
      let score = 0;
      const text = videoText(video);
      if (needsHdSet && !/HDSet|调屏|屏参|接收卡参数/i.test(text)) return { video, score: 0 };
      if (needsHdPlayer && !/HDPlayer/i.test(text)) return { video, score: 0 };
      if (needsScreenControl && !/屏掌控|LedArt/i.test(text)) return { video, score: 0 };
      if (needsCloud && !/云平台|Cloud/i.test(text)) return { video, score: 0 };
      if (needsLcd && !/LCD/i.test(text)) return { video, score: 0 };
      if (needsWifi && !/WiFi|Wi-Fi|密码|热点/i.test(text)) return { video, score: 0 };
      if (needsReadback && !/回读/i.test(text)) return { video, score: 0 };
      if (/屏掌控|ledart/i.test(context) && /屏掌控|LedArt/i.test(text)) score += 100;
      if (/hdplayer/i.test(context) && /HDPlayer/i.test(text)) score += 100;
      if (/云平台|cloud/i.test(context) && /云平台|Cloud/i.test(text)) score += 120;
      if (/app|手机/i.test(context) && /APP|手机|mobile/i.test(text)) score += 70;
      if (/LCD/i.test(context) && /LCD/i.test(text)) score += 80;
      if (/WiFi|Wi-Fi|密码|热点/i.test(context) && /WiFi|Wi-Fi|密码|热点/i.test(text)) score += 90;
      if (/回读/i.test(context) && /回读/i.test(text)) score += 90;
      if (/发送|发布|节目/i.test(context) && /发送|节目/i.test(text)) score += 40;
      if (/全彩/i.test(context) && /全彩/i.test(text)) score += 30;
      if (/单色|单双色/i.test(context) && /单色|单双色/i.test(text)) score += 30;
      return { video, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.video);
}

function operationSteps(query, hits) {
  if (/屏掌控|ledart|手机|app|无线/i.test(query)) {
    return {
      title: "APP/屏掌控操作：先连接设备，再编辑并发送节目",
      steps: [
        "手机连接控制卡/播放器 Wi-Fi，或确保手机和设备在同一局域网。",
        "打开对应 APP，搜索并进入设备；如搜不到，先检查设备供电、天线、Wi-Fi 和手机网络状态。",
        "新建节目或打开已有节目，按屏幕类型添加文本、图片、视频等内容。",
        "确认屏幕参数和节目内容后，点击发送/发布。",
        "发送完成后查看屏幕效果；异常时优先按下方文档排查。"
      ]
    };
  }
  if (/hdplayer/i.test(query)) {
    return {
      title: "HDPlayer操作：先建节目，再选设备发送",
      steps: [
        "打开 HDPlayer，新建或打开节目，完成内容编辑。",
        "确认电脑和控制卡/播放盒在同一网络，或通过网线直连设备。",
        "点击发送/发布节目，选择在线设备。",
        "发送完成后查看屏幕播放效果；设备不在线时检查网段、防火墙、网线或 Wi-Fi。"
      ]
    };
  }
  if (/hdset|调屏|屏参/i.test(query)) {
    return {
      title: "HDSet操作：先连接设备，再读取或设置屏参",
      steps: [
        "确认电脑和控制器/处理器/接收卡连接正常。",
        "打开 HDSet，选择对应设备类型并搜索设备。",
        "进入屏参或接收卡参数页面，先读取当前参数或备份配置。",
        "按现场屏幕宽高、接收卡数量、模组参数进行设置。",
        "确认无误后再发送到设备；客户现场不确定时先不要覆盖原参数。"
      ]
    };
  }
  const first = hits[0]?.doc?.category || "软件/操作";
  return {
    title: `${first}：先按文档确认版本和连接方式，再进行操作`,
    steps: [
      "先确认客户使用的软件、APP 或设备型号。",
      "按下方最相关文档查看安装、连接和操作步骤。",
      "如果是节目发送类问题，先确认设备在线，再发送节目。",
      "如果是调试类问题，先备份或读取当前参数，再做修改。",
      "官网没有公开资料时，请通过官网右下角联系客服查询。"
    ]
  };
}

function operationOfficialHtml(query) {
  if (/hdplayer/i.test(query)) {
    return `
      <article class="source-card">
        <div class="source-head">
          <strong>官网</strong>
          <span>补充查询</span>
        </div>
        <p>软件使用说明和指导文档优先看上方来源；官网未公开或链接打不开时，请通过官网右下角联系客服查询。</p>
        <div class="official-source-links">
          <a href="${OFFICIAL.home}" target="_blank" rel="noreferrer">官网</a>
        </div>
      </article>
    `;
  }
  return `
    <article class="source-card">
      <div class="source-head">
        <strong>官网公开资料</strong>
        <span>补充查询</span>
      </div>
      <p class="official-missing">官网暂未找到对应操作资料的精确公开链接时，请通过官网右下角联系客服查询。</p>
      <div class="address-row">
        <span>官网：</span>
        <a href="${OFFICIAL.home}" target="_blank" rel="noreferrer">${OFFICIAL.home}</a>
      </div>
    </article>
  `;
}

function renderOperationAnswer(query, hits) {
  const guide = operationSteps(query, hits);
  const docs = hits.slice(0, 6);
  const videos = videosForOperation(query, hits);
  $("#answerPanel").innerHTML = `
    <article class="answer-card">
      <span class="answer-label">操作答案</span>
      <h2>${escapeHtml(guide.title)}</h2>
      <ol class="steps">
        ${guide.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
      </ol>
    </article>
  `;

  $("#matchSummary").textContent = `${docs.length} 个文档${videos.length ? ` + ${videos.length} 个指导视频` : ""}`;
  $("#sourceList").innerHTML = `
    ${docs.map(({ doc, score }, index) => `
      <article class="source-card">
        <div class="source-head">
          <strong>${index + 1}. ${escapeHtml(doc.name)}</strong>
          <span>${escapeHtml(doc.category)} · 匹配 ${Math.round(score)}</span>
        </div>
        <p>${escapeHtml((doc.summary || [])[0] || "本地资料库已接入该操作文档。")}</p>
        ${(doc.summary || []).slice(1, 4).map((text) => `<p class="small-line">${escapeHtml(text)}</p>`).join("")}
        <p class="local-note">本地资料库已接入索引，客户页面只显示摘要，不提供本地原文件下载。</p>
      </article>
    `).join("")}
    ${videos.map((video) => `
      <article class="source-card video-card">
        <div class="source-head">
          <strong>${escapeHtml(video.title)}</strong>
          <span>指导视频</span>
        </div>
        <p>${escapeHtml(video.desc)}</p>
        <video controls controlsList="nodownload" preload="metadata" oncontextmenu="return false">
          <source src="${escapeHtml(video.src)}" type="video/mp4" />
        </video>
      </article>
    `).join("")}
    ${operationOfficialHtml(query)}
  `;
}

function isScreenControlQuery(query) {
  return /屏掌控|ledart|手机.*(发|发送|发布|节目|控制)|app.*(发|发送|发布|节目|控制)|无线.*(发|发送|发布|节目)/i.test(query || "");
}

function preferredScreenControlDocs(query) {
  const text = String(query || "");
  return [...SCREEN_CONTROL_DOCS].sort((a, b) => {
    const score = (doc) => {
      let value = 0;
      if (/全彩/.test(text) && /全彩/.test(doc.tags)) value += 50;
      if (/单色|单双色/.test(text) && /单色|单双色/.test(doc.tags)) value += 50;
      if (/商显/.test(text) && /商显/.test(doc.tags)) value += 50;
      if (/LCD/i.test(text) && /LCD/i.test(doc.tags)) value += 50;
      if (/VP/i.test(text) && /VP/i.test(doc.tags)) value += 50;
      if (/发送|发布|节目/.test(text) && /节目/.test(doc.tags)) value += 20;
      if (/全彩/.test(doc.tags)) value += 5;
      return value;
    };
    return score(b) - score(a);
  });
}

function preferredScreenControlVideos(query) {
  const text = String(query || "");
  const videos = allVideos().filter((video) => /屏掌控|LedArt/i.test(videoText(video)));
  return videos.sort((a, b) => {
    const score = (video) => {
      let value = 0;
      const tags = videoText(video);
      if (/全彩/.test(text) && /全彩/.test(tags)) value += 50;
      if (/单色|单双色/.test(text) && /单色|单双色/.test(tags)) value += 50;
      if (/发送|发布|节目/.test(text) && /发送|节目/.test(tags)) value += 10;
      return value;
    };
    return score(b) - score(a);
  });
}

function renderScreenControlAnswer(query) {
  const docs = preferredScreenControlDocs(query).slice(0, 4);
  const videos = preferredScreenControlVideos(query).slice(0, 2);
  $("#answerPanel").innerHTML = `
    <article class="answer-card">
      <span class="answer-label">操作答案</span>
      <h2>屏掌控：先连设备 Wi-Fi，再在 APP 里编辑并发送节目</h2>
      <ol class="steps">
        <li>手机打开 Wi-Fi，连接控制卡/播放器热点；默认密码通常按设备资料要求填写，常见为 8 个 8。</li>
        <li>打开屏掌控 APP，确认能搜索到设备并进入设备。</li>
        <li>新建节目，选择屏幕类型和尺寸，添加文本、图片、视频等内容。</li>
        <li>编辑完成后点发送/发布，等待发送完成，再查看屏幕播放效果。</li>
        <li>搜不到设备时，先检查手机是否连到设备热点、是否关闭移动数据干扰、设备供电和 Wi-Fi 天线是否正常。</li>
      </ol>
    </article>
  `;

  $("#matchSummary").textContent = `${docs.length} 个文档 + ${videos.length} 个指导视频`;
  $("#sourceList").innerHTML = `
    ${docs.map((doc, index) => `
      <article class="source-card">
        <div class="source-head">
          <strong>${index + 1}. ${escapeHtml(doc.title)}</strong>
          <span>操作文档</span>
        </div>
        <p>${escapeHtml(doc.desc)}</p>
        <p class="local-note">本地资料库已接入索引，客户页面只显示摘要，不提供本地原文件下载。</p>
      </article>
    `).join("")}
    ${videos.map((video) => `
      <article class="source-card video-card">
        <div class="source-head">
          <strong>${escapeHtml(video.title)}</strong>
          <span>指导视频</span>
        </div>
        <p>${escapeHtml(video.desc)}</p>
        <video controls controlsList="nodownload" preload="metadata" oncontextmenu="return false">
          <source src="${escapeHtml(video.src)}" type="video/mp4" />
        </video>
      </article>
    `).join("")}
    <article class="source-card">
      <div class="source-head">
        <strong>官网公开资料</strong>
        <span>补充查询</span>
      </div>
      <p class="official-missing">官网暂未找到屏掌控对应的精确公开资料链接，请通过官网右下角联系客服查询。</p>
      <div class="address-row">
        <span>官网：</span>
        <a href="${OFFICIAL.home}" target="_blank" rel="noreferrer">${OFFICIAL.home}</a>
      </div>
    </article>
  `;
}

function isHdPlayerProgramSend(query) {
  return /hd\s*player|hdplayer|发送节目|节目发送|发布节目|节目发布/i.test(query)
    && /发送|发布|节目|hd\s*player|hdplayer/i.test(query);
}

function renderHdPlayerProgramAnswer() {
  $("#answerPanel").innerHTML = `
    <article class="answer-card">
      <span class="answer-label">直接答案</span>
      <h2>HDPlayer发送节目：编辑节目后，点发送并选择设备</h2>
      <ol class="steps">
        <li>打开 HDPlayer，新建或打开节目，完成内容编辑。</li>
        <li>确认电脑和控制卡/播放盒在同一网络，或通过网线直连设备。</li>
        <li>点击软件里的“发送/发布节目”，选择在线设备。</li>
        <li>发送完成后查看屏幕播放效果；设备不在线时先检查网段、防火墙、网线或 Wi-Fi。</li>
      </ol>
      <div class="official-links">
        <a href="${OFFICIAL.home}" target="_blank" rel="noreferrer">官网</a>
      </div>
    </article>
  `;

  $("#matchSummary").textContent = "官网来源 + 本地指导视频";
  $("#sourceList").innerHTML = `
    <article class="source-card">
      <strong>软件使用说明</strong>
      <p>HDPlayer用户手册 V3.9，作为客户操作步骤的主要来源。若直接文件链接打不开，请从官网或右下角联系客服查询。</p>
      <a href="${OFFICIAL.home}" target="_blank" rel="noreferrer">官网</a>
    </article>
    ${allVideos().filter((video) => /HDPlayer|节目编辑|发送|发布/i.test(videoText(video))).slice(0, 3).map((video) => `
      <article class="source-card video-card">
        <strong>${escapeHtml(video.title)}</strong>
        <p>${escapeHtml(video.desc)}</p>
        <video controls controlsList="nodownload" preload="metadata" oncontextmenu="return false">
          <source src="${escapeHtml(video.src)}" type="video/mp4" />
        </video>
      </article>
    `).join("")}
  `;
}

function libraryText(item) {
  return `${item.name || item.title || ""} ${item.typeLabel || ""} ${item.category || ""} ${(item.products || []).join(" ")} ${(item.summary || []).join(" ")} ${item.keywords || ""}`;
}

function libraryScore(item, query, type) {
  const rawQuery = String(query || "").trim();
  if (!rawQuery) return 1;
  const text = libraryText(item);
  const haystack = normalize(text);
  const rawHaystack = text.toLowerCase();
  const tokens = [...new Set([
    ...queryTokens(rawQuery),
    ...keywordTokens(rawQuery)
  ])].filter(Boolean);
  let score = 0;
  const normalizedQuery = normalize(rawQuery);
  if (normalizedQuery && haystack.includes(normalizedQuery)) score += 220;
  for (const token of tokens) {
    const normalizedToken = normalize(token);
    if (!normalizedToken) continue;
    if (haystack.includes(normalizedToken)) score += normalizedToken.length > 3 ? 80 : 45;
  }
  if (/云平台|cloud/i.test(rawQuery) && /云平台|cloud|云信息|信息发布系统/i.test(text)) score += 240;
  if (/屏掌控|ledart/i.test(rawQuery) && /屏掌控|ledart/i.test(text)) score += 240;
  if (/hdplayer/i.test(rawQuery) && /hdplayer/i.test(text)) score += 240;
  if (/hdset|调屏|屏参|接收卡参数/i.test(rawQuery) && /hdset|调屏|屏参|接收卡参数/i.test(text)) score += 220;
  if (/lcd/i.test(rawQuery) && /lcd/i.test(text)) score += 160;
  if (/wifi|wi-fi|密码|热点/i.test(rawQuery) && /wifi|wi-fi|密码|热点/i.test(text)) score += 160;
  if (/回读/i.test(rawQuery) && /回读/i.test(text)) score += 160;
  if (/发送|发布|节目/i.test(rawQuery) && /发送|发布|节目/i.test(text)) score += 120;
  if (/安装/i.test(rawQuery) && /安装/i.test(text)) score += 100;
  if (/app|手机|无线/i.test(rawQuery) && /app|手机|无线|屏掌控|ledart/i.test(text)) score += 100;
  if (/全彩/i.test(rawQuery) && /全彩/i.test(text)) score += 80;
  if (/单色|单双色/i.test(rawQuery) && /单色|单双色/i.test(text)) score += 80;
  if (type === "videos" && rawHaystack.includes("英文") && !/英文|english/i.test(rawQuery)) score -= 20;
  return score;
}

function libraryEntries(type) {
  if (type === "specs") {
    return libraryDocuments
      .filter((doc) => doc.type === "specification")
      .sort((a, b) => compareLibraryByProduct(a, b));
  }
  if (type === "manuals") {
    return libraryDocuments
      .filter((doc) => doc.type === "manual")
      .sort((a, b) => compareLibraryByProduct(a, b));
  }
  if (type === "guides") {
    return operationResources
      .sort((a, b) => String(a.category).localeCompare(String(b.category), "zh-Hans-CN") || String(a.name).localeCompare(String(b.name), "zh-Hans-CN"));
  }
  if (type === "videos") {
    return allVideos().sort((a, b) => String(a.title).localeCompare(String(b.title), "zh-Hans-CN"));
  }
  return [];
}

function renderDocLibraryCard(item, index) {
  const products = (item.products || []).slice(0, 8).join("、");
  const summary = (item.summary || []).slice(0, 3);
  return `
    <article class="source-card">
      <div class="source-head">
        <strong>${index + 1}. ${escapeHtml(item.name)}</strong>
        <span>${escapeHtml(item.typeLabel || item.category || "文档")}</span>
      </div>
      ${products ? `<p class="small-line">关联型号：${escapeHtml(products)}</p>` : ""}
      ${summary.length ? summary.map((text) => `<p>${escapeHtml(text)}</p>`).join("") : `<p>已接入本地资料索引，可通过搜索框继续按型号或关键词检索。</p>`}
      <p class="local-note">此处展示本地文件夹内容摘要，不提供原文件下载。</p>
    </article>
  `;
}

function renderVideoLibraryCard(video, index) {
  return `
    <article class="source-card video-card">
      <div class="source-head">
        <strong>${index + 1}. ${escapeHtml(video.title)}</strong>
        <span>${escapeHtml(video.category || "指导视频")}</span>
      </div>
      <p>${escapeHtml(video.desc || "本地微盘指导视频，仅用于在线播放参考，不提供下载按钮。")}</p>
      <video controls controlsList="nodownload" preload="metadata" oncontextmenu="return false">
        <source src="${escapeHtml(video.src)}" type="video/mp4" />
      </video>
    </article>
  `;
}

function renderLibrary(type) {
  const labels = {
    specs: "规格书",
    manuals: "软件使用说明",
    guides: "指导文档",
    videos: "指导视频"
  };
  const label = labels[type] || "资料";
  const query = $("#searchInput").value.trim();
  let entries = libraryEntries(type);
  if (query) {
    entries = entries
      .map((item) => ({ item, score: libraryScore(item, query, type) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || libraryText(a.item).localeCompare(libraryText(b.item), "zh-Hans-CN"))
      .map((entry) => entry.item);
  }
  document.querySelectorAll("[data-library]").forEach((button) => {
    button.classList.toggle("active", button.dataset.library === type);
  });

  $("#answerPanel").innerHTML = `
    <article class="answer-card">
      <span class="answer-label">资料目录</span>
      <h2>${escapeHtml(label)}</h2>
      <p>${query ? `已按当前搜索词“${escapeHtml(query)}”筛选。` : "点击列表内容可以直接查看摘要，视频可以在线播放；文档类不开放本地原文件下载。"}</p>
    </article>
  `;
  $("#matchSummary").textContent = `${entries.length} 个${type === "videos" ? "指导视频" : "文件"}`;
  $("#sourceList").innerHTML = entries.length
    ? entries.map((item, index) => type === "videos" ? renderVideoLibraryCard(item, index) : renderDocLibraryCard(item, index)).join("")
    : `
      <article class="source-card">
        <strong>没有找到对应内容</strong>
        <p>可以清空搜索框后再点一次“${escapeHtml(label)}”，查看该分类下的全部内容。</p>
      </article>
    `;
}

function renderDefault() {
  $("#answerPanel").innerHTML = `
    <article class="answer-card empty">
      <span class="answer-label">等待查询</span>
      <h2>输入型号或问题，马上出答案</h2>
      <p>例如：A3、A3带载、VP2430带载、T16接口、HDPlayer发送节目。</p>
    </article>
  `;
  $("#matchSummary").textContent = "等待查询";
  $("#sourceList").innerHTML = "";
}

function renderNoResult(query) {
  $("#answerPanel").innerHTML = `
    <article class="answer-card warning">
      <span class="answer-label">未命中</span>
      <h2>暂时没有找到“${escapeHtml(query)}”的可靠速查答案</h2>
      <p>可以换成完整型号再搜，例如 HD-A3、HD-VP2430、HD-T16。官网没有公开资料时，请通过官网右下角联系客服查询。</p>
      <div class="official-links">
        <a href="${OFFICIAL.home}" target="_blank" rel="noreferrer">官网</a>
      </div>
    </article>
  `;
  $("#matchSummary").textContent = "0 条";
  $("#sourceList").innerHTML = "";
}

function renderProductAnswer(query, matches) {
  const intent = intentOf(query);
  const primary = matches[0].item;
  const exactModelQuery = modelTokensOf(query).length > 0;
  const usefulMatches = (exactModelQuery
    ? matches.filter((entry) => exactProductMatch(entry.item, query))
    : matches.filter((entry, index) => index === 0 || entry.score >= 400)
  ).slice(0, 5);
  const rows = quickRows(primary, intent, query);
  const title = intent === "overview"
    ? `${productName(primary)} 速查`
    : `${productName(primary)} ${intentLabel(intent)}`;

  $("#answerPanel").innerHTML = `
    <article class="answer-card">
      <span class="answer-label">直接答案</span>
      <h2>${escapeHtml(title)}</h2>
      ${renderQuickRows(rows)}
    </article>
  `;

  $("#matchSummary").textContent = `${usefulMatches.length} 条相关`;
  $("#sourceList").innerHTML = usefulMatches.map(({ item, score }) => sourceCard(item, score, query, intent)).join("");
}

function renderFuzzySuggestion(query, matches) {
  const intent = intentOf(query);
  const askedModel = displayModel(query);
  const strong = matches.filter((entry) => entry.score >= 300);
  const top = (strong.length ? strong : matches).slice(0, 4);

  $("#answerPanel").innerHTML = `
    <article class="answer-card warning">
      <span class="answer-label">型号未准确命中</span>
      <h2>没有找到准确型号“${escapeHtml(askedModel)}”</h2>
      <p>可能你要问的是下面这些相近型号。先不要把它当成“${escapeHtml(askedModel)}”的答案，只能作为相近型号参数参考。</p>
      <div class="suggestion-grid">
        ${top.map(({ item }) => `
          <div class="suggestion-item">
            <strong>${escapeHtml(productName(item))}</strong>
            <p>${escapeHtml(quickRows(item, intent, query)[0]?.text || "已有相近速查资料")}</p>
          </div>
        `).join("")}
      </div>
    </article>
  `;

  $("#matchSummary").textContent = `${top.length} 个相近型号`;
  $("#sourceList").innerHTML = top.map(({ item, score }) => sourceCard(item, score, query, intent, "相近匹配")).join("");
}

function render() {
  const query = $("#searchInput").value.trim();
  document.querySelectorAll("[data-library]").forEach((button) => {
    button.classList.remove("active");
  });
  if (!query) {
    renderDefault();
    return;
  }

  const firmwareMatches = searchIcFirmware(query);
  if (firmwareMatches.length) {
    renderIcFirmwareAnswer(query, firmwareMatches);
    return;
  }

  const operationMatches = searchOperations(query);
  if (operationMatches.length && operationMatches[0].score >= 120) {
    renderOperationAnswer(query, operationMatches);
    return;
  }

  if (isHdPlayerProgramSend(query)) {
    renderHdPlayerProgramAnswer();
    return;
  }

  if (isScreenControlQuery(query)) {
    renderScreenControlAnswer(query);
    return;
  }

  const matches = searchProducts(query);
  if (!matches.length) {
    renderNoResult(query);
    return;
  }
  if (!exactProductMatch(matches[0].item, query)) {
    renderFuzzySuggestion(query, matches);
    return;
  }
  renderProductAnswer(query, matches);
}

async function boot() {
  try {
    const [response, officialResponse, operationResponse, libraryResponse, videoResponse] = await Promise.all([
      fetch("public-quick-facts.json", { cache: "no-store" }),
      fetch("official-links.json", { cache: "no-store" }),
      fetch("operation-resources.json", { cache: "no-store" }),
      fetch("quick-index.json", { cache: "no-store" }),
      fetch("video-resources.json", { cache: "no-store" })
    ]);
    const data = await response.json();
    quickTable = Array.isArray(data.products) ? data.products.filter((item) => !isFalseProductModel(item)) : [];
    if (officialResponse.ok) {
      const officialData = await officialResponse.json();
      officialLinks = officialData.products || {};
    }
    if (operationResponse.ok) {
      const operationData = await operationResponse.json();
      operationResources = Array.isArray(operationData.documents) ? operationData.documents : [];
    }
    if (libraryResponse.ok) {
      const libraryData = await libraryResponse.json();
      libraryDocuments = Array.isArray(libraryData.documents) ? libraryData.documents : [];
    }
    if (videoResponse.ok) {
      const videoData = await videoResponse.json();
      videoResources = Array.isArray(videoData.videos) ? videoData.videos : [];
    }
    $("#indexStatus").textContent = "配单工具";
  } catch (error) {
    $("#indexStatus").textContent = "配单工具";
    quickTable = [];
  }

  $("#searchInput").addEventListener("input", render);
  $("#clearButton").addEventListener("click", () => {
    $("#searchInput").value = "";
    $("#searchInput").focus();
    render();
  });
  document.querySelectorAll("[data-query]").forEach((button) => {
    button.addEventListener("click", () => {
      $("#searchInput").value = button.dataset.query || "";
      render();
    });
  });
  document.querySelectorAll("[data-library]").forEach((button) => {
    button.addEventListener("click", () => {
      renderLibrary(button.dataset.library);
    });
  });
  render();
}

boot();

