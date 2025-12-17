/**
 * QR Code View
 * Display QR code in the TUI using OpenTUI components
 */

import { Box, Text } from "@opentui/core"
import { appState } from "../state/AppState"
import { getQRCode } from "../utils/qr"
import QRCode from "qrcode"

/**
 * QR Code View Component
 * Shows QR code for authentication
 */
export function QRCodeView() {
  const state = appState.getState()
  const qrMatrix = state.qrCodeMatrix

  if (!qrMatrix) {
    return Box(
      { flexDirection: "column", flexGrow: 1, justifyContent: "center", alignItems: "center" },
      Text({ content: "Loading QR code..." })
    )
  }

  // Render QR code using Unicode blocks
  const BLOCK_FULL = "█"
  const BLOCK_UPPER = "▀"
  const BLOCK_LOWER = "▄"
  const BLOCK_EMPTY = " "

  const padding = 2
  const modules = qrMatrix.modules
  const width = modules.size + padding * 2

  // Build QR code lines
  const qrLines: string[] = []

  // Top padding
  for (let i = 0; i < padding; i++) {
    qrLines.push(BLOCK_FULL.repeat(width))
  }

  // Render QR using half-blocks (2 rows per line)
  for (let y = 0; y < modules.size; y += 2) {
    let line = BLOCK_FULL.repeat(padding)

    for (let x = 0; x < modules.size; x++) {
      const upperPixel = modules.data[y * modules.size + x] === 1
      const lowerPixel =
        y + 1 < modules.size ? modules.data[(y + 1) * modules.size + x] === 1 : false

      if (upperPixel && lowerPixel) {
        line += BLOCK_FULL
      } else if (upperPixel && !lowerPixel) {
        line += BLOCK_UPPER
      } else if (!upperPixel && lowerPixel) {
        line += BLOCK_LOWER
      } else {
        line += BLOCK_EMPTY
      }
    }

    line += BLOCK_FULL.repeat(padding)
    qrLines.push(line)
  }

  // Bottom padding
  for (let i = 0; i < padding; i++) {
    qrLines.push(BLOCK_FULL.repeat(width))
  }

  return Box(
    { flexDirection: "column", flexGrow: 1, justifyContent: "center", alignItems: "center" },

    Text({ content: "📷 Scan QR Code with WhatsApp" }),
    Box({ height: 1 }),

    // QR Code - render each line
    ...qrLines.map((line) => Text({ content: line })),

    Box({ height: 1 }),
    Text({ content: "Open WhatsApp → Settings → Linked Devices → Link a Device" }),
    Box({ height: 1 }),
    Text({ content: "Press 'q' or '1' to go back to sessions" })
  )
}

/**
 * Load QR code data and show QR view
 */
export async function showQRCode(sessionName: string): Promise<void> {
  try {
    // Get raw QR data
    const qrValue = await getQRCode(sessionName)
    if (!qrValue) {
      return
    }

    // Generate QR matrix
    const matrix = await QRCode.create(qrValue, { errorCorrectionLevel: "M" })

    // Store in app state
    appState.setState({
      ...appState.getState(),
      qrCodeMatrix: matrix,
      currentView: "qr" as any,
    })
  } catch (error) {
    console.error("Failed to load QR code:", error)
  }
}
