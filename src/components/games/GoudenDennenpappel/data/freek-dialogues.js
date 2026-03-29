// Freek's dialogue lines — Avi 3 level Dutch (short, simple sentences)
// Each key returns an array of strings (one per dialogue card)

export const OUD_WOUD_DIALOGUES = {
  intro: (name) => [
    'Hoofdstuk 1: Het Oude Woud',
    `Hoi ${name}! Ik ben Freek.`,
    'Dit is het eerste hoofdstuk van ons avontuur.',
    'Zoek de drie paddenstoelen en vind het eerste stukje van de schatkaart.',
    'Ik ben boswachter. Ik ken dit bos goed.',
    'Er is iets bijzonders verstopt in dit bos.',
    'Het heet de Gouden Dennenpappel.',
    'Maar ik heb jouw hulp nodig!',
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

export const ZONNIGE_WEIDE_DIALOGUES = {
  intro: (name) => [
    'Hoofdstuk 2: De Zonnige Weide',
    `Wat mooi hier, ${name}! Dit is mijn favoriete plek.`,
    'Maar kijk — de vlinders zijn verdwaald!',
    'Een grote storm blies ze allemaal door elkaar.',
    'Elke vlinder hoort bij één bloem.',
    'Help jij ze de weg terug te vinden?',
  ],

  butterflyApproached: [
    'Deze vlinder zoekt zijn bloem.',
    'Welke bloem past erbij? Kijk goed!',
  ],

  wrongMatch: [
    'Hmm, dat klopt nog niet.',
    'Probeer het nog een keer!',
  ],

  firstMatch: (name) => [
    `Yes! ${name}, je deed het!`,
    'Zoek nu de andere twee.',
  ],

  allMatched: [
    'Alle vlinders zijn thuis!',
    'Kijk, het kaartfragment valt uit de lucht.',
    'Het bos is blij. Pak het op!',
  ],

  complete: [
    'Geweldig! Fragment twee gevonden.',
    'Er zijn er nog meer. Kijk — de kaart toont een beekje.',
    'Op naar het volgende eiland!',
  ],
};
