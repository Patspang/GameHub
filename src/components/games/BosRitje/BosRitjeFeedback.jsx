// Feedback screens for Bos Ritje: success, collision, missed
// Shown as overlay after route execution completes

import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { Button } from '../../common/Button';
import { getStarMessage, getStepsMessage } from './scoringSystem';

const CMD_ICONS = { forward: '⬆️', left: '⬅️', right: '➡️' };

export function BosRitjeFeedback({
  type,
  stars,
  usedSteps,
  optimalSteps,
  collisionType,
  collisionStep,
  collisionCommand,
  isLastLevel,
  isNewHighScore,
  onNextLevel,
  onRetry,
  onExit,
}) {
  const t = DUTCH_TEXT.bosRitje;

  if (type === 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 py-6">
        <div className="text-7xl mb-4">🎉</div>

        <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-2">
          {t.feedback.success.title}
        </h2>

        {/* Stars */}
        <div className="flex gap-2 mb-3">
          {[1, 2, 3].map((s) => (
            <span key={s} className={`text-4xl ${stars >= s ? 'animate-bounce' : 'opacity-30'}`}
              style={stars >= s ? { animationDelay: `${s * 0.15}s` } : undefined}
            >
              ⭐
            </span>
          ))}
        </div>

        <p className="font-body text-lg text-text-secondary text-center mb-2">
          {getStarMessage(stars)}
        </p>

        <p className="font-body text-text-secondary text-center mb-4">
          {getStepsMessage(usedSteps, optimalSteps)}
        </p>

        {isNewHighScore && (
          <div className="bg-primary-yellow text-text-primary font-display font-bold text-lg px-6 py-3 rounded-full mb-4 animate-bounce shadow-lg">
            ⭐ {DUTCH_TEXT.feedback.newHighScore} ⭐
          </div>
        )}

        <div className="flex flex-col gap-3 w-full max-w-[240px]">
          {!isLastLevel && (
            <Button variant="success" onClick={onNextLevel}>
              ➡️ {t.buttons.nextLevel}
            </Button>
          )}
          <Button variant="ghost" onClick={onRetry}>
            🔄 {t.buttons.retry}
          </Button>
          <Button variant="accent" onClick={onExit}>
            🏠 {t.buttons.backHome}
          </Button>
        </div>
      </div>
    );
  }

  if (type === 'collision') {
    const collisionMessages = t.feedback.collision;
    const message = collisionMessages[collisionType] || collisionMessages.outOfBounds;

    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 py-6">
        <div className="text-7xl mb-4">💥</div>

        <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-3">
          {message}
        </h2>

        {collisionStep != null && (
          <p className="font-body text-text-secondary text-center mb-2">
            Stap {collisionStep + 1}: {CMD_ICONS[collisionCommand] || '?'} → Botsing!
          </p>
        )}

        <p className="font-body text-lg text-text-secondary text-center mb-6">
          {t.feedback.tryAgain}
        </p>

        <div className="flex flex-col gap-3 w-full max-w-[240px]">
          <Button variant="success" onClick={onRetry}>
            🔄 {t.buttons.retry}
          </Button>
          <Button variant="accent" onClick={onExit}>
            🏠 {t.buttons.backHome}
          </Button>
        </div>
      </div>
    );
  }

  // type === 'missed' (car ran out of commands without reaching goal)
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 py-6">
      <div className="text-7xl mb-4">🤔</div>

      <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-3">
        {t.feedback.missed.title}
      </h2>

      <p className="font-body text-lg text-text-secondary text-center mb-6">
        {t.feedback.missed.message}
      </p>

      <div className="flex flex-col gap-3 w-full max-w-[240px]">
        <Button variant="success" onClick={onRetry}>
          🔄 {t.buttons.retry}
        </Button>
        <Button variant="accent" onClick={onExit}>
          🏠 {t.buttons.backHome}
        </Button>
      </div>
    </div>
  );
}
