#!/usr/bin/env python3
"""copy-guard: scan built HTML (incl. JSON-LD/meta) + api/_voice-instructions* for banned Mars copy.

Usage: copy-guard.py --self-test
       copy-guard.py PATH [PATH...]

Allowlist (.copy-guard-allow), one entry per line, no wildcards:
  path :: rule :: sha256 :: reason
The sha256 is the hex digest of the normalized line (strip, collapse whitespace, UTF-8).
Comments (#) and blank lines are ignored. Malformed lines fail the scan.
"""
import contextlib
import hashlib
import io
import re
import sys
import pathlib
import tempfile

RULES = {
    "xai-partner": r"xAI partner|partnership with xAI|official xAI",
    "matt-invented-grokbots": r"(Matt|Webb).{0,40}(invent|creat|coin|nam)ed.{0,20}Grok Bots",
    "other-vendor": r"\b(OpenAI|ChatGPT|GPT-\d|Copilot|Llama|Mistral)\b",
    "xai-mention": r"\bxAI\b",  # any xAI mention in public copy; legit trademark lines go in allowlist
    "other-product-price": (
        r"\b(?:ChatGPT Plus|ChatGPT Pro|ChatGPT Team|Claude Pro|Claude Team|Claude Max"
        r"|Gemini Advanced|Gemini Ultra|Copilot Pro)\b[^.<]{0,40}\$\s?\d"
    ),
    "implies-kids": r"\b(my|Matt'?s|his) (kids|children|son|daughter)\b|\bfather of\b|\bdad of\b",
}
DENIAL_RULES = {"xai-partner", "matt-invented-grokbots"}
DENIAL_WORDS = re.compile(r"\b(?:not|no|never|without|nor)\b|\bisn['’]t\b|\baren['’]t\b", re.I)
SCAN_SUFFIXES = {".html", ".json", ".txt", ".md", ".ts", ".js", ".mjs", ".cjs"}
ALLOW_PATH = pathlib.Path(".copy-guard-allow")
WILDCARD = re.compile(r"[*?\[\]]")


def normalize_line(line):
    return re.sub(r"\s+", " ", line.strip())


def line_digest(line):
    return hashlib.sha256(normalize_line(line).encode("utf-8")).hexdigest()


def denial_before(line, start, words=5):
    window = " ".join(re.findall(r"\S+", line[:start])[-words:])
    return DENIAL_WORDS.search(window) is not None


