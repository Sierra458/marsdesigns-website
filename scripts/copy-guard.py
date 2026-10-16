#!/usr/bin/env python3
"""copy-guard: scan built HTML (incl. JSON-LD/meta) + api/_voice-instructions* for banned Mars copy.
Usage: copy-guard.py PATH [PATH...]  Allowlist: .copy-guard-allow (lines 'path-glob::rule_id', Matt-reviewed)."""
import sys, re, pathlib, fnmatch
RULES = {
 "xai-partner": r"xAI partner|partnership with xAI|official xAI",
 "matt-invented-grokbots": r"(Matt|Webb).{0,40}(invent|creat|coin|nam)ed.{0,20}Grok Bots",
 "other-vendor": r"\b(OpenAI|ChatGPT|GPT-\d|Copilot|Llama|Mistral)\b",
 "xai-mention": r"\bxAI\b",  # any xAI mention in public copy; legit trademark lines go in allowlist
 "other-product-price": r"(ChatGPT|OpenAI|Copilot|Claude|Gemini|Grok)[^.<]{0,60}\$\s?\d",
 "implies-kids": r"\b(my|Matt'?s|his) (kids|children|son|daughter)\b|\bfather of\b|\bdad of\b",
}
allow = []
p = pathlib.Path(".copy-guard-allow")
if p.exists(): allow = [l.split("::") for l in p.read_text().splitlines() if "::" in l and not l.startswith("#")]
hits = 0
for root in sys.argv[1:]:
  # A file argument (api/_voice-instructions*) must be scanned; rglob only walks directories.
  path = pathlib.Path(root)
  candidates = [path] if path.is_file() else path.rglob("*")
  for f in candidates:
    if not f.is_file() or not (f.suffix in {".html",".json",".txt",".md",".ts",".js"} or "_voice-instructions" in f.name): continue
    for n, line in enumerate(f.read_text(errors="ignore").splitlines(), 1):
      for rid, rx in RULES.items():
        if re.search(rx, line, re.I if rid != "xai-mention" else 0):
          if any(fnmatch.fnmatch(str(f), g) and rid == r for g, r in allow): print(f"ALLOWED {f}:{n} [{rid}]"); continue
          print(f"::error file={f},line={n}::copy-guard [{rid}]"); hits += 1
print(f"copy-guard: {hits} hit(s)"); sys.exit(1 if hits else 0)
