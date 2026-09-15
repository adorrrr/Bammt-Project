import { useEffect } from 'react';
import type { RefObject } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Moves focus into a dialog container when it opens and constrains
 * Tab / Shift+Tab navigation to the elements inside it, so keyboard
 * and screen-reader users can't tab out into the page content sitting
 * behind the modal overlay.
 */
export function useFocusTrap(containerRef: RefObject<HTMLElement>, isOpen: boolean): void {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const container = containerRef.current;

    // Defer to the next tick so the dialog's own contents have painted.
    const focusTimer = window.setTimeout(() => {
      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetParent !== null);
      (focusables[0] || container).focus();
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusables = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetParent !== null);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, containerRef]);
}
