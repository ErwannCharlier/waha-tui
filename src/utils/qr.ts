/**
 * QR Code utilities for terminal display
 */

import { getClient } from "../client"
import { debugLog } from "./debug"

/**
 * Get QR code as raw data from WAHA API
 */
export async function getQRCode(sessionName: string): Promise<string | null> {
  try {
    debugLog("QR", `Fetching QR code for session: ${sessionName}`)
    const client = getClient()

    const { data } = await client.auth.authControllerGetQr(sessionName as any, {
      format: "raw",
    })

    if (typeof data === "object" && data && "value" in data) {
      debugLog("QR", `QR code fetched successfully for ${sessionName}`)
      return (data as { value: string }).value
    }

    debugLog("QR", `No QR value in response for ${sessionName}`)
    return null
  } catch (error: any) {
    debugLog("QR", `Failed to fetch QR code: ${error.message}`)
    return null
  }
}
