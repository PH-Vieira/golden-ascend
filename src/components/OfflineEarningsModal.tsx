import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Coins, X } from 'lucide-react';

interface OfflineEarningsModalProps {
  isOpen: boolean;
  onClose: () => void;
  earnings: number;
  timeAway: number;
}

function formatNumber(num: number): string {
  if (num < 1000) return Math.floor(num).toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(2) + 'M';
  return (num / 1000000000).toFixed(2) + 'B';
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)} segundos`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutos`;
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  }
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return `${days}d ${hours}h`;
}

export function OfflineEarningsModal({ isOpen, onClose, earnings, timeAway }: OfflineEarningsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm game-card border-primary/30 overflow-hidden"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-muted/50 hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <div className="relative z-10 text-center py-4">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', damping: 15 }}
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center"
              >
                <span className="text-4xl">💰</span>
              </motion.div>

              {/* Title */}
              <h2 className="font-display text-xl mb-2 text-foreground">Bem-vindo de volta!</h2>
              
              {/* Time away */}
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-4">
                <Clock className="w-4 h-4" />
                <span>Você ficou fora por {formatTime(timeAway)}</span>
              </div>

              {/* Earnings */}
              <div className="bg-muted/50 rounded-xl p-4 mb-4">
                <p className="text-sm text-muted-foreground mb-2">Suas fábricas produziram:</p>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                  className="flex items-center justify-center gap-2"
                >
                  <Coins className="w-6 h-6 text-primary" />
                  <span className="font-display text-3xl gold-text">+{formatNumber(earnings)}</span>
                </motion.div>
              </div>

              {/* Collect button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-amber-500 text-primary-foreground font-semibold text-lg transition-all hover:brightness-110"
                style={{ boxShadow: '0 0 30px hsl(45 100% 50% / 0.3)' }}
              >
                Coletar! 🎉
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
