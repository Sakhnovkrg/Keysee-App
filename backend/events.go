package main

import (
	"bufio"
	"encoding/json"
	"log"
	"os"
	"strings"
)

func handleMessages() {
	writer := bufio.NewWriter(os.Stdout)

	for event := range events {
		data, err := json.Marshal(event)
		if err != nil {
			log.Println("Marshal error:", err)
			continue
		}

		_, err = writer.Write(append(data, '\n'))
		if err != nil {
			log.Println("Write error:", err)
			continue
		}
		writer.Flush()
	}
}

func handleStdin() {
	scanner := bufio.NewScanner(os.Stdin)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" {
			continue
		}

		var cmd map[string]any
		if err := json.Unmarshal([]byte(line), &cmd); err != nil {
			continue
		}

		switch cmd["type"] {
		case "exit":
			running = false
			procPostQuitMessage.Call(0)
			close(events)
		}
	}
}
