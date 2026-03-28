// Island registry — add new islands here to extend the game
// Each island needs: id, name, icon, description, component

import { OudWoud } from './OudWoud/OudWoud';

export const ISLAND_REGISTRY = [
  {
    id: 'oud-woud',
    name: 'Hoofdstuk 1: Het Oude Woud',
    icon: '🌲',
    description: 'Hoofdstuk 1: Zoek de drie paddenstoelen en vind het eerste stukje van de schatkaart.',
    component: OudWoud,
  },
  // Future islands:
  // { id: 'zonnige-weide', name: 'De Zonnige Weide', icon: '🌻', description: '...', component: ZonnigeWeide },
  // { id: 'beekje', name: 'Het Beekje', icon: '💧', description: '...', component: Beekje },
];
