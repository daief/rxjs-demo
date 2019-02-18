export const BEGIN = Date.now();

export const now = (computed = true) => {
  const n = +(Date.now() / 1000).toFixed(1);
  return computed === true ? - (BEGIN / 1000).toFixed(1) + n : n;
};

export const Log = (...args: any[]) => console.log(...args) as undefined;

export const createButton = (text: string) => {
  const b = document.createElement<'button'>('button');
  b.setAttribute('class', 'ui button');
  b.textContent = text;
  return b;
};
