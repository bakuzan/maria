import { CalculatorMode } from '@/consts';

interface RadioGroupOptions {
  defaultValue: CalculatorMode;
  onChange(value: CalculatorMode): void;
}

export default class RadioGroupController {
  private activeClass = 'maria-button--radio_active';
  private container: HTMLDivElement;
  private listener: (e: Event) => void;
  private options: RadioGroupOptions;

  constructor(selector: string, opts: RadioGroupOptions) {
    this.container = document.querySelector(selector);
    this.options = opts;

    this.init();
  }

  public tearDown() {
    this.container.querySelectorAll('button').forEach((btn) => {
      btn.classList.remove(this.activeClass);
      btn.removeEventListener('click', this.listener);
    });
  }

  // Private
  private init() {
    this.listener = (e: Event) => this.handleModeSelect(e);
    this.container.querySelectorAll('button').forEach((btn) => {
      const m = btn.getAttribute('data-mode') as CalculatorMode;
      if (m === this.options.defaultValue) {
        btn.classList.add(this.activeClass);
      }

      btn.addEventListener('click', this.listener);
    });
  }

  private handleModeSelect(event: Event) {
    const t = event.target as HTMLButtonElement;
    const newMode = t.getAttribute('data-mode');

    this.container.querySelectorAll('button').forEach((btn) => {
      const isSelected = btn.getAttribute('data-mode') === newMode;

      if (isSelected) {
        btn.classList.add(this.activeClass);
      } else {
        btn.classList.remove(this.activeClass);
      }
    });

    this.options.onChange(newMode as CalculatorMode);
  }
}
