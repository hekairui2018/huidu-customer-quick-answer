import { createSiteKnowledgeAdapter } from "./knowledge-query-adapter.mjs";

const ARTIFACT_URL = new URL("./knowledge-index.site.v1.json", import.meta.url);
const MANIFEST_URL = new URL("./knowledge-index.site.manifest.v1.json", import.meta.url);
const SEARCH_LIMIT = 120;
const SOURCE_LABELS = Object.freeze({
  product_fact: "产品资料",
  product_document: "规格/说明书",
  operation_guide: "操作文档",
  guidance_video: "指导视频",
  official_evidence_link: "官网资料",
  chip_setting: "芯片设置",
  product_comparison: "产品比较"
});

let assistant = null;
let renderFrame = 0;

const $ = (selector) => document.querySelector(selector);

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeHref(value) {
  const href = String(value || "").trim();
  if (/^https?:\/\/[^\s]+$/i.test(href)) return href;
  if (/^\/demo-videos\/[A-Za-z0-9._-]+$/i.test(href)) {
    const base = document.querySelector('meta[name="xiaohuiji-video-base"]')?.content?.replace(/\/$/, "");
    if (/^https?:\/\/[^\s]+$/i.test(base || "")) return `${base}/${encodeURIComponent(href.split("/").pop())}`;
  }
  if (/^\/(?!\/)(?!.*[\s<>"'])[^\r\n]+$/u.test(href)) return href;
  return null;
}

function answerLabel(result) {
  if (result.meta.capability === "ordering_assistant") return "配单助手";
  if (result.meta.responsePath === "local_complete") return "本地资料已确认";
  if (result.meta.responsePath === "local_scope") return "还需确认一项";
  return "本地资料暂不能确认";
}

function answerClass(result) {
  return ["safe_no_answer", "local_scope"].includes(result.meta.responsePath) ? "answer-card warning" : "answer-card";
}

function uniqueLinks(result) {
  const seen = new Set();
  return (result.attachments || []).map((item) => ({ name: item.name, href: safeHref(item.sourceLocator) }))
    .filter((item) => item.href && !seen.has(item.href) && seen.add(item.href)).slice(0, 8);
}

function renderAnswer(result) {
  const links = uniqueLinks(result);
  const orderingLink = result.meta.capability === "ordering_assistant"
    ? [{ name: "打开配单工具", href: safeHref(result.meta.orderingUrl) }]
    : [];
  const actions = [...orderingLink, ...links];
  $("#answerPanel").innerHTML = `
    <article class="${answerClass(result)}">
      <span class="answer-label">${escapeHtml(answerLabel(result))}</span>
      <p class="small-line">${escapeHtml(result.answerText).replaceAll("\n", "<br>")}</p>
      ${result.nextQuestion ? `<p class="official-missing"><strong>只需补充：</strong>${escapeHtml(result.nextQuestion)}</p>` : ""}
      ${actions.length ? `<div class="official-links">${actions.map((item) => `<a href="${escapeHtml(item.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)}</a>`).join("")}</div>` : ""}
    </article>`;
}

function sourceLinks(reference) {
  const seen = new Set();
  return (reference.links || []).map((item) => ({ ...item, href: safeHref(item.href) }))
    .filter((item) => item.href && !seen.has(item.href) && seen.add(item.href)).slice(0, 5);
}

function renderSourceCard(reference) {
  const links = sourceLinks(reference);
  const video = reference.sourceKind === "guidance_video" ? links.find((item) => item.kind === "video") : null;
  return `<article class="source-card${video ? " video-card" : ""}">
    <div class="source-head">
      <strong>${escapeHtml(reference.topic || reference.id)}</strong>
      <span>${escapeHtml(SOURCE_LABELS[reference.sourceKind] || reference.sourceKind)}</span>
    </div>
    ${reference.summary ? `<p>${escapeHtml(reference.summary)}</p>` : ""}
    <div class="source-meta">
      <span>型号：${escapeHtml((reference.model || []).join("、") || "通用资料")}</span>
      <span>证据等级：${escapeHtml(reference.sourceTrust || "-")}｜仅引用，不自动发送</span>
    </div>
    ${links.length ? `<div class="official-source-links">${links.map((item) => `<a href="${escapeHtml(item.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)}</a>`).join("")}</div>` : `<p class="official-doc-note">资料标题已核验；当前公开索引没有可直接打开的原文件地址。</p>`}
    ${video ? `<video controls preload="none" src="${escapeHtml(video.href)}" aria-label="${escapeHtml(reference.topic)}"></video>` : ""}
  </article>`;
}

function renderSources(references, summary) {
  $("#sourceList").innerHTML = references.length
    ? references.map(renderSourceCard).join("")
    : `<article class="source-card"><p>没有可安全公开的精确资料卡；系统不会用相近型号补位。</p></article>`;
  $("#matchSummary").textContent = summary || `${references.length} 条本地资料`;
}

function looksLikeUnknownModel(query) {
  return /(?:HD[-_ ]?)?(?:VP|KV|K|R|W|C|D|H|A|E|U|T|B)\d{1,5}[A-Z0-9-]*|(?:FM|ICN|SM|DP|LS|RUC|RUL|TC|HX|CFD|CNS|MBI|LYD)\d{3,6}[A-Z0-9-]*/i.test(query);
}

function renderQuery(query) {
  if (!assistant) return;
  document.querySelectorAll("[data-library]").forEach((button) => button.classList.remove("active"));
  const result = assistant.query(query);
  renderAnswer(result);
  let references = result.references || [];
  if (!references.length && query && !looksLikeUnknownModel(query) && result.meta.capability === "quick_knowledge") {
    references = assistant.searchRecords(query, 12);
  }
  renderSources(references, `${references.length} 条精确/同词资料｜${result.meta.stageTimingsMs.total} ms`);
  window.__SITE_KNOWLEDGE__.lastResult = result;
  window.__SITE_KNOWLEDGE__.lastQuery = query;
}

function scheduleQuery(query) {
  cancelAnimationFrame(renderFrame);
  renderFrame = requestAnimationFrame(() => renderQuery(query));
}

function renderLibrary(name, button) {
  if (!assistant) return;
  document.querySelectorAll("[data-library]").forEach((item) => item.classList.toggle("active", item === button));
  const result = assistant.browse(name);
  renderAnswer(result);
  renderSources(result.references, `${result.references.length} 条${button.textContent.trim()}`);
  window.__SITE_KNOWLEDGE__.lastResult = result;
  window.__SITE_KNOWLEDGE__.lastQuery = `[library:${name}]`;
}

function updateUrl(query, mode = "replace") {
  const url = new URL(window.location.href);
  if (query) url.searchParams.set("q", query);
  else url.searchParams.delete("q");
  window.history[mode === "push" ? "pushState" : "replaceState"]({}, "", url);
}

function clearSearch({ updateHistory = true } = {}) {
  const input = $("#searchInput");
  input.value = "";
  if (updateHistory) updateUrl("");
  renderQuery("");
  input.focus();
}

function appendLocalMessage(role, text, result = null) {
  const box = $("#aiChatMessages");
  const item = document.createElement("div");
  item.className = `ai-message ${role}`;
  const links = result ? uniqueLinks(result) : [];
  item.innerHTML = `<strong>${role === "user" ? "我" : "小灰机"}</strong><p>${escapeHtml(text).replaceAll("\n", "<br>")}</p>${links.length ? `<div class="official-source-links">${links.map((link) => `<a href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.name)}</a>`).join("")}</div>` : ""}`;
  box.appendChild(item);
  box.scrollTop = box.scrollHeight;
}

function setAssistantOpen(open) {
  const shell = $("#aiChatShell");
  shell.classList.toggle("open", open);
  shell.setAttribute("aria-hidden", open ? "false" : "true");
  $("#aiAssistantButton").classList.toggle("chat-open", open);
  if (open) $("#aiChatInput").focus();
  else $("#aiAssistantButton").focus();
}

function setupLocalAssistant() {
  const form = $("#aiChatForm");
  const input = $("#aiChatInput");
  $("#aiAssistantButton").addEventListener("click", () => setAssistantOpen(true));
  $("#aiChatClose").addEventListener("click", () => setAssistantOpen(false));
  $("#aiChatHintClose")?.addEventListener("click", () => $("#aiChatHint").classList.add("auto-hidden"));
  $("#aiChatClear").addEventListener("click", () => {
    $("#aiChatMessages").innerHTML = `<div class="ai-message assistant"><strong>小灰机</strong><p>你好，我只按当前站点公开的本地权威资料回答。</p></div>`;
    input.focus();
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim().slice(0, SEARCH_LIMIT);
    if (!query || !assistant) return;
    appendLocalMessage("user", query);
    const result = assistant.query(query);
    appendLocalMessage(result.meta.responsePath === "safe_no_answer" ? "error" : "assistant", result.answerText, result);
    input.value = "";
    input.focus();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && $("#aiChatShell").classList.contains("open")) setAssistantOpen(false);
  });
}

function setupSearch() {
  const input = $("#searchInput");
  input.setAttribute("aria-label", "搜索产品、规格书、操作资料、视频或芯片设置");
  input.maxLength = SEARCH_LIMIT;
  input.addEventListener("input", () => {
    const query = input.value.trim().slice(0, SEARCH_LIMIT);
    updateUrl(query);
    scheduleQuery(query);
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const query = input.value.trim().slice(0, SEARCH_LIMIT);
      updateUrl(query, "push");
      renderQuery(query);
    } else if (event.key === "Escape") {
      clearSearch();
    }
  });
  $("#clearButton").addEventListener("click", () => clearSearch());
  document.querySelectorAll("[data-library]").forEach((button) => button.addEventListener("click", () => renderLibrary(button.dataset.library, button)));
  window.addEventListener("popstate", () => {
    const query = new URLSearchParams(window.location.search).get("q") || "";
    input.value = query.slice(0, SEARCH_LIMIT);
    renderQuery(input.value.trim());
  });
}

function renderBootError(error) {
  $("#answerPanel").innerHTML = `<article class="answer-card warning"><span class="answer-label">本地资料加载失败</span><p>${escapeHtml(error.message)}</p><button id="retryKnowledge" type="button">重试</button></article>`;
  $("#sourceList").innerHTML = "";
  $("#matchSummary").textContent = "未加载";
  $("#retryKnowledge")?.addEventListener("click", () => boot());
}

async function loadKnowledge() {
  const loadStarted = performance.now();
  const [artifactResponse, manifestResponse] = await Promise.all([
    fetch(ARTIFACT_URL, { cache: "default" }),
    fetch(MANIFEST_URL, { cache: "default" })
  ]);
  if (!artifactResponse.ok || !manifestResponse.ok) throw new Error("统一知识索引不可用，请确认站点构建产物完整。");
  const [artifact, manifest] = await Promise.all([artifactResponse.json(), manifestResponse.json()]);
  if (manifest.profile !== "site_quick"
      || manifest.artifact?.buildHash !== artifact.buildHash
      || manifest.artifact?.recordCount !== artifact.recordCount
      || manifest.parent?.buildHash !== artifact.parent?.buildHash) {
    throw new Error("站点索引与清单不一致，必须从 canonical artifact 重新构建。");
  }
  assistant = createSiteKnowledgeAdapter(artifact);
  return Number((performance.now() - loadStarted).toFixed(3));
}

async function boot() {
  try {
    const coldLoadMs = await loadKnowledge();
    const initialQuery = (new URLSearchParams(window.location.search).get("q") || "").slice(0, SEARCH_LIMIT);
    $("#searchInput").value = initialQuery;
    setupSearch();
    setupLocalAssistant();
    window.__SITE_KNOWLEDGE__ = { ready: true, coldLoadMs, inspect: assistant.inspect(), lastResult: null, lastQuery: null };
    renderQuery(initialQuery);
    document.documentElement.dataset.knowledgeReady = "true";
    document.documentElement.dataset.knowledgeLoadMs = String(coldLoadMs);
  } catch (error) {
    window.__SITE_KNOWLEDGE__ = { ready: false, error: error.message };
    renderBootError(error);
  }
}

window.__SITE_KNOWLEDGE__ = { ready: false };
boot();
