/**
 * Main Layout
 * Three-column WhatsApp-style layout manager
 * Layout: Icon Sidebar (8 chars) | Chat List (30-40 chars) | Main Chat Window (flexible)
 */

import { Box } from "@opentui/core"
import { appState } from "../state/AppState"
import { WhatsAppTheme } from "../config/theme"
import { IconSidebar } from "./IconSidebar"
import { ChatsView } from "./ChatsView"
import { ConversationView } from "./ConversationView"

export function MainLayout() {
  const state = appState.getState()

  return Box(
    {
      width: "auto",
      height: "auto",
      flexDirection: "row",
      flexGrow: 1,
      flexShrink: 1,
      backgroundColor: WhatsAppTheme.deepDark,
    },
    // Icon Sidebar (left, 8 chars wide)
    IconSidebar(),

    // Chat List (middle, responsive width)
    Box(
      {
        width: state.currentView === "conversation" ? 35 : undefined,
        flexGrow: state.currentView === "conversation" ? 0 : 1,
        flexShrink: state.currentView === "conversation" ? 0 : 1,
        flexDirection: "column",
        backgroundColor: WhatsAppTheme.panelDark,
        border: true,
        borderColor: WhatsAppTheme.borderColor,
      },
      ChatsView()
    ),

    // Conversation View (right, shown when chat selected)
    ...(state.currentView === "conversation"
      ? [
          Box(
            {
              flexGrow: 1,
              flexShrink: 1,
            },
            ConversationView()
          ),
        ]
      : [])
  )
}
