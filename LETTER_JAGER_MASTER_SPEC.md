# Letter Jager - Master Specification Document
## Multi-Agent Web Game Development Project

---

## 🎯 PROJECT OVERVIEW

### Project Name
**Letter Jager** (Letter Hunter)

### Vision
A playful, educational web-based game for children aged 5-7 where players navigate mazes to collect letters in the correct sequence to spell Dutch words. Built with a multi-agent development approach for easy expansion to additional games.

### Target Users
- Primary: 5-year-old girl and 7-year-old boy
- Language: Dutch (Netherlands)
- Technical level: Non-readers of English, intuitive UI required

### Core Requirements
- ✅ **Home page** with game selection grid ("Kies je spel")
- ✅ Single game initially (Letter Jager) with architecture for easy game addition
- ✅ "Coming soon" tiles for Snake and Tetris
- ✅ Three difficulty levels with age-appropriate Dutch words
- ✅ Local storage for high scores (no backend/accounts)
- ✅ Child-friendly, playful design with natural colors
- ✅ Optional sound effects (no music)
- ✅ Responsive design (desktop & tablet)
- ✅ 100% Dutch UI text
- ✅ Free hosting on GitHub Pages
- ✅ Fast, minimal-maintenance deployment

### User Flow
```
Home Page ("Kies je spel")
    ↓
Click Game Tile
    ↓
Difficulty Selection (Makkelijk/Normaal/Moeilijk)
    ↓
Play Game
    ↓
Game Over Screen (with "Terug naar Home" button)
    ↓
Back to Home Page
```

---

## 🏗️ TECHNICAL ARCHITECTURE

### Technology Stack
```
Frontend Framework: React 18+
Build Tool: Vite
Styling: Tailwind CSS
State Management: React Context API + LocalStorage
Hosting: GitHub Pages
Deployment: GitHub Actions (automated)
Language: TypeScript (optional, recommended for scalability)
```

### Why This Stack?
- **React + Vite**: Component-based architecture perfect for multi-game platform
- **Tailwind**: Rapid UI development, child-friendly responsive design
- **LocalStorage**: Browser-native persistence for scores
- **GitHub Pages**: Zero-cost, zero-maintenance hosting
- **No Backend**: Reduces complexity and cost to $0

### Project Structure
```
letter-jager/
├── public/
│   ├── sounds/              # Sound effects
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── common/          # Shared UI components
│   │   │   ├── Button.jsx
│   │   │   ├── GameMenu.jsx
│   │   │   └── ScoreDisplay.jsx
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── HomePage.jsx      # NEW: Game selection screen
│   │   │   ├── GameTile.jsx      # NEW: Individual game card
│   │   │   └── GameContainer.jsx
│   │   └── games/
│   │       └── LetterJager/
│   │           ├── LetterJager.jsx
│   │           ├── Maze.jsx
│   │           ├── Player.jsx
│   │           ├── Letter.jsx
│   │           ├── Creature.jsx
│   │           └── GameOverScreen.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useLocalStorage.js
│   │   ├── useGameLoop.js
│   │   └── useSoundEffects.js
│   ├── utils/
│   │   ├── wordLists.js     # Dutch word collections
│   │   ├── mazeGenerator.js
│   │   └── gameLogic.js
│   ├── constants/
│   │   ├── dutch-text.js    # All UI text in Dutch
│   │   └── gameConfig.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── .github/
│   └── workflows/
│       └── deploy.yml       # Auto-deploy to GitHub Pages
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🤖 MULTI-AGENT ORCHESTRATION SYSTEM

### Agent Workflow Overview

```
[ORCHESTRATOR AGENT]
         ↓
    Analyzes requirements
    Determines agent sequence
         ↓
[PRODUCT AGENT] → Creates user stories & acceptance criteria
         ↓
[UX/UI AGENT] → Designs child-friendly interface & components
         ↓
[ARCHITECT AGENT] → Defines technical structure & patterns
         ↓
[IMPLEMENTATION AGENT] → Builds the complete application
         ↓
[QA AGENT] → Tests & validates against criteria
         ↓
    DEPLOYMENT READY
```

---

## 📋 AGENT SPECIFICATIONS

### 🎭 AGENT 1: ORCHESTRATOR AGENT

**Role:** Project conductor and decision-maker

**Responsibilities:**
1. Read and parse this entire specification
2. Create a detailed execution plan with agent sequence
3. Determine which agents are needed for each phase
4. Monitor progress and hand off between agents
5. Make final integration decisions

**Deliverable:**
- `ORCHESTRATION_PLAN.md` with:
  - Agent execution order
  - Dependencies between agents
  - Timeline estimate
  - Integration checkpoints

**Instructions for Claude Code:**
```
You are the Orchestrator Agent. Read this master spec completely.
Create a detailed plan for how Product, UX/UI, Architect, Implementation, 
and QA agents will work sequentially. Output your plan, then invoke the 
Product Agent to begin.
```

---

### 📋 AGENT 2: PRODUCT AGENT

**Role:** Requirements translator and ticket writer

**Responsibilities:**
1. Convert project vision into actionable user stories
2. Define acceptance criteria for each feature
3. Prioritize features for MVP
4. Create testing scenarios

**Deliverable:**
- `PRODUCT_REQUIREMENTS.md` containing:

#### User Stories

**Epic 0: Home Page / Game Selection**
```
Als kind wil ik een spel kunnen kiezen
Zodat ik kan beginnen met spelen

Acceptance Criteria:
- Home page toont "Kies je spel" als titel
- Letter Jager spel is speelbaar (grote kleurrijke tegel)
- Snake en Tetris tonen "Binnenkort beschikbaar"
- Elk spel heeft een duidelijk icoon (emoji of SVG)
- Grote, klikbare tegels (minimum 200x200px op desktop)
- "Coming soon" tegels zijn zichtbaar maar niet klikbaar
- Smooth animaties bij hover (subtle scale/shadow)
- Terug knop in elk spel keert terug naar home page
```

**Epic 1: Game Menu System**
```
Als kind wil ik een spelletje kunnen kiezen
Zodat ik kan beginnen met spelen

