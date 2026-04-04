'use client';
import { useEffect, useRef } from 'react';
import { useRidoStore } from '@/store/ridoStore';
import type { Payout } from '@/store/ridoStore';

const VALIDATION_MS = 7000;
const PAYOUT_COOLDOWN_MS = 15000;

export function useEngine() {
  const tick = useRidoStore((s) => s.tick);
  const addPayout = useRidoStore((s) => s.addPayout);
  const addNotification = useRidoStore((s) => s.addNotification);
  const setPayoutCooldown = useRidoStore((s) => s.setPayoutCooldown);
  const setDisruptionStart = useRidoStore((s) => s.setDisruptionStart);
  const profile = useRidoStore((s) => s.profile);

  const stateRef = useRef(useRidoStore.getState);

  useEffect(() => {
    stateRef.current = useRidoStore.getState;
  });

  useEffect(() => {
    if (!profile) return;

    const interval = setInterval(() => {
      tick();
      const s = stateRef.current();

      const { disrupting, disruptionStart, finalConfidence, payoutCooldown,
        actualIncome, expectedIncome, triggers } = s;

      if (disrupting && finalConfidence > 0.7 && !payoutCooldown) {
        if (!disruptionStart) {
          setDisruptionStart(Date.now());
          return;
        }
        const elapsed = Date.now() - disruptionStart;
        if (elapsed >= VALIDATION_MS) {
          const incomeLoss = Math.max(0, expectedIncome - actualIncome);
          const amount = incomeLoss < 80 ? 50 : incomeLoss < 180 ? 150 : 250;
          const type: Payout['type'] = amount === 50 ? 'small' : amount === 150 ? 'medium' : 'large';
          const reasons: string[] = [];
          if (triggers.rain) reasons.push('Heavy rain');
          if (triggers.traffic) reasons.push('High traffic');
          if (triggers.delay) reasons.push('Store delays');
          if (triggers.orders) reasons.push('Low demand');
          const reason = reasons.join(' + ') || 'Disruption detected';

          const payout: Payout = {
            id: Math.random().toString(36).slice(2),
            time: new Date().toLocaleTimeString(),
            reason,
            confidence: finalConfidence,
            amount,
            type,
          };
          addPayout(payout);
          setPayoutCooldown(true);
          setDisruptionStart(Date.now());
          addNotification(
            `✓ ₹${amount} Credited Automatically`,
            `${reason} detected. ₹${amount} credited automatically. No action required.`,
            'payout'
          );
          setTimeout(() => setPayoutCooldown(false), PAYOUT_COOLDOWN_MS);
        }
      }

      if (!disrupting && disruptionStart) {
        setDisruptionStart(null);
        addNotification('✦ System Stabilized', 'All conditions returned to normal. Monitoring resumed.', 'info');
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [profile, tick, addPayout, addNotification, setPayoutCooldown, setDisruptionStart]);
}
