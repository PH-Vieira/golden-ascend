import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Zap, Trophy } from 'lucide-react';
import { useGameState } from '@/hooks/useGameState';
import { CoinDisplay } from './CoinDisplay';
import { UpgradeCard } from './UpgradeCard';
import { PrestigePanel } from './PrestigePanel';

type Tab = 'upgrades' | 'prestige';

export function GameDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('upgrades');
  const {
    gameState,
    handleClick,
    buyUpgrade,
    getUpgradeCost,
    prestige,
    canPrestige,
    calculatePrestigePoints,
  } = useGameState();

  const tabs = [
    { id: 'upgrades' as Tab, label: 'Upgrades', icon: Zap },
    { id: 'prestige' as Tab, label: 'Prestígio', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <Coins className="w-6 h-6 text-primary" />
            <h1 className="font-display text-lg gold-text">Idle Fortune</h1>
          </div>
          {gameState.prestigeMultiplier > 1 && (
            <div className="px-2 py-1 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
              x{gameState.prestigeMultiplier.toFixed(1)} bônus
            </div>
          )}
        </div>
      </header>

      {/* Main coin display */}
      <div className="flex-shrink-0 px-4">
        <CoinDisplay
          coins={gameState.coins}
          coinsPerSecond={gameState.coinsPerSecond}
          onTap={handleClick}
          clickPower={gameState.clickPower}
          prestigeMultiplier={gameState.prestigeMultiplier}
        />
      </div>

      {/* Tab navigation */}
      <div className="sticky top-[61px] z-40 bg-background/80 backdrop-blur-lg px-4 py-2 border-b border-border/50">
        <div className="flex gap-2 max-w-lg mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? tab.id === 'prestige'
                    ? 'bg-secondary/20 text-secondary border border-secondary/30'
                    : 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'prestige' && canPrestige && (
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-8">
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'upgrades' && (
              <motion.div
                key="upgrades"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {gameState.upgrades.map((upgrade) => (
                  <UpgradeCard
                    key={upgrade.id}
                    upgrade={upgrade}
                    cost={getUpgradeCost(upgrade)}
                    canAfford={gameState.coins >= getUpgradeCost(upgrade)}
                    isUnlocked={gameState.totalCoins >= upgrade.unlockAt}
                    onBuy={() => buyUpgrade(upgrade.id)}
                  />
                ))}
              </motion.div>
            )}

            {activeTab === 'prestige' && (
              <motion.div
                key="prestige"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <PrestigePanel
                  prestigePoints={gameState.prestigePoints}
                  prestigeMultiplier={gameState.prestigeMultiplier}
                  totalPrestiges={gameState.totalPrestiges}
                  potentialPoints={calculatePrestigePoints()}
                  canPrestige={canPrestige}
                  onPrestige={prestige}
                />

                {/* Prestige info */}
                <div className="mt-6 space-y-4">
                  <div className="game-card">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="text-lg">📖</span>
                      Como funciona?
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Acumule 10.000 moedas totais para desbloquear o prestígio
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Cada prestígio reinicia seu progresso, mas você ganha pontos permanentes
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Pontos de prestígio aumentam seu multiplicador de produção
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        Mais moedas totais = mais pontos por prestígio
                      </li>
                    </ul>
                  </div>

                  <div className="game-card">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      Dicas de Estratégia
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        Espere acumular mais moedas para ganhar mais pontos
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        Multiplicadores aumentam toda a produção
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-accent">•</span>
                        Prestígios frequentes nem sempre são a melhor estratégia
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
