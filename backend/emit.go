package main

import "log"

func Emit(event any) {
	select {
	case events <- event:
	default:
		log.Println("⚠️ Emit dropped: channel full")
	}
}
