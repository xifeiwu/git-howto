const toString = Object.prototype.toString;

export function isNumber(val: any) {
  return typeof val === 'number' && !isNaN(parseFloat(val + '')) && isFinite(val);
}

export function isInteger(n: any) {
  return Number.isInteger(n);
}

export function isString(s: any) {
  return typeof s === 'string' || s instanceof String;
}

export function isDate(val: any) {
  return toString.call(val) === '[object Date]';
}

export function isFile(val: any) {
  return toString.call(val) === '[object File]';
}

export function isBlob(val: any) {
  return toString.call(val) === '[object Blob]';
}

export function isBuffer(obj: any) {
  return (
    obj != null &&
    obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' &&
    obj.constructor.isBuffer(obj)
  );
}

export function isObject(val: any) {
  return val !== null && typeof val === 'object';
}
export function isPlainObject(obj: any) {
  const hasOwn = Object.prototype.hasOwnProperty;
  if (!obj || toString.call(obj) !== '[object Object]') {
    return false;
  }

  const hasOwnConstructor = hasOwn.call(obj, 'constructor');
  const hasIsPrototypeOf =
    obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
  // Not own constructor property must be Object
  if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
    return false;
  }

  // Own properties are enumerated firstly, so to speed up,
  // if last one is own, then all properties are own.
  let key;
  for (key in obj) {
    /**/
  }

  return typeof key === 'undefined' || hasOwn.call(obj, key);
}

export function isRegExp(obj: any) {
  return obj instanceof RegExp;
}
export function isError(obj: any) {
  return obj instanceof Error;
}

export function isUndefined(val: any) {
  return typeof val === 'undefined';
}

export function isFunction(val: any) {
  const toStr = toString.call(val);
  return toStr === '[object Function]' || toStr === '[object AsyncFunction]';
}

export function isArray(arr: any) {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(arr);
  }
  return toString.call(arr) === '[object Array]';
}

export function isArrayBuffer(val: any) {
  return toString.call(val) === '[object ArrayBuffer]';
}

export function isFormData(val: any) {
  return typeof FormData !== 'undefined' && val instanceof FormData;
}

export function isArrayBufferView(val: any) {
  let result;
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && val.buffer instanceof ArrayBuffer;
  }
  return result;
}

export function isURLSearchParams(val: any) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

export function startsWith(str: string, prefix: string) {
  return str.indexOf(prefix) === 0;
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
export function forEach(
  obj: Array<any> | {[key: string]: any} | null | undefined,
  fn: (value: any, key: number | string, obj: object) => void
) {
  // Don't bother if no value provided
  if (obj === null || obj === undefined) {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (Array.isArray(obj)) {
    // Iterate over array values
    for (let i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 * NOTICE: all members in args should be the same, as object or array
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */

export function deepMerge<T, U>(source1: T, source2: U): T & U;
export function deepMerge<T, U, V>(source1: T, source2: U, source3: V): T & U & V;
export function deepMerge<T, U, V, W>(source1: T, source2: U, source3: V, source4: W): T & U & V & W;
export function deepMerge(...sources: any[]): any;
export function deepMerge(
  ...args: Array<{
    [key: string]: any;
  }>
) {
  let result: {
    [key: string]: any;
  } = {};
  if (Array.isArray(args[0])) {
    result = [];
  }
  const assignValue = (val: any, key: string | number) => {
    if (isDate(val)) {
      result[key] = new Date(val.getTime());
    } else if (isRegExp(val) || isFormData(val) || isFunction(val) || null == val) {
      result[key] = val;
    } else if (Array.isArray(val)) {
      // override if origin is Array
      result[key] = deepMerge(val);
    } else if (isPlainObject(val)) {
      if (isPlainObject(result[key])) {
        result[key] = deepMerge(result[key], val);
      } else {
        result[key] = deepMerge({}, val);
      }
    } else {
      result[key] = val;
    }
  };

  for (let i = 0, l = args.length; i < l; i++) {
    forEach(args[i], assignValue);
  }
  return result;
}

export function overrideObj(to: {[key: string]: any}, from: {[key: string]: any}) {
  if (isPlainObject(to) && isPlainObject(from)) {
    Object.entries(to).forEach(([key, value]) => {
      if (isPlainObject(value) && isPlainObject(from[key])) {
        overrideObj(value, from[key]);
      } else if (from[key] !== undefined) {
        to[key] = from[key];
      }
    });
  }
  return to;
}

/*
 * frequency control
 * @param fn {function}  the function to be called
 * @param delay  {number}    time delay to run the function
 * @param immediate  {bool} run on setTimeout or not
 * @param _debounce if controlled by last call or not
 * @return {function}??????????????????
 */
export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
  immediate: boolean,
  _debounce?: boolean
): T {
  // ????????????
  let curr = +new Date();
  let last_call = 0;
  let last_exec = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let diff = 0;
  // @ts-ignore
  let context: any = this;
  let args: any[] = [];
  function exec() {
    last_exec = curr;
    fn.apply(context, args);
  }
  return function (...args_: any[]) {
    curr = +new Date();
    // @ts-ignore
    context = this as any;
    args = args_;
    diff = curr - (_debounce ? last_call : last_exec) - delay;
    if (timer) {
      clearTimeout(timer);
    }
    if (_debounce) {
      if (!immediate) {
        timer = setTimeout(exec, delay);
      } else if (diff >= 0) {
        exec();
      }
    } else {
      if (diff >= 0) {
        exec();
      } else if (!immediate) {
        timer = setTimeout(exec, -diff);
      }
    }
    last_call = curr;
  } as any;
}
export function Throttled(delay: number, immediate: boolean, _debounce?: boolean) {
  return function createDecorator(target: any, key: string, descriptor: PropertyDescriptor) {
    Object.defineProperty(
      target,
      key,
      Object.assign(descriptor, {
        value: throttle(target[key], delay, immediate, _debounce),
      })
    );
  };
}

/**
 * pick props from obj
 * @param obj
 * @param keys
 * @returns
 */
export function pickProps(
  obj: {
    [key: string]: any;
  } = {},
  keys: string[]
) {
  const res: {
    [key: string]: any;
  } = {};
  keys.forEach(k => {
    res[k] = obj[k];
  });
  return res;
}
// ??????ms??????
export async function waitMilliSeconds(ms: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
