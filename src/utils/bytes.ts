/**
 * Module variables.
 * @private
 */
 interface IOptions {
  thousandsSeparator?: string;
  unitSeparator?: string;
  decimalPlaces?: number;
  fixedDecimals?: boolean;
  unit?: TUnit;
  map?: TMap;
}

const formatThousandsRegExp = /\B(?=(\d{3})+(?!\d))/g;

const formatDecimalsRegExp = /(?:\.0*|(\.[^0]+)0+)$/;

type TUnit = 'b' | 'kb' | 'mb' | 'gb' | 'tb' | 'pb';
type TMap = {
  [unit in TUnit]: number;
};
const unitMap: TMap = {
  b: 1,
  kb: 1 << 10,
  mb: 1 << 20,
  gb: 1 << 30,
  tb: Math.pow(1024, 4),
  pb: Math.pow(1024, 5),
};

const parseRegExp = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i;

/**
 * Convert the given value in bytes into a string or parse to string to an integer in bytes.
 *
 * @param {string|number} value
 * @param {{
 *  case: [string],
 *  decimalPlaces: [number]
 *  fixedDecimals: [boolean]
 *  thousandsSeparator: [string]
 *  unitSeparator: [string]
 *  }} [options] bytes options.
 *
 * @returns {string|number|null}
 */
export default function bytes(value: number, options?: IOptions): string;
export default function bytes(value: string, options?: IOptions): number;
export default function bytes(value: string | number, options?: IOptions): string | number;
export default function bytes(value: string | number, options?: IOptions) {
  if (typeof value === 'string') {
    return parse(value);
  }

  if (typeof value === 'number') {
    return format(value, options);
  }

  return null;
}

/**
 * Format the given value in bytes into a string.
 *
 * If the value is negative, it is kept as such. If it is a float,
 * it is rounded.
 *
 * @param {number} value
 * @param {object} [options]
 * @param {number} [options.decimalPlaces=2]
 * @param {number} [options.fixedDecimals=false]
 * @param {string} [options.thousandsSeparator=]
 * @param {string} [options.unit=]
 * @param {string} [options.unitSeparator=]
 *
 * @returns {string|null}
 * @public
 */

function format(value: number, options?: IOptions): string {
  if (!Number.isFinite(value)) {
    return '';
  }

  var mag = Math.abs(value);
  var thousandsSeparator = (options && options.thousandsSeparator) || '';
  var unitSeparator = (options && options.unitSeparator) || '';
  var decimalPlaces = options && options.decimalPlaces !== undefined ? options.decimalPlaces : 2;
  var fixedDecimals = Boolean(options && options.fixedDecimals);
  var map: TMap = options?.map ? options.map : unitMap;
  var unit = ((options && options.unit) || '') as any;

  if (!unit || !map[unit.toLowerCase() as keyof typeof map]) {
    if (mag >= map.pb) {
      unit = 'PB';
    } else if (mag >= map.tb) {
      unit = 'TB';
    } else if (mag >= map.gb) {
      unit = 'GB';
    } else if (mag >= map.mb) {
      unit = 'MB';
    } else if (mag >= map.kb) {
      unit = 'KB';
    } else {
      unit = 'B';
    }
  }

  var val = value / map[unit.toLowerCase() as keyof typeof map];
  var str = val.toFixed(decimalPlaces);

  if (!fixedDecimals) {
    str = str.replace(formatDecimalsRegExp, '$1');
  }

  if (thousandsSeparator) {
    str = str
      .split('.')
      .map(function (s, i) {
        return i === 0 ? s.replace(formatThousandsRegExp, thousandsSeparator) : s;
      })
      .join('.');
  }

  return str + unitSeparator + unit;
}

/**
 * Parse the string value into an integer in bytes.
 *
 * If no unit is given, it is assumed the value is in bytes.
 *
 * @param {number|string} val
 *
 * @returns {number|null}
 * @public
 */

function parse(val: string): number {
  if (typeof val === 'number' && !isNaN(val)) {
    return val;
  }

  if (typeof val !== 'string') {
    return 0;
  }

  // Test if the string passed is valid
  var results = parseRegExp.exec(val);
  var floatValue;
  var unit = 'b';

  if (!results) {
    // Nothing could be extracted from the given string
    floatValue = parseInt(val, 10);
    unit = 'b';
  } else {
    // Retrieve the value and the unit
    floatValue = parseFloat(results[1]);
    unit = results[4].toLowerCase();
  }

  if (isNaN(floatValue)) {
    return 0;
  }

  return Math.floor(unitMap[unit as keyof typeof unitMap] * floatValue);
}
