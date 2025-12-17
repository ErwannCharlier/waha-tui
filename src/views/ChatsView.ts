/**
 * Chats View
 * Display list of WhatsApp chats
 */

import { Box, Text, TextAttributes } from "@opentui/core"
import { appState } from "../state/AppState"
import { getClient } from "../client"
import { formatRelativeTime, truncate } from "../utils/formatters"
import { debugLog } from "../utils/debug"

export function ChatsView() {
  const state = appState.getState()

  if (!state.currentSession) {
    return Box(
      { flexDirection: "column", flexGrow: 1, padding: 2 },
      Text({
        content: "No session selected. Press '1' to go to Sessions and select one.",
        attributes: TextAttributes.DIM,
      })
    )
  }

  return Box(
    { flexDirection: "column", flexGrow: 1, padding: 2 },

    // Header
    Text({
      content: `Chats (Session: ${state.currentSession})`,
      attributes: TextAttributes.BOLD,
    }),

    Box({ height: 1 }),

    // Chat list
    ...state.chats.map((chat) => {
      const isSelected = state.currentChatId === chat.id
      const lastMessage = chat.lastMessage?.body || "No messages"
      const timestamp = chat.conversationTimestamp
        ? formatRelativeTime(chat.conversationTimestamp)
        : ""

      return Box(
        { flexDirection: "column", paddingLeft: 1, paddingBottom: 1 },
        Box(
          { flexDirection: "row", justifyContent: "space-between" },
          Text({
            content: `${isSelected ? ">" : " "} ${chat.name || chat.id}`,
            attributes: isSelected ? TextAttributes.BOLD : TextAttributes.NONE,
          }),
          Text({
            content: timestamp,
            attributes: TextAttributes.DIM,
          })
        ),
        Box(
          { paddingLeft: 2 },
          Text({
            content: truncate(lastMessage, 60),
            attributes: TextAttributes.DIM,
          })
        )
      )
    }),

    // Empty state
    ...(state.chats.length === 0
      ? [
          Text({
            content: "No chats found. Press 'r' to refresh.",
            attributes: TextAttributes.DIM,
          }),
        ]
      : []),

    Box({ height: 1 }),

    // Help text
    Text({
      content: "Press 'r' to refresh | 'Enter' to open chat | 'q' to quit",
      attributes: TextAttributes.DIM,
    })
  )
}

/**
 * Load chats from WAHA API
 */
export async function loadChats(sessionName: string): Promise<void> {
  try {
    debugLog("Chat", `Loading chats for session: ${sessionName}`)
    appState.setConnectionStatus("connecting")
    const client = getClient()

    const { data: chats } = await client.chats.chatsControllerGetChats({
      session: sessionName,
      limit: 50,
      sortBy: "conversationTimestamp",
      sortOrder: "desc",
    })

    const chatList = chats ?? []
    debugLog("Chat", `Loaded ${chatList.length} chats`)
    appState.setChats(chatList)
    appState.setConnectionStatus("connected")
  } catch (error) {
    debugLog("Chat", `Failed to load chats: ${error}`)
    appState.setConnectionStatus("error", `Failed to load chats: ${error}`)
    appState.setChats([])
  }
}
