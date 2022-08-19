import {isNumber, isString} from './common';
import {decodeQueryString} from './url';

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
/** url解析 */
export function parseUrl(url: string): IUrl {
  const parser = document.createElement('a');
  parser.href = url;
  return {
    protocol: parser.protocol, // => "http:"
    host: parser.host, // => "example.com:3000"
    hostname: parser.hostname, // => "example.com"
    port: parser.port, // => "3000"
    pathname: parser.pathname, // => "/pathname/"
    hash: parser.hash, // => "#hash"
    search: parser.search, // => "?search=test"
    query: decodeQueryString(parser.search), // => {search: test}
    origin: parser.origin, // => "http://example.com:3000"
  };
}

/** 数字转字符串格式化 */
export function numberToString(
  n: number,
  opt: {
    maxSuffix?: number;
  }
) {
  if (isString(n)) {
    return n;
  }
  if (!isNumber(n)) {
    return '';
  }
  const {maxSuffix} = opt;
  const s = n.toString();
  if (isNumber(maxSuffix)) {
    const splitted = s.split('.');
    if (splitted.length >= 2) {
      const suffix = splitted[splitted.length - 1];
      if (suffix.length >= (maxSuffix as number)) {
        splitted[splitted.length - 1] = suffix.slice(0, maxSuffix as number);
        return splitted.join('.');
      }
    }
  }
  return s;
}

export async function blobToText(blob: Blob) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.readAsText(blob);
    reader.onload = () => {
      const result = reader.result;
      resolve(result);
    };
    reader.onerror = e => {
      reject(e);
    };
  });
}

export async function blobToArrayBuffer(blob: Blob) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.readAsArrayBuffer(blob);
    reader.onload = () => {
      const result = reader.result;
      resolve(result);
    };
    reader.onerror = e => {
      reject(e);
    };
  });
}

export async function blobToDataURL(blob: Blob) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.readAsDataURL(blob);
    reader.onload = () => {
      const result = reader.result;
      resolve(result);
    };
    reader.onerror = e => {
      reject(e);
    };
  });
}

export async function blobToBinaryString(blob: Blob) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.readAsBinaryString(blob);
    reader.onload = () => {
      const result = reader.result;
      resolve(result);
    };
    reader.onerror = e => {
      reject(e);
    };
  });
}

export async function arrayBufferToDataUrl(ab: ArrayBuffer) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    const blob = new Blob([ab]);
    reader.readAsDataURL(blob);
    reader.onload = () => {
      const result = reader.result;
      resolve(result);
    };
    reader.onerror = e => {
      reject(e);
    };
  });
}

/** 从base64转化为file文件 */
export function base64ToFile(base64Str: string, fileName: string) {
  const params = base64Str.split(',');
  const mime = (params[0].match(/:(.*?)/) || [])[1];
  const fileData = atob(params[1]); // 解码Base64
  let {length} = fileData;
  const uint8Array = new Uint8Array(length);
  while (length) {
    length -= 1;
    uint8Array[length] = fileData.charCodeAt(length);
  }
  return new File([uint8Array], fileName, {type: mime});
}
/** 获取平台相关信息 */
export function getPlatformInfo() {
  const result: {
    android?: boolean;
    chrome?: boolean;
    chrome_version?: number | boolean;
    gecko?: boolean;
    gecko_version?: number | boolean;
    ie?: boolean;
    ie_version?: number;
    ios?: boolean;
    mac?: boolean;
    safari?: boolean;
    webkit?: boolean;
    webkit_version?: number | boolean;

    isMobile: boolean;
    qq?: boolean;
    wx?: boolean;
    qq_browser?: boolean;
  } = {
    get isMobile() {
      return Boolean(this.ios || this.android);
    },
  };

  if (typeof navigator !== 'undefined' && typeof document !== 'undefined') {
    const userAgent = navigator.userAgent;
    const ie_edge = /Edge\/(\d+)/.exec(userAgent);
    const ie_upto10 = /MSIE \d/.test(userAgent);
    const ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(userAgent);

    result.mac = /Mac/.test(navigator.platform);
    const ie$1 = (result.ie = !!(ie_upto10 || ie_11up || ie_edge));
    result.ie_version = ie_upto10
      ? (document as any).documentMode || 6
      : ie_11up
      ? +ie_11up[1]
      : ie_edge
      ? +ie_edge[1]
      : null;
    result.gecko = !ie$1 && /gecko\/(\d+)/i.test(userAgent);
    result.gecko_version = result.gecko && +(/Firefox\/(\d+)/.exec(userAgent) || [0, 0])[1];
    const chrome$1 = !ie$1 && /Chrome\/(\d+)/.exec(userAgent);
    result.chrome = !!chrome$1;
    if (Array.isArray(chrome$1)) {
      result.chrome_version = +chrome$1[1];
    }
    result.ios = !ie$1 && /AppleWebKit/.test(userAgent) && /Mobile\/\w+/.test(userAgent);
    result.android = /Android /.test(userAgent);
    result.webkit = !ie$1 && 'WebkitAppearance' in document.documentElement.style;
    result.safari = /Apple Computer/.test(navigator.vendor);
    result.webkit_version = result.webkit && +(/\bAppleWebKit\/(\d+)/.exec(userAgent) || [0, 0])[1];
    const ua = userAgent.toLowerCase();
    result.wx = /micromessenger/i.test(ua);
    result.qq = /qq/i.test(ua);
    result.qq_browser = /mqqbrowser/.test(ua);
  }

  return result;
}

