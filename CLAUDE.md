# GameHub - Multi-Game Platform for Kids

Kid-friendly web game platform (ages 5-7) built with React 19 + Vite 7 + Tailwind CSS v4, deployed to GitHub Pages.

**Target Users:** 5 & 7 year old children, non-English readers
**Language:** 100% Dutch UI (code/comments in English)
**Hosting:** GitHub Pages (static, free)
**Live:** https://patspang.github.io/GameHub/

**IMPORTANT:** ALWAYS test locally first (`npm run dev` / `npm run build`) and only deploy (commit + push) to GitHub when explicitly instructed by the user.

## Tech Stack

```
Framework: React 19 with Vite 7
Styling: Tailwind CSS v4 (design system in src/styles/globals.css @theme)
Canvas: PixiJS 8 (for games needing animation: CijferVissen, BosRitje)
State: React hooks + localStorage (no Context API needed)
Deployment: GitHub Actions → GitHub Pages
```

## Architecture

```
Home Page → Game Selection → Difficulty → Play → Home
          (Grid of tiles)  (3 levels)   (Game) (Back button)
```

Games with `skipDifficulty: true` go directly from selection to play.

## Adding a New Game — Complete Recipe

When the user asks to create a new game, follow this recipe. **Do NOT re-explore the codebase** — everything you need is documented here.

### Step 1: Add Config (`src/constants/gameConfig.js`)

Add a `GAME_NAME_CONFIG` export. Use `DIFFICULTY` constants for per-difficulty settings:

```javascript
import { DIFFICULTY } from './gameConfig';

export const MEMORY_CONFIG = {
  GRID: {
    [DIFFICULTY.EASY]: { rows: 4, cols: 4 },
    [DIFFICULTY.NORMAL]: { rows: 4, cols: 6 },
    [DIFFICULTY.HARD]: { rows: 6, cols: 6 },
  },
  CELEBRATION_DELAY: 1500,
  SCORING: {
    PER_ITEM: { [DIFFICULTY.EASY]: 100, [DIFFICULTY.NORMAL]: 80, [DIFFICULTY.HARD]: 60 },
  },
};
```

### Step 2: Add Dutch Text (`src/constants/dutch-text.js`)

Two places to add text:

**a) Difficulty descriptions** — inside `menu.difficultyDescription`:
```javascript
'game-id': {
  easy: 'Description for makkelijk',
  normal: 'Description for normaal',
  hard: 'Description for moeilijk',
},
```

**b) Game-specific section** — add a top-level key (camelCase):
```javascript
gameName: {
  name: 'Display Name',
  instructions: { howToPlay: '...' },
  hud: { score: '...', moves: '...' },
  feedback: { allComplete: '...', tryAgain: '...' },
},
```

Existing shared text you can reuse: `DUTCH_TEXT.game.score`, `DUTCH_TEXT.feedback.newHighScore`, `DUTCH_TEXT.feedback.playAgain`, `DUTCH_TEXT.feedback.changeDifficulty`, `DUTCH_TEXT.menu.backHome`.

### Step 3: Create Game Files (`src/components/games/GameName/`)

**Component signature** — games receive these props from `GameContainer`:
```javascript
export function GameName({ difficulty, language, onExit, onChangeDifficulty }) {}
```

For `skipDifficulty: true` games, `difficulty` is always `'makkelijk'` and `onChangeDifficulty` is unused. Use `onExit` to return home.

**Turn-based game pattern** (no game loop — like Muntenkluis, Sudoku, Memory):
```javascript
import { useState, useCallback } from 'react';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { Confetti } from '../../common/Confetti';
import { Button } from '../../common/Button';

function initRound(difficulty) {
  return { /* initial state */ gameStatus: 'playing' };
}

export function GameName({ difficulty, onExit, onChangeDifficulty }) {
  const [state, setState] = useState(() => initRound(difficulty));
  const [scores, setScores] = useLocalStorage('gamehub-scores', {});
  const { playSound } = useSoundEffects();
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  // Game logic handlers...

  if (state.gameStatus === 'won') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center justify-center p-4">
        <Confetti />
        {/* GameOver component */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center p-4 no-select">
      {/* HUD + Game area */}
    </div>
  );
}
```

**PixiJS canvas game pattern** (like CijferVissen, BosRitje):
- Create a `Canvas.jsx` that initializes `new Application()` in `useEffect`
- Use `actionsRef` to expose animation methods to parent
- Draw with `Graphics` primitives (no sprite files)
- Animate with `app.ticker.add()` + `performance.now()`

### Step 4: Register (`src/games/index.js`)

```javascript
import { GameName } from '../components/games/GameName/GameName';

// In GAMES object:
'game-id': {
  id: 'game-id',
  component: GameName,
  name: 'Display Name',
  icon: '🎮',
  description: 'Short Dutch description',
  available: true,
  color: 'from-primary-blue to-primary-green',
  // skipDifficulty: true,  // Add this to skip difficulty menu
  createdAt: 'YYYY-MM-DD',  // REQUIRED: today's date, used for "Nieuw" badge (5-day window)
},
```

