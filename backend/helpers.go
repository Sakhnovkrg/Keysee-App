package main

import "syscall"

var (
	procCallNextHookEx   = syscall.NewLazyDLL("user32.dll").NewProc("CallNextHookEx")
	procGetAsyncKeyState = syscall.NewLazyDLL("user32.dll").NewProc("GetAsyncKeyState")
)

func IsKeyDown(vk int) bool {
	state, _, _ := procGetAsyncKeyState.Call(uintptr(vk))
	return state&0x8000 != 0
}

func IsModifierKey(vk uint32) bool {
	return vk == VK_SHIFT || vk == VK_CONTROL || vk == VK_MENU || vk == VK_LWIN
}

func CallNextHook(nCode int, wParam, lParam uintptr) uintptr {
	ret, _, _ := procCallNextHookEx.Call(0, uintptr(nCode), wParam, lParam)
	return ret
}

func GetMouseModifiers() Modifiers {
	return Modifiers{
		Ctrl:  IsKeyDown(VK_CONTROL),
		Alt:   IsKeyDown(VK_MENU),
		Shift: IsKeyDown(VK_SHIFT),
		Win:   IsKeyDown(VK_LWIN),
	}
}
