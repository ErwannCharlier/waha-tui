/**
 * Polling Service
 * Manages background polling for real-time updates
 */

import { appState } from "../state/AppState"
import { getClient } from "../client"
import { loadMessages } from "../views/ConversationView"
import { debugLog } from "../utils/debug"
import type { ChatSummary } from "@muhammedaksam/waha-node"

// Polling intervals in milliseconds
const CHATS_POLL_INTERVAL = 3000 // 3 seconds for chat list
const MESSAGES_POLL_INTERVAL = 2000 // 2 seconds for active conversation

class PollingService {
  private chatsTimer: NodeJS.Timeout | null = null
  private messagesTimer: NodeJS.Timeout | null = null
  private isPollingChats = false
  private isPollingMessages = false

  public start(sessionName: string): void {
    this.stop() // Clear existing timers
    debugLog("Polling", `Starting polling service for session: ${sessionName}`)

    // Fetch current user's profile for self-chat detection
    this.fetchMyProfile(sessionName)

    // Start chats polling
    this.chatsTimer = setInterval(() => this.pollChats(sessionName), CHATS_POLL_INTERVAL)

    // Start messages polling (will only actually poll if a chat is selected)
    this.messagesTimer = setInterval(() => this.pollMessages(sessionName), MESSAGES_POLL_INTERVAL)
  }

  public stop(): void {
    if (this.chatsTimer) {
      clearInterval(this.chatsTimer)
      this.chatsTimer = null
    }
    if (this.messagesTimer) {
      clearInterval(this.messagesTimer)
      this.messagesTimer = null
    }
    debugLog("Polling", "Stopped polling service")
  }

  private async pollChats(sessionName: string): Promise<void> {
    if (this.isPollingChats) return
    this.isPollingChats = true

    try {
      const client = getClient()
      const response = await client.chats.chatsControllerGetChatsOverview(sessionName, {
        limit: 1000,
      })
      const chats = (response.data as unknown as ChatSummary[]) || []

      // Update state - Reactivity will handle UI updates if data changed
      // Note: We might need to optimize this if it causes too many re-renders
      // But ChatListManager has its own hash check to prevent unnecessary rebuilds
      appState.setChats(chats)
    } catch {
      // Silent error for polling to avoid spamming logs
      // debugLog("Polling", `Error polling chats: ${error}`)
    } finally {
      this.isPollingChats = false
    }
  }

  private async pollMessages(sessionName: string): Promise<void> {
    if (this.isPollingMessages) return

    const state = appState.getState()
    const currentChatId = state.currentChatId

    // Only poll if we are in conversation view/have a chat selected
    if (!currentChatId || state.currentView !== "conversation") {
      return
    }

    this.isPollingMessages = true

    try {
      // We use loadMessages which already updates the state
      // It fetches the latest 50 messages, which should include any new ones
      await loadMessages(sessionName, currentChatId)
    } catch {
      // Silent error
    } finally {
      this.isPollingMessages = false
    }
  }

  private async fetchMyProfile(sessionName: string): Promise<void> {
    try {
      const client = getClient()
      const response = await client.profile.profileControllerGetMyProfile(sessionName)
      if (response.data) {
        appState.setMyProfile(response.data)
        debugLog("Polling", `Fetched my profile: ${response.data.name} (${response.data.id})`)
      }
    } catch {
      debugLog("Polling", "Failed to fetch profile")
    }
  }
}

export const pollingService = new PollingService()