/** 文本复制 */
export function copyText(text: string): Promise<void> {
  const fakeElem = document.createElement('textarea');
  // Prevent zooming on iOS
  fakeElem.style.fontSize = '12pt';
  // Reset box model
  fakeElem.style.border = '0';
  fakeElem.style.padding = '0';
  fakeElem.style.margin = '0';
  // Move element out of screen horizontally
  fakeElem.style.position = 'absolute';
  fakeElem.style.left = '-9999px';
  fakeElem.value = text;
  document.body.appendChild(fakeElem);
  fakeElem.select();
  fakeElem.setSelectionRange(0, fakeElem.value.length);
  return new Promise((resolve, reject) => {
    try {
      document.execCommand('copy');
      resolve();
    } catch (err) {
      reject(err);
    } finally {
      document.body.removeChild(fakeElem);
    }
  });
}
export async function isUrlArrivable(url: string, method?: string): Promise<void> {
  const xhr = new XMLHttpRequest();
  return new Promise((resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          resolve();
          xhr.abort();
        } else {
          reject();
        }
      }
    };
    xhr.onerror = () => {
      reject();
    };
    xhr.open(method ? method : 'GET', url, true);
    xhr.send();
  });
}

/** 获取base64格式的图片数据 */
export function imageToBase64(img: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.drawImage(img, 0, 0);
  const dataURL = canvas.toDataURL('image/png');
  // return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  return dataURL;
}

// export function blobUrlToImg(blobUrl: string, size?: number, name?: string) {
//   if (size) {
//     const canvasNew = document.createElement('canvas');
//     canvasNew.width = canvasNew.height = size;
//     const ctx = canvasNew.getContext('2d')!;
//     const img = new Image();
//     img.width = img.height = size;
//     img.src = blobUrl;
//     img.onload = () => {
//       ctx.drawImage(img, 0, 0, 150, 150);
//       bloburl = canvasNew.toDataURL('image/png');
//       download(bloburl);
//     };
//   } else {
//     download(bloburl);
//   }
// }

/** 监听页面的可见性（是否最小化） */
export function onWindowVisibilityChange(
  cb: (visible: boolean) => void,
  opt: {
    immediate: boolean;
  } = {
    immediate: false,
  }
) {
  // 各种浏览器兼容
  let hidden = '';
  let state = '';
  let visibilityChange = '';
  if (typeof document.hidden !== 'undefined') {
    hidden = 'hidden';
    visibilityChange = 'visibilitychange';
    state = 'visibilityState';
  } else if (typeof (document as any).mozHidden !== 'undefined') {
    hidden = 'mozHidden';
    visibilityChange = 'mozvisibilitychange';
    state = 'mozVisibilityState';
  } else if (typeof (document as any).msHidden !== 'undefined') {
    hidden = 'msHidden';
    visibilityChange = 'msvisibilitychange';
    state = 'msVisibilityState';
  } else if (typeof (document as any).webkitHidden !== 'undefined') {
    hidden = 'webkitHidden';
    visibilityChange = 'webkitvisibilitychange';
    state = 'webkitVisibilityState';
  }
  if (!hidden || !state || !visibilityChange) {
    return;
  }
  document.addEventListener(
    visibilityChange,
    () => {
      cb((document as any)[hidden] as boolean);
    },
    false
  );
  const {immediate} = opt;
  if (immediate) {
    cb((document as any)[hidden] as boolean);
  }
}

