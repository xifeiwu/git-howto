const REG: {
  [key: string]: RegExp;
} = {
  mail: /^([\w-_]+(?:\.[\w-_]+)*)@(((?:[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)+\.){1,3}[a-z]{2,6})$/,
  ipOnly: /^([0-2]*[0-9]{1,2})\.([0-2]*[0-9]{1,2})\.([0-2]*[0-9]{1,2})\.([0-2]*[0-9]{1,2})$/,
  ipWithMask: /^([0-2]*[0-9]{1,2})\.([0-2]*[0-9]{1,2})\.([0-2]*[0-9]{1,2})\.([0-2]*[0-9]{1,2})(\/[0-9]+)?$/,
  domain: /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
  phone: /^1[3|4|5|6|7|8|9]\d{9}$/,
  number: /^[0-9]+$/,
};

export function getRegOf(key: string): RegExp {
  return REG[key];
}

export default function escapeStringRegexp(str: string) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}

/** to camel case */
export function toCamelCase(str: string) {
  return str.replace(/\s(\w)/g, function (_m, letter) {
    return letter.toUpperCase();
  });
}