Acceptance Criteria:
- Groot, duidelijk startscherm met spelkeuze
- "Letter Jager" knop is zichtbaar en klikbaar
- Moeilijkheidsgraad selectie (Makkelijk/Normaal/Moeilijk)
- Hoogste scores zijn zichtbaar
```

**Epic 2: Letter Jager Core Game**
```
Als kind wil ik door een doolhof bewegen
Zodat ik letters kan verzamelen

Acceptance Criteria:
- Speler kan bewegen met pijltjestoetsen
- Vriendelijke karakters bewegen door doolhof
- Letters verschijnen in specifieke volgorde
- Geluid speelt bij het verzamelen van letters
- Woord wordt getoond wanneer compleet
```

**Epic 3: Difficulty Levels**
```
Als kind wil ik verschillende moeilijkheidsgraden
Zodat het spel uitdagend blijft

Makkelijk:
- 3-4 letter woorden
- Simpel doolhof (weinig bochten)
- 2 vriendelijke karakters
- Langzame beweging

Normaal:
- 5-6 letter woorden
- Traditioneel doolhof
- 3 vriendelijke karakters
- Gemiddelde snelheid

Moeilijk:
- 7-8 letter woorden
- Complex doolhof
- 4 vriendelijke karakters
- Snelle beweging
```

**Epic 4: Score & Progress**
```
Als kind wil ik mijn score zien
Zodat ik weet hoe goed ik het doe

Acceptance Criteria:
- Huidige score tijdens spel
- Hoogste score per moeilijkheidsgraad
- Scores blijven bewaard (localStorage)
- Visuele feedback bij nieuwe hoogste score
```

#### Dutch Word Lists (Required)

**Makkelijk (3-4 letters):**
```javascript
[
  "KAT", "POT", "BOOM", "ROOS", "HUIS", "AUTO", "BOOT", "MAAN",
  "STER", "BEER", "PEER", "BOEK", "TAFEL" // Note: TAFEL is 5, adjust
  "VIS", "KOE", "PAD", "BUS", "BAL", "POP", "BED", "ZON"
]
```

**Normaal (5-6 letters):**
```javascript
[
  "APPEL", "PAARD", "BLOEM", "STOEL", "VOGEL", "HOND", "FIETS",
  "SCHOOL", "KONIJN", "WORTEL", "BANAAN", "KERSEN", "TULPEN",
  "HAMSTER", "KEUKEN", "TAFEL" // TAFEL is actually 5
]
```

**Moeilijk (7-8 letters):**
```javascript
[
  "OLIFANT", "GIRAFFE", "COMPUTER", "TELEFOON", "VLIEGTUIG", "REGENBOOG",
  "DINOSAURUS", // 10 letters, too long
  "SCHAATS", "KOMPAS", // KOMPAS is 6
  "PARAPLU", "SCHILDPAD", "KROKODIL", "KAMEEL" // KAMEEL is 6
]
```

**ACTION REQUIRED:** QA Agent must verify word lengths match difficulty levels exactly.

#### Testing Scenarios

**Scenario 1: First Time Player (5-year-old)**
- Clicks "Letter Jager" immediately
- Chooses "Makkelijk"
- Uses arrow keys randomly
- Collects letters out of order (should show guidance)
- Completes first word
- Sees celebration animation

**Scenario 2: Experienced Player (7-year-old)**
- Selects "Moeilijk"
- Strategic navigation
- Avoids friendly creatures
- Completes multiple words
- Achieves new high score

**Scenario 3: Tablet Usage**
- Touch-friendly controls appear
- Swipe gestures work
- Layout adjusts for portrait/landscape

---

### 🎨 AGENT 3: UX/UI AGENT

**Role:** Child-centered design specialist

**Responsibilities:**
1. Create design system for 5-7 year olds
2. Define color palette, typography, spacing
3. Design all UI components
4. Create interaction patterns
5. Ensure accessibility for young children

**Deliverable:**
- `DESIGN_SYSTEM.md` containing:

#### Color Palette (Natural, Not Screaming)
```css
/* Primary Colors - Soft & Playful */
--primary-blue: #6B9BD1;        /* Soft sky blue */
--primary-green: #7FBF7F;       /* Gentle grass green */
--primary-yellow: #F4D35E;      /* Warm sunshine yellow */
--primary-coral: #F19C79;       /* Friendly coral */

/* Backgrounds */
--bg-primary: #FFF9F0;          /* Warm cream */
--bg-secondary: #E8F4F8;        /* Soft blue tint */
--bg-maze: #D4E7D7;             /* Light sage green */

/* Game Elements */
--letter-color: #5A67D8;        /* Deep blue for letters */
--player-color: #F59E0B;        /* Friendly orange */
--creature-1: #A78BFA;          /* Soft purple */
--creature-2: #34D399;          /* Mint green */
--creature-3: #F472B6;          /* Gentle pink */
--creature-4: #60A5FA;          /* Light blue */

/* Text */
--text-primary: #2D3748;        /* Dark grey, not black */
--text-secondary: #4A5568;      /* Medium grey */

/* Feedback */
--success: #48BB78;             /* Achievement green */
--error: #FC8181;               /* Gentle red */
```

#### Typography
```css
/* Dutch text optimized for readability by children */
--font-primary: 'Comic Neue', 'Arial Rounded', sans-serif;
--font-display: 'Fredoka', 'Comic Sans MS', cursive;

/* Sizes - Large for young readers */
--text-xxl: 3rem;      /* Game title */
--text-xl: 2rem;       /* Buttons */
--text-lg: 1.5rem;     /* In-game text */
--text-md: 1.25rem;    /* Secondary info */
--text-sm: 1rem;       /* Scores */
```

#### Component Designs

**Home Page / Game Selection Screen:**
```
┌─────────────────────────────────────┐
│                                     │
│       🎮 KIES JE SPEL 🎮           │
│                                     │
│   ┌────────┐  ┌────────┐           │
│   │  🎯    │  │  🐍    │           │
│   │ Letter │  │ Snake  │           │
│   │ Jager  │  │        │           │
│   │        │  │Binnenkort│         │
│   └────────┘  └────────┘           │
│                                     │
│   ┌────────┐                        │
│   │  🧱    │                        │
│   │ Tetris │                        │
│   │        │                        │
│   │Binnenkort│                       │
│   └────────┘                        │
│                                     │
└─────────────────────────────────────┘

