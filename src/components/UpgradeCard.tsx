import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import type { Upgrade } from '@/hooks/useGameState';
import { useFeedback } from '@/hooks/useFeedback';

interface UpgradeCardProps {
  upgrade: Upgrade;
  cost: number;
  canAfford: boolean;
  isUnlocked: boolean;
  onBuy: () => void;
}

function formatNumber(num: number): string {
  if (num < 1000) return Math.floor(num).toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(2) + 'M';
  return (num / 1000000000).toFixed(2) + 'B';
}

export function UpgradeCard({ upgrade, cost, canAfford, isUnlocked, onBuy }: UpgradeCardProps) {
  const { upgradeFeedback } = useFeedback();
  const isMaxed = upgrade.level >= upgrade.maxLevel;
  const progress = (upgrade.level / upgrade.maxLevel) * 100;

  if (!isUnlocked) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.5, y: 0 }}
        className="game-card opacity-50 relative overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Lock className="w-6 h-6" />
            <span className="text-xs">Desbloqueie com mais moedas</span>
          </div>
        </div>
        <div className="flex items-center gap-3 opacity-30">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
            {upgrade.icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{upgrade.name}</h3>
            <p className="text-sm text-muted-foreground">{upgrade.description}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const handleBuy = () => {
    if (canAfford && !isMaxed) {
      upgradeFeedback();
      onBuy();
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: canAfford && !isMaxed ? 0.98 : 1 }}
      onClick={handleBuy}
      disabled={!canAfford || isMaxed}
      className={`game-card w-full text-left transition-all duration-200 ${
        canAfford && !isMaxed 
          ? 'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 active:scale-[0.98]' 
          : ''
      } ${!canAfford && !isMaxed ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
          isMaxed 
            ? 'bg-accent/20' 
            : canAfford 
              ? 'bg-primary/20' 
              : 'bg-muted'
        }`}>
          {upgrade.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold truncate">{upgrade.name}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isMaxed 
                ? 'bg-accent/20 text-accent' 
                : 'bg-muted text-muted-foreground'
            }`}>
              Lv.{upgrade.level}
            </span>
          </div>
          <p className="text-sm text-muted-foreground truncate">{upgrade.description}</p>
          
          {/* Progress bar */}
          <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${isMaxed ? 'bg-accent' : 'bg-primary'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Cost */}
        <div className="text-right shrink-0">
          {isMaxed ? (
            <span className="text-accent font-semibold text-sm">MAX</span>
          ) : (
            <div className={`font-display text-sm ${canAfford ? 'text-primary' : 'text-muted-foreground'}`}>
              🪙 {formatNumber(cost)}
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}
