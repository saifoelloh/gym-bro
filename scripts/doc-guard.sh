#!/bin/bash

# --- Documentation Guard ---
# Checks for codebase changes that might require documentation updates.

# ANSI Colors for Pretty Output
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 1. Define Critical Codebase Paths
CRITICAL_PATHS=("src/app/api" "src/types" "supabase" "src/hooks")

# 2. Check for Staged Changes in Critical Paths
CODE_CHANGES_DETECTED=false
for path in "${CRITICAL_PATHS[@]}"; do
    if git diff --cached --name-only | grep -q "^$path"; then
        CODE_CHANGES_DETECTED=true
        break
    fi
done

# 3. Check for Staged Changes in Documentation
DOC_CHANGES_DETECTED=false
if git diff --cached --name-only | grep -q -E "^.agents/|^README.md"; then
    DOC_CHANGES_DETECTED=true
fi

# 4. Fire Warning if Sync is Missing
if [ "$CODE_CHANGES_DETECTED" = true ] && [ "$DOC_CHANGES_DETECTED" = false ]; then
    echo -e "${YELLOW}========================================================${NC}"
    echo -e "${YELLOW}⚠️  DOCUMENTATION GUARD WARNING${NC}"
    echo -e "${YELLOW}========================================================${NC}"
    echo -e "You've changed core logic in ${CYAN}API, Types, DB, or Hooks${NC},"
    echo -e "but no changes were found in ${CYAN}.agents/ (AI Tooling)${NC} or ${CYAN}README.md${NC}."
    echo -e ""
    echo -e "Consider if you need to update:"
    echo -e " - ${CYAN}.agents/rules.md${NC} (if architecture changed)"
    echo -e " - ${CYAN}.agents/workflows/${NC} (if dev flow changed)"
    echo -e " - ${CYAN}README.md${NC} (if user-facing features changed)"
    echo -e ""
    echo -e "${CYAN}💡 TIP: Run '/sync-documentation' to have the AI fix this automatically.${NC}"
    echo -e ""
    echo -e "${YELLOW}Proceed with commit anyway? (y/n)${NC}"
    
    # Read user input - handles terminal interaction during commit
    exec < /dev/tty
    read -r response
    if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo -e "${RED}Commit aborted by user.${NC}"
        exit 1
    fi
fi

exit 0
