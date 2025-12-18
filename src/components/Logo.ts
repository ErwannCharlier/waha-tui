/**
 * Logo Component
 * ASCII art logo for WAHA TUI
 */

import { Box, ASCIIFont } from "@opentui/core"
import { WhatsAppTheme } from "../config/theme"

export function Logo({ color = WhatsAppTheme.white }: { color?: string }) {
  return Box(
    {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    ASCIIFont({ font: "tiny", text: "waha-tui", color })
  )
}
