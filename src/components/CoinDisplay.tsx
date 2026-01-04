import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CoinDisplayProps {
  coins: number;
  coinsPerSecond: number;
  onTap: () => void;
  clickPower: number;
  prestigeMultiplier: number;
}

interface FloatingCoin {
  id: number;
  x: number;
  y: number;
  value: number;
}

function formatNumber(num: number): string {
  if (num < 1000) return Math.floor(num).toString();
  if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
  if (num < 1000000000) return (num / 1000000).toFixed(2) + 'M';
  if (num < 1000000000000) return (num / 1000000000).toFixed(2) + 'B';
  return (num / 1000000000000).toFixed(2) + 'T';
}

export function CoinDisplay({ coins, coinsPerSecond, onTap, clickPower, prestigeMultiplier }: CoinDisplayProps) {
  const [floatingCoins, setFloatingCoins] = useState<FloatingCoin[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const coinIdRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    onTap();
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const newCoin: FloatingCoin = {
      id: coinIdRef.current++,
      x: x + (Math.random() - 0.5) * 40,
      y,
      value: clickPower,
    };

    setFloatingCoins((prev) => [...prev, newCoin]);

    setTimeout(() => {
      setFloatingCoins((prev) => prev.filter((c) => c.id !== newCoin.id));
    }, 1000);
  };

  return (
    <div className="relative flex flex-col items-center gap-4 py-8">
      {/* Prestige multiplier badge */}
      {prestigeMultiplier > 1 && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-4 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/50"
        >
          <span className="text-sm font-medium prestige-text">
            x{prestigeMultiplier.toFixed(1)}
          </span>
        </motion.div>
      )}

      {/* Main coin counter */}
      <div className="text-center mb-4">
        <motion.div 
          key={Math.floor(coins)}
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 0.1 }}
          className="number-ticker text-5xl sm:text-6xl font-bold gold-text"
        >
          {formatNumber(coins)}
        </motion.div>
        <p className="text-muted-foreground mt-1 text-lg">moedas</p>
      </div>

      {/* Per second indicator */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30">
        <span className="text-accent text-lg">+{formatNumber(coinsPerSecond)}</span>
        <span className="text-muted-foreground">/s</span>
      </div>

      {/* Tap area */}
      <div 
        ref={containerRef}
        className="relative mt-6"
      >
        <motion.button
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          onClick={handleTap}
          animate={{ 
            scale: isPressed ? 0.95 : 1,
            boxShadow: isPressed 
              ? '0 0 20px hsl(45 100% 50% / 0.3)' 
              : '0 0 40px hsl(45 100% 50% / 0.4)'
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center cursor-pointer active:cursor-pointer select-none"
        >
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-400 to-primary flex items-center justify-center">
            <span className="text-5xl sm:text-6xl">🪙</span>
          </div>
          
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full animate-pulse-glow border-2 border-primary/50" />
        </motion.button>

        {/* Floating coins */}
        <AnimatePresence>
          {floatingCoins.map((coin) => (
            <motion.div
              key={coin.id}
              initial={{ x: coin.x, y: coin.y, opacity: 1, scale: 1 }}
              animate={{ 
                y: coin.y - 80, 
                opacity: 0, 
                scale: 0.5 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute pointer-events-none font-display text-primary font-bold text-xl"
              style={{ left: 0, top: 0 }}
            >
              +{formatNumber(coin.value)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Click power indicator */}
      <p className="text-muted-foreground text-sm mt-2">
        +{formatNumber(clickPower)} por toque
      </p>
    </div>
  );
}
