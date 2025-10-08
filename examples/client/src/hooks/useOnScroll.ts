import { useEffect, type RefObject } from 'react';

export function useOnScroll({ ref, onReachBottom, offsetBottom = 0 }: Props) {
  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const handleScroll = () => {
      const distanceFromBottom = Math.trunc(
        element.scrollHeight - element.scrollTop - element.clientHeight
      );
      if (distanceFromBottom <= offsetBottom) {
        onReachBottom();
      }
    };

    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [ref, onReachBottom, offsetBottom]);
}

type Props = {
  ref: RefObject<HTMLElement | null>;
  onReachBottom: () => void;
  offsetBottom?: number;
};
