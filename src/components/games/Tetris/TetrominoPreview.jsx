// Next piece preview box for Tetris
// Shows the upcoming tetromino in a small 4x4 grid

import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { TetrisBlock } from './TetrisBlock';

export function TetrominoPreview({ piece, tileSize }) {
  if (!piece) return null;

  const previewSize = Math.max(20, tileSize * 0.7);
  const cells = piece.shapes[0]; // Always show in default rotation

  // Compute bounding box to center the piece
  const minR = Math.min(...cells.map((c) => c[0]));
  const maxR = Math.max(...cells.map((c) => c[0]));
  const minC = Math.min(...cells.map((c) => c[1]));
  const maxC = Math.max(...cells.map((c) => c[1]));
  const pieceH = maxR - minR + 1;
  const pieceW = maxC - minC + 1;

  const boxSize = 4 * previewSize;
  const offsetR = (4 - pieceH) / 2 - minR;
  const offsetC = (4 - pieceW) / 2 - minC;

  return (
    <div className="bg-white/80 rounded-xl p-3 shadow-sm">
      <p className="font-display font-bold text-sm text-text-secondary text-center mb-2">
        {DUTCH_TEXT.tetris.hud.next}
      </p>
      <div
        className="relative"
        style={{ width: boxSize, height: boxSize }}
      >
        {cells.map(([r, c], i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: (c + offsetC) * previewSize,
              top: (r + offsetR) * previewSize,
            }}
          >
            <TetrisBlock color={piece.color} size={previewSize} />
          </div>
        ))}
      </div>
    </div>
  );
}