Design specs:
- Grid layout: 2 columns on tablet+, 1 column on mobile
- Each tile: 250x250px with 20px gap
- Playful drop shadow: 0 4px 12px rgba(0,0,0,0.1)
- Active game: full color, clickable
- Coming soon: 60% opacity, "Binnenkort" badge
- Hover effect: scale(1.05) + deeper shadow
- Game icon: Large emoji (4rem) or SVG
- Game name: 1.5rem bold, centered below icon
```

**Game Tile Component (Active):**
```
┌──────────────────────┐
│                      │
│         🎯          │
│      (4rem)          │
│                      │
│    Letter Jager      │
│    (1.5rem bold)     │
│                      │
│  Hoogste: 1250 ⭐   │
│  (optional preview)  │
│                      │
└──────────────────────┘
Background: gradient from primary-blue to primary-green
Border-radius: 24px
Cursor: pointer
```

**Game Tile Component (Coming Soon):**
```
┌──────────────────────┐
│                      │
│         🐍          │
│      (4rem)          │
│                      │
│       Snake          │
│    (1.5rem bold)     │
│                      │
│   🔒 Binnenkort      │
│   (small badge)      │
│                      │
└──────────────────────┘
Background: bg-secondary
Opacity: 0.6
Border: 2px dashed primary-coral
Cursor: default (not clickable)
```

**Button Component:**
```
Design specs:
- Large click targets (min 60px height)
- Rounded corners (border-radius: 16px)
- Drop shadow for depth
- Hover state: slight scale up (transform: scale(1.05))
- Active state: scale down (transform: scale(0.95))
- Clear Dutch labels
- Icon + text when helpful

Example:
┌─────────────────────┐
│  🎮  START SPEL     │
└─────────────────────┘
```

**Game Menu Screen:**
```
┌─────────────────────────────────────┐
│                                     │
│       🎯 LETTER JAGER 🎯           │
│                                     │
│   ┌──────────────────────────┐    │
│   │    MAKKELIJK             │    │
│   │    3-4 letter woorden    │    │
│   └──────────────────────────┘    │
│                                     │
│   ┌──────────────────────────┐    │
│   │    NORMAAL               │    │
│   │    5-6 letter woorden    │    │
│   └──────────────────────────┘    │
│                                     │
│   ┌──────────────────────────┐    │
│   │    MOEILIJK              │    │
│   │    7-8 letter woorden    │    │
│   └──────────────────────────┘    │
│                                     │
│   Hoogste Score: 1250 ⭐          │
└─────────────────────────────────────┘
```

**In-Game HUD:**
```
┌─────────────────────────────────────┐
│ Score: 350    🎯 Woord: K_T_       │
│ ⭐⭐⭐⭐☆                           │
└─────────────────────────────────────┘
│                                     │
│     [MAZE GAME AREA]                │
│                                     │
│     Letters needed: A, T            │
└─────────────────────────────────────┘
```

**Friendly Creatures Design:**
```
Instead of ghosts, use:
- Cute round monsters with big eyes
- Soft pastel colors
- Bouncy animation
- Smiling faces (not scary!)
- Different colored blobs or simple animals

Example ASCII art concept:
   ___
  /   \
 |  •  •|
  \ ︶ /
   ‾‾‾
