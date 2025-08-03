package main

import (
	"fmt"
	"unsafe"
)

const (
	WM_KEYDOWN    = 0x0100
	WM_KEYUP      = 0x0101
	WM_SYSKEYDOWN = 0x0104
	WM_SYSKEYUP   = 0x0105
	VK_SHIFT      = 0x10
	VK_CONTROL    = 0x11
	VK_MENU       = 0x12
	VK_LWIN       = 0x5B
	VK_F1					= 0x70
)

type KBDLLHOOKSTRUCT struct {
	VkCode      uint32
	ScanCode    uint32
	Flags       uint32
	Time        uint32
	DwExtraInfo uintptr
}

var vkToString = map[uint32]string{
	8:   "Backspace",
	9:   "Tab",
	13:  "Enter",
	20:  "CapsLock",
	27:  "Esc",
	32:  "Space",
	33:  "PageUp",
	34:  "PageDown",
	35:  "End",
	36:  "Home",
	37:  "Left",
	38:  "Up",
	39:  "Right",
	40:  "Down",
	44:  "PrintScreen",
	45:  "Insert",
	46:  "Delete",
	91:  "Win",
	92:  "Win",
	93:  "Menu",
	144: "NumLock",
	145: "ScrollLock",
	19:  "Pause",

	160: "Shift", 161: "Shift",
	162: "Ctrl", 163: "Ctrl",
	164: "Alt", 165: "Alt",

	48: "0", 49: "1", 50: "2", 51: "3", 52: "4",
	53: "5", 54: "6", 55: "7", 56: "8", 57: "9",

	65: "A", 66: "B", 67: "C", 68: "D", 69: "E",
	70: "F", 71: "G", 72: "H", 73: "I", 74: "J",
	75: "K", 76: "L", 77: "M", 78: "N", 79: "O",
	80: "P", 81: "Q", 82: "R", 83: "S", 84: "T",
	85: "U", 86: "V", 87: "W", 88: "X", 89: "Y", 90: "Z",

	96: "Num0", 97: "Num1", 98: "Num2", 99: "Num3",
	100: "Num4", 101: "Num5", 102: "Num6",
	103: "Num7", 104: "Num8", 105: "Num9",

	106: "*", 107: "+", 109: "-", 110: ".", 111: "/",

	112: "F1", 113: "F2", 114: "F3", 115: "F4",
	116: "F5", 117: "F6", 118: "F7", 119: "F8",
	120: "F9", 121: "F10", 122: "F11", 123: "F12",

	186: ";", 187: "=", 188: ",", 189: "-",
	190: ".", 191: "/", 192: "`",
	219: "[", 220: "\\", 221: "]", 222: "'",
}

var knownKeyState = make(map[uint32]bool)

func getVKName(vk uint32) string {
	if name, ok := vkToString[vk]; ok {
		return name
	}
	return fmt.Sprintf("VK_%d", vk)
}

func KeyboardProc(nCode int, wParam uintptr, lParam uintptr) uintptr {
	if nCode != 0 {
		return CallNextHook(nCode, wParam, lParam)
	}

	kbd := (*KBDLLHOOKSTRUCT)(unsafe.Pointer(lParam))
	vk := kbd.VkCode

	switch wParam {
	case WM_KEYDOWN, WM_SYSKEYDOWN:
		if knownKeyState[vk] {
			return CallNextHook(nCode, wParam, lParam)
		}
		knownKeyState[vk] = true

		// F1 Handling
		if vk == 0x70 {
			active = !active
			sendStateToFrontend()
		}

		if !active {
			return CallNextHook(nCode, wParam, lParam)
		}

		event := KeyEvent{
			Type: "keyboard",
			VK:   vk,
			Key:  getVKName(vk),
			Modifiers: Modifiers{
				Ctrl:  IsKeyDown(VK_CONTROL),
				Alt:   IsKeyDown(VK_MENU),
				Shift: IsKeyDown(VK_SHIFT),
				Win:   IsKeyDown(VK_LWIN),
			},
		}
		Emit(event)

	case WM_KEYUP, WM_SYSKEYUP:
		delete(knownKeyState, vk)
	}

	return CallNextHook(nCode, wParam, lParam)
}
