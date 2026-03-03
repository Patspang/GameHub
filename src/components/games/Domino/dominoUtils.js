// Pure game logic for Domino — no React dependencies

import { DOMINO_CONFIG as CFG } from '../../../constants/gameConfig';

// Generate all tiles for a given max pip value
// Double-4 = 15 tiles, double-5 = 21, double-6 = 28
export function createTileSet(maxPips) {
  const tiles = [];
  let id = 0;
  for (let left = 0; left <= maxPips; left++) {
    for (let right = left; right <= maxPips; right++) {
      tiles.push({ id: id++, left, right });
    }
  }
  return tiles;
}

// Fisher-Yates shuffle
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Deal tiles: returns { playerHand, computerHand, boneyard }
export function dealTiles(maxPips, handSize) {
  const tiles = shuffle(createTileSet(maxPips));
  return {
    playerHand: tiles.slice(0, handSize),
    computerHand: tiles.slice(handSize, handSize * 2),
    boneyard: tiles.slice(handSize * 2),
  };
}

// Get the open ends of the chain
// Chain is array of { left, right } in placement order
// The left end of the first tile and right end of the last tile are open
export function getChainEnds(chain) {
  if (chain.length === 0) return null;
  return {
    leftEnd: chain[0].left,
    rightEnd: chain[chain.length - 1].right,
  };
}

// Check if a tile can be placed, and where
// Returns { canPlaceLeft, canPlaceRight }
export function canPlace(tile, chain) {
  if (chain.length === 0) {
    return { canPlaceLeft: true, canPlaceRight: true };
  }
  const ends = getChainEnds(chain);
  const values = [tile.left, tile.right];
  return {
    canPlaceLeft: values.includes(ends.leftEnd),
    canPlaceRight: values.includes(ends.rightEnd),
  };
}

// Get all valid moves for a hand
// Returns array of { tile, end: 'left'|'right' }
// A tile that fits both ends produces two entries
export function getValidMoves(hand, chain) {
  const moves = [];
  for (const tile of hand) {
    const { canPlaceLeft, canPlaceRight } = canPlace(tile, chain);
    if (canPlaceLeft) moves.push({ tile, end: 'left' });
    if (canPlaceRight) moves.push({ tile, end: 'right' });
  }
  return moves;
}

// Get unique playable tile IDs (tiles that can go somewhere)
export function getPlayableTileIds(hand, chain) {
  const ids = new Set();
  for (const tile of hand) {
    const { canPlaceLeft, canPlaceRight } = canPlace(tile, chain);
    if (canPlaceLeft || canPlaceRight) ids.add(tile.id);
  }
  return ids;
}

// Place a tile on the chain at the given end
// Returns new chain array with tile correctly oriented
export function placeTile(chain, tile, end) {
  if (chain.length === 0) {
    // First tile — place as-is
    return [{ ...tile }];
  }

  const ends = getChainEnds(chain);

  if (end === 'left') {
    // tile's right value must match chain's leftEnd
    const oriented = tile.right === ends.leftEnd
      ? { ...tile }
      : { ...tile, left: tile.right, right: tile.left };
    return [oriented, ...chain];
  } else {
    // tile's left value must match chain's rightEnd
    const oriented = tile.left === ends.rightEnd
      ? { ...tile }
      : { ...tile, left: tile.right, right: tile.left };
    return [...chain, oriented];
  }
}

// Sum of all dots in a hand
export function handValue(hand) {
  return hand.reduce((sum, t) => sum + t.left + t.right, 0);
}

// Tile total value
function tileValue(tile) {
  return tile.left + tile.right;
}

// --- AI STRATEGIES ---

// Easy: random valid move
function getEasyAIMove(hand, chain) {
  const moves = getValidMoves(hand, chain);
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

// Normal: play highest-value tile first
function getNormalAIMove(hand, chain) {
  const moves = getValidMoves(hand, chain);
  if (moves.length === 0) return null;
  // Deduplicate: if a tile appears for both ends, pick the higher-scoring end
  const bestPerTile = new Map();
  for (const move of moves) {
    const existing = bestPerTile.get(move.tile.id);
    if (!existing || tileValue(move.tile) > tileValue(existing.tile)) {
      bestPerTile.set(move.tile.id, move);
    }
  }
  const uniqueMoves = Array.from(bestPerTile.values());
  uniqueMoves.sort((a, b) => tileValue(b.tile) - tileValue(a.tile));
  return uniqueMoves[0];
}

// Hard: strategic — block player, keep versatile tiles
function getHardAIMove(hand, chain) {
  const moves = getValidMoves(hand, chain);
  if (moves.length === 0) return null;

  // Score each move
  const scored = moves.map((move) => {
    let score = 0;
    // Prefer high-value tiles (get rid of heavy tiles early)
    score += tileValue(move.tile) * 2;

    // Prefer doubles (less flexible, play them when you can)
    if (move.tile.left === move.tile.right) score += 5;

    // Prefer tiles that DON'T match many other tiles in hand
    // (keep versatile tiles for later)
    const otherHand = hand.filter((t) => t.id !== move.tile.id);
    const matchesInHand = otherHand.filter(
      (t) => t.left === move.tile.left || t.right === move.tile.left ||
             t.left === move.tile.right || t.right === move.tile.right
    ).length;
    score -= matchesInHand * 3;

    // If placing creates an end value we have more tiles for, that's good
    const newChain = placeTile(chain, move.tile, move.end);
    const newEnds = getChainEnds(newChain);
    const futureMatches = otherHand.filter(
      (t) => t.left === newEnds.leftEnd || t.right === newEnds.leftEnd ||
             t.left === newEnds.rightEnd || t.right === newEnds.rightEnd
    ).length;
    score += futureMatches * 2;

    return { ...move, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0];
}

// Dispatcher
export function getAIMove(hand, chain, difficulty) {
  switch (difficulty) {
    case 'makkelijk': return getEasyAIMove(hand, chain);
    case 'moeilijk': return getHardAIMove(hand, chain);
    default: return getNormalAIMove(hand, chain);
  }
}

// Check if a round is over
// Returns { over: boolean, reason: 'empty'|'blocked'|null, winner: 'player'|'computer'|null }
export function checkRoundEnd(playerHand, computerHand, boneyard, chain) {
  if (playerHand.length === 0) {
    return { over: true, reason: 'empty', winner: 'player' };
  }
  if (computerHand.length === 0) {
    return { over: true, reason: 'empty', winner: 'computer' };
  }
  // Check if both are blocked (no valid moves and boneyard empty)
  if (boneyard.length === 0) {
    const playerCanPlay = getValidMoves(playerHand, chain).length > 0;
    const computerCanPlay = getValidMoves(computerHand, chain).length > 0;
    if (!playerCanPlay && !computerCanPlay) {
      const pVal = handValue(playerHand);
      const cVal = handValue(computerHand);
      return {
        over: true,
        reason: 'blocked',
        winner: pVal <= cVal ? 'player' : 'computer',
      };
    }
  }
  return { over: false, reason: null, winner: null };
}

// Calculate round score for the winning side
export function calculateRoundScore(winner, playerHand, computerHand) {
  if (winner === 'player') {
    const opponentDots = handValue(computerHand);
    const bonus = playerHand.length === 0 ? CFG.SCORING.EMPTY_HAND_BONUS : 0;
    return Math.max(CFG.SCORING.MIN_ROUND_POINTS, opponentDots + bonus);
  }
  // Computer won — player still gets minimum encouragement points
  return CFG.SCORING.MIN_ROUND_POINTS;
}