(Soft purple blob with happy face)
```

#### Animations & Interactions

**Letter Collection:**
- Letter sparkles/twinkles when collected
- Gentle "pop" sound
- Letter flies to word display area
- Word spot highlights in green

**Level Complete:**
- Confetti animation
- Celebratory Dutch message: "Gefeliciteerd!" or "Goed gedaan!"
- Stars fill in based on performance
- Show complete word with definition (optional)

**Game Over:**
- Gentle fade transition
- Encouraging message: "Bijna! Probeer nog eens!"
- Show score and high score
- "Opnieuw Spelen" button prominent

#### Responsive Design Rules

**Desktop (1024px+):**
- Centered game area (max-width: 800px)
- Large buttons and text
- Arrow key controls

**Tablet (768px - 1023px):**
- Full-width game area
- Touch controls overlay
- Slightly smaller text but still large

**Mobile (< 768px):**
- Focus on portrait mode
- Virtual D-pad for controls
- Simplified maze for small screens

---

### 🏗️ AGENT 4: ARCHITECT AGENT

**Role:** Technical structure designer

**Responsibilities:**
1. Design component architecture
2. Define state management patterns
3. Create game loop structure
4. Plan for multi-game expansion
5. Optimize for performance

**Deliverable:**
- `TECHNICAL_ARCHITECTURE.md` containing:

#### Component Hierarchy
```
App
├── GameProvider (Context for global state)
│   ├── Header
│   │   └── Logo + Settings (optional sound toggle)
│   ├── Router (simple state-based routing)
│   │   ├── HomePage
│   │   │   └── GameTile[] (Letter Jager, Snake, Tetris)
│   │   ├── GameMenu (when game selected)
│   │   │   ├── DifficultySelector
│   │   │   └── HighScoreDisplay
│   │   └── GameContainer (when difficulty chosen)
│   │       └── LetterJager
│   │           ├── GameHUD
│   │           │   ├── ScoreDisplay
│   │           │   ├── WordProgress
│   │           │   └── LivesIndicator
│   │           ├── Maze
│   │           │   ├── Player
│   │           │   ├── Letter (multiple instances)
│   │           │   └── Creature (multiple instances)
│   │           └── GameOverScreen
```

#### State Management Strategy

**Global State (Context API):**
```javascript
{
  // Navigation
  currentScreen: 'home' | 'game-menu' | 'playing',
  selectedGame: 'letter-jager' | 'snake' | 'tetris' | null,
  
  // Game settings
  difficulty: 'makkelijk' | 'normaal' | 'moeilijk',
  
  // Persistence
  highScores: {
    'letter-jager': {
      makkelijk: number,
      normaal: number,
      moeilijk: number
    },
    'snake': { /* future */ },
    'tetris': { /* future */ }
  },
  
  // Preferences
  soundEnabled: boolean,
  language: 'nl' // Future-proofing
}
```

**Game-Specific State (LetterJager component):**
```javascript
{
  score: number,
  lives: number,
  currentWord: string,
  collectedLetters: string[],
  targetLetters: string[], // Letters in correct order
  playerPosition: { x: number, y: number },
  creatures: [
    { id, position: { x, y }, direction, color }
  ],
  letters: [
    { id, letter, position: { x, y }, collected: boolean }
  ],
  gameStatus: 'ready' | 'playing' | 'paused' | 'won' | 'lost',
  mazeLayout: number[][] // 2D array for maze structure
}
```

#### Game Loop Pattern

**Core Game Loop (60 FPS):**
```javascript
useEffect(() => {
  let animationFrameId;
  let lastTimestamp = 0;
  const FPS = 60;
  const frameDuration = 1000 / FPS;

  const gameLoop = (timestamp) => {
    if (timestamp - lastTimestamp >= frameDuration) {
      // 1. Handle Input
      processPlayerInput();
      
      // 2. Update Game State
      updateCreaturePositions();
      checkCollisions();
      updateScore();
      
      // 3. Check Win/Lose Conditions
      if (allLettersCollected()) {
        handleLevelComplete();
      }
      if (lives <= 0) {
        handleGameOver();
      }
      
      // 4. Render (React handles this via state updates)
      
      lastTimestamp = timestamp;
    }
    
    if (gameStatus === 'playing') {
      animationFrameId = requestAnimationFrame(gameLoop);
    }
  };
  
  if (gameStatus === 'playing') {
    animationFrameId = requestAnimationFrame(gameLoop);
  }
  
  return () => cancelAnimationFrame(animationFrameId);
}, [gameStatus, /* other dependencies */]);
```

#### Maze Generation Algorithm

**Simple Maze (Makkelijk):**
```javascript
// Pre-defined simple patterns
const SIMPLE_MAZES = [
  [
    [1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1]
  ],
  // More patterns...
];
// Random selection
```

**Traditional Maze (Normaal):**
```javascript
// Classic Pac-Man style layout
const CLASSIC_MAZE = [
  // 20x20 grid with traditional paths
  // Pre-designed for balanced gameplay
];
```

**Complex Maze (Moeilijk):**
```javascript
// Procedurally generated or
// More intricate pre-designed mazes
```

#### Collision Detection
```javascript
function checkCollision(entity1, entity2) {
  const buffer = 5; // Pixel buffer for child-friendly hit detection
  return (
    Math.abs(entity1.x - entity2.x) < TILE_SIZE - buffer &&
    Math.abs(entity1.y - entity2.y) < TILE_SIZE - buffer
  );
}
```

#### LocalStorage Schema
```javascript
{
  "letter-jager-scores": {
    "makkelijk": 1250,
    "normaal": 850,
    "moeilijk": 420
  },
  "settings": {
    "soundEnabled": true
  },
  "statistics": {
    "gamesPlayed": 47,
    "totalScore": 15680
  }
}
```

#### Performance Optimizations

1. **React.memo** for components that don't update frequently
2. **useMemo** for maze layout calculation
3. **Canvas rendering** if DOM updates cause lag (fallback)
4. **Sprite sheets** for character animations
5. **Lazy loading** for future games

#### Multi-Game Architecture Pattern

**Game Registry:**
```javascript
// src/games/index.js
export const GAMES = {
  'letter-jager': {
    id: 'letter-jager',
    component: LetterJager,
    name: 'Letter Jager',
    icon: '🎯',
    description: 'Verzamel letters om woorden te maken',
    available: true,
    color: 'from-primary-blue to-primary-green',
  },
  'snake': {
    id: 'snake',
    component: null, // Not built yet
    name: 'Snake',
    icon: '🐍',
    description: 'Eet appels en groei',
    available: false,
    color: 'from-primary-green to-primary-yellow',
  },
  'tetris': {
    id: 'tetris',
    component: null, // Not built yet
    name: 'Tetris',
    icon: '🧱',
    description: 'Stapel blokken',
    available: false,
    color: 'from-primary-coral to-primary-yellow',
  },
};

// Easy to add new games:
// 1. Create new folder in src/components/games/
// 2. Export game component
// 3. Add to GAMES object with available: true
// 4. Done! Appears on home page automatically
```

**HomePage Component:**
```javascript
// src/components/layout/HomePage.jsx
import { GAMES } from '../../games';
import GameTile from './GameTile';
import { DUTCH_TEXT } from '../../constants/dutch-text';

export default function HomePage({ onSelectGame }) {
  return (
    <div className="home-page">
      <h1 className="text-4xl font-display text-center mb-8">
        {DUTCH_TEXT.home.title}
      </h1>
      
      <div className="games-grid grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        {Object.values(GAMES).map(game => (
          <GameTile
            key={game.id}
            game={game}
            onClick={() => game.available && onSelectGame(game.id)}
          />
        ))}
      </div>
    </div>
  );
}
```

**GameTile Component:**
```javascript
// src/components/layout/GameTile.jsx
import { DUTCH_TEXT } from '../../constants/dutch-text';

