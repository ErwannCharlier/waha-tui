/**
 * Footer Component
 * Styled keyboard shortcuts and version info
 */

import { Box, Text, TextNodeRenderable } from "@opentui/core"
import { WhatsAppTheme } from "../config/theme"
import { appState } from "../state/AppState"

interface KeyHint {
  key: string
  label: string
  keyColor?: string
}

export function Footer() {
  const state = appState.getState()

  // Dynamic hints based on current view
  const hints: KeyHint[] = []

  if (state.currentView === "sessions") {
    hints.push(
      { key: "↑↓", label: "Navigate" },
      { key: "Enter", label: "Select" },
      { key: "n", label: "New Session" },
      { key: "2", label: "Chats" }
    )
  } else if (state.currentView === "chats" || state.currentView === "conversation") {
    hints.push(
      { key: "↑↓", label: "Navigate" },
      { key: "Enter", label: "Open Chat" },
      { key: "Tab", label: "Switch Icon" },
      { key: "1", label: "Sessions" }
    )
  }

  // Always available
  hints.push({ key: "r", label: "Refresh" }, { key: "q", label: "Quit", keyColor: "#ef5350" })

  // Build hint text with styled nodes
  const hintText = Text({})

  hints.forEach((hint, idx) => {
    // Key (colored)
    const keyNode = new TextNodeRenderable({
      fg: hint.keyColor || WhatsAppTheme.green,
    })
    keyNode.add(hint.key)
    hintText.add(keyNode)

    // Label (dim)
    const labelNode = new TextNodeRenderable({
      fg: WhatsAppTheme.textSecondary,
    })
    labelNode.add(` ${hint.label}`)
    hintText.add(labelNode)

    // Separator (not for last item)
    if (idx < hints.length - 1) {
      const sepNode = new TextNodeRenderable({
        fg: WhatsAppTheme.borderLight,
      })
      sepNode.add(" │ ")
      hintText.add(sepNode)
    }
  })

  return Box(
    {
      height: 3,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingLeft: 2,
      paddingRight: 2,
      backgroundColor: WhatsAppTheme.panelDark,
      border: true,
      borderColor: WhatsAppTheme.borderLight,
    },
    // Keyboard hints (left)
    hintText,
    // Version (right)
    Text({
      content: "waha-tui v0.1.0",
      fg: WhatsAppTheme.textTertiary,
    })
  )
}
