
# GameHub

GameHub is een kindvriendelijk webplatform voor educatieve minigames, speciaal ontworpen voor kinderen van 5-7 jaar. De interface is volledig Nederlandstalig en geoptimaliseerd voor touch (tablet en desktop). Het platform draait volledig lokaal (geen backend) en wordt gratis gehost via GitHub Pages.

## Features
- **Meerdere spellen**: Memory, Sudoku, Muntenkluis, Letter Leren, CijferVissen, BosRitje, Tetris, en meer
- **Volledig Nederlands**: UI, feedback en woordlijsten zijn 100% Nederlandstalig
- **Touch-vriendelijk**: Grote knoppen, eenvoudige bediening, werkt op tablet en desktop
- **Spelersnaam**: Naam wordt opgeslagen in localStorage (`gamehub-player-name`) en automatisch overgenomen bij volgende bezoeken
- **Scores & voortgang**: Highscores en speelfrequentie per spel worden lokaal opgeslagen
- **Beta-games**: Nieuwe of experimentele spellen kunnen zichtbaar worden gemaakt met de `?enableBeta=true` URL-parameter of via localStorage (`__GAMEHUB_BETA_ENABLED`)
- **Geen backend**: Alles draait lokaal, geen accounts of internet nodig na laden

## Installatie & lokaal draaien
1. Installeer dependencies:
	```bash
	npm install
	# of
	pnpm install
	```
2. Start de ontwikkelserver:
	```bash
	npm run dev
	# of
	pnpm dev
	```
3. Open [http://localhost:5173](http://localhost:5173) in je browser

## Bouwen & deployen
- Productiebouw: `npm run build` of `pnpm build`
- Preview: `npm run preview`
- Deploy naar GitHub Pages gebeurt automatisch bij push naar `main`

## Architectuur
- **React 19 + Vite 7**
- **Tailwind CSS v4** (design tokens in `src/styles/globals.css`)
- **PixiJS 8** voor canvas/animatie-games
- **Games registry**: Nieuwe spellen toevoegen via `src/games/index.js` en eigen map in `src/components/games/`
- **Teksten**: Alle Nederlandse teksten in `src/constants/dutch-text.js`

## Beta-games activeren
- Via URL: `https://.../GameHub/?enableBeta=true` (zet een flag in localStorage)
- Of handmatig: `localStorage.setItem('__GAMEHUB_BETA_ENABLED', 'true')`

## Naam overnemen
- De spelersnaam wordt opgeslagen in localStorage als `gamehub-player-name` en automatisch gebruikt bij volgende bezoeken.

## Nieuwe spellen toevoegen
Zie `CLAUDE.md` voor een volledig stappenplan.

## Licentie
MIT
