import { useState, useEffect, useCallback } from 'react';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  baseEffect: number;
  level: number;
  maxLevel: number;
  unlockAt: number;
  type: 'production' | 'multiplier' | 'click';
  icon: string;
}

export interface GameState {
  coins: number;
  totalCoins: number;
  coinsPerSecond: number;
  clickPower: number;
  prestigePoints: number;
  prestigeMultiplier: number;
  totalPrestiges: number;
  upgrades: Upgrade[];
}

const initialUpgrades: Upgrade[] = [
  {
    id: 'auto-clicker',
    name: 'Auto Clicker',
    description: '+1 moeda/s',
    baseCost: 10,
    costMultiplier: 1.15,
    baseEffect: 1,
    level: 0,
    maxLevel: 100,
    unlockAt: 0,
    type: 'production',
    icon: '⚡',
  },
  {
    id: 'gold-mine',
    name: 'Mina de Ouro',
    description: '+5 moedas/s',
    baseCost: 100,
    costMultiplier: 1.2,
    baseEffect: 5,
    level: 0,
    maxLevel: 50,
    unlockAt: 50,
    type: 'production',
    icon: '⛏️',
  },
  {
    id: 'factory',
    name: 'Fábrica',
    description: '+25 moedas/s',
    baseCost: 500,
    costMultiplier: 1.25,
    baseEffect: 25,
    level: 0,
    maxLevel: 30,
    unlockAt: 300,
    type: 'production',
    icon: '🏭',
  },
  {
    id: 'bank',
    name: 'Banco',
    description: '+100 moedas/s',
    baseCost: 2000,
    costMultiplier: 1.3,
    baseEffect: 100,
    level: 0,
    maxLevel: 20,
    unlockAt: 1000,
    type: 'production',
    icon: '🏦',
  },
  {
    id: 'click-power',
    name: 'Poder do Clique',
    description: '+1 por clique',
    baseCost: 50,
    costMultiplier: 1.5,
    baseEffect: 1,
    level: 0,
    maxLevel: 50,
    unlockAt: 25,
    type: 'click',
    icon: '👆',
  },
  {
    id: 'multiplier',
    name: 'Multiplicador',
    description: 'x1.5 produção',
    baseCost: 1000,
    costMultiplier: 2,
    baseEffect: 0.5,
    level: 0,
    maxLevel: 10,
    unlockAt: 500,
    type: 'multiplier',
    icon: '✨',
  },
];

const PRESTIGE_THRESHOLD = 10000;

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('idleGameState');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      coins: 0,
      totalCoins: 0,
      coinsPerSecond: 0,
      clickPower: 1,
      prestigePoints: 0,
      prestigeMultiplier: 1,
      totalPrestiges: 0,
      upgrades: initialUpgrades,
    };
  });

  // Calculate coins per second
  const calculateCPS = useCallback(() => {
    let baseCPS = 0;
    let multiplier = 1;

    gameState.upgrades.forEach((upgrade) => {
      if (upgrade.type === 'production') {
        baseCPS += upgrade.baseEffect * upgrade.level;
      } else if (upgrade.type === 'multiplier') {
        multiplier += upgrade.baseEffect * upgrade.level;
      }
    });

    return baseCPS * multiplier * gameState.prestigeMultiplier;
  }, [gameState.upgrades, gameState.prestigeMultiplier]);

  // Calculate click power
  const calculateClickPower = useCallback(() => {
    let power = 1;
    gameState.upgrades.forEach((upgrade) => {
      if (upgrade.type === 'click') {
        power += upgrade.baseEffect * upgrade.level;
      }
    });
    return power * gameState.prestigeMultiplier;
  }, [gameState.upgrades, gameState.prestigeMultiplier]);

  // Update CPS
  useEffect(() => {
    const cps = calculateCPS();
    const clickPower = calculateClickPower();
    if (cps !== gameState.coinsPerSecond || clickPower !== gameState.clickPower) {
      setGameState((prev) => ({ ...prev, coinsPerSecond: cps, clickPower }));
    }
  }, [calculateCPS, calculateClickPower, gameState.coinsPerSecond, gameState.clickPower]);

  // Game tick
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        coins: prev.coins + prev.coinsPerSecond / 10,
        totalCoins: prev.totalCoins + prev.coinsPerSecond / 10,
      }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('idleGameState', JSON.stringify(gameState));
  }, [gameState]);

  const handleClick = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + prev.clickPower,
      totalCoins: prev.totalCoins + prev.clickPower,
    }));
  }, []);

  const getUpgradeCost = useCallback((upgrade: Upgrade) => {
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level));
  }, []);

  const buyUpgrade = useCallback((upgradeId: string) => {
    setGameState((prev) => {
      const upgrade = prev.upgrades.find((u) => u.id === upgradeId);
      if (!upgrade) return prev;

      const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level));
      if (prev.coins < cost || upgrade.level >= upgrade.maxLevel) return prev;

      return {
        ...prev,
        coins: prev.coins - cost,
        upgrades: prev.upgrades.map((u) =>
          u.id === upgradeId ? { ...u, level: u.level + 1 } : u
        ),
      };
    });
  }, []);

  const calculatePrestigePoints = useCallback(() => {
    return Math.floor(Math.sqrt(gameState.totalCoins / PRESTIGE_THRESHOLD));
  }, [gameState.totalCoins]);

  const canPrestige = gameState.totalCoins >= PRESTIGE_THRESHOLD;

  const prestige = useCallback(() => {
    if (!canPrestige) return;

    const newPrestigePoints = calculatePrestigePoints();
    
    setGameState((prev) => ({
      coins: 0,
      totalCoins: 0,
      coinsPerSecond: 0,
      clickPower: 1,
      prestigePoints: prev.prestigePoints + newPrestigePoints,
      prestigeMultiplier: 1 + (prev.prestigePoints + newPrestigePoints) * 0.1,
      totalPrestiges: prev.totalPrestiges + 1,
      upgrades: initialUpgrades,
    }));
  }, [canPrestige, calculatePrestigePoints]);

  return {
    gameState,
    handleClick,
    buyUpgrade,
    getUpgradeCost,
    prestige,
    canPrestige,
    calculatePrestigePoints,
  };
}