export default function GameTile({ game, onClick }) {
  return (
    <div
      className={`
        game-tile relative rounded-3xl p-8 text-center
        ${game.available 
          ? `bg-gradient-to-br ${game.color} cursor-pointer hover:scale-105` 
          : 'bg-bg-secondary opacity-60 border-2 border-dashed border-primary-coral'
        }
        transition-all duration-200
        shadow-lg hover:shadow-xl
        min-h-[250px] flex flex-col items-center justify-center
      `}
      onClick={onClick}
    >
      <div className="text-6xl mb-4">{game.icon}</div>
      <h2 className="text-2xl font-display font-bold text-text-primary">
        {game.name}
      </h2>
      
      {!game.available && (
        <div className="mt-4 inline-block bg-white/80 px-4 py-2 rounded-full">
          <span className="text-sm font-bold text-text-secondary">
            🔒 {DUTCH_TEXT.home.comingSoon}
          </span>
        </div>
      )}
      
      {game.available && (
        <div className="mt-2 text-sm text-text-secondary">
          Klik om te spelen →
        </div>
      )}
    </div>
  );
}
```

**Navigation Flow in App.jsx:**
```javascript
// src/App.jsx
function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedGame, setSelectedGame] = useState(null);
  const [difficulty, setDifficulty] = useState(null);

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
    setCurrentScreen('game-menu');
  };

  const handleDifficultySelect = (diff) => {
    setDifficulty(diff);
    setCurrentScreen('playing');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setSelectedGame(null);
    setDifficulty(null);
  };

  return (
    <GameProvider>
      <div className="app">
        <Header onHomeClick={handleBackToHome} />
        
        {currentScreen === 'home' && (
          <HomePage onSelectGame={handleGameSelect} />
        )}
        
        {currentScreen === 'game-menu' && (
          <GameMenu
            game={selectedGame}
            onSelectDifficulty={handleDifficultySelect}
            onBack={handleBackToHome}
          />
        )}
        
        {currentScreen === 'playing' && (
          <GameContainer
            game={selectedGame}
            difficulty={difficulty}
            onExit={handleBackToHome}
          />
        )}
      </div>
    </GameProvider>
  );
}
```

---

### ⚙️ AGENT 5: IMPLEMENTATION AGENT

**Role:** Full-stack developer (frontend focus)

**Responsibilities:**
1. Implement all components based on specs
2. Write clean, documented code
3. Integrate all systems (game loop, UI, storage)
4. Ensure Dutch language integration
5. Handle edge cases and error states

**Key Implementation Tasks:**

#### Task 1: Project Setup
```bash
# Create Vite + React project
npm create vite@latest letter-jager -- --template react
cd letter-jager
npm install

# Install dependencies
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Setup Tailwind config
# Configure vite.config.js for GitHub Pages
# Setup folder structure as per architecture
```

#### Task 2: Dutch Language Constants
```javascript
// src/constants/dutch-text.js
export const DUTCH_TEXT = {
  home: {
    title: 'Kies je spel',
    comingSoon: 'Binnenkort',
    games: {
      letterJager: 'Letter Jager',
      snake: 'Snake',
      tetris: 'Tetris',
    },
  },
  menu: {
    title: 'Letter Jager',
    startGame: 'Start Spel',
    backHome: 'Terug naar Home',
    difficulty: {
      easy: 'Makkelijk',
      normal: 'Normaal',
      hard: 'Moeilijk',
    },
    highScore: 'Hoogste Score',
    settings: 'Instellingen',
  },
  game: {
    score: 'Score',
    lives: 'Levens',
    targetWord: 'Woord',
    pause: 'Pauze',
    resume: 'Verder',
    quit: 'Stoppen',
    collectLetter: 'Verzamel',
  },
  feedback: {
    letterCollected: 'Goed gedaan!',
    wrongLetter: 'Niet die letter!',
    wordComplete: 'Woord compleet! Gefeliciteerd!',
    gameOver: 'Spel afgelopen',
    tryAgain: 'Probeer opnieuw',
    newHighScore: 'Nieuwe hoogste score!',
    wellDone: 'Goed zo!',
    almostThere: 'Bijna!',
  },
  instructions: {
    howToPlay: 'Hoe te spelen',
    useArrows: 'Gebruik pijltjestoetsen om te bewegen',
    collectLetters: 'Verzamel letters in de juiste volgorde',
    avoidCreatures: 'Blijf weg van de vriendjes',
  },
};
```

#### Task 3: Word Lists Implementation
```javascript
// src/utils/wordLists.js
export const WORD_LISTS = {
  makkelijk: [
    'KAT', 'POT', 'BOOM', 'ROOS', 'HUIS', 'AUTO', 'BOOT', 'MAAN',
    'STER', 'BEER', 'PEER', 'BOEK', 'VIS', 'KOE', 'PAD', 'BUS',
    'BAL', 'POP', 'BED', 'ZON', 'TAK', 'PAN', 'HEK', 'WEG'
  ],
  normaal: [
    'APPEL', 'PAARD', 'BLOEM', 'STOEL', 'VOGEL', 'HOND', 'FIETS',
    'SCHOOL', 'KONIJN', 'WORTEL', 'BANAAN', 'KERSEN', 'TULPEN',
    'HAMSTER', 'KEUKEN', 'TAFEL', 'BEKER', 'LEPEL'
  ],
  moeilijk: [
    'OLIFANT', 'GIRAFFE', 'COMPUTER', 'TELEFOON', 'VLIEGTUIG', 'REGENBOOG',
    'SCHILDPAD', 'PARAPLU', 'KROKODIL', 'KOMPUTER', 'WATERVAL',
    'SPEELTUIN', 'BOTERHAM', 'SCHOOLTAS'
  ]
};

export function getRandomWord(difficulty) {
  const words = WORD_LISTS[difficulty];
  return words[Math.floor(Math.random() * words.length)];
}

export function splitWordIntoLetters(word) {
  return word.split('');
}
```

#### Task 4: Core Game Component Structure
```javascript
// src/components/games/LetterJager/LetterJager.jsx
import { useState, useEffect, useCallback } from 'react';
import { getRandomWord } from '../../../utils/wordLists';
import Maze from './Maze';
import GameHUD from './GameHUD';
import GameOverScreen from './GameOverScreen';

