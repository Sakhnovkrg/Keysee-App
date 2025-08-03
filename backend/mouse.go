package main

import (
	"unsafe"
)

const (
	WM_LBUTTONDOWN = 0x0201
	WM_LBUTTONUP   = 0x0202
	WM_RBUTTONDOWN = 0x0204
	WM_RBUTTONUP   = 0x0205
	WM_MBUTTONDOWN = 0x0207
	WM_MBUTTONUP   = 0x0208
	WM_MOUSEMOVE   = 0x0200
	WM_MOUSEWHEEL  = 0x020A
)

type MSLLHOOKSTRUCT struct {
	Pt          struct{ X, Y int32 }
	MouseData   uint32
	Flags       uint32
	Time        uint32
	DwExtraInfo uintptr
}

func MouseProc(nCode int, wParam uintptr, lParam uintptr) uintptr {
	if nCode != 0 || !active {
		return CallNextHook(nCode, wParam, lParam)
	}

	mouse := (*MSLLHOOKSTRUCT)(unsafe.Pointer(lParam))
	x, y := mouse.Pt.X, mouse.Pt.Y
	mod := GetMouseModifiers()

	isAnyModifier := mod.Ctrl || mod.Alt || mod.Shift || mod.Win

	switch wParam {
	case WM_LBUTTONDOWN, WM_RBUTTONDOWN, WM_MBUTTONDOWN:
		Emit(map[string]interface{}{
			"type":      "mousedown",
			"x":         x,
			"y":         y,
			"btn":       getMouseButton(wParam),
			"modifiers": mod,
		})

	case WM_LBUTTONUP, WM_RBUTTONUP, WM_MBUTTONUP:
		Emit(map[string]interface{}{
			"type":      "mouseup",
			"x":         x,
			"y":         y,
			"btn":       getMouseButton(wParam),
			"modifiers": mod,
		})

	case WM_MOUSEWHEEL:
		if !isAnyModifier {
			return CallNextHook(nCode, wParam, lParam)
		}

		delta := int16(mouse.MouseData >> 16)
		dir := "none"
		if delta > 0 {
			dir = "up"
		} else if delta < 0 {
			dir = "down"
		}
		Emit(map[string]interface{}{
			"type":      "wheel",
			"x":         x,
			"y":         y,
			"modifiers": mod,
			"direction": dir,
		})
	}

	return CallNextHook(nCode, wParam, lParam)
}

func getMouseButton(wParam uintptr) string {
	switch wParam {
	case WM_LBUTTONDOWN, WM_LBUTTONUP:
		return "left"
	case WM_RBUTTONDOWN, WM_RBUTTONUP:
		return "right"
	case WM_MBUTTONDOWN, WM_MBUTTONUP:
		return "middle"
	default:
		return ""
	}
}
