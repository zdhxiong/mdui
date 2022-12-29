/** https://github.com/shoelace-style/shoelace/blob/next/src/internal/modal.ts */
import { getTabbableBoundary } from './tabbable.js';

let activeModals: HTMLElement[] = [];

export class Modal {
  private readonly element: HTMLElement;
  private tabDirection: 'forward' | 'backward' = 'forward';

  public constructor(element: HTMLElement) {
    this.element = element;
    this.handleFocusIn = this.handleFocusIn.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  public activate(): void {
    activeModals.push(this.element);
    document.addEventListener('focusin', this.handleFocusIn);
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  public deactivate(): void {
    activeModals = activeModals.filter((modal) => modal !== this.element);
    document.removeEventListener('focusin', this.handleFocusIn);
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  private isActive(): boolean {
    // The "active" modal is always the most recent one shown
    return activeModals[activeModals.length - 1] === this.element;
  }

  private checkFocus(): void {
    if (this.isActive()) {
      if (!this.element.matches(':focus-within')) {
        const { start, end } = getTabbableBoundary(this.element);
        const target = this.tabDirection === 'forward' ? start : end;

        if (typeof target?.focus === 'function') {
          target.focus({ preventScroll: true });
        }
      }
    }
  }

  private handleFocusIn(): void {
    this.checkFocus();
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Tab' && event.shiftKey) {
      this.tabDirection = 'backward';
    }

    // Ensure focus remains trapped after they key is pressed
    requestAnimationFrame(() => this.checkFocus());
  }

  private handleKeyUp(): void {
    this.tabDirection = 'forward';
  }
}