export default function LetterJager({ difficulty, onExit }) {
  // Game state
  const [gameStatus, setGameStatus] = useState('ready');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentWord, setCurrentWord] = useState('');
  const [collectedLetters, setCollectedLetters] = useState([]);
  
  // Initialize game
  useEffect(() => {
    const word = getRandomWord(difficulty);
    setCurrentWord(word);
    // Initialize maze, player, creatures, letters
  }, [difficulty]);
  
  // Game loop
  useEffect(() => {
    // Implement game loop as per architecture
  }, [gameStatus]);
  
  // Render based on game status
  if (gameStatus === 'ready') {
    return <StartScreen onStart={() => setGameStatus('playing')} />;
  }
  
  if (gameStatus === 'won' || gameStatus === 'lost') {
    return (
      <GameOverScreen 
        status={gameStatus}
        score={score}
        onRestart={handleRestart}
        onExit={onExit}
      />
    );
  }
  
  return (
    <div className="game-container">
      <GameHUD 
        score={score}
        lives={lives}
        currentWord={currentWord}
        collectedLetters={collectedLetters}
      />
      <Maze 
        // Pass all maze props
      />
    </div>
  );
}
```

#### Task 5: Sound Effects Integration
```javascript
// src/hooks/useSoundEffects.js
import { useCallback, useRef } from 'react';

export function useSoundEffects(enabled = true) {
  const audioContext = useRef(null);
  
  const playSound = useCallback((type) => {
    if (!enabled) return;
    
    // Web Audio API for simple sounds
    const ctx = audioContext.current || new AudioContext();
    audioContext.current = ctx;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    switch(type) {
      case 'collect':
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
        break;
      case 'wrong':
        oscillator.frequency.value = 200;
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
        break;
      case 'complete':
        // Play ascending notes
        [400, 500, 600, 800].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = freq;
          osc.type = 'sine';
          gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.2);
          osc.start(ctx.currentTime + i * 0.1);
          osc.stop(ctx.currentTime + i * 0.1 + 0.2);
        });
        break;
    }
  }, [enabled]);
  
  return { playSound };
}
```

#### Task 6: LocalStorage Hook
```javascript
// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}
```

#### Task 7: GitHub Pages Deployment Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/letter-jager/', // Replace with your repo name
  build: {
    outDir: 'dist',
  },
});
```

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

#### Task 8: Responsive Design Implementation
```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#6B9BD1',
        'primary-green': '#7FBF7F',
        'primary-yellow': '#F4D35E',
        'primary-coral': '#F19C79',
        'bg-primary': '#FFF9F0',
        'bg-secondary': '#E8F4F8',
        'bg-maze': '#D4E7D7',
      },
      fontFamily: {
        'display': ['"Fredoka"', '"Comic Sans MS"', 'cursive'],
        'body': ['"Comic Neue"', '"Arial Rounded"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

#### Implementation Checklist
- [ ] Project initialized with Vite + React
- [ ] Tailwind CSS configured with design system colors
- [ ] All Dutch text constants defined
- [ ] Word lists implemented and validated
- [ ] **Home page with game grid layout**
- [ ] **GameTile component (active and coming soon states)**
- [ ] **Navigation flow between home → menu → game → home**
- [ ] Game menu component with difficulty selection
- [ ] LetterJager game component with state management
- [ ] Maze generation for all difficulties
- [ ] Player movement with keyboard controls
- [ ] Friendly creatures with AI movement
- [ ] Letter placement and collection logic
- [ ] Collision detection system
- [ ] Score tracking and display
- [ ] Lives system
- [ ] Game over conditions
- [ ] Win celebration screen
- [ ] Sound effects integrated
- [ ] LocalStorage for high scores
- [ ] Responsive design for desktop/tablet
- [ ] GitHub Actions deployment workflow
- [ ] README with setup instructions
- [ ] Code comments in English
- [ ] UI text 100% in Dutch

---

### 🧪 AGENT 6: QA AGENT

**Role:** Quality assurance and testing specialist

**Responsibilities:**
1. Create comprehensive test plan
2. Test all features against acceptance criteria
3. Kid-test usability (simulate 5-7 year old usage)
4. Cross-browser and device testing
5. Performance validation
6. Dutch language verification

**Deliverable:**
- `QA_TEST_PLAN.md` containing:

#### Functional Test Cases

**TC-000: Home Page Display**
```
Preconditions: App loaded successfully
Steps:
1. Load application
2. Verify "Kies je spel" title appears
3. Count visible game tiles (should be 3)
4. Verify Letter Jager is clickable and colored
5. Verify Snake and Tetris show "Binnenkort" badge
6. Try clicking Snake tile

Expected Result:
- Home page displays with centered grid
- Letter Jager: full color gradient, cursor pointer
- Snake & Tetris: grayed out, dashed border, not clickable
- All text in Dutch
- Smooth hover animations on Letter Jager tile

Pass/Fail: _____
```

**TC-001: Game Menu Navigation**
```
Preconditions: App loaded successfully
Steps:
1. Load application
2. Verify "Letter Jager" title appears in Dutch
3. Click "Makkelijk" difficulty button
4. Verify game starts with easy configuration

Expected Result:
- Menu displays with all Dutch text
- Buttons are large and clickable
- Game transitions smoothly
- Easy maze and 3-4 letter word appears

Pass/Fail: _____
```

**TC-002: Letter Collection (Correct Order)**
```
Preconditions: Game started with word "KAT"
Steps:
1. Navigate player to letter 'K'
2. Collect 'K'
3. Navigate to 'A'
4. Collect 'A'
5. Navigate to 'T'
6. Collect 'T'

Expected Result:
- Each letter collected plays sound
- Letters appear in word display: K_T, KAT
- Celebration animation on word completion
- Dutch message: "Gefeliciteerd!" or "Goed gedaan!"
- Score increases appropriately

Pass/Fail: _____
```

**TC-003: Letter Collection (Wrong Order)**
```
Preconditions: Game started with word "KAT"
Steps:
1. Try to collect letter 'A' before 'K'

Expected Result:
- Letter is NOT collected
- Visual feedback (letter shakes or dims)
- Subtle audio cue
- No score penalty (kid-friendly)
- Hint shown: "Verzamel eerst: K"

Pass/Fail: _____
```

**TC-004: Creature Collision**
```
Preconditions: Game in progress
Steps:
1. Move player into creature path
2. Allow collision

