import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, TrendingUp, Star } from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';

interface PrestigePanelProps {
  prestigePoints: number;
  prestigeMultiplier: number;
  totalPrestiges: number;
  potentialPoints: number;
  canPrestige: boolean;
  onPrestige: () => void;
}

export function PrestigePanel({
  prestigePoints,
  prestigeMultiplier,
  totalPrestiges,
  potentialPoints,
  canPrestige,
  onPrestige,
}: PrestigePanelProps) {
  const { prestigeFeedback } = useFeedback();
  const newMultiplier = 1 + (prestigePoints + potentialPoints) * 0.1;

  const handlePrestige = () => {
    if (canPrestige) {
      prestigeFeedback();
      onPrestige();
    }
  };

  return (
    <div className="game-card border-secondary/30 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-secondary" />
          <h2 className="font-display text-lg prestige-text">Prestígio</h2>
        </div>

        {/* Current stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <Star className="w-4 h-4 text-secondary mx-auto mb-1" />
            <div className="font-display text-xl text-secondary">{prestigePoints}</div>
            <div className="text-xs text-muted-foreground">Pontos</div>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <TrendingUp className="w-4 h-4 text-accent mx-auto mb-1" />
            <div className="font-display text-xl text-accent">x{prestigeMultiplier.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Multiplicador</div>
          </div>
        </div>

        {/* Prestige preview */}
        {canPrestige && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-3 bg-secondary/10 rounded-xl border border-secondary/20"
          >
            <div className="text-sm text-muted-foreground mb-2">Ao fazer prestige você ganha:</div>
            <div className="flex items-center justify-between">
              <span className="text-secondary font-medium">+{potentialPoints} pontos</span>
              <span className="text-accent font-medium">→ x{newMultiplier.toFixed(1)}</span>
            </div>
          </motion.div>
        )}

        {/* Prestige button */}
        <motion.button
          onClick={handlePrestige}
          disabled={!canPrestige}
          whileTap={canPrestige ? { scale: 0.95 } : {}}
          className={`w-full py-4 rounded-xl font-display font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
            canPrestige
              ? 'bg-gradient-to-r from-secondary to-purple-600 text-secondary-foreground glow-prestige hover:brightness-110'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          <RotateCcw className={`w-5 h-5 ${canPrestige ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '3s' }} />
          {canPrestige ? 'Fazer Prestige' : 'Alcance 10K moedas totais'}
        </motion.button>

        {/* Warning text */}
        {canPrestige && (
          <p className="text-xs text-muted-foreground text-center mt-3">
            ⚠️ Isso reinicia seu progresso, mas você mantém bônus permanentes
          </p>
        )}

        {/* Total prestiges */}
        {totalPrestiges > 0 && (
          <div className="mt-4 pt-3 border-t border-border/50 text-center">
            <span className="text-xs text-muted-foreground">
              Prestiges totais: <span className="text-secondary">{totalPrestiges}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
