// Freek's dialogue lines — Avi 3 level Dutch (short, simple sentences)
// Each key returns an array of strings (one per dialogue card)

export const OUD_WOUD_DIALOGUES = {
  intro: (name) => [
    `Hoi ${name}! Ik ben Freek.`,
    'Ik ben boswachter. Ik ken dit bos goed.',
    'Er is iets bijzonders verstopt in dit bos.',
    'Het heet de Gouden Dennenpappel.',
    'Maar ik heb jouw hulp nodig!',
    'Zoek de drie rode paddenstoelen.',
    'Daarna laat ik je zien wat je moet doen.',
    'Succes! Je kunt het!',
  ],

  mushroomFound: (n) => {
    if (n === 1) return ['Goed zo! Je vond de eerste paddenstoel.', 'Zoek er nog twee. Kijk goed rond!'];
    // n === 2: no dialogue — keep focus, momentum is enough
    return null;
  },

  allMushrooms: [
    'Yes! Alle drie de paddenstoelen!',
    'Nu moet je verder lopen op het pad.',
    'Maar er ligt een grote boomstam in de weg.',
    'Loop er recht op af. Dan rolt hij vanzelf weg!',
  ],

  logRolled: [
    'Sterk gedaan!',
    'Nu is het pad vrij.',
    'Loop verder. Het kaartfragment ligt verderop.',
  ],

  complete: [
    'Je hebt het kaartfragment gevonden!',
    'Dit is een stuk van de schatkaart.',
    'Er zijn nog meer stukken te vinden.',
    'Op naar het volgende eiland!',
  ],
};
