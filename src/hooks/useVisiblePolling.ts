import { useEffect, useRef } from 'react';

/**
 * Exécute un callback à intervalle régulier (défaut 15s) uniquement quand
 * la page est visible. Réexécute immédiatement le callback quand la page
 * redevient visible (pour rattraper les changements survenus pendant
 * que l'onglet était caché). Clean propre à l'unmount.
 *
 * N'appelle PAS le callback au mount : on suppose que les données sont
 * déjà chargées en amont (ex: AuthContext au login). Démarrer uniquement
 * l'intervalle pour les mises à jour ultérieures.
 */
export function useVisiblePolling(
  callback: () => void | Promise<void>,
  intervalMs = 15000,
  enabled = true,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const run = () => {
      try {
        Promise.resolve(callbackRef.current()).catch((error) => {
          console.error('[useVisiblePolling] callback error:', error);
        });
      } catch (error) {
        console.error('[useVisiblePolling] callback error:', error);
      }
    };

    const start = () => {
      if (intervalId !== null) return;
      intervalId = setInterval(run, intervalMs);
    };

    const stop = () => {
      if (intervalId === null) return;
      clearInterval(intervalId);
      intervalId = null;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Rattrape les changements survenus pendant que l'onglet était caché
        run();
        start();
      } else {
        stop();
      }
    };

    // Démarre l'intervalle (pas d'appel initial au mount : les données
    // sont censées être déjà hydratées par le AuthContext).
    if (document.visibilityState === 'visible') {
      start();
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [intervalMs, enabled]);
}

