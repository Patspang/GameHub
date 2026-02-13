// Tekenen & Kleuren — drawing and coloring game
// Two modes: free drawing on blank canvas, or coloring pre-made outlines
// No difficulty levels — all features available immediately

import { useState, useRef, useCallback } from 'react';
import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { TEKENEN_CONFIG } from '../../../constants/gameConfig';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { DrawingCanvas } from './DrawingCanvas';
import { ToolBar } from './ToolBar';
import { TemplateSelector } from './TemplateSelector';
import { Gallery } from './Gallery';
import { GalleryView } from './GalleryView';
import { Button } from '../../common/Button';

const T = DUTCH_TEXT.tekenen;

export function Tekenen({ onExit }) {
  const [screen, setScreen] = useState('menu');
  const [templateId, setTemplateId] = useState(null);
  const [viewingIndex, setViewingIndex] = useState(null);
  const [currentColor, setCurrentColor] = useState('#2D3748');
  const [brushSize, setBrushSize] = useState(TEKENEN_CONFIG.DEFAULT_BRUSH_SIZE);
  const [tool, setTool] = useState('brush');
  const [canUndo, setCanUndo] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  const [gallery, setGallery] = useLocalStorage('gamehub-tekenen-gallery', []);
  const { playSound } = useSoundEffects();
  const canvasRef = useRef(null);

  // Start free drawing
  const handleFreeDraw = useCallback(() => {
    setTemplateId(null);
    setCurrentColor('#2D3748');
    setBrushSize(TEKENEN_CONFIG.DEFAULT_BRUSH_SIZE);
    setTool('brush');
    setCanUndo(false);
    setScreen('drawing');
  }, []);

  // Start coloring mode — go to template selector
  const handleColoring = useCallback(() => {
    setScreen('coloring-select');
  }, []);

  // Template selected — start drawing with outline
  const handleTemplateSelect = useCallback((id) => {
    setTemplateId(id);
    setCurrentColor('#FF6B6B');
    setBrushSize(TEKENEN_CONFIG.DEFAULT_BRUSH_SIZE);
    setTool('brush');
    setCanUndo(false);
    setScreen('drawing');
  }, []);

  // Save current drawing to gallery
  const handleSave = useCallback(() => {
    if (!canvasRef.current) return;

    if (gallery.length >= TEKENEN_CONFIG.MAX_GALLERY_SIZE) {
      // Gallery full — remove oldest
      setGallery((prev) => prev.slice(1));
    }

    const dataUrl = canvasRef.current.toDataURL();
    if (!dataUrl) return;

    const entry = {
      id: Date.now(),
      dataUrl,
      createdAt: new Date().toISOString(),
      templateId: templateId || null,
    };

    setGallery((prev) => [...prev, entry]);
    playSound('collect');

    // Show saved toast
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 1500);
  }, [gallery, templateId, setGallery, playSound]);

  // Undo last stroke
  const handleUndo = useCallback(() => {
    if (!canvasRef.current) return;
    const remaining = canvasRef.current.undo();
    setCanUndo(remaining > 0);
  }, []);

  // Clear canvas
  const handleClear = useCallback(() => {
    if (!canvasRef.current) return;
    canvasRef.current.clear();
    setCanUndo(false);
  }, []);

  // Track whether undo is available after each stroke
  const handlePointerUp = useCallback(() => {
    if (canvasRef.current) {
      setCanUndo(canvasRef.current.getStrokeCount() > 0);
    }
  }, []);

  // Color change also switches to brush tool
  const handleColorChange = useCallback((color) => {
    setCurrentColor(color);
    setTool('brush');
  }, []);

  // Back from drawing to menu
  const handleBackToMenu = useCallback(() => {
    setScreen('menu');
    setTemplateId(null);
  }, []);

  // Gallery: view a drawing
  const handleViewDrawing = useCallback((index) => {
    setViewingIndex(index);
    setScreen('gallery-view');
  }, []);

  // Gallery: delete a drawing
  const handleDeleteDrawing = useCallback((index) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
    if (screen === 'gallery-view') {
      setScreen('gallery');
    }
  }, [setGallery, screen]);

  // --- Menu screen ---
  if (screen === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center justify-center p-4">
        <div className="text-8xl mb-6">🎨</div>
        <h1 className="font-display text-4xl font-bold text-text-primary mb-2">
          {T.name}
        </h1>
        <p className="font-body text-text-secondary mb-10">
          {T.menu.freeDrawDescription}
        </p>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Button variant="primary" size="lg" onClick={handleFreeDraw}>
            ✏️ {T.menu.freeDraw}
          </Button>
          <Button variant="success" size="lg" onClick={handleColoring}>
            🖌️ {T.menu.coloring}
          </Button>
          <Button
            variant="accent"
            size="lg"
            onClick={() => setScreen('gallery')}
          >
            🖼️ {T.menu.gallery}
            {gallery.length > 0 && (
              <span className="ml-2 text-sm opacity-75">({gallery.length})</span>
            )}
          </Button>
        </div>

        <div className="mt-8">
          <Button variant="ghost" size="lg" onClick={onExit}>
            ← {DUTCH_TEXT.menu.backHome}
          </Button>
        </div>
      </div>
    );
  }

  // --- Template selector ---
  if (screen === 'coloring-select') {
    return (
      <TemplateSelector
        onSelect={handleTemplateSelect}
        onBack={handleBackToMenu}
      />
    );
  }

  // --- Gallery ---
  if (screen === 'gallery') {
    return (
      <Gallery
        drawings={gallery}
        onView={handleViewDrawing}
        onDelete={handleDeleteDrawing}
        onBack={handleBackToMenu}
      />
    );
  }

  // --- Gallery view ---
  if (screen === 'gallery-view' && viewingIndex !== null && gallery[viewingIndex]) {
    return (
      <GalleryView
        drawing={gallery[viewingIndex]}
        onDelete={() => handleDeleteDrawing(viewingIndex)}
        onBack={() => setScreen('gallery')}
      />
    );
  }

  // --- Drawing screen ---
  return (
    <div
      className="h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col"
      onPointerUp={handlePointerUp}
    >
      {/* Saved toast overlay */}
      {savedToast && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-primary-green/90 rounded-2xl px-8 py-4 shadow-lg pointer-events-none">
          <p className="font-display font-bold text-2xl text-white text-center">
            {T.gallery.saved}
          </p>
        </div>
      )}

      {/* Canvas area */}
      <div className="flex-1 p-3 pb-0 flex flex-col min-h-0">
        <DrawingCanvas
          ref={canvasRef}
          templateId={templateId}
          currentColor={currentColor}
          brushSize={brushSize}
          tool={tool}
        />
      </div>

      {/* Toolbar */}
      <div className="shrink-0">
        <ToolBar
          currentColor={currentColor}
          onColorChange={handleColorChange}
          brushSize={brushSize}
          onBrushSizeChange={setBrushSize}
          tool={tool}
          onToolChange={setTool}
          onUndo={handleUndo}
          onClear={handleClear}
          onSave={handleSave}
          onBack={handleBackToMenu}
          canUndo={canUndo}
        />
      </div>
    </div>
  );
}
