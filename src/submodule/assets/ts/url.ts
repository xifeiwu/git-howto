import {isPlainObject, isString} from './common';

interface IUrl {
  protocol: string; // => "http:"
  host: string; // => "example.com:3000"
  hostname: string; // => "example.com"
  port: string; // => "3000"
  pathname: string; // => "/pathname/"
  hash: string; // => "#hash"
  search: string; // => "?search=test"
  query: {
    [key: string]: string | string[];
  }; // => {search: test}
  origin: string; // => "http://example.com:3000"
}
/** 生成url */
export function generateUrl(urlObj: IUrl) {
  const {origin, pathname, query, hash} = urlObj;
  const search = encodeQueryString(query as {[key: string]: string | string[] | number | undefined});
  return `${origin}${pathname}${search}${hash}`;
}

export function encodeQueryString(
  obj: {[key: string]: string | string[] | number | undefined},
  trimQ = true
): string {
  let realIdx = 0;
  const ret = Object.keys(obj).reduce((str, key) => {
    const delimiter = realIdx === 0 ? '?' : '&';
    const val = obj[key];
    // XXX: 丢弃 undefined
    if (typeof val === 'undefined') {
      return str;
    }
    realIdx += 1;
    if (Array.isArray(val)) {
      val.forEach(v => {
        str += delimiter + encodeURIComponent(key);
        str += '=' + encodeURIComponent(v);
      });
    } else {
      // XXX: 如果 val = ‘’ 不需要 =
      str += delimiter + encodeURIComponent(key);
      if (val !== '') {
        str += '=' + encodeURIComponent(val);
      }
    }
    return str;
  }, '');

  if (trimQ) {
    return ret.substring(1);
  }
  return ret;
}

export function toUrl(config: {
  path: string;
  params?: {
    [key: string]: string;
  };
  query?: {[key: string]: string | string[] | number | undefined};
}) {
  const {path, params, query} = config;
  let url = path;
  if (isPlainObject(params)) {
    const reg = new RegExp('/{([^}]*)}|/:([^/]*)', 'g');
    const replacer = (_match: string, p1: string, p2: string) => {
      const p = p1 ? p1 : p2 ? p2 : '';
      if (
        !(
          params as {
            [key: string]: string;
          }
        ).hasOwnProperty(p)
      ) {
        // return match;
        throw new Error(`${p} is not found in params`);
      }
      const v = (
        params as {
          [key: string]: string;
        }
      )[p];
      return `/${v}`;
    };
    url = url.replace(reg, replacer);
  }
  if (query) {
    url = `${url}?${encodeQueryString(query)}`;
  }
  return url;
}

/**
 * ref: https://github.com/Gozala/querystring
 * @param qs stands for queryString
 * @param sep seperate string, & as default
 * @param eq equal string, = as default
 * @param options
 */
export function decodeQueryString(
  qs: string,
  sep: string = '&',
  eq: string = '='
): {
  [key: string]: string | Array<string>;
} {
  const results: {
    [key: string]: string | Array<string>;
  } = {};
  qs = qs.trim();
  if (!isString(qs) || qs.length === 0) {
    return results;
  }
  try {
    qs = qs.startsWith('?') ? qs.substr(1) : qs;
    const regexp = /\+/g;
    qs.split(sep).forEach(it => {
      const x = it.replace(regexp, '%20');
      const idx = x.indexOf(eq);
      let kstr: string;
      let vstr: string;
      let k: string;
      let v: string;
      if (idx >= 0) {
        kstr = x.substr(0, idx);
        vstr = x.substr(idx + 1);
      } else {
        kstr = x;
        vstr = '';
      }
      k = decodeURIComponent(kstr);
      v = decodeURIComponent(vstr);
      if (!results.hasOwnProperty(k)) {
        results[k] = v;
      } else if (Array.isArray(results[k])) {
        (results[k] as Array<string>).push(v);
      } else {
        results[k] = [results[k] as string, v];
      }
    });
  } catch (error) {
    console.log('error in parseQueryString:');
    console.log(error);
  }
  return results;
}
/** 获取解析后的queryString */
export function getQuery(key: string): Array<string> | string | undefined;
export function getQuery(key: string, oneValue: boolean, search?: string): string | undefined;
export function getQuery(): {
  [key: string]: Array<string> | string;
};
export function getQuery(key?: string, oneValue?: boolean, search?: string) {
  if (typeof location === 'undefined') {
    return undefined;
  }

  const query = decodeQueryString(search || location.search);
  if (key) {
    if (Array.isArray(query[key]) && oneValue) {
      return query[key][0];
    }
    return query[key] ? query[key] : undefined;
  }
  return query;
}
