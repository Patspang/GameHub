// HUD showing turn indicator and running score

import { DUTCH_TEXT } from '../../../constants/dutch-text';

const T = DUTCH_TEXT.boterKaasEieren;

export function TicTacToeHUD({ currentPlayer, isTwoPlayer, isComputerTurn, scores }) {
  let turnText;
  if (isTwoPlayer) {
    turnText = currentPlayer === 'X' ? T.hud.player1Turn : T.hud.player2Turn;
  } else {
    turnText = isComputerTurn ? T.hud.computerThinking : T.hud.yourTurn;
  }

  return (
    <div className="w-full max-w-sm bg-white/80 backdrop-blur rounded-2xl px-4 py-3 flex items-center justify-between mb-4">
      <div className="font-display font-bold text-text-primary text-lg">
        {turnText}
      </div>
      <div className="flex gap-3 font-body text-sm text-text-secondary">
        <span>❌ {scores.X}</span>
        <span>⭕ {scores.O}</span>
        <span>➖ {scores.draws}</span>
      </div>
    </div>
  );
}
