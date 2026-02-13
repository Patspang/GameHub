// Grid of coloring page templates to choose from

import { useRef, useEffect } from 'react';
import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { TEMPLATES, drawTemplate } from '../../../utils/drawingTemplates';
import { Button } from '../../common/Button';

const T = DUTCH_TEXT.tekenen;

function TemplateThumbnail({ template, onClick }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawTemplate(ctx, template.id, canvas.width, canvas.height);
  }, [template.id]);

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white shadow-md transition-all active:scale-95"
    >
      <canvas
        ref={canvasRef}
        width={140}
        height={105}
        className="w-full rounded-xl"
      />
      <span className="font-display font-bold text-lg text-text-primary">
        {template.emoji} {T.templates[template.id]}
      </span>
    </button>
  );
}

export function TemplateSelector({ onSelect, onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center p-4">
      <h2 className="font-display text-3xl font-bold text-text-primary mb-6 mt-4">
        {T.templates.chooseTemplate}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
        {TEMPLATES.map((template) => (
          <TemplateThumbnail
            key={template.id}
            template={template}
            onClick={() => onSelect(template.id)}
          />
        ))}
      </div>

      <div className="mt-8">
        <Button variant="ghost" size="lg" onClick={onBack}>
          ← {T.tools.back}
        </Button>
      </div>
    </div>
  );
}
