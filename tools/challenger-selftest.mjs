#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pagePath = path.join(root, "challenger", "index.html");
const cssPath = path.join(root, "challenger", "challenger.css");
const scriptPath = path.join(root, "challenger", "challenger.js");
const contractPath = path.join(root, "claims.json");
const failures = [];

const requireFile = (file) => {
  if (!fs.existsSync(file)) failures.push(`missing required file: ${path.relative(root, file)}`);
};

[pagePath, cssPath, scriptPath, contractPath].forEach(requireFile);

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL  ${failure}`));
  process.exit(1);
}

const html = fs.readFileSync(pagePath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");
const script = fs.readFileSync(scriptPath, "utf8");
const contract = JSON.parse(fs.readFileSync(contractPath, "utf8"));
const claimIds = new Set(contract.claims.map((claim) => claim.id));

const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

assert((html.match(/<h1\b/gi) || []).length === 1, "challenger must contain exactly one h1");
assert(/<meta\s+name="robots"\s+content="noindex, nofollow">/i.test(html), "challenger must remain noindex until promotion");
assert(html.includes("tel:+18888147785"), "live demo phone link is missing");
assert(html.includes("+1 (888) 814-7785"), "visible live demo number is missing");
assert(html.includes("Demo calls are logged and transcribed"), "demo recording/transcription disclosure is missing");
assert(html.includes("This is a demo, not a customer result"), "demo result boundary is missing");
assert(html.includes("social and WhatsApp configurations vary by deployment"), "omnichannel deployment boundary is missing");
assert(html.includes("policy-compliant disputes for false or prohibited content"), "review-remediation boundary is missing");
assert(html.includes("Client revenue and ROAS are not"), "revenue and ROAS boundary is missing");
assert(html.includes("jesusalexelamaro@gmail.com"), "canonical contact email is missing");
assert(!/hello@alexamaro\.me/i.test(html), "unverified contact email is present");
assert(!/(delete|erase|remove)\s+(bad|negative|legitimate)\s+reviews?/i.test(html), "unethical review-removal language is present");
assert(!/<(?:script|img|source|link)\b[^>]+(?:src|srcset|href)="https?:\/\//i.test(html), "challenger loads an off-origin page resource");
assert(!/url\(\s*["']?https?:\/\//i.test(css), "challenger CSS loads an off-origin resource");
assert(!/data:image\/svg\+xml/i.test(css), "challenger uses a handcrafted inline SVG asset");
assert(script.includes("prefers-reduced-motion"), "motion preference handling is missing");
assert(script.includes("ArrowRight") && script.includes("ArrowLeft"), "tab keyboard navigation is missing");
assert(!/<[^>]+role="tabpanel"[^>]+hidden/i.test(html), "tabpanel content is hidden before JavaScript enhancement");

const luminance = (hex) => {
  const channels = hex.match(/[a-f\d]{2}/gi).map((value) => Number.parseInt(value, 16) / 255);
  const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
};
const contrast = (foreground, background) => {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) / (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
};

for (const [foreground, background, label] of [
  ["f3eee5", "070706", "primary dark text"],
  ["aaa49a", "070706", "muted dark text"],
  ["837f78", "171614", "quiet panel text"],
  ["67625b", "f2eee5", "muted paper text"],
  ["6d38f0", "f2eee5", "purple paper display"],
  ["ffffff", "6d38f0", "white purple button"]
]) {
  assert(contrast(foreground, background) >= 4.5, `${label} fails 4.5:1 contrast`);
}

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
assert(duplicateIds.length === 0, `duplicate ids: ${duplicateIds.join(", ")}`);

for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  assert(ids.includes(match[1]), `internal link target does not exist: #${match[1]}`);
}

for (const match of html.matchAll(/data-claim-id="([^"]+)"/g)) {
  assert(claimIds.has(match[1]), `unknown claim id: ${match[1]}`);
}

const localRefs = [];
for (const match of html.matchAll(/\b(?:src|href|data-full)="([^"#?]+)"/g)) {
  const ref = match[1];
  if (/^(?:https?:|mailto:|tel:)/i.test(ref)) continue;
  localRefs.push(ref);
}
for (const match of html.matchAll(/\bsrcset="([^"]+)"/g)) {
  for (const candidate of match[1].split(",")) localRefs.push(candidate.trim().split(/\s+/)[0]);
}
for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
  const ref = match[1];
  if (!ref.startsWith("data:")) localRefs.push(ref);
}

for (const ref of localRefs) {
  const resolved = path.resolve(path.dirname(pagePath), ref);
  assert(fs.existsSync(resolved), `local resource does not exist: ${ref}`);
}

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL  ${failure}`));
  console.error(`challenger-selftest: ${failures.length} failure(s)`);
  process.exit(1);
}

console.log(`challenger-selftest: pass — ${claimIds.size} claims recognized, ${localRefs.length} local resources resolved.`);
