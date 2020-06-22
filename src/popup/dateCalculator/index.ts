import { CalculatorMode } from '@/consts';
import RadioGroupController from '@/utils/RadioGroupController';

import dateOffsetCalculator from './dateOffsetCalculator';
import dateRangeCalculator from './dateRangeCalculator';
import { request } from 'http';

const VISIBLE_SIDEBAR_CLASS = 'popup__sidebar--visible';
const ACTIVE_FORM_CLASS = 'date-form--visible';

class DateCalculatorManager {
  private modeButtonManager: RadioGroupController | null = null;

  public init() {
    document
      .getElementById('openDateCalculator')
      .addEventListener('click', () => this.onClick());
  }

  // Private methods
  private async onClick() {
    const sidebar = document.getElementById('popupSidebar');
    const isVisible = sidebar.className.includes(VISIBLE_SIDEBAR_CLASS);

    if (isVisible) {
      sidebar.classList.remove(VISIBLE_SIDEBAR_CLASS);

      dateOffsetCalculator.destroy();
      dateRangeCalculator.destroy();
      this.modeButtonManager.tearDown();
    } else {
      sidebar.classList.add(VISIBLE_SIDEBAR_CLASS);

      this.modeButtonManager = new RadioGroupController('#dateModeGroup', {
        onChange: (v) => this.onCalculatorModeChange(v),
        defaultValue: CalculatorMode.DaysFrom
      });

      dateOffsetCalculator.init();
    }
  }

  private onCalculatorModeChange(mode: CalculatorMode) {
    switch (mode) {
      case CalculatorMode.DaysFrom:
        dateRangeCalculator.destroy();
        this.toggleTo(mode);
        dateOffsetCalculator.init();
        break;
      case CalculatorMode.DaysBetween:
        dateOffsetCalculator.destroy();
        this.toggleTo(mode);
        dateRangeCalculator.init();
        break;
      default:
        break;
    }
  }

  private toggleTo(mode: string) {
    document
      .querySelector('#popupSidebar')
      .querySelectorAll('form')
      .forEach((f) => {
        f.classList.remove(ACTIVE_FORM_CLASS);
        f.setAttribute('aria-hidden', 'true');
      });

    requestAnimationFrame(() => {
      const showMe = document.querySelector(`form[data-mode="${mode}"]`);
      showMe.classList.add(ACTIVE_FORM_CLASS);
      showMe.setAttribute('aria-hidden', 'false');
    });
  }
}

const service = new DateCalculatorManager();

export default service;
