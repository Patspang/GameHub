// All user-facing Dutch text for the application
// Code and comments are in English, UI text is 100% Dutch

export const DUTCH_TEXT = {
  home: {
    title: 'Kies je spel',
    greeting: 'Hoi',
    namePrompt: 'Hoe heet je?',
    nameButton: 'Laten we spelen!',
    comingSoon: 'Binnenkort',
    clickToPlay: 'Tik om te spelen',
    favorites: 'Jouw Favorieten',
    otherGames: 'Andere Spellen',
    newBadge: 'Nieuw!',
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
    difficultyDescription: {
      'letter-jager': {
        easy: '3-4 letter woorden',
        normal: '5-6 letter woorden',
        hard: '7-8 letter woorden',
      },
      'snake': {
        easy: 'Tel tot 5, langzaam',
        normal: 'Tel tot 8, normaal',
        hard: 'Tel tot 10, snel',
      },
      'tetris': {
        easy: 'Langzaam, minder blokken',
        normal: 'Alle blokken, normaal',
        hard: 'Snel, hoog level',
      },
      'letter-leren': {
        easy: 'Woorden van 3 letters',
        normal: 'Woorden van 4 letters',
        hard: 'Woorden van 5 letters',
      },
      'muntenkluis': {
        easy: 'Sommen tot 5',
        normal: 'Sommen tot 10',
        hard: 'Sommen tot 20',
      },
      'sudoku': {
        easy: 'Kleine puzzels (4x4)',
        normal: 'Middel puzzels (6x6)',
        hard: 'Grote puzzels (9x9)',
      },
      'cijfer-vissen': {
        easy: 'Optellen tot 10',
        normal: 'Aftrekken binnen 10',
        hard: 'Tafels 1 t/m 6',
      },
      'pinguin-avontuur': {
        easy: 'Klein doolhof, 3 vissen',
        normal: 'Middel doolhof, 4 vissen',
        hard: 'Groot doolhof, 5 vissen',
      },
      'bos-ritje': {
        easy: '15 levels - steeds moeilijker!',
        normal: '15 levels - steeds moeilijker!',
        hard: '15 levels - steeds moeilijker!',
      },
      'memory': {
        easy: '4x4 kaarten (8 paren)',
        normal: '4x6 kaarten (12 paren)',
        hard: '6x6 kaarten (18 paren)',
      },
    },
    highScore: 'Hoogste Score',
    settings: 'Instellingen',
    language: 'Taal',
    languages: {
      nl: 'Nederlands',
      en: 'English',
    },
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
    playAgain: 'Opnieuw Spelen',
    changeDifficulty: 'Moeilijkheid Aanpassen',
  },
  instructions: {
    howToPlay: 'Hoe te spelen',
    useArrows: 'Gebruik de knoppen of veeg om te bewegen',
    collectLetters: 'Verzamel letters in de juiste volgorde',
    avoidCreatures: 'Blijf weg van de vriendjes',
  },
  letterLeren: {
    name: 'Letter Leren',
    instructions: {
      howToPlay: 'Leer letters en woorden met plaatjes!',
      tapCorrectWord: 'Tik op het juiste woord',
      tapLettersInOrder: 'Tik de letters in de juiste volgorde',
      typeTheWord: 'Typ het woord letter voor letter',
    },
    feedback: {
      wordComplete: 'Woord compleet!',
      allComplete: 'Alle woorden goed! Geweldig!',
    },
  },
  tetris: {
    name: 'Tetris',
    instructions: {
      howToPlay: 'Stapel de blokken en maak rijen vol!',
      useArrows: 'Gebruik de knoppen om blokken te bewegen en draaien',
    },
    hud: {
      level: 'Level',
      lines: 'Rijen',
      next: 'Volgende',
    },
    feedback: {
      lineClear: 'Goed zo!',
      tetris: 'TETRIS! Geweldig!',
      levelUp: 'Level omhoog!',
      gameOver: 'Spel afgelopen',
      tryAgain: 'Probeer nog eens!',
      greatJob: 'Super gedaan!',
    },
  },
  muntenkluis: {
    name: "Dagobert's Muntenkluis",
    instructions: {
      howToPlay: 'Tel de munten en kies het juiste antwoord!',
      tapCorrectAnswer: 'Tik op het juiste getal',
      countTheCoins: 'Tel de munten om het antwoord te vinden',
    },
    feedback: {
      correct: ['Goed zo!', 'Super!', 'Geweldig!', 'Knap!', 'Top!'],
      wrong: ['Bijna!', 'Probeer nog eens!', 'Je kan het!', 'Nog een keer!'],
      allComplete: 'De kluis zit vol! Geweldig!',
      vaultFull: 'De kluis zit helemaal vol!',
    },
  },
  sudoku: {
    name: 'Sudoku',
    instructions: {
      howToPlay: 'Vul de lege vakjes met de juiste cijfers!',
      tapCell: 'Tik op een leeg vakje en kies een cijfer',
    },
    feedback: {
      puzzleComplete: 'Puzzel opgelost!',
      allComplete: 'Alle puzzels klaar! Geweldig!',
    },
  },
  cijferVissen: {
    name: 'Cijfer Vissen',
    instructions: {
      howToPlay: 'Vang de vis met het juiste antwoord!',
    },
    feedback: {
      correct: ['Goed gevist!', 'Klopt helemaal!', 'Geweldig!', 'Perfect!', 'Goed zo!'],
      tryAgain: ['Probeer opnieuw!', 'Kijk nog eens goed!', 'Bijna! Nog een keer?', 'Probeer een andere vis!'],
    },
    reward: {
      title: 'Goed Gevist!',
      perfect: 'Perfect! Alle vissen eerste keer gevangen!',
      great: 'Goed gedaan!',
      completed: 'Gelukt! Goed gevist!',
      fishAgain: 'Opnieuw Vissen',
    },
    hud: {
      catch: 'Vangst',
      of: 'van',
    },
  },
  tekenen: {
    name: 'Tekenen & Kleuren',
    menu: {
      freeDraw: 'Vrij Tekenen',
      freeDrawDescription: 'Teken wat je wilt!',
      coloring: 'Kleurplaat',
      coloringDescription: 'Kies een plaatje om in te kleuren',
      gallery: 'Mijn Tekeningen',
      galleryDescription: 'Bekijk je opgeslagen tekeningen',
    },
    tools: {
      eraser: 'Gum',
      undo: 'Terug',
      clear: 'Wissen',
      save: 'Opslaan',
      back: 'Terug',
    },
    templates: {
      cat: 'Kat',
      butterfly: 'Vlinder',
      star: 'Ster',
      house: 'Huis',
      flower: 'Bloem',
      heart: 'Hart',
      rainbow: 'Regenboog',
      fish: 'Vis',
      chooseTemplate: 'Kies een kleurplaat',
    },
    gallery: {
      title: 'Mijn Tekeningen',
      empty: 'Nog geen tekeningen!',
      emptyHint: 'Maak je eerste tekening!',
      delete: 'Verwijderen',
      saved: 'Opgeslagen!',
      galleryFull: 'Gallerij vol! Verwijder een tekening.',
    },
  },
  pinguinAvontuur: {
    name: 'Pinguïn Avontuur',
    instructions: {
      howToPlay: 'Help de pinguïn naar de zee!',
      collectFish: 'Vang de vissen in de juiste volgorde: 1, 2, 3...',
      useArrows: 'Gebruik de knoppen of veeg om te bewegen',
    },
    hud: {
      fish: 'Vissen',
      of: 'van',
    },
    feedback: {
      fishCollected: 'Vis gevangen!',
      wrongFish: 'Dat is niet de juiste vis!',
      allFishCollected: 'Alle vissen gevangen! Zwem naar de zee!',
      gameWon: 'De pinguïn is bij de zee! Hoera!',
    },
  },
  bosRitje: {
    name: 'Bos Ritje',
    instructions: {
      howToPlay: 'Plan de route voor je auto door het bos!',
      step1: '1. Bekijk waar je auto staat en waar het doel is',
      step2: '2. Tik op commando\'s om je route te plannen',
      step3: '3. Tik op START om je auto te laten rijden',
      step4: '4. Probeer de kortste route te vinden!',
      forwardDesc: 'Rijd 1 vakje vooruit',
      leftDesc: 'Draai naar links',
      rightDesc: 'Draai naar rechts',
    },
    game: {
      yourRoute: 'Jouw Route:',
      commands: 'Commando\'s:',
      steps: 'Stappen',
      forward: 'Vooruit',
      left: 'Links',
      right: 'Rechts',
      start: 'START',
      clear: 'WISSEN',
      maxReached: 'Maximum bereikt!',
      noCommands: 'Voeg eerst commando\'s toe!',
      level: 'Level',
    },
    feedback: {
      collision: {
        tree: 'Oeps! Je bent tegen een boom gebotst!',
        rock: 'Au! Je reed tegen een rots!',
        water: 'Pas op! Je rijdt het water in!',
        outOfBounds: 'Voorzichtig! Je rijdt van de weg af!',
      },
      success: {
        title: 'GELUKT!',
        perfect: [
          'Perfect! Kortste route!',
          'Ongelooflijk! Optimale route!',
          'Geweldig! Geen stap teveel!',
        ],
        good: [
          'Goed gedaan! Bijna perfect!',
          'Super! Kan iets korter, maar top!',
          'Uitstekend! Probeer nog korter?',
        ],
        completed: [
          'Gelukt! Kun je het korter?',
          'Yes! Kan het efficiënter?',
          'Goed! Probeer een kortere route!',
        ],
        steps: 'Route in {steps} stappen (optimaal: {optimal})',
      },
      missed: {
        title: 'Bijna!',
        message: 'Je auto bereikte het doel niet. Probeer meer stappen!',
      },
      tryAgain: 'Probeer een andere route!',
    },
    buttons: {
      nextLevel: 'Volgende Level',
      retry: 'Opnieuw Proberen',
      backHome: 'Naar Home',
      changeDifficulty: 'Moeilijkheid Aanpassen',
    },
  },
  memory: {
    name: 'Memory',
    instructions: {
      howToPlay: 'Vind alle paren door kaarten om te draaien!',
      tapCard: 'Tik op een kaart om hem om te draaien',
      findPairs: 'Onthoud waar de plaatjes zijn!',
    },
    hud: {
      moves: 'Zetten',
      pairs: 'Paren',
    },
    feedback: {
      allComplete: 'Alle paren gevonden! Geweldig!',
      movesResult: 'Je hebt het gehaald in {moves} zetten!',
    },
  },
  snake: {
    name: 'Tel Slang',
    instructions: {
      howToPlay: 'Eet de nummers in de juiste volgorde!',
      useArrows: 'Gebruik de knoppen of veeg om de slang te besturen',
    },
    hud: {
      target: 'Zoek',
      round: 'Ronde',
    },
    feedback: {
      roundComplete: 'Ronde compleet!',
      gameWon: 'Je hebt gewonnen! Gefeliciteerd!',
      gameOver: 'Spel afgelopen',
      tryAgain: 'Bijna! Probeer nog eens!',
    },
  },
};
