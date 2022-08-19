import {isString, isNumber} from './common';

/**
 * yyyy-mm-dd
 * yyyy-mm-dd hh:mm:ss.SSS
 * yyyy-mm-ddThh:mm:ss.SSS
 */
export function parseDateString(val: string): Date {
  const valFixed = val.replace(/[-T]/g, m => (m === '-' ? '/' : ' ')).replace(/\.\d+/, '');
  // console.log('date', val, valFixed);
  return new Date(valFixed);
}
export function toDate(date: string | number | Date): Date {
  if (isString(date)) {
    date = parseDateString(date as string);
  } else if (isNumber(date)) {
    date = new Date(date);
  } else {
    date = new Date(date);
  }

  return date;
}
/**
 * transfer to formated date string
 * @date timestamp of date
 * @fmt the format of result, such as yyyy-MM-dd hh:mm:ss.SSS
 */
export function formatDate(date: string | number | Date | null, fmt: string) {
  if (!date) {
    return '';
  }

  date = toDate(date);
  if (!(date instanceof Date)) {
    return '';
  }

  const o: {
    [key: string]: any;
  } = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S+': date.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] + '' : ((k === 'S+' ? '000' : '00') + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return fmt;
}
export function getDate(d: Date | number | string): Date {
  d = toDate(d);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
