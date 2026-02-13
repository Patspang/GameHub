// Color palette for drawing — 12 kid-friendly colors in circular swatches

import { TEKENEN_CONFIG } from '../../../constants/gameConfig';

export function ColorPicker({ currentColor, onColorChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {TEKENEN_CONFIG.DRAWING_COLORS.map((color) => (
        <button
          key={color}
          onClick={() => onColorChange(color)}
          className={`w-11 h-11 rounded-full border-2 transition-transform ${
            currentColor === color
              ? 'scale-125 border-text-primary ring-2 ring-text-primary ring-offset-2'
              : 'border-gray-300 active:scale-110'
          }`}
          style={{
            backgroundColor: color,
            boxShadow: color === '#FFFFFF' ? 'inset 0 0 0 1px #d1d5db' : undefined,
          }}
          aria-label={`Kleur ${color}`}
        />
      ))}
    </div>
  );
}
