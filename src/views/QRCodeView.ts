/**
 * QR Code Login View
 * WhatsApp Web-style login page with QR code and instructions
 */

import { Box, Text, TextAttributes } from "@opentui/core"
import { appState } from "../state/AppState"
import { getQRCode } from "../utils/qr"
import { WhatsAppTheme, Icons } from "../config/theme"
import QRCode from "qrcode"
import type { QRCode as QRCodeType } from "qrcode"
import { Logo } from "../components/Logo"

/**
 * QR Code Login View Component
 * Shows WhatsApp Web-style login page with instructions and QR code
 */
export function QRCodeView() {
  const state = appState.getState()
  const qrMatrix = state.qrCodeMatrix

  // Build QR code lines if we have a matrix
  const qrLines: string[] = []
  if (qrMatrix) {
    const BLOCK_FULL = "█"
    const BLOCK_UPPER = "▀"
    const BLOCK_LOWER = "▄"
    const BLOCK_EMPTY = " "

    const padding = 4 // Extra vertical padding since half-blocks compress height by 2x
    const modules = qrMatrix.modules

    // Top padding
    for (let i = 0; i < padding / 2; i++) {
      qrLines.push(BLOCK_FULL.repeat(modules.size + padding * 2))
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
    for (let i = 0; i < padding / 2; i++) {
      qrLines.push(BLOCK_FULL.repeat(modules.size + padding * 2))
    }
  }

  return Box(
    {
      flexDirection: "column",
      flexGrow: 1,
      backgroundColor: WhatsAppTheme.background,
    },

    // Header with WhatsApp branding
    Box(
      {
        height: 3,
        width: "100%",
        paddingLeft: 2,
        alignItems: "center",
        flexDirection: "row",
      },
      Logo({ color: WhatsAppTheme.green })
    ),

    // Main content area
    Box(
      {
        flexDirection: "row",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      },

      // Left side - Instructions
      Box(
        {
          flexDirection: "column",
          width: "40%",
          paddingRight: 4,
        },
        Text({
          content: "Steps to log in",
          fg: WhatsAppTheme.textPrimary,
          attributes: TextAttributes.BOLD,
        }),
        Box({ height: 1 }),
        // Step 1
        Box(
          { flexDirection: "row" },
          Text({
            content: `${Icons.circled1} `,
            fg: WhatsAppTheme.textSecondary,
          }),
          Text({
            content: `Open WhatsApp ${Icons.whatsapp} on your phone`,
            fg: WhatsAppTheme.textPrimary,
          })
        ),
        Box({ height: 1 }),
        // Step 2
        Box(
          { flexDirection: "row" },
          Text({
            content: `${Icons.circled2} `,
            fg: WhatsAppTheme.textSecondary,
          }),
          Text({
            content: "On Android tap Menu ⋮ · On iPhone tap Settings ⚙",
            fg: WhatsAppTheme.textPrimary,
          })
        ),
        Box({ height: 1 }),
        // Step 3
        Box(
          { flexDirection: "row" },
          Text({
            content: `${Icons.circled3} `,
            fg: WhatsAppTheme.textSecondary,
          }),
          Text({
            content: "Tap Linked devices, then Link device",
            fg: WhatsAppTheme.textPrimary,
          })
        ),
        Box({ height: 1 }),
        // Step 4
        Box(
          { flexDirection: "row" },
          Text({
            content: `${Icons.circled4} `,
            fg: WhatsAppTheme.textSecondary,
          }),
          Text({
            content: "Scan the QR code to confirm",
            fg: WhatsAppTheme.textPrimary,
          })
        )
      ),

      // Right side - QR Code
      Box(
        {
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        },
        ...(qrMatrix
          ? qrLines.map((line) =>
              Text({
                content: line,
                fg: WhatsAppTheme.green,
              })
            )
          : [
              Text({
                content: "Loading QR code...",
                fg: WhatsAppTheme.textSecondary,
              }),
            ])
      )
    ),

    // Footer
    Box(
      {
        height: 3,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      },
      Text({
        content: `${Icons.lock} Your personal messages are end-to-end encrypted`,
        fg: WhatsAppTheme.textSecondary,
      })
    )
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
    const matrix: QRCodeType = QRCode.create(qrValue, { errorCorrectionLevel: "M" })

    // Store in app state
    appState.setState({
      ...appState.getState(),
      qrCodeMatrix: matrix,
      currentView: "qr",
    })
  } catch (error) {
    console.error("Failed to load QR code:", error)
  }
}
