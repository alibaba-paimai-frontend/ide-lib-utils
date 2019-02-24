
export function invariant(check: boolean, message: string, thing?: string) {
  if (!check) {
    throw new Error(
      '[lib-utils] Invariant failed: ' +
        message +
        (thing ? " in '" + thing + "'" : '')
    );
  }
}

export function isExist(val: any): boolean {
  return typeof val !== 'undefined' && val !== null;
}

// from mobx
export function uniq(arr: any[]) {
  var res: any[] = [];
  arr.forEach(function(item) {
    if (res.indexOf(item) === -1) res.push(item);
  });
  return res;
}

export function pick(object: any, paths: string[]) {
  const obj: any = {};
  for (const path of paths) {
    if (isExist(object[path])) {
      obj[path] = object[path]
    }
  }
  return obj;
} 

export function capitalize(str: string) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isPlainObject(value: any) {
  if (value === null || typeof value !== 'object') return false;
  var proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}


/**
 * get value from object
 * 
 * see for detail: 
 *  // https://gomakethings.com/how-to-get-the-value-of-an-object-from-a-specific-path-with-vanilla-js
 *  // https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
 * @param o - target object
 * @param s - path string
 * @param def - default value
 */
export function getValueByPath(o: any, s: string, def?: any) {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, '');           // strip a leading dot
  var a = s.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return def;
    }
  }
  return o;
}