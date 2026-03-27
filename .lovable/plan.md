

# Connect Pinterest & View Your Boards

## Overview
Add a "Connect Pinterest" button and "Your Pinterest Boards" section below the existing "Inspired by Pinterest" section. Uses mock data now, structured for real Pinterest API v5 later.

## Components to Create

### 1. `src/components/ConnectPinterestButton.tsx`
- Shows only when user is authenticated (`useAuth()`)
- Checks `localStorage` for `pinterest_connected` state
- Not connected: red "Connect Pinterest" button → sets mock token in localStorage, updates state
- Connected: green "Pinterest Connected" badge with disconnect option
- Comments marking where real OAuth redirect would go

### 2. `src/components/UserPinterestBoards.tsx`
- Shows only when authenticated AND Pinterest connected
- Displays mock boards in a responsive grid (4 cols desktop, 2 tablet, 1 mobile)
- Each board card: cover image, board name, pin count
- Click a board → opens `PinterestBoardModal`
- Mock data: 6 boards with fashion themes using Unsplash images
- Comments for `fetchBoards()` API integration point

### 3. `src/components/PinterestBoardModal.tsx`
- Dialog modal showing pins from a selected board
- Masonry layout of mock pins
- Each pin: image + "Shop Similar" button → navigates to `/search?q={keyword}`
- Comments for `fetchPins(boardId)` API integration point

### 4. `src/data/pinterestMockData.ts`
- Mock boards array: `{ id, name, coverImage, pinCount, pins[] }`
- Mock pins: `{ id, image, description, link }`
- 6 boards, 4-6 pins each

## Files to Modify

### 5. `src/components/PinterestInspiredSection.tsx`
- Add `ConnectPinterestButton` in the header area (right-aligned)
- Add `UserPinterestBoards` section below the existing masonry grid

## Data Flow
```text
localStorage("pinterest_connected") → ConnectPinterestButton state
                                    → UserPinterestBoards visibility
Board click → PinterestBoardModal(boardId) → show mock pins
Pin "Shop Similar" → /search?q=keyword
```

## Files Summary
- **Create**: `src/data/pinterestMockData.ts`, `src/components/ConnectPinterestButton.tsx`, `src/components/UserPinterestBoards.tsx`, `src/components/PinterestBoardModal.tsx`
- **Modify**: `src/components/PinterestInspiredSection.tsx`

