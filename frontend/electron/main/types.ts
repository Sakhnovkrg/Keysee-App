export interface KeyboardEvent {
    type: string
    vk: number
    key: string
    modifiers: Modifiers
}

export interface MouseEvent {
    btn: string
    modifiers: Modifiers
    type: string
    x: number
    y: number
}

export interface Modifiers {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  win?: boolean;
}

export type InputEvent = KeyboardEvent | MouseEvent