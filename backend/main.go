package main

import (
	"fmt"
	"log"
	"syscall"
	"unsafe"
)

var (
	user32                  = syscall.NewLazyDLL("user32.dll")
	kernel32                = syscall.NewLazyDLL("kernel32.dll")
	procSetWindowsHookEx    = user32.NewProc("SetWindowsHookExW")
	procUnhookWindowsHookEx = user32.NewProc("UnhookWindowsHookEx")
	procGetMessageW         = user32.NewProc("GetMessageW")
	procTranslateMessage    = user32.NewProc("TranslateMessage")
	procDispatchMessage     = user32.NewProc("DispatchMessageW")
	procGetModuleHandleW    = kernel32.NewProc("GetModuleHandleW")
	procPostQuitMessage     = user32.NewProc("PostQuitMessage")
)

const (
	WH_KEYBOARD_LL = 13
	WH_MOUSE_LL    = 14
)

var (
	events  = make(chan any, 1000)
)

func main() {
	fmt.Println("Starting Keysee hook process (IPC via stdio)")

	go handleMessages()
	go handleStdin()

	hInstanceRaw, _, err := procGetModuleHandleW.Call(0)
	if hInstanceRaw == 0 {
		log.Println("Failed to get module handle:", err)
		return
	}
	hInstance := hInstanceRaw

	hookProcKeyboard := syscall.NewCallback(KeyboardProc)
	hHookKeyboard, _, _ := procSetWindowsHookEx.Call(
		uintptr(WH_KEYBOARD_LL),
		hookProcKeyboard,
		hInstance, 0)
	if hHookKeyboard == 0 {
		log.Println("Failed to set keyboard hook")
		return
	}
	defer procUnhookWindowsHookEx.Call(hHookKeyboard)

	hookProcMouse := syscall.NewCallback(MouseProc)
	hHookMouse, _, _ := procSetWindowsHookEx.Call(
		uintptr(WH_MOUSE_LL),
		hookProcMouse,
		hInstance, 0)
	if hHookMouse == 0 {
		log.Println("Failed to set mouse hook")
		return
	}
	defer procUnhookWindowsHookEx.Call(hHookMouse)

	var msg struct {
		hwnd    uintptr
		message uint32
		wParam  uintptr
		lParam  uintptr
		time    uint32
		pt      struct{ x, y int32 }
	}

	for running {
		ret, _, _ := procGetMessageW.Call(
			uintptr(unsafe.Pointer(&msg)),
			0, 0, 0,
		)
		if ret == 0 {
			break
		}
		procTranslateMessage.Call(uintptr(unsafe.Pointer(&msg)))
		procDispatchMessage.Call(uintptr(unsafe.Pointer(&msg)))
	}
}
