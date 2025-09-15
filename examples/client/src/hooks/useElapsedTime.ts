import { useState, useRef, useEffect, useMemo } from 'react';

export function useElapsedTime({
  clearOn,
  enabled = true,
}: {
  clearOn: boolean;
  enabled?: boolean;
}) {
  const startedAt = useMemo(() => new Date(), [enabled]);
  const [elapsedTimeInSeconds, setElapsedTimeInSeconds] = useState<number>(0);

  function setElapsedTime() {
    const elapsedTime = new Date().getTime() - startedAt.getTime();
    setElapsedTimeInSeconds(elapsedTime / 1000);
  }

  const elapsedTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!elapsedTimeIntervalRef.current && enabled) {
      elapsedTimeIntervalRef.current = setInterval(setElapsedTime, 50);
    }
  }, [enabled]);

  useEffect(() => {
    if (clearOn && elapsedTimeIntervalRef.current) {
      clearInterval(elapsedTimeIntervalRef.current);
    }
  }, [clearOn]);

  return {
    elapsedTimeInSeconds: `${elapsedTimeInSeconds
      .toString()
      .padEnd(2, '.')
      .padEnd(5, '0')}s`,
  };
}
