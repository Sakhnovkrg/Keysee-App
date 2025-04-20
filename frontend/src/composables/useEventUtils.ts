export interface Modifiers {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  win?: boolean;
}

export function eventKey(e: {
  type: string;
  key?: string;
  btn?: string;
  direction?: string;
  modifiers?: Modifiers;
}): string {
  const mods = e.modifiers || {};
  return [
    e.type,
    mods.ctrl && "Ctrl",
    mods.alt && "Alt",
    mods.shift && "Shift",
    mods.win && "Win",
    e.key || e.btn || e.direction,
  ]
    .filter(Boolean)
    .join("+");
}

export function isModifierKey(key?: string): boolean {
  return ["Shift", "Ctrl", "Alt", "Win"].includes(key || "");
}

export function hasAnyModifiers(mods?: Modifiers): boolean {
  return Boolean(mods && Object.values(mods).some(Boolean));
}

export function equalModifiers(a?: Modifiers, b?: Modifiers): boolean {
  const keys: (keyof Modifiers)[] = ["ctrl", "alt", "shift", "win"];
  return keys.every((k) => Boolean(a?.[k]) === Boolean(b?.[k]));
}

export function formatWithModifiers(e: {
  key?: string;
  btn?: string;
  direction?: string;
  modifiers?: Modifiers;
  type?: string;
}): string {
  const mods: string[] = [];
  if (e.modifiers?.ctrl) mods.push("Ctrl");
  if (e.modifiers?.alt) mods.push("Alt");
  if (e.modifiers?.shift) mods.push("Shift");
  if (e.modifiers?.win) mods.push("Win");

  if (e.type === 'wheel') {
    const arrow = e.direction === 'up' ? '🡅' : e.direction === 'down' ? '🡇' : '';
    mods.push(`${arrow} Scroll`);
    return mods.join(' + ');
  }

  if (e.type === 'mousedown') {
    const mouseBtn = e.btn ? capitalize(e.btn) : '';
    const prefix = mods.length ? mods.join(' + ') + ' + ' : '';
    return `${prefix}${mouseBtn} Click`;
  }

  const key = e.key ?? '';
  if (key) mods.push(key);

  return mods.join(' + ');
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}