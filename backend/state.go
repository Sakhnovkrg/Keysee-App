package main

var (
	running = true
	active = true
)

func sendStateToFrontend() {
	Emit(map[string]any{
		"type":    "activityChanged",
		"enabled": active, // или trackingEnabled, как назовёшь
	})
}