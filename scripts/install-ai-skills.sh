#!/usr/bin/env bash
#
# Instalează în repo-ul curent:
#   - cele 7 skill-uri UI/UX Pro Max (ui-ux-pro-max, ui-styling, design-system,
#     design, brand, slides, banner-design) în .claude/skills/
#   - configul Magic MCP (21st.dev) în .mcp.json
#
# Rulează din rădăcina unui repo git:  bash install-ai-skills.sh
#
set -euo pipefail

REPO_URL="https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "→ Clonez sursa skill-urilor..."
git clone --depth 1 "$REPO_URL" "$TMP/src" >/dev/null 2>&1

echo "→ Copiez skill-urile în .claude/skills/ ..."
mkdir -p .claude/skills
cp -r "$TMP/src/.claude/skills/." .claude/skills/

# Skill-ul principal folosește ${CLAUDE_PLUGIN_ROOT} (mod plugin de marketplace).
# Îl comitem direct în repo, deci rescriem la cale relativă la proiect.
if [ -f .claude/skills/ui-ux-pro-max/SKILL.md ]; then
  sed -i 's|\${CLAUDE_PLUGIN_ROOT}/|./|g' .claude/skills/ui-ux-pro-max/SKILL.md
fi

echo "→ Scriu .mcp.json (Magic MCP; cheia se citește din env MAGIC_API_KEY) ..."
if [ -f .mcp.json ]; then
  echo "  .mcp.json există deja — îl las neatins (verifică-l manual)."
else
  cat > .mcp.json <<'JSON'
{
  "mcpServers": {
    "magic": {
      "command": "npx",
      "args": ["-y", "@21st-dev/magic@latest", "API_KEY=${MAGIC_API_KEY}"]
    }
  }
}
JSON
fi

echo
echo "✓ Gata. Skill-uri instalate:"
ls -1 .claude/skills/
echo
echo "Următorii pași:"
echo "  1. git add .claude .mcp.json && git commit -m 'Add UI/UX skills + Magic MCP'"
echo "  2. Pune MAGIC_API_KEY în Environment variables (Settings -> Code -> environment)."
echo "  3. Pornește o sesiune nouă; verifică cu /mcp (serverul 'magic' = connected)."
