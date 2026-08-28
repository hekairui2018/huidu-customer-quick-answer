const ALLOWED_SOURCE_KINDS = new Set([
  "product_fact", "product_document", "operation_guide", "guidance_video",
  "official_evidence_link", "chip_setting", "product_comparison"
]);

const CLAIM_LABELS = Object.freeze({
  total_load_pixels: "总带载",
  per_port_load_pixels: "单网口带载",
  max_width_pixels: "最大宽",
  max_height_pixels: "最大高",
  port_count: "输出网口"
});

function now() {
  return globalThis.performance?.now?.() ?? Date.now();
}

function unique(values) {
  return [...new Set((Array.isArray(values) ? values.flat(Infinity) : [values]).filter((value) => value !== null && value !== undefined && value !== "").map(String))];
}

function normalizeInput(value) {
  return String(value || "").normalize("NFKC")
    .replace(/[“”‘’"'`《》〈〉「」『』]/g, "")
    .replace(/[，,。.!！?？;；:：、()（）\[\]【】]/g, " ")
    .replace(/\s+/g, " ").trim();
}

function canonical(value) {
  return String(value || "").normalize("NFKC").toUpperCase()
    .replace(/^HD[-_ ]?/, "").replace(/[\s_-]+/g, "");
}

function compactQuery(value) {
  const normalized = normalizeInput(value).toUpperCase()
    .replace(/HD[-_ ]?(?=(?:VP|KV|FM|ICN|SM|DP|LS|RUC|RUL|TC|HX|CFD|CNS|MBI|LYD|K|R|W|C|D|H|A|E|U|T|B)\d)/g, "");
  return canonical(normalized).replace(/[^A-Z0-9\u3400-\u9FFF]/g, "");
}

function resultBase(started) {
  return {
    answerText: "",
    references: [],
    needMoreInfo: false,
    nextQuestion: null,
    attachments: [],
    meta: {
      product: "xiaohuiji",
      capability: "quick_knowledge",
      localDeterministic: true,
      queryMode: "exact_fact_document_lookup",
      channelProfile: "site_quick",
      responsePath: "safe_no_answer",
      codexUsed: false,
      codexAnswerUsed: false,
      codexRole: "none",
      textSource: "local_quick_formatter",
      plannerLane: "deterministic_fast_lane",
      capabilityCalls: { caseBrowse: 0, ordering: 0, quickKnowledge: 1 },
      capabilityOwnership: "xiaohuiji_internal",
      stageTimingsMs: { total: 0 }
    },
    finish() {
      this.meta.stageTimingsMs.total = Number((now() - started).toFixed(3));
      delete this.finish;
      return this;
    }
  };
}

function reference(record) {
  return {
    id: record.id,
    sourceKind: record.sourceKind,
    sourceDate: null,
    sourceLocator: record.links?.[0]?.href || null,
    model: unique([record.models, record.chips]).slice(0, 8),
    version: null,
    sourceTrust: record.sourceTrust,
    customerUse: record.customerUse,
    topic: record.topic,
    summary: record.summary,
    links: (record.links || []).map((item) => ({ ...item }))
  };
}

function attach(result, records, limit = 5) {
  const selected = records.slice(0, limit);
  result.references = selected.map(reference);
  result.attachments = selected.flatMap((record) => (record.links || []).map((link, index) => ({
    id: `${record.id}-LINK-${index + 1}`,
    name: link.name,
    sourceLocator: link.href,
    send: false
  }))).slice(0, limit);
  return selected;
}

function containsAlias(haystack, needle) {
  let start = haystack.indexOf(needle);
  while (start >= 0) {
    const before = haystack[start - 1] || "";
    const after = haystack[start + needle.length] || "";
    if (!/[A-Z0-9]/.test(before) && !/[A-Z0-9]/.test(after)) return start;
    start = haystack.indexOf(needle, start + 1);
  }
  return -1;
}

function identitySuffix(identity) {
  return identity.match(/^(?:VP|KV|K|R|W|C|D|H|A|E|U|T|B)(\d{1,5}[A-Z0-9-]*)$/)?.[1]
    || identity.match(/^(?:FM|ICN|SM|DP|LS|RUC|RUL|TC|HX|CFD|CNS|MBI|LYD)(\d{3,6}[A-Z0-9-]*)$/)?.[1]
    || null;
}

function entitiesForAlias(key, ids, recordsById) {
  const values = [];
  for (const id of ids || []) {
    const record = recordsById.get(id);
    if (!record) continue;
    for (const value of unique([record.models, record.chips, record.aliases])) {
      const identity = canonical(value);
      if (identity === key || identitySuffix(identity) === key) values.push(identity);
    }
  }
  return unique(values).sort();
}

function extractEntities(text, artifact, recordsById) {
  const compact = compactQuery(text);
  const matches = [];
  const keys = Object.keys(artifact.indexes.aliases).sort((left, right) => right.length - left.length || left.localeCompare(right));
  for (const key of keys) {
    if (key.length < 2) continue;
    const index = containsAlias(compact, key);
    if (index < 0) continue;
    const end = index + key.length;
    if (matches.some((match) => index >= match.index && end <= match.end)) continue;
    const identities = entitiesForAlias(key, artifact.indexes.aliases[key], recordsById);
    matches.push({ key, index, end, identities });
  }
  const confirmed = unique(matches.flatMap((match) => match.identities.length === 1 ? match.identities : [])).sort((left, right) => compact.indexOf(left) - compact.indexOf(right));
  const ambiguous = matches.filter((match) => match.identities.length > 1);
  const rawPrefixed = unique(compact.match(/(?:VP|KV|K|R|W|C|D|H|A|E|U|T|B)\d{1,5}[A-Z0-9-]*|(?:FM|ICN|SM|DP|LS|RUC|RUL|TC|HX|CFD|CNS|MBI|LYD)\d{3,6}[A-Z0-9-]*/g) || []);
  const unknown = rawPrefixed.filter((token) => !confirmed.includes(token));
  return { confirmed, ambiguous, unknown };
}

function exactMatch(record, entities) {
  const identities = new Set(unique([record.models, record.aliases, record.chips]).map(canonical));
  return entities.every((entity) => identities.has(canonical(entity)));
}

function trusted(record) {
  return ["A", "B"].includes(record.sourceTrust);
}

function exactRecords(records, entities, kinds) {
  return records.filter((record) => kinds.has(record.sourceKind) && trusted(record) && exactMatch(record, entities));
}

function publicResultForRecords(result, records, answerText, responsePath = "local_complete") {
  attach(result, records);
  result.answerText = answerText;
  result.meta.responsePath = responsePath;
  return result.finish();
}

function ambiguousBareNumber(result, artifact, entities, text) {
  if (entities.confirmed.length) return null;
  const match = normalizeInput(text).match(/(?:^|\s)(\d{3,5})(?=\s|参数|资料|规格|$)/);
  if (!match) return null;
  const candidates = artifact.indexes.numericProducts[match[1]] || [];
  if (candidates.length < 2) return null;
  result.answerText = `${match[1]} 不能唯一确定产品，本地索引中对应多个完整型号：${candidates.slice(0, 12).join("、")}。`;
  result.needMoreInfo = true;
  result.nextQuestion = "请提供铭牌上的完整型号（含VP、KV和字母后缀）。";
  result.meta.responsePath = "local_scope";
  result.meta.evidenceGate = { accepted: 0, reason: "entity_ambiguous" };
  return result.finish();
}

function documentLookup(result, records, entities, text) {
  if (!/(?:规格书|说明书|手册|产品资料)/i.test(text) || !entities.length) return null;
  const wantsSpecification = /规格书/i.test(text);
  const wantsManual = /说明书|手册/i.test(text);
  const candidates = exactRecords(records, entities, new Set(["product_document", "operation_guide", "official_evidence_link"]))
    .filter((record) => !wantsSpecification || record.quick?.documentKind === "specification")
    .filter((record) => !wantsManual || record.quick?.documentKind === "manual")
    .sort((left, right) => `${left.sourceKind}:${left.topic}`.localeCompare(`${right.sourceKind}:${right.topic}`));
  if (!candidates.length) return null;
  const selected = attach(result, candidates);
  result.answerText = `已找到 ${entities.join("、")} 的${wantsSpecification ? "规格书" : wantsManual ? "说明书/手册" : "产品资料"}：\n${selected.map((record, index) => `${index + 1}. ${record.topic}`).join("\n")}\n附件状态：仅引用，未发送。`;
  result.meta.responsePath = "local_complete";
  result.meta.attachmentDelivery = "reference_only";
  return result.finish();
}

function significantOperationToken(text) {
  const upper = normalizeInput(text).toUpperCase();
  return ["HDPLAYER", "HDSET", "屏掌控", "LEDART", "云平台", "节目", "软件"].find((token) => upper.includes(token)) || null;
}

function operationLookup(result, records, text) {
  if (!/(?:操作文档|指导文档|操作视频|指导视频)/i.test(text)) return null;
  const wantsVideo = /(?:操作|指导)?视频/i.test(text);
  const token = significantOperationToken(text);
  const kind = wantsVideo ? "guidance_video" : "operation_guide";
  const candidates = records.filter((record) => record.sourceKind === kind && trusted(record)
    && (!token || record.searchText.includes(token)));
  if (!candidates.length) return null;
  const selected = attach(result, candidates);
  result.answerText = `找到 ${token || "相关"} 的${wantsVideo ? "操作视频" : "操作文档"}资料：\n${selected.map((record, index) => `${index + 1}. ${record.topic}`).join("\n")}\n附件仅作引用，本核心不会自动发送文件。`;
  result.meta.responsePath = "local_complete";
  return result.finish();
}

function claimTypes(text) {
  const normalized = normalizeInput(text);
  if (/(?:每(?:个|路)?网口|单(?:个|路)网口|per[-\s]?port)/i.test(normalized)) return ["per_port_load_pixels"];
  if (/(?:最宽|最大宽|水平最大)/i.test(normalized)) return ["max_width_pixels"];
  if (/(?:最高|最大高|垂直最大)/i.test(normalized)) return ["max_height_pixels"];
  if (/(?:网口数|多少(?:个|路)?网口|几个网口)/i.test(normalized)) return ["port_count"];
  if (/(?:最大带载|带载范围|总带载|最大控制|带载)/i.test(normalized)) return ["total_load_pixels", "max_width_pixels", "max_height_pixels"];
  return [];
}

function pixelValue(value) {
  if (value >= 10000 && value % 10000 === 0) return `${value / 10000}万像素`;
  if (value >= 10000) return `${Number((value / 10000).toFixed(2))}万像素`;
  return `${value}像素`;
}

function formatClaim(type, value) {
  return `${CLAIM_LABELS[type]}${type === "port_count" ? `${value}个` : pixelValue(value)}`;
}

function parameterLookup(result, records, entities, text) {
  if (!/(?:参数|最大带载|带载|分辨率|接口)/i.test(text) || !entities.length) return null;
  const candidates = exactRecords(records, entities, new Set(["product_fact"]));
  if (!candidates.length) return null;
  const requested = claimTypes(text);
  const conflict = candidates.some((record) => requested.some((type) => record.quick?.conflictClaimTypes?.includes(type)));
  if (requested.length && conflict) {
    attach(result, candidates, 3);
    result.answerText = `${entities.join("、")} 的${/带载/i.test(text) ? "最大带载" : /分辨率/i.test(text) ? "分辨率" : "接口"}资料存在同字段冲突，当前本地知识库不报未经统一的数值。`;
    result.needMoreInfo = true;
    result.nextQuestion = "请确认要以哪一版规格书或硬件版本为准。";
    result.meta.responsePath = "safe_no_answer";
    result.meta.evidenceGate = { accepted: 0, reasons: ["claim_conflict"] };
    return result.finish();
  }
  const facts = requested.flatMap((type) => unique(candidates.flatMap((record) => record.quick?.claimFacts?.[type]?.values || [])).map((value) => ({ type, value: Number(value) })));
  if (facts.length) {
    attach(result, candidates, 3);
    result.answerText = `${entities.join("、")} 的已核参数：${facts.map(({ type, value }) => formatClaim(type, value)).join("；")}。`;
    result.meta.responsePath = "local_complete";
    result.meta.evidenceGate = { accepted: candidates.length, reasons: [], claimTypes: requested };
    return result.finish();
  }
  attach(result, candidates, 3);
  result.answerText = `已找到 ${entities.join("、")} 的产品资料；请指定要查带载、分辨率、接口或功能中的哪一项。`;
  result.needMoreInfo = true;
  result.nextQuestion = "要查带载、分辨率、接口还是功能？";
  result.meta.responsePath = "local_scope";
  return result.finish();
}

function chipSettingLookup(result, records, entities, text) {
  if (!/(?:智能设置|设置选什么|选什么)/i.test(text) || !entities.length) return null;
  const candidates = exactRecords(records, entities, new Set(["chip_setting"]));
  if (!candidates.length) return null;
  const selected = attach(result, candidates, 3);
  const mappings = unique(selected.map((record) => record.quick?.setting).filter(Boolean));
  result.answerText = `${entities.join("、")} 的本地智能设置映射：${mappings.join("；")}。这是设置类别映射，不是故障修复说明，也不代表固件适用结论。`;
  result.meta.responsePath = "local_complete";
  result.meta.mappingType = "setting_only_not_fix";
  return result.finish();
}

function firmwareCategoryLookup(result, records, entities, text) {
  if (!/固件/i.test(text) || !entities.length) return null;
  const candidates = exactRecords(records, entities, new Set(["chip_setting"]));
  if (!candidates.length) return null;
  const categories = unique(candidates.map((record) => record.quick?.firmwareCategory).filter(Boolean));
  attach(result, candidates, 3);
  result.answerText = categories.length
    ? `${entities.join("、")} 的本地资料只确认固件类别映射：${categories.join("；")}。这不是可刷写文件或明确版本修复，站点不提供升级动作。`
    : `${entities.join("、")} 目前只能确认芯片设置映射，不能唯一确定设备固件。`;
  result.needMoreInfo = true;
  result.nextQuestion = "请补充完整设备型号。";
  result.meta.responsePath = "local_scope";
  result.meta.evidenceGate = { accepted: 0, reason: "firmware_device_identity_missing" };
  return result.finish();
}

function bestClaim(claims, dimension) {
  return [...(claims || [])].sort((left, right) => {
    const score = (value) => dimension === "ports"
      ? (/HDMI/i.test(value) ? 20 : 0) + (/DVI/i.test(value) ? 10 : 0) + (/(?:输入|input)/i.test(value) ? 5 : 0) - (/(?:three-in-one|三合一)/i.test(value) ? 20 : 0)
      : (/(?:支持|support)/i.test(value) ? 15 : 0) + (/(?:USB|信号|场景|播放)/i.test(value) ? 8 : 0) - (/(?:diagram|连接图)/i.test(value) ? 20 : 0);
    return score(right) - score(left) || left.localeCompare(right);
  })[0];
}

function comparisonLookup(result, records, entities, text) {
  if (!/(?:区别|对比|比较)/i.test(text) || entities.length !== 2) return null;
  const [left, right] = entities;
  const leftRecord = records.find((record) => record.sourceKind === "product_fact" && exactMatch(record, [left]) && trusted(record));
  const rightRecord = records.find((record) => record.sourceKind === "product_fact" && exactMatch(record, [right]) && trusted(record));
  if (!leftRecord || !rightRecord) return null;
  const dimensions = ["ports", "operation", "resolution", "load"].filter((dimension) =>
    leftRecord.quick?.claims?.[dimension]?.length && rightRecord.quick?.claims?.[dimension]?.length
    && !leftRecord.quick.conflictDimensions.includes(dimension) && !rightRecord.quick.conflictDimensions.includes(dimension));
  if (!dimensions.length) return null;
  const selected = dimensions.slice(0, 2);
  attach(result, [leftRecord, rightRecord], 2);
  result.answerText = `仅比较双方都有证据且未触发冲突门禁的同维度：\n${selected.map((dimension) => `${dimension}：${left}＝${bestClaim(leftRecord.quick.claims[dimension], dimension)}；${right}＝${bestClaim(rightRecord.quick.claims[dimension], dimension)}`).join("\n")}`;
  result.meta.responsePath = "local_complete";
  result.meta.comparisonDimensions = selected;
  return result.finish();
}

function genericExactLookup(result, records, entities) {
  if (!entities.length) return null;
  const candidates = exactRecords(records, entities, new Set(["product_fact", "product_document", "official_evidence_link", "chip_setting"]));
  if (!candidates.length) return null;
  const selected = attach(result, candidates, 5);
  result.answerText = `已找到 ${entities.join("、")} 的本地权威资料，共 ${candidates.length} 条。请继续输入“参数、规格书、智能设置、操作文档”等具体内容。`;
  result.needMoreInfo = true;
  result.nextQuestion = "要查哪一项资料？";
  result.meta.responsePath = "local_scope";
  result.meta.searchResultIds = selected.map((record) => record.id);
  return result.finish();
}

function recordScore(record, query) {
  const compact = compactQuery(query);
  if (!compact) return 0;
  const identities = unique([record.models, record.aliases, record.chips]);
  if (identities.some((value) => canonical(value) === compact)) return 1000;
  if (record.topic.toUpperCase().includes(normalizeInput(query).toUpperCase())) return 700;
  if (record.searchText.includes(normalizeInput(query).toUpperCase())) return 400;
  const pieces = normalizeInput(query).toUpperCase().split(/\s+/).filter((value) => value.length > 1);
  const hits = pieces.filter((piece) => record.searchText.includes(piece)).length;
  return hits === pieces.length && hits ? 200 + hits * 10 : 0;
}

export function createSiteKnowledgeAdapter(artifact) {
  if (artifact?.schemaVersion !== "knowledge-index.site.v1" || artifact?.profile !== "site_quick") throw new Error("Unsupported site knowledge artifact");
  if (artifact.policy?.aiAnswerReachable !== false || artifact.policy?.aftersalesRecords !== 0 || artifact.policy?.internalVersionFeatures !== 0) throw new Error("Unsafe site knowledge policy");
  if (artifact.records.some((record) => !ALLOWED_SOURCE_KINDS.has(record.sourceKind))) throw new Error("Forbidden site source kind");
  const records = Object.freeze(artifact.records.map((record) => Object.freeze(record)));
  const recordsById = new Map(records.map((record) => [record.id, record]));
  const library = (name, limit = 80) => (artifact.indexes.libraries[name] || []).map((id) => recordsById.get(id)).filter(Boolean).slice(0, limit);

  return Object.freeze({
    query(text) {
      const started = now();
      const result = resultBase(started);
      const input = normalizeInput(text).slice(0, 120);
      if (!input) {
        result.answerText = "输入完整型号、资料名称或操作关键词，即可在本地权威资料中快速查询。";
        result.meta.responsePath = "local_scope";
        return result.finish();
      }
      if (/(?:配单|怎么配|如何配|几张接收卡|多少张接收卡|BOM|物料清单|拓扑)/i.test(input)) {
        result.answerText = "配单由小灰机的配单助手处理，请使用页面顶部“配单工具”入口。";
        result.meta.capability = "ordering_assistant";
        result.meta.responsePath = "external_capability";
        result.meta.capabilityCalls = { caseBrowse: 0, ordering: 1, quickKnowledge: 0 };
        result.meta.orderingUrl = "/site/LED配单图工具.html";
        return result.finish();
      }
      if (/(?:历史案例|现场案例|以前遇到过|售后案例)/i.test(input)) {
        result.answerText = "当前速查站不公开售后案例数据；该问题属于小灰机内部售后能力。";
        result.meta.capability = "aftersales";
        result.meta.responsePath = "safe_no_answer";
        result.meta.capabilityCalls = { caseBrowse: 0, ordering: 0, quickKnowledge: 0 };
        return result.finish();
      }
      if (/(?:版本说明|版本功能|哪一版|哪个版本).*(?:修复|功能)?|(?:修复了什么)/i.test(input)) {
        result.answerText = "当前速查站不开放内部版本说明或修复记录。";
        result.meta.responsePath = "safe_no_answer";
        result.meta.profileGate = { allowed: false, reason: "source_kind_not_allowed", sourceKind: "version_feature" };
        return result.finish();
      }
      const entities = extractEntities(input, artifact, recordsById);
      const ambiguous = ambiguousBareNumber(result, artifact, entities, input);
      if (ambiguous) return ambiguous;
      for (const handler of [
        () => operationLookup(result, records, input),
        () => documentLookup(result, records, entities.confirmed, input),
        () => comparisonLookup(result, records, entities.confirmed, input),
        () => chipSettingLookup(result, records, entities.confirmed, input),
        () => firmwareCategoryLookup(result, records, entities.confirmed, input),
        () => parameterLookup(result, records, entities.confirmed, input),
        () => genericExactLookup(result, records, entities.confirmed)
      ]) {
        const response = handler();
        if (response) return response;
      }
      const entity = unique([entities.confirmed, entities.unknown]).join("、");
      result.answerText = entity
        ? `当前本地权威资料中未找到与 ${entity} 精确绑定且满足证据门禁的答案。`
        : "当前问题还不能唯一绑定到本地资料实体。";
      result.needMoreInfo = !entity;
      result.nextQuestion = !entity ? "请补充完整产品、设备或芯片型号。" : null;
      result.meta.evidenceGate = { accepted: 0, reason: "no_exact_trusted_evidence" };
      return result.finish();
    },
    browse(name, limit = 80) {
      const started = now();
      const result = resultBase(started);
      const labels = { specs: "规格书", manuals: "软件使用说明", guides: "指导文档", videos: "指导视频" };
      if (!labels[name]) {
        result.answerText = "未知资料分类。";
        return result.finish();
      }
      const selected = library(name, limit);
      result.references = selected.map(reference);
      result.attachments = selected.flatMap((record) => (record.links || []).map((link, index) => ({ id: `${record.id}-LINK-${index + 1}`, name: link.name, sourceLocator: link.href, send: false })));
      result.answerText = `已加载 ${selected.length} 条${labels[name]}资料。`;
      result.meta.responsePath = "local_complete";
      result.meta.library = name;
      return result.finish();
    },
    searchRecords(text, limit = 24) {
      return records.map((record) => ({ record, score: recordScore(record, text) }))
        .filter((item) => item.score > 0)
        .sort((left, right) => right.score - left.score || left.record.id.localeCompare(right.record.id))
        .slice(0, limit).map((item) => reference(item.record));
    },
    getRecord(id) {
      const record = recordsById.get(id);
      return record ? reference(record) : null;
    },
    inspect() {
      return {
        product: "xiaohuiji",
        capability: "quick_knowledge",
        profile: artifact.profile,
        recordCount: records.length,
        buildHash: artifact.buildHash,
        parentBuildHash: artifact.parent.buildHash,
        localDeterministic: true,
        aiAnswerReachable: false
      };
    }
  });
}

export { canonical, normalizeInput };
