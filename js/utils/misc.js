export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function isArray(obj) {
  return toString.call(obj) === "[object Array]"
}

export function sum(a, b) {
  return a + b;
}

export function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
