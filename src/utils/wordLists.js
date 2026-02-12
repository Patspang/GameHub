// Dutch word lists organized by difficulty level
// All words are age-appropriate for children aged 5-7

export const WORD_LISTS = {
  makkelijk: [
    'KAT', 'POT', 'VIS', 'KOE', 'PAD', 'BUS', 'BAL', 'POP',
    'BED', 'ZON', 'TAK', 'PAN', 'HEK', 'WEG', 'BOOM', 'ROOS',
    'HUIS', 'AUTO', 'BOOT', 'MAAN', 'STER', 'BEER', 'PEER', 'BOEK',
  ],
  normaal: [
    'APPEL', 'PAARD', 'BLOEM', 'STOEL', 'VOGEL', 'FIETS',
    'TAFEL', 'BEKER', 'LEPEL', 'SCHOOL', 'KONIJN', 'WORTEL',
    'BANAAN', 'KERSEN', 'TULPEN', 'KEUKEN',
  ],
  moeilijk: [
    'OLIFANT', 'GIRAFFE', 'PARAPLU', 'SCHAATS', 'KOMPAS',
    'SCHILDPAD', 'KROKODIL', 'COMPUTER', 'TELEFOON', 'REGENBOOG',
    'WATERVAL', 'BOTERHAM', 'SPEELTUIN', 'SCHOOLTAS',
  ],
};

export function getRandomWord(difficulty) {
  const words = WORD_LISTS[difficulty];
  return words[Math.floor(Math.random() * words.length)];
}

export function splitWordIntoLetters(word) {
  return word.split('');
}
