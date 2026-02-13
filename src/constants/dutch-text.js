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
        hard: 'Tik letters in volgorde',
      },
      'muntenkluis': {
        easy: 'Sommen tot 5',
        normal: 'Sommen tot 10',
        hard: 'Sommen tot 20',
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
    useArrows: 'Gebruik de knoppen om te bewegen',
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
  snake: {
    name: 'Tel Slang',
    instructions: {
      howToPlay: 'Eet de nummers in de juiste volgorde!',
      useArrows: 'Gebruik de knoppen om de slang te besturen',
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
