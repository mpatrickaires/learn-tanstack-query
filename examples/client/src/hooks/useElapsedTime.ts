import { useState, useRef, useEffect, useMemo } from 'react';
import { msToSeconds } from '../utils';

export function useElapsedTime({
  clearOn,
  enabled = true,
  showMs = true,
}: Props) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [elapsedTimeInSeconds, setElapsedTimeInSeconds] = useState<number>(0);
  const [hasCleared, setHasCleared] = useState(false);
  const startedAt = useMemo(() => new Date(), [isEnabled]);
  const elapsedTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    debugger;
    if (elapsedTimeIntervalRef.current || !isEnabled) {
      return;
    }

    elapsedTimeIntervalRef.current = setInterval(setElapsedTime, 50);
    if (typeof clearOn === 'number') {
      setTimeout(clear, clearOn);
    }
  }, [isEnabled]);

  useEffect(() => {
    if (typeof clearOn === 'boolean' && clearOn) {
      clear();
    }
  }, [clearOn]);

  function setElapsedTime() {
    const elapsedTime = new Date().getTime() - startedAt.getTime();
    setElapsedTimeInSeconds(elapsedTime / 1000);
  }

  function clear() {
    if (elapsedTimeIntervalRef.current) {
      clearInterval(elapsedTimeIntervalRef.current);
      setHasCleared(true);
      setIsEnabled(false);
    }
  }

  function reset() {
    if (isEnabled) {
      return;
    }

    elapsedTimeIntervalRef.current = null;
    setHasCleared(false);
    setIsEnabled(true);
  }

  const elapsedTime =
    typeof clearOn === 'number' && hasCleared
      ? msToSeconds(clearOn)
      : elapsedTimeInSeconds;
  const elapsedTimeFormatted = showMs
    ? `${elapsedTime.toString().padEnd(2, '.').padEnd(5, '0')}`
    : Math.round(elapsedTime);

  return {
    elapsedTimeInSeconds: `${elapsedTimeFormatted}s`,
    reset,
  };
}

type Props = {
  clearOn: boolean | number;
  enabled?: boolean;
  showMs?: boolean;
};