/** 获取图片宽高 */
export function getImgSize(url: string): Promise<{
  width: number;
  height: number;
}> {
  return new Promise((resolve, reject) => {
    const $img = document.createElement('img');
    $img.style.display = 'none';
    $img.src = url;
    $img.addEventListener('error', () => {
      document.body.removeChild($img);
      reject();
    });
    $img.addEventListener('load', () => {
      const data = {
        width: $img.naturalWidth,
        height: $img.naturalHeight,
      };
      document.body.removeChild($img);
      resolve(data);
    });
    document.body.appendChild($img);
  });
}

/**
 * 加载js文件
 * @param path, 脚本路径
 * @param reload, 是否重新加载
 */
export async function lazyLoadJs(path: string, reload?: boolean): Promise<HTMLScriptElement> {
  return new Promise((resolve, reject) => {
    if (!path) {
      reject(new Error('path is not set'));
      return;
    }
    let nodeToAdd: HTMLScriptElement | null = document.head.querySelector(`script[src="${path}"]`);

    if (nodeToAdd) {
      if (reload) {
        nodeToAdd.parentNode?.removeChild(nodeToAdd);
      } else {
        // lazyLoadFiles[path] = nodeToAdd;
        resolve(nodeToAdd);
        return;
      }
    }
    const timeout = setTimeout(() => {
      onError(new ErrorEvent('请求超时'));
    }, 12000);
    const onLoad = () => {
      clearTimeout(timeout);
      if (nodeToAdd) {
        nodeToAdd.removeEventListener('load', onLoad);
        nodeToAdd.removeEventListener('error', onError);
      }
      if (!nodeToAdd) {
        reject(`nodeToAdd is null`);
        return;
      }
      // lazyLoadFiles[path] = nodeToAdd;
      resolve(nodeToAdd);
    };
    const onError = (err: ErrorEvent) => {
      if (nodeToAdd) {
        nodeToAdd.removeEventListener('load', onLoad);
        nodeToAdd.removeEventListener('error', onError);
      }
      clearTimeout(timeout);
      reject(err);
    };
    nodeToAdd = document.createElement('script') as HTMLScriptElement;
    if (!nodeToAdd) {
      return;
    }
    nodeToAdd.type = 'text/javascript';
    nodeToAdd.charset = 'utf-8';
    nodeToAdd.async = true;
    // nodeToAdd.timeout = 120000;
    nodeToAdd.src = path;
    if (nodeToAdd === null) {
      onError(new ErrorEvent(`nodeToAdd created is null`));
    }

    nodeToAdd.addEventListener('load', onLoad);
    nodeToAdd.addEventListener('error', onError);
    document.head.appendChild(nodeToAdd);
  });
}

export function getCSSStyle(element: Element, prop: string) {
  return window.getComputedStyle(element, null).getPropertyValue(prop);
}
function getCanvasFontSize(el = document.body) {
  const fontWeight = getCSSStyle(el, 'font-weight') || 'normal';
  const fontSize = getCSSStyle(el, 'font-size') || '16px';
  const fontFamily = getCSSStyle(el, 'font-family') || 'Times New Roman';
  return `${fontWeight} ${fontSize} ${fontFamily}`;
}
/**
 * Uses canvas.measureText to compute and return the width of the given text of given font in pixels.
 *
 * @param {String} text The text to be rendered.
 * @param {String} font The css font descriptor that text is to be rendered with (e.g. "bold 14px verdana").
 *
 * @see https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript/21015393#21015393
 */
export const getTextWidth: {
  (
    text: string,
    font: {
      fontWeight: string;
      fontSize: string;
      fontFamily: string;
    }
  ): number;
  canvas?: HTMLCanvasElement;
} = (
  text: string,
  font: {
    fontWeight: string;
    fontSize: string;
    fontFamily: string;
  }
) => {
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  if (!context) {
    return -1;
  }
  const {fontWeight = 'normal', fontSize, fontFamily} = font;
  context.font = [fontWeight, fontSize, fontFamily].join(' ');
  const metrics = context.measureText(text);
  return metrics.width;
};
