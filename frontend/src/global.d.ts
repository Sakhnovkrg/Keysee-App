interface Window {
    ipcRenderer: {
      onInputEvent: (callback: (data: any) => void) => void
      on: (channel: string, listener: (...args: any[]) => void) => void
      off: (channel: string, listener: (...args: any[]) => void) => void
      send: (channel: string, ...args: any[]) => void
      invoke: (channel: string, ...args: any[]) => Promise<any>
    }
  }