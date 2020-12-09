import { DateTime } from 'luxon';

const MINUTES_IN_AN_HOUR = 60;

const COLON = /^\d{0,2}:\d{0,2} \w{3,}$/; // e.g. 10:00 PST or 1:00 CST
const AMPM = /^\d{0,2} ?\w{2} \w{3,}$/; // e.g. 5 PM EST or 9PM CET
const AMPMCOLON = /^\d{0,2}:\d{0,2} ?\w{2} \w{3,}$/; // e.g. 1:00 PM JST or 1:00PM VLAT

/* EXAMPLES WITH CONFIRMED CONVERSIONS
    10:00 PST    -> 18:00 GMT
    1:00 CST     -> 07:00 GMT
    5 PM EST     -> 22:00 GMT
    9PM CET      -> 20:00 GMT
    1:00 PM JST  -> 04:00 GMT
    1:00PM VLAT  -> 03:00 GMT
*/

function parseTimeWithZoneString(inputString: string) {
  const trimmed = inputString.trim();
  const withColonNoAMPM = trimmed.match(COLON);
  const withNoColonAMPM = trimmed.match(AMPM);
  const withColonAMPM = trimmed.match(AMPMCOLON);

  if (!withColonNoAMPM && !withNoColonAMPM && !withColonAMPM) {
    return {
      success: false,
      errorMessage: `Invalid input. Input (${inputString}) did not match accepted formats.`
    };
  }

  let hour = '0';
  let minute = '0';
  let zone = '';

  if (withColonNoAMPM) {
    const [nums, z] = trimmed.split(' ');
    const [h, m] = nums.split(':');

    hour = h;
    minute = m;
    zone = z;
  } else if (withNoColonAMPM) {
    const parts = trimmed.split(' ');
    const [h, o, z] =
      parts.length === 3
        ? parts
        : [parts[0].replace(/\D/g, ''), parts[0].replace(/\d/g, ''), parts[1]];

    const isAM = o.toUpperCase() === 'AM';

    hour = isAM ? h : `${Number(h) + 12}`;
    zone = z;
  } else if (withColonAMPM) {
    const parts = trimmed.split(' ');
    const [h, m, o, z] =
      parts.length === 3
        ? [...parts[0].split(':'), ...parts.slice(1)]
        : [
            ...parts[0].split(':').map((x) => x.replace(/\D/g, '')),
            parts[0].replace(/\d|\:/g, ''),
            parts[1]
          ];

    const isAM = o.toUpperCase() === 'AM';

    hour = isAM ? h : `${Number(h) + 12}`;
    minute = m;
    zone = z;
  } else {
    return {
      success: false,
      errorMessage: `Invalid input. Input (${inputString}) hit an impossible case!`
    };
  }

  return {
    success: true,
    hour: Number(hour),
    minute: Number(minute),
    zone: zone.toUpperCase()
  };
}

export default function timezoneConversion(inputString: string) {
  console.log('Input: ', inputString);
  if (!inputString || !inputString.trim()) {
    return {
      success: false,
      errorMessage: 'Invalid input. No input provided.'
    };
  }

  const result = parseTimeWithZoneString(inputString);
  if (!result.success) {
    return {
      success: false,
      errorMessage: result.errorMessage
    };
  }

  const fromObj = DateTime.fromObject({
    hour: result.hour,
    minute: result.minute,
    zone: result.zone
  });

  if (!fromObj.isValid) {
    return {
      success: false,
      errorMessage: `${fromObj.invalidReason} > ${fromObj.invalidExplanation}`
    };
  }

  const utcOffset = fromObj.offset / MINUTES_IN_AN_HOUR;
  const localZone = DateTime.local().zone.name;
  const source = DateTime.fromObject(fromObj.toObject()).toJSDate();
  const date = DateTime.fromJSDate(new Date(fromObj.toJSDate()))
    .setZone(localZone)
    .toJSDate();

  return {
    success: true,
    source,
    date,
    utcOffset
  };
}
