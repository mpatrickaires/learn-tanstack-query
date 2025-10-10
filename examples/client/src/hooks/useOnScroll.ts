import { useEffect, type RefObject } from 'react';

export function useOnScroll({
  ref,
  onReachBottom,
  offsetBottom = 0,
  onReachTop,
  offsetTop = 0,
}: Props) {
  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const handleScroll = async () => {
      if (element.scrollTop <= offsetTop && onReachTop) {
        const result = onReachTop();
        if (result instanceof Promise) {
          await result;
          requestAnimationFrame(() => {
            element.scrollTop = offsetTop + 100;
          });
        }
      }

      if (!onReachBottom) {
        return;
      }

      const distanceFromBottom = Math.trunc(
        element.scrollHeight - element.scrollTop - element.clientHeight
      );
      if (distanceFromBottom <= offsetBottom) {
        onReachBottom?.();
      }
    };

    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [ref, onReachBottom, offsetBottom]);
}

type Props = {
  ref: RefObject<HTMLElement | null>;
  onReachBottom?: () => unknown | Promise<unknown>;
  offsetBottom?: number;
  onReachTop?: () => unknown | Promise<unknown>;
  offsetTop?: number;
};
