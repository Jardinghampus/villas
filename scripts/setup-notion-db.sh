#!/bin/bash
# ============================================================
# DUBAIVILLE - NOTION DATABASE SETUP
# ============================================================
# Quick setup script for creating Notion databases
#
# PREREQUISITES:
#   1. Create a Notion Integration at https://www.notion.so/my-integrations
#   2. Create a page in Notion where databases will be created
#   3. Share that page with your integration (Click "..." -> "Add connections")
#   4. Get the page ID from the URL
#
# USAGE:
#   ./scripts/setup-notion-db.sh
#
# Or with environment variables:
#   NOTION_API_KEY=secret_xxx NOTION_PARENT_PAGE=abc123 ./scripts/setup-notion-db.sh
# ============================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║     DUBAIVILLE - NOTION DATABASE SETUP                 ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check for API Key
if [ -z "$NOTION_API_KEY" ]; then
    echo -e "${YELLOW}Enter your Notion API Key (from https://www.notion.so/my-integrations):${NC}"
    read -p "> " NOTION_API_KEY
fi

# Check for Parent Page ID
if [ -z "$NOTION_PARENT_PAGE" ]; then
    echo ""
    echo -e "${YELLOW}Enter the Parent Page ID where databases will be created:${NC}"
    echo -e "(Found in URL: notion.so/Your-Page-${GREEN}abc123def456...${NC})"
    read -p "> " NOTION_PARENT_PAGE
fi

# Remove dashes from page ID if present
NOTION_PARENT_PAGE=$(echo "$NOTION_PARENT_PAGE" | tr -d '-')

# Ask about sample data
echo ""
echo -e "${YELLOW}Do you want to add sample data? (y/n)${NC}"
read -p "> " ADD_SAMPLE
SEED_FLAG=""
if [[ "$ADD_SAMPLE" =~ ^[Yy]$ ]]; then
    SEED_FLAG="--seed"
fi

# Run the TypeScript setup script
echo ""
echo -e "${BLUE}Running database setup...${NC}"
echo ""

export NOTION_API_KEY
export NOTION_PARENT_PAGE

npx ts-node scripts/setup-notion-db.ts $SEED_FLAG

echo ""
echo -e "${GREEN}Done! Check the output above for your .env.local values.${NC}"
