package main

type Modifiers struct {
	Ctrl  bool `json:"ctrl,omitempty"`
	Alt   bool `json:"alt,omitempty"`
	Shift bool `json:"shift,omitempty"`
	Win   bool `json:"win,omitempty"`
}

type KeyEvent struct {
	Type      string    `json:"type"` // "keyboard"
	VK        uint32    `json:"vk"`
	Key       string    `json:"key"`
	Modifiers Modifiers `json:"modifiers"`
}

type MouseBaseEvent struct {
	X         int32     `json:"x"`
	Y         int32     `json:"y"`
	Modifiers Modifiers `json:"modifiers"`
}

type MouseClickEvent struct {
	Type           string         `json:"type"` // "mousedown" / "mouseup"
	MouseBaseEvent MouseBaseEvent `json:",inline"`
	Btn            string         `json:"btn"` // "left", "right", "middle"
}

type MouseWheelEvent struct {
	Type           string         `json:"type"` // "wheel"
	MouseBaseEvent MouseBaseEvent `json:",inline"`
	Direction      string         `json:"direction"` // "up", "down"
}