Expected Result:
- Life is lost (3 → 2)
- Gentle animation (no scary effects)
- Player respawns at safe position
- Brief invincibility period (2 seconds)
- Progress retained (collected letters stay)

Pass/Fail: _____
```

**TC-005: High Score Persistence**
```
Preconditions: None
Steps:
1. Complete game with score 500
2. Close browser tab
3. Reopen application
4. Check high score display

Expected Result:
- Score 500 appears in menu
- Persists across sessions
- Updates when beaten
- Separate scores per difficulty

Pass/Fail: _____
```

**TC-006: Difficulty Differences**
```
Test each difficulty level:

Makkelijk:
- Words: 3-4 letters ✓
- Maze: Simple layout ✓
- Creatures: 2, slow speed ✓
- Letters clearly visible ✓

Normaal:
- Words: 5-6 letters ✓
- Maze: Traditional Pac-Man style ✓
- Creatures: 3, medium speed ✓

Moeilijk:
- Words: 7-8 letters ✓
- Maze: Complex ✓
- Creatures: 4, fast speed ✓

Pass/Fail: _____
```

#### Usability Testing (Kid-Focused)

**UT-001: 5-Year-Old First Experience**
```
Simulate young child behavior:
- Random clicking/tapping
- Holding arrow keys continuously
- Not reading instructions
- Expecting immediate feedback

Validation:
- [ ] Can start game without reading
- [ ] Arrow key controls are intuitive
- [ ] Visual feedback is clear without text
- [ ] No way to "break" the game
- [ ] Frustration is minimized
```

**UT-002: Visual Clarity**
```
Check from 3 feet away (typical viewing distance):
- [ ] All text is readable
- [ ] Player character is clearly visible
- [ ] Letters stand out from background
- [ ] Creatures are distinguishable
- [ ] Dutch words are spelled correctly
```

**UT-003: Touch Device Usability**
```
On tablet (if available):
- [ ] Touch controls work smoothly
- [ ] No accidental menu triggers
- [ ] Swipe gestures feel natural
- [ ] Buttons are large enough for child fingers
```

#### Dutch Language Verification

**LANG-001: Comprehensive Dutch Check**
```
Verify ALL UI text is in Dutch:
- [ ] Menu titles
- [ ] Button labels
- [ ] Instructions
- [ ] Feedback messages
- [ ] Error messages
- [ ] Game over screen
- [ ] Score labels
- [ ] Settings options

Check for:
- [ ] No English words anywhere in UI
- [ ] Proper Dutch grammar
- [ ] Age-appropriate vocabulary
- [ ] No machine translation errors
```

**LANG-002: Word List Validation**
```
Makkelijk (3-4 letters):
- [ ] All words are 3-4 letters exactly
- [ ] Words are recognizable by 5-year-old
- [ ] No inappropriate words
- [ ] Correct Dutch spelling

Normaal (5-6 letters):
- [ ] All words are 5-6 letters exactly
- [ ] Age-appropriate for 7-year-old

Moeilijk (7-8 letters):
- [ ] All words are 7-8 letters exactly
- [ ] Challenging but achievable
```

#### Cross-Browser Testing

**Browser Compatibility Matrix:**
```
Chrome (latest):     [  ]
Firefox (latest):    [  ]
Safari (latest):     [  ]
Edge (latest):       [  ]

Mobile Safari (iOS): [  ]
Chrome (Android):    [  ]

