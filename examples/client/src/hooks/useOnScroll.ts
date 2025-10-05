import { useEffect, useRef, type RefObject } from 'react';

export function useOnScroll({ ref, onReachBottom, offsetBottom = 0 }: Props) {
  const hasReachedBottom = useRef(false);
  const previousScrollHeight = useRef(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const handleScroll = () => {
      const currentScrollHeight = element.scrollHeight;
      if (previousScrollHeight.current < currentScrollHeight) {
        hasReachedBottom.current = false;
      }

      previousScrollHeight.current = currentScrollHeight;

      // if (hasReachedBottom.current) {
      //   return;
      // }

      const distanceFromBottom = Math.trunc(
        element.scrollHeight - element.scrollTop - element.clientHeight
      );
      if (distanceFromBottom <= offsetBottom) {
        hasReachedBottom.current = true;
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
