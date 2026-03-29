# De Gouden Dennenpappel — Game Design Document

> Dit document is de centrale referentie voor Claude Code bij het bouwen van elk nieuw level.
> Lees dit document volledig voordat je aan een level begint.
> Alle levels worden één voor één gebouwd, maar passen allemaal binnen de architectuur en regels die hier beschreven staan.

---

## Inhoudsopgave

1. [Technische architectuur](#1-technische-architectuur)
2. [Universele design-principes](#2-universele-design-principes)
3. [Verhaallijn & wereld](#3-verhaallijn--wereld)
4. [Freeks karakter & dialoog-regels](#4-freeks-karakter--dialoog-regels)
5. [Educatieve laag](#5-educatieve-laag)
6. [Level-overzicht](#6-level-overzicht)
7. [Hoofdstuk 1 — Het Oude Woud](#7-hoofdstuk-1--het-oude-woud)
8. [Hoofdstuk 2 — De Zonnige Weide](#8-hoofdstuk-2--de-zonnige-weide)
9. [Hoofdstuk 3 — Het Beekje](#9-hoofdstuk-3--het-beekje)
10. [Hoofdstuk 4 — De Oude Boerderij](#10-hoofdstuk-4--de-oude-boerderij)
11. [Hoofdstuk 5 — De Top van de Heuvel](#11-hoofdstuk-5--de-top-van-de-heuvel)
12. [Epiloog — De Wereldboom](#12-epiloog--de-wereldboom)
13. [Checklist nieuw level](#13-checklist-nieuw-level)

---

## 1. Technische Architectuur

### Stack

- React 19, Vite 7, Three.js
- Volledig touch-first — gebouwd voor iPad en mobiel
- 100% Nederlandstalige UI
- Alle code en comments zijn in het Engels
- Geen externe game engines — alles is custom Three.js

### Bestandsstructuur per level

Elk level leeft in een eigen map onder `src/components/games/GoudenDennenpappel/islands/`:

```
islands/
  OudWoud/
    OudWoud.jsx          ← hoofdcomponent, alle game logic
    OudWoudScene.js      ← Three.js scene builder, retourneert objecten
  ZonnigeWeide/
    ZonnigeWeide.jsx
    ZonnigeWeideScene.js
  [NieuwLevel]/
    [NieuwLevel].jsx
    [NieuwLevelScene].js
```

Het nieuwe level wordt geregistreerd in `islands/island-registry.js`. Voeg het toe aan de array in de gewenste volgorde. Vergrendeling (locked islands) wordt later toegevoegd; voor nu zijn alle geregistreerde eilanden speelbaar.

### Gedeelde engine-componenten

Deze componenten mogen nooit per level opnieuw worden geschreven. Gebruik ze altijd:

- `engine/ThreeCanvas.jsx` — monteert de renderer, draait de game loop, roept `onReady` en `onFrame` aan
- `engine/FirstPersonController.js` — first-person beweging met collision detection; ondersteunt cirkels en AABB boxes
- `engine/InteractionSystem.js` — raycaster voor het detecteren van nabije interacteerbare objecten
- `ui/DialogueBox.jsx` — Freeks dialoogvenster in twee modi: `centered` (groot modaal) en bottom bar
- `ui/TouchControls.jsx` — joystick links, swipe-look rechts, actieknop rechtsonder
- `ui/CollectableHUD.jsx` — opdracht HUD rechtsboven (kan per level worden aangepast of vervangen)
- `ui/IntroScreen.jsx` — naam-invoerscherm bij eerste start van het spel
- `ui/IslandMap.jsx` — De Schatkaart: het eilandkeuze-scherm tussen levels in
- `hooks/useIslandProgress.js` — slaat voltooide eilanden op in localStorage

### Interactie-patroon

Interacties verlopen via nabijheid (proximity) of via de `InteractionSystem` raycaster:

- Nabijheid: elke frame wordt de afstand tussen speler en object gecheckt. Onder een drempel wordt het object automatisch opgepakt of geactiveerd. Gebruik dit voor collectables (paddenstoelen, fragmenten).
- Raycaster: de `InteractionSystem` detecteert waar de speler naar kijkt. Bij een hit verschijnt de actieknop in `TouchControls`. Gebruik dit voor objecten waarmee de speler bewust interacteert (praatpalen, deuren, dieren).

### State-management

- React state (`useState`) voor alles wat de UI beïnvloedt: HUD-tellers, dialoog, voltooiingsstatus
- Refs (`useRef`) voor alles wat Three.js en de game loop nodig hebben: scene-objecten, de controller, animatie-state
- Nooit React state updaten vanuit de Three.js game loop — gebruik refs als brug, en trigger state-updates alleen via callback-refs die in de game loop worden aangeroepen

### Collision

- Bomen: cirkel-collision, straal afhankelijk van schaal
- Muren en obstakels: AABB boxes via `addCollisionBox(minX, maxX, minZ, maxZ)`
- Eilandgrenzen: vier grote AABB boxes rondom het speelveld, toegevoegd na het laden van de scene
- Een collision box kan worden verwijderd via de index die `addCollisionBox` retourneert (gebruik dit als een obstakel wordt weggeruimd)

### Progress opslaan

Wanneer een level voltooid is, roep je `onComplete()` aan — dit is een prop die vanuit `GoudenDennenpappel.jsx` wordt doorgegeven. De progress hook slaat de voltooiing op in localStorage. Roep `onComplete` aan als allerlaatste actie, na de eindscène of het einddialooog.

### Geheugen en GPU-cleanup

`ThreeCanvas` ruimt automatisch de scene op bij unmount (geometrieën, materialen, texturen). Zorg dat je in de scene builder geen losse referenties naar texturen of materialen bewaart buiten de scene-objecten om.

---

## 2. Universele Design-Principes

Deze regels gelden voor elk level, zonder uitzondering.

### 2.1 Visuele stijl

De game gebruikt een warme, low-poly stijl. Alle objecten zijn opgebouwd uit eenvoudige Three.js geometrieën. Er zijn geen externe 3D-modellen of textures bestanden — alle texturen worden procedureel gegenereerd via canvas.

- Kleurenpalet: warme groentonen (#1a3d0f tot #3a6e22), goud (#f0d060), zacht blauw voor water (#1a6e9e), warm bruin voor hout (#7a4a28)
- Grond: altijd een canvas-gegenereerde grasstextuur met normale map voor diepte
- Bomen: altijd de gedeelde pine tree builder uit `OudWoudScene.js` — gebruik `applyTreeWobble` voor de wobble-animatie bij botsingen. Bomen zijn InstancedMeshes voor performance.
- Verlichting: één HemisphereLight (hemel/grond), één AmbientLight, één hoofdzon als DirectionalLight met schaduwen, één zachte fill vanaf de tegenovergestelde zijde
- Sky environment map: altijd `buildSkyEnvMap` aanroepen na scene setup en instellen als `scene.environment`
- Schaduwen: `castShadow` en `receiveShadow` voor alle relevante objecten
- Renderer: ACES Filmic tone mapping, SRGBColorSpace output

### 2.2 UI & HUD

- Alle UI-tekst is 100% Nederlands
- Lettertype: `system-ui, sans-serif` voor alle in-game UI
- Kleur voor primaire UI-tekst: `#f0d060` (goud) voor titels, `#a8e080` (lichtgroen) voor subtitels, `#f5f0e8` (crème) voor dialoogtekst
- HUD heeft altijd een donkere achtergrond met lichte rand: `background: linear-gradient(180deg, #2e1e0a, #1a0e05)`, `border: 2px solid #7a5a2e`
- De terugknop staat altijd linksboven, buiten de touch capture zone
- De actieknop staat altijd rechtsonder, pulserende animatie (`gdp-pulse` keyframe)
- Een crosshair in het midden van het scherm bij first-person levels
- De level-titel staat altijd gecentreerd bovenin, semi-transparante achtergrond

### 2.3 Touch & controls

- Links 45% van het scherm: virtuele joystick voor lopen
- Rechts 55% van het scherm: swipe om rond te kijken
- De joystick-indicator wordt omhoog geschoven als er een dialoog-balk onderin zichtbaar is (`joystickBottomOffset` prop)
- Touch events worden altijd als `passive: false` geregistreerd om `preventDefault()` te kunnen aanroepen
- De actieknop en de terugknop zitten buiten de touch-capture div zodat taps altijd doorkomen

### 2.4 Camera

- First-person perspectief, ooghoogte 1.7 units
- FOV: 72 graden
- Near clipping: 0.1, far clipping: 200
- Pitch gelimiteerd tot ±36 graden (geen volledig omhoog/omlaag kijken)
- De startpositie van de camera wordt gedefinieerd in de scene builder als `startPosition: new THREE.Vector3(...)`

### 2.5 Dialoog — Freek

- Freeks dialoogvenster heeft altijd zijn portret (🧝 emoji, groen achtergrond) en de naam "FREEK" in kleine letters
- Twee modi: `centered: true` voor grote instructiemomenten (met overlay), geen centered voor de bottom-bar variant
- De speler tikt altijd handmatig door dialoog heen — geen automatisch doorspoelen
- Nooit meer dan twee zinnen per dialoogkaart
- Alle dialoogtekst staat in `data/freek-dialogues.js`, nooit hardcoded in het level-component
- `autoClose: 5000` is beschikbaar voor niet-kritieke berichten die vanzelf verdwijnen

### 2.6 Animaties

- Wateranimaties: verschuif de texture offset per frame (`offset.x += delta * 0.012`, `offset.y += delta * 0.008`)
- Rollende objecten: ease-out animatie via tijdspercentage, sla de startpositie en doelpositie op in een ref
- Boom-wobble: sinus-functie met dalende amplitude over 700ms via `applyTreeWobble`
- Gloeiende collectables: gebruik een `PointLight` op het object en een emissive material
- Alle animatie-state leeft in refs, nooit in React state

### 2.7 Performance

- Bomen zijn altijd InstancedMesh — nooit losse Mesh per boom
- Canvas-texturen worden één keer aangemaakt en hergebruikt — nooit per frame
- Gebruik `Math.min(delta, 0.05)` als cap op de delta time om grote sprongen bij tabwissels te voorkomen
- Gebruik pre-allocated Three.js objecten (Vector3, Matrix4, Euler, Quaternion) voor berekeningen in de game loop — nooit `new` aanroepen in de frame callback
- `raycaster.far` instellen op de minimale nuttige afstand, niet onbeperkt laten

---

## 3. Verhaallijn & Wereld

### De centrale premisse

De Gouden Dennenpappel is het hart van het bos. Eens per honderd jaar, als de eerste sneeuw valt, kan hij worden gevonden door iemand met bosgeluk. Volwassenen verliezen bosgeluk als ze ouder worden — daarom kan Freek de Dennenpappel niet zelf vinden. Hij heeft een kind nodig.

Als de Dennenpappel niet op tijd naar de Wereldboom wordt gebracht, vriest het bos voor altijd in.

### De wereld

Het spel speelt zich af op vijf eilanden, omringd door water. Elk eiland vertegenwoordigt een ander deel van het betoverde bos. De speler reist via De Schatkaart (het eilandkeuze-scherm) van eiland naar eiland. Elk voltooid eiland laat een kaartfragment achter dat uiteindelijk de weg naar de Wereldboom onthult.

### De drie magische regels van de Dennenpappel

Freek vertelt deze regels gespreid over de eerste drie hoofdstukken:

1. De Dennenpappel kan niet gestolen worden — alleen gevonden door iemand die echt helpt.
2. Hij schijnt goud als het bos gezond is. Nu is hij donker, want het bos heeft hulp nodig.
3. Wie hem aanraakt, hoort het bos ademen — een geluid dat maar weinig mensen kennen.

### De kaartfragmenten

Elk kaartfragment toont een silhouet van het volgende eiland:

- Fragment 1 (Oud Woud): silhouet van een weide met een grote zon
- Fragment 2 (Zonnige Weide): silhouet van een kronkelend beekje
- Fragment 3 (Beekje): silhouet van een boerderij met een silo
- Fragment 4 (Boerderij): silhouet van een heuvel met een boom op de top
- Fragment 5 (Top van de Heuvel): silhouet van de Wereldboom — enorm, stralend

### Freeks geheim

Freeks grootmoeder vond de Gouden Dennenpappel al eens — zij was de laatste die hem vond, honderd jaar geleden. Ze verstopte hem bewust terug omdat het bos hem nodig had. Freek weet dit, maar vertelt het pas in hoofdstuk 4, als hij terugdenkt aan zijn jeugd op de boerderij.

---

## 4. Freeks Karakter & Dialoog-Regels

### Wie is Freek?

Freek is de laatste Oudhoedenaar — lid van een eeuwenoud gilde dat het bos beschermt. Hij is oud, vriendelijk, en een beetje verlegen als hij een compliment krijgt. Hij draagt altijd een versleten groene hoed met een kleine dennenappel erop. Hij praat eenvoudig en direct, maar weet heel veel.

### Dialoog-schrijfregels (voor alle tekst in freek-dialogues.js)

- Maximaal twee korte zinnen per kaart — nooit meer
- AVI-3 niveau: korte woorden, geen samengestelde bijzinnen, concrete beelden
- Freek stelt altijd een vraag als hij een opdracht geeft — hij geeft nooit het antwoord
- Freek viert elk succes overdreven enthousiast ("Yes! Geweldig! Super!")
- Bij een fout: altijd "Hmm, probeer het nog een keer!" — nooit iets negatiever dan dat
- Freek spreekt het kind altijd aan bij naam (de naam wordt meegegeven als prop `playerName`)
- Freek maakt nooit grapjes over de moeilijkheid van een opdracht — hij gelooft altijd dat het kind het kan

### Emotionele arc per hoofdstuk

- H1: Enthousiast en bemoedigend — dit is het begin van het avontuur
- H2: Warm en blij — hij houdt van de weide, dit is zijn favoriete plek
- H3: Bezorgd maar hoopvol — het beekje is bijna droog, maar samen lossen we het op
- H4: Nostalgisch en een beetje stil — hier speelde hij als kind, dit raakt hem
- H5: Rustig en vol vertrouwen — hij weet dat het kind dit kan, ook al zegt hij weinig

### Freeks geheimhouding

Freek is mysterieus over de Dennenpappel. Hij geeft altijd net genoeg informatie om verder te gaan, maar houdt altijd iets achter. Hij lijkt meer te weten dan hij zegt. Dit gevoel moet in elk hoofdstuk aanwezig zijn — een kleine hint, een pauze, een blik opzij.

---

## 5. Educatieve Laag

### Kernprincipe: volledig embedded

Leer- en rekenopdrachten zijn altijd volledig verweven met de spelwereld. Ze zijn nooit losstaande quizschermen of pop-ups die losstaan van het verhaal. De opdracht is de sleutel die de wereld opent — zonder de opdracht op te lossen gaat het spel letterlijk niet verder.

Als een leeropdracht eruit geknipt zou kunnen worden zonder dat het level kapot gaat, zit hij verkeerd in het design.

### Hoe leeropdrachten werken in de wereld

- De opdracht is fysiek zichtbaar als onderdeel van een object in de 3D wereld (een bordje op een boomstam, getallen op stenen, een raadsel op een deur)
- Er is geen apart "opdrachtscherm" dat het spel onderbreekt
- De speler lost de opdracht op door te interacteren met de wereld, niet door te typen of een formulier in te vullen
- Feedback is altijd visueel en auditief — een animatie, een geluid, een lichtflits — nooit een tekst die uitlegt wat er mis ging
- Fout antwoord: het object schudt, een vriendelijk geluid, en de speler kan het opnieuw proberen. Geen straf, geen levens, geen game over
- Goed antwoord: het object reageert direct en dramatisch op de actie (de steen klikt op zijn plek, de deur gaat open, de boomstam rolt weg)

### Moeilijkheidsopbouw over de hoofdstukken

De leeropdrachten worden per hoofdstuk moeilijker, passend bij de leerlijnen van groep 4:

- H1: Optellen tot 10, één CVC-woord lezen
- H2: Tellen met stappen van 2, kleurwoorden lezen en matchen
- H3: Getallen op volgorde leggen, een aanwijswoord in een zin begrijpen
- H4: Tafels van 2 en 5, een rijmend raadsel lezen en beantwoorden
- H5: Gemengd optellen en aftrekken, een korte zin zelfstandig lezen

### Maximaal drie keuze-opties

Elke keuze-opdracht heeft altijd twee of drie antwoord-opties. Nooit meer. De opties zijn grote, aanraakbare vlakken in de wereld — geen kleine knoppen.

### Freek als pedagoog

Freek stelt altijd een vraag als aanleiding voor de opdracht. Hij geeft nooit het antwoord, zelfs niet als hint. Hij wacht tot het kind iets probeert. Bij een fout zegt hij alleen "Hmm, probeer het nog een keer!" Bij succes viert hij het uitbundig, altijd persoonlijk gericht aan het kind met zijn of haar naam.

---

## 6. Level-Overzicht

| # | Naam | Thema | Reken-opdracht | Taal-opdracht | Status |
|---|------|-------|----------------|---------------|--------|
| 1 | Het Oude Woud | Kracht | Optellen paddenstoelen | CVC-woord "DUW" lezen | Gebouwd |
| 2 | De Zonnige Weide | Vriendschap | Tellen met stappen van 2 | Kleurwoorden lezen & matchen | Te bouwen |
| 3 | Het Beekje | Zorg | Getallen op volgorde | Aanwijswoord in een zin | Te bouwen |
| 4 | De Oude Boerderij | Herinnering | Tafel van 2 en 5 | Rijmraadsel lezen | Te bouwen |
| 5 | De Top van de Heuvel | Vertrouwen | Gemengd optellen/aftrekken | Korte zin zelfstandig lezen | Te bouwen |

---

## 7. Hoofdstuk 1 — Het Oude Woud

> Status: volledig gebouwd. Dit hoofdstuk dient als referentie-implementatie voor alle volgende levels.

### Verhaalmoment

De speler ontvangt een brief van Freek en arriveert in het Oude Woud. Freek legt uit dat er iets magisch in het bos verborgen is. De speler moet drie magische paddenstoelen vinden, een boomstam van het pad rollen, en een kaartfragment ophalen.

### Eiland-afmetingen

- Breedte: 56 units (x: -20 tot +36)
- Diepte: 92 units (z: -73 tot +19)
- Middelpunt: x=8, z=-27
- Startpositie speler: x=0, y=1.7, z=7 (vlak voor de poort)

### Omgeving

- Dicht dennenbos aan beide zijden van een slingerende grindweg
- Het pad loopt van de ingangspoort (z=5) naar het zuiden, buigt dan naar rechts, en loopt door naar de boomstam (z=-50)
- Het kaartfragment ligt net voorbij de boomstam (z=-53.5)
- Rondom het eiland: water met een animerende texture offset
- Klif-randen rondom het eiland in zandkleur
- Ingangspoort met het bordje "Het Oude Woud"

### Drie paddenstoelen

- Paddenstoel 1: x=10.2, z=-7.0 — net rechts van de ingangspoort, makkelijk te vinden
- Paddenstoel 2: x=-9.8, z=-30.0 — links van het pad, achter een groepje bomen
- Paddenstoel 3: x=26.2, z=-38.0 — ver rechts, vereist verkenning
- Collectie-radius: 1.8 units (speler loopt erdoorheen)
- Bij ophalen: paddenstoel wordt onzichtbaar, HUD-teller gaat omhoog, Freek reageert

### Boomstam

- Positie: x=14, z=-50
- Wordt actief nadat alle drie paddenstoelen zijn verzameld
- Collision box: x: 11.0–17.0, z: -51.4 tot -48.6
- Bij inlopen: collision box wordt verwijderd, boomstam rolt zuidwaarts weg met ease-out animatie
- Rolsnelheid en rolafstand zijn afhankelijk van de loopsnelheid (velocity-based)

### Kaartfragment

- Positie: x=14, z=-53.5
- Glanzend geel vlak op de grond met een PointLight erboven
- Actief pas nadat de boomstam is gerold
- Bij ophalen: fragment verdwijnt, einddialooog van Freek start, dan `onComplete()`

### HUD

- Drie rode cirkels voor de paddenstoelen (vullen zich bij collectie)
- Logpictogram met tekst "Pad geblokkeerd" / "Pad vrij!"

### Leeropdrachten

Hoofdstuk 1 heeft zijn leeropdrachten nog niet geïmplementeerd. Ze worden toegevoegd in een latere iteratie als volgt:

Reken-opdracht: op de drie paddenstoelen staan getallen (3, 4, 3 — totaal 10). Na het vinden van alle drie verschijnt er een klein bordje naast Freek: "Hoeveel paddenstoelen heb je gevonden?" met drie keuzes: 7 / 8 / 10. De juiste keuze ontgrendelt de boomstam. Het bordje is een fysiek object in de wereld (een houten bord op een paal), geen UI overlay.

Taal-opdracht: de boomstam heeft een bordje erop: het woord "DUW" in grote houten letters. De boomstam rolt pas weg nadat de speler het bordje heeft aangetikt. Freek zegt: "Wat staat er op het bordje? Tik het aan als je het weet." Er is geen keuzemenu — de speler tikt het bordje zelf aan, waarna een geluid het woord uitspreekt en de stam rolt.

### Dialoogscript (freek-dialogues.js — OUD_WOUD_DIALOGUES)

Intro (centered, bij start):
1. "Hoofdstuk 1: Het Oude Woud"
2. "Hoi [naam]! Ik ben Freek."
3. "Dit is het eerste hoofdstuk van ons avontuur."
4. "Zoek de drie paddenstoelen en vind het eerste stukje van de schatkaart."
5. "Ik ben boswachter. Ik ken dit bos goed."
6. "Er is iets bijzonders verstopt in dit bos."
7. "Het heet de Gouden Dennenpappel."
8. "Maar ik heb jouw hulp nodig!"
9. "Succes! Je kunt het!"

Bij eerste paddenstoel:
1. "Goed zo! Je vond de eerste paddenstoel."
2. "Zoek er nog twee. Kijk goed rond!"

Bij tweede paddenstoel: geen dialoog — vaart houden.

Bij alle paddenstoelen (centered):
1. "Yes! Alle drie de paddenstoelen!"
2. "Nu moet je verder lopen op het pad."
3. "Maar er ligt een grote boomstam in de weg."
4. "Loop er recht op af. Dan rolt hij vanzelf weg!"

Bij boomstam gerold:
1. "Sterk gedaan!"
2. "Nu is het pad vrij."
3. "Loop verder. Het kaartfragment ligt verderop."

Bij fragment gevonden (centered):
1. "Je hebt het kaartfragment gevonden!"
2. "Dit is een stuk van de schatkaart."
3. "Er zijn nog meer stukken te vinden."
4. "Op naar het volgende eiland!"

---

## 8. Hoofdstuk 2 — De Zonnige Weide

### Verhaalmoment

Na het donkere dennenbos opent zich een grote zonnige weide — een plotse contrastvol moment. De weide staat vol bloemen, maar ze zijn door een storm door elkaar gegooid. De vlinders weten niet meer bij welke bloem ze horen en vliegen ronddwalen. Freek legt uit dat bloemen en vlinders bij elkaar horen, en dat alleen iemand met bosgeluk ze kan samenbrengen.

Dit is het vriendschaps-hoofdstuk: iets bij elkaar brengen wat uit elkaar is.

### Eiland-afmetingen

- Breedte: 50 units (x: -25 tot +25)
- Diepte: 70 units (z: -65 tot +5)
- Open grasvlakte in het midden, boomrijen aan de randen
- Startpositie speler: x=0, y=1.7, z=3

### Omgeving

- Open grasvlakte met lage heuveltjes (verhoogde grondvlakken, geen steile hellingen)
- Verspreid over de weide: grote kleurrijke bloemen (geen bomen in het midden)
- Bomen alleen langs de randen van het eiland
- Felle blauwe lucht — geen mist (contrast met het Oude Woud)
- Zonnige gouden verlichting — een lagere zonhoek dan hoofdstuk 1
- Vlinders: animated billboards (platte vlakken die altijd naar de camera gericht zijn) die rondvliegen in een simpele sinusbaan

### Drie bloem-vlinder-paren

De kern van dit level zijn drie bloemen en drie vlinders. Elke bloem heeft een kleur en een naam-bordje. Elke vlinder heeft dezelfde kleur en draagt een klein kaartje.

Paar 1: Rood — bloem op x=-8, z=-15 — vlinder zweeft bij x=5, z=-10
Paar 2: Blauw — bloem op x=10, z=-32 — vlinder zweeft bij x=-10, z=-28
Paar 3: Geel — bloem op x=-5, z=-48 — vlinder zweeft bij x=12, z=-44

### Bloemen

Elke bloem bestaat uit:
- Een grote bloemkop (gestapelde ringen van blaadjes, in de kleur van het paar)
- Een groene stengel
- Een houten bordje naast de bloem waarop de kleur staat geschreven: "ROO", "BLA", of "GEL" (drie letters — bewust kort voor AVI-3 niveau). Schrijf dit als 3D-tekst op een houten plankhje via een canvas texture.
- De bloem licht subtiel op als de speler dichtbij is

### Vlinders

Elke vlinder bestaat uit:
- Twee PlaneGeometry-vleugels in de kleur van het paar, opgezet als billboard (altijd richting camera)
- Een klein kaartje dat aan de vlinder hangt, ook met de drie-letter kleurcode
- De vlinder beweegt langs een simpele sinusbaan (2-3 meter breed, 1.5 meter hoog)
- De vlinder heeft een HoverRadius van 3 units — als de speler dichtbij komt, stopt de vlinder met vliegen en kijkt de speler aan (billboard blijft, vlieganimatie pauzeert)

### De match-mechanic (embedded leeropdracht)

Dit is de kernmechanic van het level. De speler brengt een vlinder naar zijn bloem door er naartoe te lopen terwijl de vlinder gestopt is.

Stap voor stap:
1. Speler loopt naar een vlinder (binnen 3 units)
2. Vlinder stopt en zweeft op dezelfde plek
3. Freek zegt: "Deze vlinder zoekt zijn bloem. Welke bloem past erbij?"
4. Speler loopt met de vlinder mee (vlinder "volgt" de speler op 1 unit afstand) naar een bloem
5. Als de speler een bloem nadert (binnen 2.5 units): een visueel effect op de bloem (blaadjes trillen)
6. Als het de juiste bloem is: de vlinder landt op de bloem, bloem groeit even op, vrolijk geluid, Freek juicht
7. Als het de verkeerde bloem is: de vlinder schudt van nee, vrolijk geluid, Freek zegt "Hmm, probeer het nog een keer!"

De vlinder "volgt" de speler technisch via een ref die bijhoudt of de speler een vlinder heeft "opgepakt". De vlinderpositie wordt elke frame bijgewerkt naar de spelerpositie min 1 unit in looprichting.

### Tellen met stappen van 2 (embedded reken-opdracht)

Elke bloem heeft een aantal blaadjes dat deelbaar is door 2: 4, 6, of 8 blaadjes. De bijpassende vlinder heeft hetzelfde aantal stippen op zijn vleugels.

Freek zegt bij de eerste vlinder: "Kijk eens goed naar de stippen op de vleugels. Tel ze: 2, 4, 6... Welke bloem heeft net zo veel blaadjes?"

De speler hoeft dit niet expliciet te beantwoorden — de match is correct als ze bij de juiste bloem uitkomen. Maar het visuele tellen is de hint die hen naar de juiste bloem leidt.

### Kleurwoorden lezen (embedded taal-opdracht)

Op elke bloem staat een drie-letter kleurwoord op het bordje. De vlinder draagt hetzelfde woord. De speler moet de woorden visueel matchen om de juiste bloem te vinden.

Dit is geen expliciete lesopdracht — het kind doet het automatisch als onderdeel van het matchen. Freek noemt de bordjes nooit expliciet. Maar een kind dat kan lezen heeft een extra aanwijzing naast de kleur.

### Kaartfragment

Nadat alle drie de paren zijn gematcht, daalt het kaartfragment langzaam uit de lucht neer in het midden van de weide — als een blad dat valt. Het fragment gloeit goud. Freek zegt dat het bos blij is.

Positie na landing: x=0, z=-30

### HUD

Drie kleine vlinder-icoontjes (gebruik een eenvoudige vlindervorm in canvas). Ze vullen zich als elk paar gematcht is.

### Dialoogscript (ZONNIGE_WEIDE_DIALOGUES)

Intro (centered):
1. "Hoofdstuk 2: De Zonnige Weide"
2. "Wat mooi hier, [naam]! Dit is mijn favoriete plek."
3. "Maar kijk — de vlinders zijn verdwaald!"
4. "Een grote storm blies ze allemaal door elkaar."
5. "Elke vlinder hoort bij één bloem."
6. "Help jij ze de weg terug te vinden?"

Bij eerste vlinder benaderd:
1. "Deze vlinder zoekt zijn bloem."
2. "Welke bloem past erbij? Kijk goed!"

Bij foute match:
1. "Hmm, dat klopt nog niet."
2. "Probeer het nog een keer!"

Bij eerste juiste match:
1. "Yes! [naam], je deed het!"
2. "Zoek nu de andere twee."

Bij alle paren gematcht (centered):
1. "Alle vlinders zijn thuis!"
2. "Kijk, het kaartfragment valt uit de lucht."
3. "Het bos is blij. Pak het op!"

Bij fragment opgepakt (centered):
1. "Geweldig! Fragment twee gevonden."
2. "Er zijn er nog meer. Kijk — de kaart toont een beekje."
3. "Op naar het volgende eiland!"

---

## 9. Hoofdstuk 3 — Het Beekje

### Verhaalmoment

Het beekje is bijna opgedroogd — de stenen liggen op de verkeerde plek en blokkeren het water. Freek maakt zich zorgen: zonder het beekje kan het bos niet leven. Het kind helpt de stenen terug op de goede volgorde te leggen zodat het water weer kan stromen. Onder het stromende water verschijnt het derde kaartfragment.

Dit is het zorg-hoofdstuk: iets repareren dat kapot is gegaan.

### Eiland-afmetingen

- Breedte: 45 units (x: -22 tot +23)
- Diepte: 75 units (z: -70 tot +5)
- Een beekbedding loopt van noord naar zuid door het midden van het eiland
- Startpositie speler: x=0, y=1.7, z=3

### Omgeving

- Zanderig, droog beekbedding in het midden (de grond is bruin en kleiig, niet groen)
- Aan de linkerkant van het beekje: lage wilgenbomen (hangend, blauwgroen)
- Aan de rechterkant: open grasland met enkele sparren
- Bron van het beekje: een kleine waterval in het noorden (z=-55), nu bijna droog (weinig watereffect)
- Monding van het beekje: een poel in het zuiden (z=-10), nu droog
- Als het beekje hersteld is: een wateranimatie stroomt van noord naar zuid door het bedding

### Vijf stenen

In het beekbedding liggen vijf grote stenen door elkaar. Elke steen heeft een getal erop gegraveerd (als canvas texture): 5, 2, 8, 1, 4.

De stenen zijn geplaatst op willekeurige posities dwars door het beekbedding:
- Steen "5": x=-1, z=-20
- Steen "2": x=3, z=-28
- Steen "8": x=-2, z=-35
- Steen "1": x=2, z=-18
- Steen "4": x=-3, z=-42

De correcte volgorde is 1 → 2 → 4 → 5 → 8, van noord naar zuid langs het beekbedding.

Er zijn vijf stap-posities in het beekbedding waar stenen thuishoren:
- Positie A (meest noordelijk): z=-18 — hier hoort steen "1"
- Positie B: z=-26 — steen "2"
- Positie C: z=-33 — steen "4"
- Positie D: z=-40 — steen "5"
- Positie E (meest zuidelijk): z=-48 — steen "8"

### De stap-mechanic (embedded leeropdracht)

De speler loopt naar een steen en tikt hem aan (actieknop). De steen wordt "vastgepakt" (hij zweeft 0.5 units boven de grond en volgt de speler). De speler loopt naar de juiste stap-positie in het beekbedding.

Als de steen boven een stap-positie zweeft:
- Juiste steen: de steen daalt naar beneden, klikt op zijn plek met een steengeluid, licht even op
- Foute steen: de steen schudt en komt terug bij de speler

Freek geeft geen directe aanwijzingen voor welke steen waar hoort — dat ontdekt het kind zelf via het principe van oplopende volgorde. Maar Freek zegt bij de eerste steen: "De stenen moeten op volgorde liggen. Begin bij de kleinste!"

Als alle vijf stenen op de juiste plek liggen, begint het water te stromen (blauw watereffect verschijnt in het beekbedding, animerend van noord naar zuid).

### Aanwijswoord in een zin (embedded taal-opdracht)

Als het water begint te stromen, verschijnt er op een steen aan de kant van het beekje een inscriptie. Freek zegt de inscriptie voor, maar met een gat: "Het water stroomt naar ___." Op drie losse stenen verschijnen drie woordopties als billboards: LINKS / RECHTS / BENEDEN.

De speler loopt naar de juiste steen. Het antwoord is BENEDEN (het water stroomt de heuvel af naar het zuiden). Bij de juiste keuze: het watereffect versnelt even, het fragment verschijnt onder water.

### Kaartfragment

Het kaartfragment ligt op de bodem van het beekje op x=0, z=-33. Als het water stroomt en de taal-opdracht is opgelost, wordt het fragment zichtbaar (het licht op van onder het water). De speler loopt erdoorheen om het op te pakken.

### HUD

Vijf stap-slots weergegeven als kleine steenvormen. Ze vullen zich als elke steen op de juiste plek is gelegd.

### Dialoogscript (BEEKJE_DIALOGUES)

Intro (centered):
1. "Hoofdstuk 3: Het Beekje"
2. "O nee, [naam]. Het water staat bijna stil."
3. "De stenen liggen op de verkeerde plek."
4. "Het water weet niet meer welke kant op."
5. "Help jij de stenen op de goede volgorde te leggen?"
6. "Begin bij de kleinste!"

Bij eerste steen opgepakt:
1. "Goed zo! Je hebt een steen."
2. "Waar hoort hij thuis?"

Bij fout gelegd:
1. "Hmm, probeer het nog een keer!"

Bij alle stenen goed:
1. "Het water stroomt weer! Hoor je dat?"
2. "Nu nog één vraag..."

Bij taal-opdracht goed:
1. "Juist! Het water stroomt naar beneden."
2. "En kijk — het kaartfragment!"

Freeks geheim (centered, na fragment ophalen):
1. "Weet je, [naam]... mijn grootmoeder kende dit beekje."
2. "Zij vond de Gouden Dennenpappel. Lang geleden."
3. "Ze verstopte hem weer. Omdat het bos hem nodig had."
4. "Jij bent de eerste die ik dit vertel."

Op naar het volgende:
1. "De kaart toont een boerderij. Kom, we gaan."

---

## 10. Hoofdstuk 4 — De Oude Boerderij

### Verhaalmoment

Aan de rand van het bos staat een verlaten boerderij. Hier woonde vroeger een familie die het bos bewaakte samen met Freeks gilde. Nu zijn alleen de dieren over. Ze zijn verdrietig en weten elk één deel van een raadsel dat de weg naar het volgende kaartfragment wijst. Freek wordt hier stil en nostalgisch — hij speelde hier als kind.

Dit is het herinneringsschoofdstuk: het verleden heeft waarde.

### Eiland-afmetingen

- Breedte: 52 units (x: -26 tot +26)
- Diepte: 78 units (z: -73 tot +5)
- Het boerderijgebouw staat centraal op x=0, z=-30
- Erf en pad voor de boerderij: z=-10 tot z=-28
- Achterland achter de boerderij: z=-30 tot z=-65

### Omgeving

- Het boerderijgebouw zelf: een eenvoudig rechthoekig gebouw met een punt-dak, rood dak, witte muren (canvas texturen)
- Een grote silo naast de boerderij: x=15, z=-30
- Een houten omheining rondom het erf
- Een hooiberg achter de boerderij: x=-10, z=-48 — het kaartfragment is hierin verborgen
- Grasland met her en der boerderijobjecten: een watertrog, een oud karretje, een roestige pomp
- Bomen alleen ver op de achtergrond
- Sfeer: warmer licht dan de vorige eilanden — een late namiddag gouden uur

### De drie dieren

Elk dier staat op een vaste plek op het erf of het land. Ze zijn eenvoudige low-poly modellen (opgebouwd uit BoxGeometry en SphereGeometry). Ze bewegen met een simpele idle-animatie (licht op en neer bewegen).

Koe: x=-8, z=-18 — op het erf, links van de ingang
Schaap: x=10, z=-20 — bij de omheining, rechts van de ingang
Uil: x=5, z=-55 — op een paal achter de boerderij, 's nachts actief (maar het is namiddag, dus hij zit te slapen met zijn ogen dicht)

### De raadsel-mechanic

Elk dier geeft één zin van een driedelig rijmend raadsel. De speler bezoekt ze in willekeurige volgorde. Elk dier heeft een bordje bij zich waarop de zin staat (canvas texture), en het dier "spreekt" de zin uit via Freeks dialoogvenster (Freek vertaalt omdat het kind de dierentaal niet spreekt).

Het raadsel, gespreid over de drie dieren:
- Koe: "Ik heb vier poten en eet gras,"
- Schaap: "mijn vacht is wit als de sneeuw in het bos,"
- Uil: "in de hooiberg lig ik te wachten op jou."

Samen vormen ze het antwoord: in de hooiberg. De speler hoeft geen antwoord te kiezen — het raadsel wijst de weg. Na alle drie de dieren bezocht te hebben, verschijnt er een glinstering in de hooiberg.

### Tabel van 2 en 5 (embedded reken-opdracht)

Bij de koe staat een houten bord: "De koe geeft elke dag 2 emmers melk. Hoeveel emmers zijn dat in 5 dagen?" Op drie naburige stenen staan de opties: 7 / 10 / 15. De speler loopt naar de juiste steen.

Het juiste antwoord is 10 (2 × 5). Bij de juiste steen: de koe maakt een blij geluid, Freek juicht.

Dit moet worden opgelost voordat de koe haar deel van het raadsel geeft — de koe staat pas te wachten als het sommetje klopt.

### Rijmraadsel lezen (embedded taal-opdracht)

Dit is de raadsel-mechanic zelf. De drie raadselzinnen zijn op de bordjes bij de dieren leesbaar voor het kind. Freek leest ze ook voor, maar een kind dat zelf leest heeft een extra plezier: ze kunnen het alvast raden voor Freek uitgesproken heeft.

De uil slaapt en reageert pas als de speler hem aanraakt (actieknop). Dan klappen zijn ogen open (animatie) en geeft hij zijn deel van het raadsel.

### Kaartfragment

Het fragment zit in de hooiberg. De hooiberg heeft een zacht goudkleurig glinsteren zodra alle drie de raadselzinnen zijn gehoord. De speler loopt naar de hooiberg toe en tikt hem aan. De hooiberg "opent" (de bovenkant schuift weg als een animatie) en het goudglanzende fragment komt omhoog.

### HUD

Drie dieren-icoontjes (koe, schaap, uil). Ze vullen zich als elk dier is bezocht en zijn deel van het raadsel gegeven heeft.

### Dialoogscript (BOERDERIJ_DIALOGUES)

Intro (centered):
1. "Hoofdstuk 4: De Oude Boerderij"
2. "Ik ken deze plek, [naam]. Hier speelde ik vroeger."
3. "De familie Bosveld woonde hier. Ze pasten op het bos."
4. "Nu zijn ze weg. Maar de dieren herinneren zich alles."
5. "Praat met de koe, het schaap, en de uil."
6. "Ze weten samen waar het kaartfragment is."

Freek bij aankomst boerderij (bottom bar, automatisch):
1. "Mijn grootmoeder kende mevrouw Bosveld goed."
2. "Hier leerde ik wat het betekent om voor het bos te zorgen."

Koe — voor de rekensom:
1. "De koe heeft een vraag voor jou, [naam]."
2. "Ze geeft elke dag 2 emmers melk. Hoeveel is dat in 5 dagen?"

Koe — na juiste som:
1. "Goed gerekend! De koe is blij."
2. "Ze fluistert haar deel van het raadsel..."

Schaap:
1. "Het schaap heeft ook iets te zeggen."
2. "Luister goed naar zijn zin."

Uil — voor aantikken:
1. "De uil slaapt. Tik hem zachtjes aan."

Uil — na aantikken:
1. "Zijn ogen gaan open! Hij heeft de laatste zin."

Na alle drie (centered):
1. "Heb je het begrepen, [naam]?"
2. "De hooiberg! Het kaartfragment ligt in de hooiberg."

Bij fragment gevonden (centered):
1. "Je hebt het gevonden!"
2. "Fragment vier. Bijna klaar."
3. "De kaart toont een heuvel. De laatste."
4. "Ik ben trots op jou."

---

## 11. Hoofdstuk 5 — De Top van de Heuvel

### Verhaalmoment

De schatkaart is compleet. Hij wijst naar de Wereldboom op de top van de heuvel. De weg omhoog is bezaaid met vijf puzzelstenen — elk met een som. Alle sommen hebben hetzelfde antwoord. De juiste volgorde opent de poort naar de Wereldboom. Binnenin de Wereldboom, in een holle knoop, ligt de Gouden Dennenpappel.

Dit is het vertrouwens-hoofdstuk: geloven dat je het kunt.

### Eiland-afmetingen

- Breedte: 44 units (x: -22 tot +22)
- Diepte: 80 units (z: -75 tot +5)
- De heuvel is een oplopende geometrie — de grond stijgt geleidelijk van z=0 naar de top op z=-60
- De Wereldboom staat op de top: x=0, z=-65

### Omgeving

- De heuvel is technisch gezien een reeks terrasvormen (flat stukken grond op oplopende y-posities, verbonden via zachte hellingen) — geen echte hoogte-heightmap
- Bomen langs de randen van de heuvel, dunner wordend naar boven
- De Wereldboom bovenaan: een enorme boom (5x groter dan een gewone boom), met een goudkleurige glinstering in de stam
- Een stenen poort voor de Wereldboom: x=0, z=-58
- Het pad omhoog is bezaaid met vijf puzzelstenen op oplopende terrassen

### De vijf puzzelstenen

Elke steen heeft een som erop (canvas texture). Alle sommen geven het antwoord 7:
- Steen A (terrras 1): 3 + 4
- Steen B (terras 2): 10 - 3
- Steen C (terras 3): 2 + 5
- Steen D (terras 4): 14 - 7
- Steen E (terras 5): 6 + 1

De stenen staan als obstakel op het pad — de speler kan er niet langs zonder ze te activeren. Elke steen heeft een actieknop. Als de speler een steen activeert, verschijnt er een klein keuzemenu van drie keuzes: 5 / 7 / 9. De juiste keuze laat de steen opzijrollen (weganimatie). De foute keuze laat de steen trillen.

Let op: dit is de enige keer in het spel dat er een keuze-popup verschijnt als klein UI element. Het is bewust gehouden bij drie opties, grote aanraakbare vlakken, geen tekst die de vraag herhaalt.

### Korte zin zelfstandig lezen (embedded taal-opdracht)

De stenen poort voor de Wereldboom heeft een inscriptie in twee regels. Freek leest de eerste regel voor: "Alleen wie helpt, mag verder." De tweede regel leest het kind zelf — er is een korte pauze, en dan verschijnt de tekst langzaam letter voor letter: "Jij hebt geholpen."

Dit is het enige moment in het spel waar het kind gevraagd wordt iets zelfstandig te lezen zonder Freek die het ook voorleest. Freek zegt: "Er staat nog iets. Kun jij het lezen?" Dan verschijnt de tekst.

### De poort en de Wereldboom

De stenen poort gaat open (beide deurpanelen schuiven uit elkaar) nadat alle vijf stenen zijn opgelost EN de taal-opdracht is voltooid. De speler loopt door de poort naar de Wereldboom.

De Wereldboom heeft een holte in de stam op ooghoogte (y=1.7). Daarin ligt de Gouden Dennenpappel — een kleine goudkleurige dennenappelvorm die pulsend gloeit. De speler loopt ernaartoe.

### De Gouden Dennenpappel

De Dennenpappel is een kleine ConeGeometry (dennenappel-vorm) met een goud emissive material dat pulsend klopt (emissiveIntensity animeert tussen 0.6 en 1.2 in een sinusgolf). Rondom hem een zachte PointLight in goudkleur.

Als de speler de Dennenpappel aanraakt: een groot moment. Alle lichten in de scene worden even verzacht en goudkleurig. Een rustgevend geluid (wind + diep boshuis). Freek is stil voor twee seconden. Dan begint het einddialooog.

### HUD

Vijf steen-icoontjes. Ze worden doorgestreept als elke som is opgelost.

### Dialoogscript (HEUVEL_DIALOGUES)

Intro (centered):
1. "Hoofdstuk 5: De Top van de Heuvel"
2. "Dit is het, [naam]. De schatkaart is compleet."
3. "De Wereldboom staat op de top."
4. "Maar het pad is geblokkeerd door vijf stenen."
5. "Op elke steen staat een som. Los ze op."
6. "Jij kunt dit. Je hebt het al vier keer bewezen."

Bij eerste som goed:
1. "Goed zo! De steen rolt weg."

Bij alle sommen goed:
1. "De poort! Kijk, hij gaat open."

Taal-opdracht:
1. "Er staat iets op de poort."
2. "Ik lees de eerste zin: 'Alleen wie helpt, mag verder.'"
3. "Er staat nog iets. Kun jij het lezen?"

Na taal-opdracht:
1. "Jij hebt geholpen. Dat klopt precies."
2. "Ga naar de Wereldboom."

Bij Dennenpappel gevonden (centered, lange pauze voor eerste zin):
1. "..."
2. "Je hebt bosgeluk, [naam]. Dat wist ik."
3. "Hoor je dat? Het bos ademt."
4. "Mijn grootmoeder had dit ook gehoord."
5. "Nu kunnen we hem naar de Wereldboom brengen."
6. "Het bos leeft weer. Voor honderd jaar."

`onComplete()` aanroepen na de laatste dialoogkaart.

---

## 12. Epiloog — De Wereldboom

De epiloog is geen apart eiland maar een korte cutscene die wordt afgespeeld nadat hoofdstuk 5 voltooid is, vanuit het hoofd-component `GoudenDennenpappel.jsx`.

### Wat er gebeurt

De camera zweeft langzaam omhoog langs de Wereldboom. Het bos rondom licht op in een goudkleurige gloed. Freek staat naast de speler (een eenvoudige low-poly figuur verschijnt naast de camera, net buiten het zicht, maar zijn schaduw is zichtbaar).

Freek zegt zijn laatste woorden. Dan fadeert het scherm naar zwart en verschijnt de tekst:

"[Naam] heeft bosgeluk."
"Het bos leeft voor honderd jaar."

Daarna keert het spel terug naar De Schatkaart met alle eilanden groen gemarkeerd.

### Dialoogscript (EPILOOG_DIALOGUES)

1. "Kijk eens, [naam]."
2. "Het bos wordt goud."
3. "Zo ziet een gezond bos eruit."
4. "Freek kijkt je aan."
5. "Dank je wel. Echt."
6. "Mijn grootmoeder zou blij zijn geweest."
7. "Nu weet het bos dat jij er bent."

---

## 13. Checklist Nieuw Level

Gebruik deze lijst als je een nieuw level bouwt.

### Bestanden

- [ ] `islands/[NaamLevel]/[NaamLevel].jsx` aangemaakt
- [ ] `islands/[NaamLevel]/[NaamLevelScene].js` aangemaakt
- [ ] Level toegevoegd aan `islands/island-registry.js`
- [ ] Dialooglijnen toegevoegd aan `data/freek-dialogues.js` als een nieuw exportobject

### Scene

- [ ] Eilandgrenzen gedefinieerd als `islandBounds` object in de scene builder
- [ ] Vier collision boxes voor eilandgrenzen toegevoegd in de hoofdcomponent
- [ ] Grond-textuur procedureel gegenereerd via canvas
- [ ] Water-textuur procedureel gegenereerd via canvas en geanimeerd per frame
- [ ] Klif-randen rondom het eiland
- [ ] Bomen als InstancedMesh, niet als losse meshes
- [ ] Sky environment map ingesteld via `buildSkyEnvMap`
- [ ] `startPosition` gedefinieerd en ingesteld op camera bij `onReady`

### Game logic

- [ ] Alle game-state die UI beïnvloedt gebruikt `useState`
- [ ] Alle Three.js state gebruikt `useRef`
- [ ] Dialoogcallbacks zijn callback-refs (geen stale closures in de game loop)
- [ ] `onComplete()` wordt aangeroepen als allerlaatste actie na einddialooog
- [ ] `onExit()` is gekoppeld aan de terugknop in `TouchControls`

### Leeropdrachten

- [ ] Reken-opdracht is volledig embedded in een object in de wereld
- [ ] Taal-opdracht is volledig embedded in een object in de wereld
- [ ] Geen losstaand quiz-scherm of pop-up dat het spel onderbreekt
- [ ] Fout antwoord: object schudt, Freek zegt "Hmm, probeer het nog een keer!", speler kan opnieuw
- [ ] Goed antwoord: directe visuele en auditieve feedback in de wereld
- [ ] Maximaal drie keuze-opties als er een keuze is

### Dialoog

- [ ] Alle dialoogtekst staat in `freek-dialogues.js`, niet hardcoded in het component
- [ ] Elke kaart heeft maximaal twee korte zinnen
- [ ] Freek gebruikt de naam van de speler via `playerName` prop
- [ ] Freek geeft nooit het antwoord op een leeropdracht
- [ ] Freek viert elk succes persoonlijk en enthousiast

### Controls & UX

- [ ] `TouchControls` gebruikt met correcte props
- [ ] `joystickBottomOffset` aangepast op basis van of er een bottom-bar dialoog actief is
- [ ] Crosshair aanwezig
- [ ] Level-titel linksboven of gecentreerd bovenin
- [ ] HUD rechtsboven met level-specifieke icoontjes

### Performance

- [ ] Geen `new THREE.Vector3()` (of vergelijkbaar) in de frame callback
- [ ] `delta` wordt gecapped op `Math.min(delta, 0.05)`
- [ ] Canvas texturen worden eenmalig aangemaakt, niet per frame

---

*Einde van het Game Design Document — De Gouden Dennenpappel*