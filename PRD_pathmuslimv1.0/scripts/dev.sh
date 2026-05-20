#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}PathMuslim Development Environment${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"

# Check if Supabase is running
echo -e "${YELLOW}Checking Supabase status...${NC}"
if supabase status &>/dev/null; then
    echo -e "${GREEN}✓ Supabase is running${NC}"
else
    echo -e "${YELLOW}Starting Supabase...${NC}"
    supabase start
fi

# Display Supabase credentials
echo -e "\n${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}Supabase Services:${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
supabase status

echo ""
echo -e "${YELLOW}Starting Next.js development server...${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Available at: http://localhost:3000${NC}"
echo -e "${GREEN}Studio:       http://127.0.0.1:54323${NC}"
echo ""

# Start Next.js dev server
npm run dev
