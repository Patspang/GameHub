// Drawing toolbar — color picker, brush sizes, and action buttons
// Positioned at bottom for easy tablet thumb reach

import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { ColorPicker } from './ColorPicker';
import { BrushSizePicker } from './BrushSizePicker';

const T = DUTCH_TEXT.tekenen.tools;

export function ToolBar({
  currentColor,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  tool,
  onToolChange,
  onUndo,
  onClear,
  onSave,
  onBack,
  canUndo,
}) {
  return (
    <div className="w-full bg-bg-secondary/90 backdrop-blur-sm rounded-t-2xl px-4 py-3 shadow-lg space-y-3">
      {/* Color palette */}
      <ColorPicker currentColor={currentColor} onColorChange={onColorChange} />

      {/* Controls row */}
      <div className="flex items-center justify-between gap-2">
        <BrushSizePicker brushSize={brushSize} onBrushSizeChange={onBrushSizeChange} />

        <div className="flex items-center gap-2">
          {/* Eraser toggle */}
          <button
            onClick={() => onToolChange(tool === 'eraser' ? 'brush' : 'eraser')}
            className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all ${
              tool === 'eraser'
                ? 'bg-primary-coral/20 ring-2 ring-primary-coral'
                : 'bg-white/50 active:bg-white/80'
            }`}
            title={T.eraser}
          >
            {tool === 'eraser' ? '✏️' : '🧹'}
          </button>

          {/* Undo */}
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-white/50 active:bg-white/80 disabled:opacity-30 disabled:active:bg-white/50 transition-all"
            title={T.undo}
          >
            ↩️
          </button>

          {/* Clear */}
          <button
            onClick={onClear}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-white/50 active:bg-white/80 transition-all"
            title={T.clear}
          >
            🗑️
          </button>

          {/* Save */}
          <button
            onClick={onSave}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-primary-green/20 active:bg-primary-green/30 ring-1 ring-primary-green transition-all"
            title={T.save}
          >
            💾
          </button>

          {/* Back */}
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-white/50 active:bg-white/80 transition-all"
            title={T.back}
          >
            🏠
          </button>
        </div>
      </div>
    </div>
  );
}