def load_allow(path):
    entries = []
    if not path.exists():
        return entries
    for n, raw in enumerate(path.read_text().splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split(" :: ")
        if len(parts) != 4:
            print(f"::error file={path},line={n}::copy-guard malformed allowlist entry")
            sys.exit(2)
        file_path, rule, digest, reason = (part.strip() for part in parts)
        if (
            not file_path
            or not reason
            or rule not in RULES
            or not re.fullmatch(r"[0-9a-f]{64}", digest)
            or WILDCARD.search(file_path)
            or WILDCARD.search(rule)
        ):
            print(f"::error file={path},line={n}::copy-guard malformed allowlist entry")
            sys.exit(2)
        entries.append((file_path, rule, digest))
    return entries


def iter_files(root):
    path = pathlib.Path(root)
    candidates = [path] if path.is_file() else path.rglob("*")
    for f in candidates:
        if f.is_file() and (f.suffix in SCAN_SUFFIXES or "_voice-instructions" in f.name):
            yield f


def matching_rules(line):
    found = []
    for rid, rx in RULES.items():
        flags = 0 if rid == "xai-mention" else re.I
        for match in re.finditer(rx, line, flags):
            if rid in DENIAL_RULES and denial_before(line, match.start()):
                continue
            found.append(rid)
            break
    return found


def scan(roots, allow_path=ALLOW_PATH):
    allow = load_allow(allow_path)
    hits = 0
    allowed = 0
    for root in roots:
        for f in iter_files(root):
            for n, line in enumerate(f.read_text(errors="ignore").splitlines(), 1):
                for rid in matching_rules(line):
                    digest = line_digest(line)
                    if any(str(f) == path and rid == rule and digest == hashed for path, rule, hashed in allow):
                        print(f"ALLOWED {f}:{n} [{rid}]")
                        allowed += 1
                        continue
                    print(f"::error file={f},line={n}::copy-guard [{rid}]")
                    hits += 1
    print(f"copy-guard: {hits} hit(s), {allowed} allowed")
    return 1 if hits else 0


def _write(dir_path, name, text):
    path = dir_path / name
    path.write_text(text)
    return path


def _expect(dir_path, name, text, code, present=(), absent=(), allow_path=None):
    path = _write(dir_path, name, text if text.endswith("\n") else text + "\n")
    allow = allow_path if allow_path is not None else _write(dir_path, ".copy-guard-allow", "")
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        got = scan([path], allow)
    out = buf.getvalue()
    rules = set(re.findall(r"copy-guard \[([^\]]+)\]", out))
    if got != code or any(r not in rules for r in present) or any(r in rules for r in absent):
        print(f"self-test failed for {name!r}: exit {got} want {code}; rules {sorted(rules)}", file=sys.stderr)
        print(out, file=sys.stderr)
        return False
    if code == 0 and ("::error" in out or "0 hit(s)" not in out):
        print(f"self-test failed for {name!r}: clean scan was not clean\n{out}", file=sys.stderr)
        return False
    return True


def self_test():
    failures = 0
    with tempfile.TemporaryDirectory() as tmp:
        root = pathlib.Path(tmp)
        cases = [
            ("claim-partner.html", "<p>an official xAI partner</p>", 1, ("xai-partner",), ()),
            ("claim-invented.html", "<p>Matt Webb invented and named Grok Bots</p>", 1, ("matt-invented-grokbots",), ()),
            ("vendor.html", "<p>built on ChatGPT</p>", 1, ("other-vendor",), ()),
            ("copilot-price.html", "<p>Copilot costs $19</p>", 1, ("other-vendor",), ("other-product-price",)),
            ("kids.html", "<p>Matt's kids love it</p>", 1, ("implies-kids",), ()),
            ("clean.html", "<p>Mars Designs is based in Texas.</p>", 0, (), ()),
            ("claude-track.html", "<p>Claude track $129</p>", 0, (), ()),
            ("claude-pro.html", "<p>Claude Pro $20</p>", 1, ("other-product-price",), ()),
            ("denial-invented.html", "<p>Do not say Matt invented and named Grok Bots</p>", 0, (), ()),
            ("denial-partner.html", "<p>We claim no partnership with xAI</p>", 1, ("xai-mention",), ("xai-partner",)),
            ("denial-isnt.html", "<p>This isn't an official xAI partner</p>", 1, ("xai-mention",), ("xai-partner",)),
            ("far-denial.html", "<p>We are not a shop, and the work is an official xAI partner program</p>", 1, ("xai-partner",), ()),
            ("vendor.mjs", "export const note = 'built on ChatGPT'\n", 1, ("other-vendor",), ()),
            ("vendor.cjs", "module.exports = 'built on ChatGPT'\n", 1, ("other-vendor",), ()),
        ]
        for name, text, code, present, absent in cases:
            if not _expect(root, name, text, code, present, absent):
                failures += 1
        # A direct file path (not a directory) is scanned.
        if not _expect(root, "direct.html", "<p>an official xAI partner</p>", 1, ("xai-partner",)):
            failures += 1
        # Exact allow entry suppresses one normalized line and is counted.
        phrase = "<p>an official xAI partner</p>"
        allowed_line = phrase if phrase.endswith("\n") else phrase + "\n"
        # The scanner hashes each file line without the trailing newline splitlines() drops.
        line = allowed_line.splitlines()[0]
        digest = line_digest(line)
        target = _write(root, "allowed.html", allowed_line)
        allow_file = root / "good-allow"
        allow_file.write_text(f"{target} :: xai-partner :: {digest} :: fixture trademark line\n")
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            got = scan([target], allow_file)
        out = buf.getvalue()
        if got != 1 or "copy-guard [xai-partner]" in out or f"ALLOWED {target}:1 [xai-partner]" not in out or "1 allowed" not in out:
            # xai-mention on the same line is still a hit; xai-partner must be allowed.
            print(f"self-test failed for allow entry\n{out}", file=sys.stderr)
            failures += 1
        elif "copy-guard [xai-mention]" not in out:
            print(f"self-test failed: allow entry also hid xai-mention\n{out}", file=sys.stderr)
            failures += 1
        for label, contents in (
            ("wildcard", "dist/*.html :: xai-mention :: " + ("a" * 64) + " :: no globs\n"),
            ("malformed", "not a valid allow line\n"),
            ("short-hash", "index.html :: xai-mention :: abcd :: missing digest\n"),
        ):
            bad = root / label
            bad.write_text(contents)
            buf = io.StringIO()
            with contextlib.redirect_stdout(buf):
                try:
                    scan([target], bad)
                    got = 0
                except SystemExit as exc:
                    got = exc.code
            if got != 2:
                print(f"self-test failed for {label}: exit {got}\n{buf.getvalue()}", file=sys.stderr)
                failures += 1
        load_allow(ALLOW_PATH)
    if failures:
        print(f"copy-guard self-test: {failures} failure(s)", file=sys.stderr)
        return 1
    print("copy-guard self-test: ok")
    return 0


def main(argv):
    if argv[1:] == ["--self-test"]:
        return self_test()
    if len(argv) < 2:
        print("usage: copy-guard.py --self-test | PATH [PATH...]", file=sys.stderr)
        return 2
    return scan(argv[1:])


if __name__ == "__main__":
    sys.exit(main(sys.argv))
