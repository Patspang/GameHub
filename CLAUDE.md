# Letter Jager - Multi-Game Platform for Kids

Kid-friendly web game platform (ages 5-7) built with React + Vite + Tailwind, deployed to GitHub Pages.

## Project Context

**Goal:** Educational Dutch-language games starting with "Letter Jager" (Pac-Man variant where kids collect letters to spell words). Architecture supports easy addition of Snake, Tetris, etc.

**Target Users:** 5 & 7 year old children, non-English readers  
**Language:** 100% Dutch UI (code/comments in English)  
**Hosting:** GitHub Pages (static, free)

## Reference Documents

📋 **Master Spec:** `LETTER_JAGER_MASTER_SPEC.md` - Complete project specification with:
- Multi-agent orchestration plan
- Detailed product requirements & user stories
- Design system & UI components
- Technical architecture
- Implementation guidelines
- QA test plan

**IMPORTANT:** Read the master spec FIRST before starting any work. It contains detailed instructions for each phase.

## Tech Stack

```
Framework: React 18+ with Vite
Styling: Tailwind CSS (design system defined in master spec)
State: React Context API + localStorage
Deployment: GitHub Actions → GitHub Pages
```

## Architecture

```
Home Page → Game Selection → Difficulty → Play → Home
          (Grid of tiles)  (3 levels)   (Game) (Back button)
```

## Development Workflow

### Phase-Based Development

Work in **sequential phases with validation checkpoints**:

**Phase 1: Foundation**
- Setup: Vite + React + Tailwind
- File structure (see master spec)
- Design system implementation
- **CHECKPOINT:** Show color palette, typography working

**Phase 2: Home & Navigation**  
- HomePage with game grid
- GameTile component (active + coming soon states)
- Navigation flow (home ↔ menu ↔ game)
- **CHECKPOINT:** Full navigation working, ask for visual review

**Phase 3: Letter Jager Core**
- Game menu (difficulty selection)
- Basic maze rendering
- Player movement (arrow keys)
- **CHECKPOINT:** Player can move in maze, ask before proceeding

**Phase 4: Game Mechanics**
- Letter placement & collection logic
- Creature AI & collision detection
- Score & lives system
- **CHECKPOINT:** Core gameplay loop working, ask for testing

**Phase 5: Polish & Features**
- Sound effects (Web Audio API)
- Win/lose screens
- LocalStorage for high scores
- Animations & visual feedback
- **CHECKPOINT:** Request playtesting feedback

**Phase 6: Deployment**
- GitHub Actions workflow
- Deploy to GitHub Pages
- **CHECKPOINT:** Confirm live site works

### Checkpoint Protocol

At each CHECKPOINT:
1. **Stop and summarize** what was built
2. **Ask specific questions** if anything is unclear
3. **Request validation** before proceeding
4. **Offer to show** key components/screens
5. **Never assume** - always confirm before moving to next phase

## Critical Requirements

### Dutch Language
- UI text: **ONLY Dutch** (defined in `constants/dutch-text.js`)
- Word lists: Age-appropriate Dutch words per difficulty
- Code/comments: English is fine
- **Validate:** No English visible in UI

### Child-Friendly Design
- Large click targets (min 60px height buttons)
- Playful, natural colors (no harsh/bright)
- Friendly creatures (not scary)
- Encouraging feedback messages
- **Validate:** Would a 5-year-old understand this?

### Multi-Game Architecture
- Games registry pattern (`games/index.js`)
- Easy to add new games without changing core code
- HomePage dynamically renders from games registry
- **Validate:** Could we add Snake in <1 hour?

### Zero Cost
- No backend/database (localStorage only)
- GitHub Pages hosting (static)
- No API calls or external services
- **Validate:** Will this always be free?

## File Boundaries

### CAN edit/create:
- `/src/**/*` - All source files
- `/public/**/*` - Static assets
- `.github/workflows/*` - Deployment config
- Config files: `vite.config.js`, `tailwind.config.js`, etc.

### CANNOT edit:
- `node_modules/` - Never touch
- `.git/` - Git internals
- `/dist/` - Build output (auto-generated)

## Commands

```bash
# Development
npm install              # First time setup
npm run dev             # Start dev server (port 5173)

# Build & Deploy
npm run build           # Production build
npm run preview         # Preview production build

# Deployment happens automatically via GitHub Actions on push to main
```

## Code Style

### JavaScript/React
- Functional components with hooks
- Named exports (no default exports)
- Descriptive variable names
- Comment complex game logic

### CSS/Tailwind
- Use design system colors (defined in tailwind.config.js)
- Utility classes over custom CSS
- Responsive by default (mobile-first)

### File Organization
- One component per file
- Group related files in same folder
- Keep components small and focused

## Common Patterns

### Dutch Text Usage
```javascript
import { DUTCH_TEXT } from '../constants/dutch-text';

// Always use constants, never hardcode Dutch text
<button>{DUTCH_TEXT.menu.startGame}</button>
```

### Game Registration
```javascript
// Add to games/index.js
export const GAMES = {
  'new-game': {
    id: 'new-game',
    component: NewGame,
    name: 'Game Name',
    icon: '🎮',
    available: true,
    color: 'from-primary-blue to-primary-green',
  },
};
```

### Sound Effects
```javascript
const { playSound } = useSoundEffects();
playSound('collect'); // 'collect', 'wrong', 'complete'
```

## Testing Approach

Before marking ANY phase complete:
1. Verify all Dutch text is correct
2. Test on both desktop and tablet sizes
3. Click through full user flow
4. Check console for errors
5. Ask for user validation at checkpoints

## Questions & Clarifications

**When stuck or unclear:**
- Reference the master spec for detailed guidance
- Ask specific questions at checkpoints
- Suggest alternatives if requirements seem conflicting
- Never guess - always clarify with user

**Red flags to raise:**
- English text appearing in UI
- Complex backend/database needs arising
- Costs being introduced
- Architecture getting too complicated
- Kids might find something scary/confusing

## Success Criteria

✅ 5-year-old can start game independently (no reading English)  
✅ Home page shows Letter Jager + 2 "coming soon" tiles  
✅ Full navigation flow works (home → game → home)  
✅ Letter Jager playable with 3 difficulty levels  
✅ High scores save between sessions  
✅ Deployed live on GitHub Pages  
✅ New game can be added easily (<1 hour)

---

**Remember:** Work in phases, validate at checkpoints, keep it simple, make it kid-friendly!
