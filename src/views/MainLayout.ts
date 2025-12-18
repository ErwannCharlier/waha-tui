/**
 * Main Layout
 * Three-column WhatsApp-style layout manager
 * Layout: Icon Sidebar (8 chars) | Chat List (30-40 chars) | Main Chat Window (flexible)
 */

import { Box } from "@opentui/core"
import { appState } from "../state/AppState"
import { WhatsAppTheme, Layout } from "../config/theme"
import { IconSidebar } from "./IconSidebar"
import { ChatsView } from "./ChatsView"

export function MainLayout() {
  const state = appState.getState()

  // Calculate chat list width based on terminal size
  // Will be implemented when we have access to terminal dimensions
  const chatListWidth = Layout.chatListMinWidth

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

    // Chat List (middle, 30-40 chars)
    Box(
      {
        width: chatListWidth,
        height: "auto",
        flexDirection: "column",
        flexGrow: 0,
        flexShrink: 0,
        backgroundColor: WhatsAppTheme.panelDark,
        border: true,
        borderColor: WhatsAppTheme.borderColor,
      },
      // ChatsView will be rendered here
      state.activeIcon === "chats" ? ChatsView() : Box({}, [])
    ),

    // Main Chat Window (right, flexible)
    Box(
      {
        width: "auto",
        height: "auto",
        flexDirection: "column",
        flexGrow: 1,
        flexShrink: 1,
        backgroundColor: WhatsAppTheme.deepDark,
      },
      // ChatWindow will be rendered here when we create it
      // For now, placeholder
      Box(
        {
          width: "auto",
          height: "auto",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
        }
        // Placeholder text
      )
    )
  )
}
