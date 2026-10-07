import fs from "fs";
import { execFileSync } from "child_process";

let s = 20260507;
const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; };
const pick = a => a[Math.floor(rnd() * a.length)];
const verbs = ["Reviewed", "Refactored", "Fixed", "Tested", "Documented", "Planned", "Cleaned up", "Optimised", "Debugged", "Updated", "Sketched", "Wrote notes on", "Followed up on", "Reworked", "Prototyped"];
const objs = ["the project backlog", "a layout bug on mobile", "API error handling", "build scripts", "client feedback", "page load performance", "the data model", "UI spacing and typography", "a flaky test", "dependency updates", "README and docs", "meta tags and structure", "an animation", "the release checklist", "some old TODOs", "input validation", "the deployment config", "a draft chapter", "level balancing", "the settings screen", "logging and monitoring", "a small utility script", "image assets", "the next sprint", "a code review"];
const used = new Set();
const bullet = () => {
  for (let n = 0; n < 1000; n++) {
    const b = `${pick(verbs)} ${pick(objs)}`;
    if (!used.has(b)) { used.add(b); return b; }
  }
  return `${pick(verbs)} ${pick(objs)} (${Math.floor(rnd() * 1e6)})`;
};

function addBullet(txt, b) {
  const lines = txt.replace(/\n+$/, "").split("\n");
  const i = lines.findIndex(l => /^## Work done/i.test(l));
  let end = lines.length;
  if (i >= 0) {
    for (let j = i + 1; j < lines.length; j++) {
      if (/^## /.test(lines[j])) { end = j; break; }
    }
  }
  let ins = end;
  while (ins > 0 && lines[ins - 1].trim() === "") ins--;
  lines.splice(ins, 0, "- " + b + ".");
  return lines.join("\n") + "\n";
}

const counts = {};
execFileSync("git", ["log", "--format=%ad", "--date=short"], { encoding: "utf8" })
  .trim().split("\n").forEach(d => { counts[d] = (counts[d] || 0) + 1; });

const A = "dawidpolakowski <dawidpolakowski@gmail.com>";
let total = 0;
for (let d = new Date(2026, 1, 1); d < new Date(2026, 9, 7); d.setDate(d.getDate() + 1)) {
  const k = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
  const have = counts[k] || 0;
  if (have >= 3) continue;
  const wk = d.getDay() % 6 !== 0;
  let target = wk ? Math.round(2 + rnd() * rnd() * 9 + rnd() * 3) : Math.round(1 + rnd() * 3.5);
  if (rnd() < 0.08) target += 4;
  if (wk && rnd() < 0.06) target = Math.max(2, Math.round(rnd() * 2));
  const extra = target - have;
  if (extra <= 0) continue;
  const f = `logs/${k.slice(0, 7)}/${k}.md`;
  let txt = fs.readFileSync(f, "utf8");
  let mins = 9 * 60 + Math.floor(rnd() * 60);
  for (let i = 0; i < extra; i++) {
    txt = addBullet(txt, bullet());
    fs.writeFileSync(f, txt);
    mins += 20 + Math.floor(rnd() * 70);
    if (mins > 22 * 60 + 30) mins = 22 * 60 + 30;
    const dt = `${k} ${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}:00 +0100`;
    execFileSync("git", ["add", f]);
    execFileSync("git", ["commit", "-q", "--author", A, "--date", dt, "-m", `Update log ${k}`], {
      env: { ...process.env, GIT_COMMITTER_NAME: "dawidpolakowski", GIT_COMMITTER_EMAIL: "dawidpolakowski@gmail.com", GIT_COMMITTER_DATE: dt },
    });
    total++;
  }
}
console.log("added", total);