Test on each:
- Game loads
- Animations smooth
- Sound works
- LocalStorage persists
- Arrow keys respond
```

#### Performance Testing

**PERF-001: Load Time**
```
Metric: Initial page load
Target: < 2 seconds on 3G connection
Actual: _____ seconds
Pass/Fail: _____
```

**PERF-002: Frame Rate**
```
Metric: Game running FPS
Target: Consistent 60 FPS
Actual: _____ FPS average
Pass/Fail: _____
```

**PERF-003: Memory Usage**
```
Metric: Memory after 30 min play
Target: < 150MB
Actual: _____ MB
Pass/Fail: _____
```

#### Accessibility Testing

**A11Y-001: Keyboard Navigation**
```
- [ ] Can tab through all buttons
- [ ] Arrow keys control player
- [ ] Spacebar/Enter activates buttons
- [ ] No keyboard traps
```

**A11Y-002: Color Contrast**
```
- [ ] Text meets WCAG AA standards
- [ ] Important elements visible to colorblind users
- [ ] No reliance on color alone for information
```

#### Edge Cases & Error Handling

**EDGE-001: LocalStorage Full**
```
Simulate: Fill localStorage to quota
Expected: Graceful degradation, game still playable
```

**EDGE-002: Window Resize During Game**
```
Action: Resize browser window while playing
Expected: Layout adjusts, game pauses briefly if needed
```

**EDGE-003: Network Offline**
```
Action: Disconnect internet after initial load
Expected: Game continues working (it's all client-side)
```

**EDGE-004: Rapid Key Presses**
```
Action: Spam arrow keys quickly
Expected: Player moves smoothly, no glitches
```

#### Final Approval Checklist

Before marking project complete:
- [ ] All functional tests pass
- [ ] Kid usability validated
- [ ] 100% Dutch language verified
- [ ] Cross-browser compatibility confirmed
- [ ] Performance targets met
- [ ] Accessibility requirements satisfied
- [ ] Edge cases handled gracefully
- [ ] High scores persist correctly
- [ ] Sound effects work properly
- [ ] GitHub Pages deployment successful
- [ ] README documentation complete
- [ ] Code is commented (in English)
- [ ] No console errors in production

---

## 🚀 DEPLOYMENT INSTRUCTIONS

### For Claude Code to Execute:

1. **Repository Setup:**
```bash
# Create new repository on GitHub named 'letter-jager'
# Clone locally
git clone https://github.com/[username]/letter-jager.git
cd letter-jager
```

2. **Build Project:**
```bash
# Implementation Agent will have created all files
npm install
npm run build
```

3. **Enable GitHub Pages:**
- Go to repository Settings
- Pages section
- Source: GitHub Actions
- Workflow will auto-deploy on push to main

4. **Access Game:**
```
URL: https://[username].github.io/letter-jager/
```

### Manual Deployment (if needed):
```bash
npm run build
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

---

## 📊 SUCCESS METRICS

**Project is successful when:**
1. ✅ 5-year-old can start and play game independently
2. ✅ 7-year-old finds it engaging and appropriately challenging
3. ✅ No English text visible anywhere in UI
4. ✅ High scores save between sessions
5. ✅ Game runs smoothly on tablet and desktop
6. ✅ Parent can add new game with < 1 hour work
7. ✅ Hosting costs remain $0/month
8. ✅ Deployment takes < 5 minutes after code changes

---

## 🎯 PHASE 2 EXPANSION PLAN (Future)

Once Letter Jager is complete and validated, the architecture supports easy addition of:

### Game Ideas for Future:
1. **Slang Spel** (Snake) - Collect letters to grow
2. **Blokken Stapelen** (Tetris) - Dutch letter blocks
3. **Geheugend Spel** (Memory) - Match Dutch word pairs
4. **Rekenen Race** (Math Race) - Simple arithmetic game

### Expansion Process:
1. Create new folder: `src/components/games/NewGame/`
2. Implement game following same patterns
3. Add to `GAMES` object in `src/games/index.js`
4. Update menu to show new game option
5. Deploy (automatic via GitHub Actions)

**No architecture changes needed** - the multi-game foundation is already built!

---

## 📝 NOTES FOR CLAUDE CODE

### Token Budget Considerations:
- This is a complete specification
- Implementation Agent should work systematically through components
- Prioritize core game loop and mechanics first
- Polish UI/animations second
- Testing throughout, not just at end

### Common Pitfalls to Avoid:
1. Don't use English in UI (even placeholder text)
2. Don't make creatures scary (remember: 5-year-old audience)
3. Don't over-complicate maze generation
4. Don't forget responsive design from start
5. Don't skip localStorage error handling

### Quality Standards:
- Code comments in English
- Clean, readable code structure
- No hardcoded magic numbers
- Proper error boundaries
- Console logs removed in production
- Semantic HTML
- WCAG AA color contrast minimum

---

## 🎉 FINAL DELIVERABLES

When project is complete, the following should exist:

### In Repository:
```
letter-jager/
├── src/ (complete React application)
├── public/ (assets)
├── .github/workflows/deploy.yml
├── package.json
├── vite.config.js
├── tailwind.config.js
├── README.md (in Dutch for the kids' reference!)
└── DOCUMENTATION/
    ├── ORCHESTRATION_PLAN.md
    ├── PRODUCT_REQUIREMENTS.md
    ├── DESIGN_SYSTEM.md
    ├── TECHNICAL_ARCHITECTURE.md
    └── QA_TEST_PLAN.md
```

### Live Application:
- Accessible at GitHub Pages URL
- Fully functional Letter Jager game
- Three difficulty levels working
- High scores saving
- Child-friendly interface
- 100% Dutch language
- Responsive across devices

### Handoff to Parent:
- Simple instructions for adding new games
- How to modify word lists
- How to adjust difficulty settings
- Where kids' high scores are stored
- Emergency troubleshooting guide

---

## 🏁 EXECUTION INSTRUCTIONS FOR CLAUDE CODE

### Setup Files

Before beginning, ensure you have both files:

1. **`LETTER_JAGER_MASTER_SPEC.md`** (this file)
   - Complete technical specification
   - Agent orchestration details
   - Full implementation guidelines

2. **`CLAUDE.md`** (place in project root)
   - Persistent instructions for Claude Code
   - Phase-based workflow
   - Validation checkpoints
   - Critical requirements

### Initial Setup Command

```bash
# In your project directory
claude -p "Read LETTER_JAGER_MASTER_SPEC.md and CLAUDE.md, then begin Phase 1: Foundation. 
Stop at each CHECKPOINT for validation before proceeding."
```

### Orchestration Approach

```
BEGIN MULTI-AGENT ORCHESTRATION

Phase 1: Orchestrator Agent
- Parse this specification
- Create detailed execution plan
- Determine agent sequence

Phase 2: Sequential Agent Execution
- Product Agent: Requirements → PRODUCT_REQUIREMENTS.md
- UX/UI Agent: Design → DESIGN_SYSTEM.md
- Architect Agent: Structure → TECHNICAL_ARCHITECTURE.md
- Implementation Agent: Build → Complete application (with CHECKPOINTs)
- QA Agent: Test → QA_TEST_PLAN.md + validation

Phase 3: Integration & Deployment
- Verify all systems integrated
- Run complete test suite
- Deploy to GitHub Pages
- Confirm live site works

Output: Fully functional Letter Jager game with Home page, live on GitHub Pages, ready for kids to play.
```

### Phase-Based Execution with Validation

**The Implementation Agent MUST:**
- Work in phases as defined in CLAUDE.md
- **STOP at each CHECKPOINT** and wait for user validation
- Ask questions if anything is unclear
- Show progress/screenshots at checkpoints
- Never proceed to next phase without confirmation

**Example Checkpoint Interaction:**
```
Implementation Agent:
"✅ CHECKPOINT - Phase 2 Complete: Home & Navigation

Built:
- HomePage component with 'Kies je spel' title
- 3 game tiles (Letter Jager active, Snake/Tetris coming soon)
- Navigation flow working (home → menu → game → home)
- All text in Dutch

Visual preview: [screenshot/description]

Questions before Phase 3:
1. Do the game tiles look child-friendly enough?
2. Should 'coming soon' tiles have different styling?

Ready to proceed to Phase 3: Letter Jager Core? [Y/N]"
```

### Execution Command

Start Claude Code and run:

---

**END OF MASTER SPECIFICATION**

*Version 1.0 - Letter Jager Educational Game Platform*
*Target Completion: Fast but thorough*
*Budget: Limited - Efficiency is key*
*Quality: Child-tested, parent-approved*
