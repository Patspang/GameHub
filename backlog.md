

# GameHub Backlog
## Overview

GameHub is a kid-friendly web game platform (ages 5-7) built with React 19 + Vite 7 + Tailwind CSS, deployed to GitHub Pages. Currently 7 games with Dutch UI, localStorage scoring, and GitHub Actions CI/CD.


## Backlog Items

| ID | Title | Description | Priority | Status | Assigned To | Due Date | Notes |
|---|---|---|---|---|---|---|---|
| BUG-001 | Fix terug button navigation | Back button (`onExit`) not working on game screens — user cannot return to home page | P1 | Done ✓ | | | Fixed: Was passing local setScreen('map') instead of onExit prop to island component in GoudenDennenpappel.jsx. Now properly chains to app-level exit handler |

## Game Ideas (Unvetted)

- [ ] Game Name: `game-id`
    - Description:
    - Difficulty levels: Easy/Normal/Hard or skipDifficulty
    - Target age: 5-7
    - Priority: P0/P1/P2

## Bug Reports

| ID | Title | Severity | Status | Browser/Device | Notes |
|---|---|---|---|---|---|
| BUG-001 | Terug button not functional | High | Done ✓ | All | Fixed: onExit prop wiring in GoudenDennenpappel.jsx |
| BUG-002 | iPad browser freezes on paddestoel collision | High | Done ✓ | iPad Safari | Fixed: Optimized proximity checks with early visibility check, replaced setTimeout with requestAnimationFrame for dialogue batching to reduce callback stacking on iPad Safari |

## Technical Debt

- [ ] Item
- [ ] Item

## GoudenDennenpappel — Three.js Visual/Performance Improvements

| ID | Title | Description | Impact | iPad Perf | Status |
|---|---|---|---|---|---|
| GDP-001 | InstancedMesh for trees | Replace ~46 individual tree Groups (276 draw calls) with InstancedMesh | Identical look, denser forest possible | ✅ Saves ~270 draw calls | Done ✓ |
| GDP-002 | Animated water UV scroll | Scroll water texture offset in frame loop so water looks alive and rippling | Water feels dynamic | ✅ ~0 cost | Done ✓ |
| GDP-003 | PMREMGenerator sky env map | Generate a sky env map at load time so all PBR surfaces pick up sky-blue/warm indirect bounce light | Big realism jump | ✅ One-time load | Done ✓ |
| GDP-004 | Canvas-generated normal maps | Add normal maps for grass, dirt path and bark textures for visible surface depth | Ground has depth and grooves | ✅ Uploaded once | Done ✓ |
| GDP-005 | Shadow map 2048 → 1024 | Reduce directional light shadow map resolution — nearly identical at iPad resolution | — | ✅ Halves shadow pass GPU time | Done ✓ |
| GDP-006 | Limit shadow casters | Only ground, log and gate cast shadows; skip rocks, flowers, pinecones | Nearly identical | ✅ Faster shadow pass | Done ✓ |
| GDP-007 | More trees (after GDP-001) | Add more trees once instancing is in — free after GDP-001 | Denser forest | ✅ Free | Done ✓ |


