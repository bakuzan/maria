import formatDateForDisplay from '@/utils/formatDateForDisplay';
import daysBetweenDates from '@/utils/daysBetweenDates';
import formatDuration from '@/utils/formatDuration';

const ERROR_CLASS = 'popup__message--error';

class DateRangeCalculator {
  private form: HTMLFormElement | undefined;
  private dayFromInput: HTMLInputElement | undefined;
  private dayToInput: HTMLInputElement | undefined;
  private messageBox: HTMLDivElement | undefined;
  private listener: (e: Event) => void;
  private timer = 0;

  public init() {
    this.form = document.querySelector('#dateDurationForm');
    this.dayFromInput = document.querySelector('#dayFrom');
    this.dayToInput = document.querySelector('#dayTo');

    this.messageBox = document.querySelector('#messageBox');
    this.listener = (e: Event) => this.handleDateCalculate(e);

    this.form.addEventListener('submit', this.listener);

    clearTimeout(this.timer);
    this.timer = window.setTimeout(() => this.dayFromInput.focus(), 250);
  }

  public destroy() {
    this.dayFromInput.value = '';
    this.dayToInput.value = '';
    this.messageBox.textContent = '';

    this.form.removeEventListener('submit', this.listener);
  }

  // Private
  private handleDateCalculate(event: Event) {
    event.preventDefault();

    const from = new Date(this.dayFromInput.value);
    const to = new Date(this.dayToInput.value);

    const isInvalidFrom = from.toString() === 'Invalid Date';
    const isInvalidTo = to.toString() === 'Invalid Date';

    if (isInvalidFrom || isInvalidTo) {
      this.messageBox.classList.add(ERROR_CLASS);
      this.messageBox.textContent = `Invalid date.\r\nBoth fields must be a valid date.`;
      return;
    }

    const days = daysBetweenDates(from, to);
    const diff = formatDuration(days);
    const f = formatDateForDisplay(from);
    const t = formatDateForDisplay(to);

    this.messageBox.classList.remove(ERROR_CLASS);
    this.messageBox.textContent = `${diff}\r\nfrom ${f}\r\nto ${t}`;
  }
}

const service = new DateRangeCalculator();

export default service;
