/**
 * Icon Sidebar
 * Vertical navigation with emoji icons for main sections
 */

import { Box, Text } from "@opentui/core"
import { appState } from "../state/AppState"
import { WhatsAppTheme, Icons, Layout } from "../config/theme"
import type { ActiveIcon } from "../state/AppState"

export function IconSidebar() {
  const state = appState.getState()

  const iconItems: Array<{ key: ActiveIcon; icon: string; position: "top" | "bottom" }> = [
    { key: "chats", icon: Icons.chats, position: "top" },
    { key: "status", icon: Icons.status, position: "top" },
    { key: "profile", icon: Icons.profile, position: "bottom" },
    { key: "settings", icon: Icons.settings, position: "bottom" },
  ]

  // Top icons
  const topIcons = iconItems
    .filter((item) => item.position === "top")
    .map((item) => {
      const isActive = state.activeIcon === item.key

      return Box(
        {
          width: Layout.iconSidebarWidth,
          height: 3,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isActive ? WhatsAppTheme.activeBg : WhatsAppTheme.panelDark,
          border: isActive,
          borderColor: isActive ? WhatsAppTheme.green : undefined,
        },
        Text({
          content: item.icon,
          fg: isActive ? WhatsAppTheme.green : WhatsAppTheme.textSecondary,
        })
      )
    })

  // Bottom icons
  const bottomIcons = iconItems
    .filter((item) => item.position === "bottom")
    .map((item) => {
      const isActive = state.activeIcon === item.key

      return Box(
        {
          width: Layout.iconSidebarWidth,
          height: 3,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isActive ? WhatsAppTheme.activeBg : WhatsAppTheme.panelDark,
          border: isActive,
          borderColor: isActive ? WhatsAppTheme.green : undefined,
        },
        Text({
          content: item.icon,
          fg: isActive ? WhatsAppTheme.green : WhatsAppTheme.textSecondary,
        })
      )
    })

  return Box(
    {
      width: Layout.iconSidebarWidth,
      height: "auto",
      flexDirection: "column",
      flexGrow: 0,
      flexShrink: 0,
      backgroundColor: WhatsAppTheme.panelDark,
      justifyContent: "space-between",
    },
    // Top section
    Box(
      {
        flexDirection: "column",
      },
      ...topIcons
    ),
    // Bottom section
    Box(
      {
        flexDirection: "column",
      },
      ...bottomIcons
    )
  )
}
