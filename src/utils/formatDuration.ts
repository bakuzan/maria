/* tslint:disable:object-literal-sort-keys */
const defaults = {
  days: {
    1: 'day',
    2: 'days'
  },
  months: {
    1: 'month',
    2: 'months'
  },
  years: {
    1: 'year',
    2: 'years'
  }
};

function getUnit(interval: number, unit: string, opts: any) {
  let ret;

  if (typeof opts[unit] === 'string') {
    return opts[unit];
  }

  Object.keys(opts[unit]).forEach(function (key) {
    if (Number(key) <= interval) {
      ret = opts[unit][key];
    }
  });

  return ret;
}

const DAYS_PER_YEAR = 365;
const DAYS_PER_MONTH = DAYS_PER_YEAR / 12;

export default function formatDuration(durationDays: number, opts = defaults) {
  const parts = [];
  let days = durationDays;
  let interval = Math.floor(days / DAYS_PER_YEAR);

  if (interval >= 1) {
    parts.push(interval + ' ' + getUnit(interval, 'years', opts));
    days -= interval * 365;
  }

  interval = Math.floor(days / DAYS_PER_MONTH);
  if (interval >= 1) {
    parts.push(interval + ' ' + getUnit(interval, 'months', opts));
    days -= interval * DAYS_PER_MONTH;
  }

  interval = Math.floor(days);
  if (interval >= 1) {
    parts.push(interval + ' ' + getUnit(interval, 'days', opts));
  }

  return parts.length ? parts.join(', ') : `0 days`;
}
