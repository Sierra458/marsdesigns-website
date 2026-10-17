#!/usr/bin/env python3
"""copy-guard: scan built HTML (incl. JSON-LD/meta) and voice-instruction files.

A path argument may be a directory or a single file. Single files are scanned
directly (a directory walk would skip api/_voice-instructions*). Missing paths
are reported. Allowlist lines, if any, are exactly:

    path :: rule :: sha256(normalized line) :: reason

Normalized line: strip, then collapse whitespace to a single space. Wildcards
and malformed lines are rejected. The allowlist ships empty.
"""
import hashlib
import pathlib
import re
import sys

RULES = {
    "xai-partner": r"xAI partner|partnership with xAI|official xAI",
    "matt-invented-grokbots": r"(Matt|Webb).{0,40}(invent|creat|coin|nam)ed.{0,20}Grok Bots",
    "other-vendor": r"\b(OpenAI|ChatGPT|GPT-\d|Copilot|Llama|Mistral)\b",
    "xai-mention": r"\bxAI\b",  # any xAI mention in public copy; legit trademark lines go in allowlist
    "other-product-price": (
        r"\b(Claude|ChatGPT|Gemini|Copilot|OpenAI)\s+"
        r"(Pro|Plus|Advanced|Ultra|Team|Enterprise|Business|Max|Premium)\b"
        r"[^.<]{0,40}\$\s?\d"
    ),
    "implies-kids": r"\b(my|Matt'?s|his) (kids|children|son|daughter)\b|\bfather of\b|\bdad of\b",
}
SCAN_SUFFIXES = {
    ".html", ".json", ".txt", ".md", ".ts", ".js", ".mjs", ".cjs",
    ".body", ".rsc", ".meta", ".xml",
}
DENIAL_RULES = {"xai-partner", "matt-invented-grokbots"}
DENIAL_WORDS = {"not", "no", "never", "isn't", "aren't", "without", "nor"}
WORD = re.compile(r"[A-Za-z]+(?:'[A-Za-z]+)?")
ALLOW_PATH = pathlib.Path(".copy-guard-allow")


def normalize_line(line: str) -> str:
    return re.sub(r"\s+", " ", line.strip())


def line_digest(line: str) -> str:
    return hashlib.sha256(normalize_line(line).encode("utf-8")).hexdigest()


def load_allow(path: pathlib.Path) -> list[tuple[str, str, str, str]]:
    if not path.exists():
        return []
    entries: list[tuple[str, str, str, str]] = []
    for number, raw in enumerate(path.read_text().splitlines(), 1):
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        parts = [part.strip() for part in raw.split(" :: ")]
        if len(parts) != 4 or any(part == "" for part in parts):
            raise SystemExit(f"malformed allowlist {path}:{number}")
        file_path, rule, digest, reason = parts
        if any(char in file_path for char in "*?[]"):
            raise SystemExit(f"wildcard allowlist path not allowed {path}:{number}")
        if rule not in RULES:
            raise SystemExit(f"unknown allowlist rule {path}:{number}")
        if not re.fullmatch(r"[0-9a-f]{64}", digest):
            raise SystemExit(f"allowlist sha256 must be 64 hex chars {path}:{number}")
        if not reason:
            raise SystemExit(f"malformed allowlist {path}:{number}")
        entries.append((file_path, rule, digest, reason))
    return entries


def should_scan(path: pathlib.Path) -> bool:
    return path.suffix in SCAN_SUFFIXES or "_voice-instructions" in path.name


def iter_scan_files(argument: str) -> list[pathlib.Path]:
    path = pathlib.Path(argument)
    if not path.exists():
        print(f"copy-guard: skipped missing path {path}")
        return []
    if path.is_file():
        if not should_scan(path):
            print(f"copy-guard: skipped {path} (not a scanned file type)")
            return []
        return [path]
    return [item for item in path.rglob("*") if item.is_file() and should_scan(item)]


def denial_just_before(line: str, start: int) -> bool:
    prefix = line[:start]
    # Denial words in an earlier sentence do not cover this match.
    cut = max(prefix.rfind(char) for char in ".!?;|")
    if cut != -1:
        prefix = prefix[cut + 1 :]
    words = [word.lower() for word in WORD.findall(prefix)]
    return any(word in DENIAL_WORDS for word in words[-5:])


def allowed_hit(entries: list[tuple[str, str, str, str]], file_path: pathlib.Path, rule: str, line: str) -> bool:
    digest = line_digest(line)
    seen = {str(file_path), file_path.as_posix()}
    return any(file_path_text in seen and rule == rule_id and digest == expected for file_path_text, rule_id, expected, _reason in entries)


def main() -> None:
    entries = load_allow(ALLOW_PATH)
    hits = 0
    allowed = 0
    for argument in sys.argv[1:]:
        for file_path in iter_scan_files(argument):
            for number, line in enumerate(file_path.read_text(errors="ignore").splitlines(), 1):
                for rule_id, pattern in RULES.items():
                    flags = 0 if rule_id == "xai-mention" else re.I
                    matched = False
                    for match in re.finditer(pattern, line, flags):
                        if rule_id in DENIAL_RULES and denial_just_before(line, match.start()):
                            continue
                        matched = True
                        break
                    if not matched:
                        continue
                    if allowed_hit(entries, file_path, rule_id, line):
                        print(f"ALLOWED {file_path}:{number} [{rule_id}]")
                        allowed += 1
                        continue
                    print(f"::error file={file_path},line={number}::copy-guard [{rule_id}]")
                    hits += 1
    print(f"copy-guard: {allowed} allowed, {hits} hit(s)")
    sys.exit(1 if hits else 0)


if __name__ == "__main__":
    main()
