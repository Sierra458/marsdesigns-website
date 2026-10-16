#!/bin/bash
# Print guard-config files changed since BASE as job-summary notices.
set -euo pipefail

base="${1:-}"
files=(
  .gitleaks.toml
  .gitleaksignore
  .copy-guard-allow
  scripts/copy-guard.py
  .github/workflows/copy-guard.yml
  .github/workflows/gitleaks.yml
)

summary="${GITHUB_STEP_SUMMARY:-}"
write_summary() {
  if [ -n "$summary" ]; then
    printf '%s\n' "$1" >> "$summary"
  else
    printf '%s\n' "$1"
  fi
}

if [ -z "$base" ] || [ "$base" = "0000000000000000000000000000000000000000" ]; then
  write_summary "### Guard configuration"
  write_summary "No base commit to compare."
  exit 0
fi

changed=$(git diff --name-only "$base" HEAD -- "${files[@]}")
write_summary "### Guard configuration"
if [ -z "$changed" ]; then
  write_summary "No guard config files changed."
  exit 0
fi

write_summary "Changed guard config files:"
while IFS= read -r file; do
  [ -n "$file" ] || continue
  write_summary "- \`$file\`"
  echo "::notice title=Guard config changed::$file"
done <<< "$changed"
