// Island registry — add new islands here to extend the game
// Each island needs: id, name, icon, description, component

import { OudWoud } from './OudWoud/OudWoud';
import { ZonnigeWeide } from './ZonnigeWeide/ZonnigeWeide';
import { Beekje } from './Beekje/Beekje';

export const ISLAND_REGISTRY = [
  {
    id: 'oud-woud',
    name: 'Hoofdstuk 1: Het Oude Woud',
    icon: '🌲',
    description: 'Zoek de drie paddenstoelen en vind het eerste stukje van de schatkaart.',
    component: OudWoud,
  },
  {
    id: 'zonnige-weide',
    name: 'Hoofdstuk 2: De Zonnige Weide',
    icon: '🌻',
    description: 'Help de verdwaalde vlinders terug naar hun bloem.',
    component: ZonnigeWeide,
  },
  {
    id: 'beekje',
    name: 'Hoofdstuk 3: Het Beekje',
    icon: '💧',
    description: 'Leg de stenen op volgorde en laat het water weer stromen.',
    component: Beekje,
  },
];
