#!/bin/bash

# --- Documentation Analyzer ---
# Analyzes codebase changes and summarizes what needs documentation updates.

# ANSI Colors
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}Analyzing Documentation Debt...${NC}"

# 1. Identify staged changes
CHANGES=$(git diff --cached --name-only)

if [ -z "$CHANGES" ]; then
    echo -e "${YELLOW}No staged changes detected. Analyzing last commit instead...${NC}"
    CHANGES=$(git diff --name-only HEAD~1 HEAD)
fi

# 2. Filter critical files
API_CHANGES=$(echo "$CHANGES" | grep "^src/app/api")
TYPE_CHANGES=$(echo "$CHANGES" | grep "^src/types")
DB_CHANGES=$(echo "$CHANGES" | grep "^supabase")
HOOK_CHANGES=$(echo "$CHANGES" | grep "^src/hooks")

# 3. Output Analysis for AI consumption
echo "--- ANALYSIS START ---"
if [ ! -z "$API_CHANGES" ]; then
    echo "[API_DEBT]"
    echo "$API_CHANGES"
fi

if [ ! -z "$TYPE_CHANGES" ]; then
    echo "[TYPE_DEBT]"
    echo "$TYPE_CHANGES"
fi

if [ ! -z "$DB_CHANGES" ]; then
    echo "[DB_DEBT]"
    echo "$DB_CHANGES"
fi

if [ ! -z "$HOOK_CHANGES" ]; then
    echo "[HOOK_DEBT]"
    echo "$HOOK_CHANGES"
fi
echo "--- ANALYSIS END ---"

# 4. Generate Diff Snippets for the AI
echo -e "${CYAN}Generating context for AI...${NC}"
git diff --cached src/app/api src/types supabase src/hooks | grep -E "^\+|^\-|@@" | grep -v "+++" | grep -v "\-\-\-"
