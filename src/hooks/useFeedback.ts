import { useCallback, useRef } from 'react';

// Audio context for Web Audio API (more reliable than HTMLAudioElement for game sounds)
let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

// Play a simple synthesized coin sound
function playCoinSound(volume = 0.3) {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  } catch (e) {
    // Audio not supported
  }
}

// Play upgrade purchase sound (deeper, more satisfying)
function playUpgradeSound(volume = 0.4) {
  try {
    const ctx = getAudioContext();
    
    // First tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(400, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
    gain1.gain.setValueAtTime(volume, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.2);
    
    // Second tone (harmony)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(600, ctx.currentTime + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.15);
    gain2.gain.setValueAtTime(volume * 0.7, ctx.currentTime + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc2.start(ctx.currentTime + 0.05);
    osc2.stop(ctx.currentTime + 0.25);
  } catch (e) {
    // Audio not supported
  }
}

// Trigger haptic feedback
function triggerHaptic(style: 'light' | 'medium' | 'heavy' = 'light') {
  try {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30, 10, 30],
      };
      navigator.vibrate(patterns[style]);
    }
  } catch (e) {
    // Haptic not supported
  }
}

export function useFeedback() {
  const lastClickTime = useRef(0);
  const minInterval = 30; // Minimum ms between sounds to prevent audio spam

  const clickFeedback = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTime.current > minInterval) {
      playCoinSound(0.2);
      triggerHaptic('light');
      lastClickTime.current = now;
    }
  }, []);

  const upgradeFeedback = useCallback(() => {
    playUpgradeSound(0.3);
    triggerHaptic('medium');
  }, []);

  const prestigeFeedback = useCallback(() => {
    try {
      const ctx = getAudioContext();
      
      // Ascending arpeggio for prestige
      const notes = [400, 500, 600, 800, 1000];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08);
        gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.3);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.3);
      });
      
      triggerHaptic('heavy');
    } catch (e) {
      // Audio not supported
    }
  }, []);

  return {
    clickFeedback,
    upgradeFeedback,
    prestigeFeedback,
  };
}
