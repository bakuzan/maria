import formatDateForDisplay from '@/utils/formatDateForDisplay';

const ERROR_CLASS = 'popup__message--error';

class DateCalculator {
  private dateOffsetForm: HTMLFormElement | undefined;
  private daysInput: HTMLInputElement | undefined;
  private messageBox: HTMLDivElement | undefined;
  private listener: (e: Event) => void;
  private timer = 0;

  public init() {
    this.dateOffsetForm = document.querySelector('#dateOffsetForm');
    this.daysInput = document.querySelector('#days');
    this.messageBox = document.querySelector('#messageBox');
    this.listener = (e: Event) => this.handleDateCalculate(e);

    this.dateOffsetForm.addEventListener('submit', this.listener);

    clearTimeout(this.timer);
    this.timer = window.setTimeout(this.daysInput.focus, 250);
  }

  public destroy() {
    this.daysInput.value = '';
    this.messageBox.textContent = '';

    this.dateOffsetForm.removeEventListener('submit', this.listener);
  }

  // Private
  private handleDateCalculate(event: Event) {
    event.preventDefault();

    const val = this.daysInput.value;
    const offset = Number(val ?? 0);

    if (isNaN(offset)) {
      this.messageBox.classList.add(ERROR_CLASS);
      this.messageBox.textContent = `Invalid value: ${offset}.\r\nOffset must be a number.`;
      return;
    }

    const d = new Date();
    d.setDate(d.getDate() + offset);

    const newDate = formatDateForDisplay(d);
    const today = formatDateForDisplay(new Date());
    this.messageBox.classList.remove(ERROR_CLASS);
    this.messageBox.textContent = `${offset} days\r\nfrom ${today}\r\nis ${newDate}`;
  }
}

const service = new DateCalculator();

export default service;
