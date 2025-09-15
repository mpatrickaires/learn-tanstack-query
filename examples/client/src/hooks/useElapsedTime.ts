import { useState, useRef, useEffect, useMemo } from 'react';

export function useElapsedTime(clearCondition: boolean) {
  const startedAt = useMemo(() => new Date(), []);
  const [elapsedTimeInSeconds, setElapsedTimeInSeconds] = useState<number>(0);

  function setElapsedTime() {
    const elapsedTime = new Date().getTime() - startedAt.getTime();
    setElapsedTimeInSeconds(elapsedTime / 1000);
  }

  const elapsedTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!elapsedTimeIntervalRef.current) {
      elapsedTimeIntervalRef.current = setInterval(setElapsedTime, 50);
    }
  }, []);

  useEffect(() => {
    if (clearCondition && elapsedTimeIntervalRef.current) {
      clearInterval(elapsedTimeIntervalRef.current);
    }
  }, [clearCondition]);

  return {
    elapsedTimeInSeconds: elapsedTimeInSeconds
      .toString()
      .padEnd(2, '.')
      .padEnd(5, '0'),
  };
}
