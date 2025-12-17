/**
 * Application State
 * Global state management for the TUI
 */

export type ViewType = "sessions" | "chats" | "conversation" | "settings"

export interface AppState {
  currentView: ViewType
  currentSession: string | null
  currentChatId: string | null
  sessions: any[]
  chats: any[]
  messages: Map<string, any[]>
  connectionStatus: "connected" | "connecting" | "disconnected" | "error"
  errorMessage: string | null
}

class StateManager {
  private state: AppState = {
    currentView: "sessions",
    currentSession: null,
    currentChatId: null,
    sessions: [],
    chats: [],
    messages: new Map(),
    connectionStatus: "disconnected",
    errorMessage: null,
  }

  private listeners: Array<(state: AppState) => void> = []

  getState(): AppState {
    return { ...this.state }
  }

  setState(updates: Partial<AppState>): void {
    this.state = { ...this.state, ...updates }
    this.notifyListeners()
  }

  subscribe(listener: (state: AppState) => void): () => void {
    this.listeners.push(listener)
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private notifyListeners(): void {
    const state = this.getState()
    for (const listener of this.listeners) {
      listener(state)
    }
  }

  // Helper methods
  setCurrentView(view: ViewType): void {
    this.setState({ currentView: view })
  }

  setCurrentSession(sessionName: string | null): void {
    this.setState({ currentSession: sessionName })
  }

  setCurrentChat(chatId: string | null): void {
    this.setState({ currentChatId: chatId, currentView: chatId ? "conversation" : "chats" })
  }

  setSessions(sessions: any[]): void {
    this.setState({ sessions })
  }

  setChats(chats: any[]): void {
    this.setState({ chats })
  }

  setMessages(chatId: string, messages: any[]): void {
    const messagesMap = new Map(this.state.messages)
    messagesMap.set(chatId, messages)
    this.setState({ messages: messagesMap })
  }

  addMessage(chatId: string, message: any): void {
    const messagesMap = new Map(this.state.messages)
    const existing = messagesMap.get(chatId) || []
    messagesMap.set(chatId, [...existing, message])
    this.setState({ messages: messagesMap })
  }

  setConnectionStatus(status: AppState["connectionStatus"], errorMessage?: string): void {
    this.setState({ connectionStatus: status, errorMessage: errorMessage || null })
  }
}

export const appState = new StateManager()