### Step 5: Build & Test

```bash
npm run build   # Must pass with zero errors
```

### Available Common Components

| Component | Import | Usage |
|-----------|--------|-------|
| `Button` | `../../common/Button` | `<Button variant="success\|ghost\|accent\|warning" size="lg\|md">` |
| `Confetti` | `../../common/Confetti` | `<Confetti />` — 40 falling particles |
| `FlashOverlay` | `../../common/FlashOverlay` | `<FlashOverlay trigger={count} />` — white flash on wrong answer |
| `TouchControls` | `../../common/TouchControls` | `<TouchControls onDirection={fn} />` — D-pad for movement games |
| `ScoreDisplay` | `../../common/ScoreDisplay` | `<ScoreDisplay score={n} />` |

### Available Hooks

| Hook | Usage |
|------|-------|
| `useSoundEffects()` | `const { playSound } = useSoundEffects()` |
| `useLocalStorage(key, default)` | `const [val, setVal, refresh] = useLocalStorage('key', {})` |

**Sound effects:** `playSound('collect')` (happy tone), `playSound('wrong')` (buzz), `playSound('complete')` (melody), `playSound('hit')` (thud), `playSound('highscore')` (fanfare).

### High Score Pattern

Scores stored per difficulty in `gamehub-scores`:
```javascript
const [scores, setScores] = useLocalStorage('gamehub-scores', {});

// Save score
const gameScores = scores['game-id'] || {};
if (newScore > (gameScores[difficulty] || 0)) {
  setScores((s) => ({
    ...s,
    'game-id': { ...(s['game-id'] || {}), [difficulty]: newScore },
  }));
  playSound('highscore');
}
```

For `skipDifficulty` games (like BosRitje), store a single number instead: `scores['game-id'] = totalScore`.

### Design Guidelines for Games

- **Touch targets:** min 56px, ideally 60px+
- **Fonts:** `font-display` for headings/labels, `font-body` for text
- **Colors:** use design system (`primary-blue-dark`, `primary-coral-dark`, `text-primary`, `text-secondary`, `success`, `error`)
- **Layout:** `min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary`
- **HUD:** white/80 backdrop-blur rounded bar at top
- **No lose condition preferred** — kids always succeed eventually (encouraging)
- **Landscape tablet:** use Tailwind `landscape:` variant for side-by-side layouts

### Step 6: Update Analytics Tracking

**IMPORTANT:** For every significant change — new game, new button, new user flow — update the GA4 tracking. This is NOT optional.

**Analytics utility:** `src/utils/analytics.js` — thin wrapper around `window.gtag()`.

**Current events tracked:**

| Event | Where Fired | Parameters |
|-------|-------------|------------|
| `game_start` | `App.jsx` — when game begins | `game_id`, `game_name`, `difficulty` |
| `difficulty_select` | `App.jsx` — when difficulty chosen | `game_id`, `game_name`, `difficulty` |
| `game_end` | `GameContainer.jsx` — on exit or difficulty change | `game_id`, `game_name`, `difficulty`, `duration_sec` |

**How to add tracking for a new event:**
1. Add a named function to `src/utils/analytics.js`:
   ```javascript
   export function trackNewEvent(param1, param2) {
     trackEvent('new_event_name', { param1, param2 });
   }
   ```
2. Import and call it at the appropriate point in the UI
3. Keep events **anonymous** — no PII, no player names, no identifying data

**GA4 property:** `G-H0N71FNZLF` (configured in `index.html` with `anonymize_ip: true`)

**When adding a new game**, the existing `game_start`, `difficulty_select`, and `game_end` events fire automatically (handled in `App.jsx` and `GameContainer.jsx`). No extra tracking code is needed in the game component itself unless you add game-specific events (e.g. `level_complete` in BosRitje).

### Existing Games for Reference

| Game | Type | Key Pattern |
|------|------|-------------|
| Muntenkluis | Turn-based, React only | Simplest template — `initRound()` → state machine |
| Memory | Turn-based, React only | CSS animations, timed callbacks |
| Sudoku | Turn-based, React only | Grid-based, cell selection |
| Letter Leren | Turn-based, React only | Word/picture matching |
| CijferVissen | PixiJS canvas | Pond animations, fish AI |
| BosRitje | PixiJS canvas | Grid tiles, car movement, 15 levels |
| PinguinAvontuur | RAF game loop | Maze generation, keyboard/touch movement |
| Tetris | RAF game loop | Falling blocks, keyboard input |

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

## Testing Approach

Before completing any game:
1. `npm run build` must pass with zero errors
2. Verify all Dutch text is correct (no English in UI)
3. Test on both desktop and tablet sizes
4. Click through full user flow
5. Cards/buttons large enough for small fingers (56px+)
