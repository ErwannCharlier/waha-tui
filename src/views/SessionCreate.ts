/**
 * Session Creation Dialog
 * Handle creating new WAHA sessions
 */

import { getClient } from "../client"
import { appState } from "../state/AppState"
import type { SessionCreateRequest } from "@muhammedaksam/waha-node"
import { debugLog } from "../utils/debug"

export async function createNewSession(): Promise<void> {
  try {
    // Prompt for session name
    const sessionName = prompt("Enter session name:", "default") || "default"

    debugLog("Session", `Creating new session: ${sessionName}`)
    console.log(`\n📱 Creating session: ${sessionName}...`)

    const client = getClient()

    const createRequest: SessionCreateRequest = {
      name: sessionName,
      config: {
        noweb: {
          store: {
            enabled: true,
            fullSync: false,
          },
          markOnline: true,
        },
      },
      start: true,
    }

    const { data: session } = await client.sessions.sessionsControllerCreate(createRequest)
    debugLog("Session", `Session created: ${session.name} (status: ${session.status})`)
    console.log(`✅ Session created: ${session.name}`)
    console.log(`   Status: ${session.status}`)

    if (session.status === "SCAN_QR_CODE") {
      console.log("\n📷 Scan QR code with WhatsApp to authenticate...")
      console.log("   Press 'r' to refresh and see updated status\n")
    }

    // Set as current session and refresh
    appState.setCurrentSession(sessionName)
  } catch (error) {
    debugLog("Session", `Failed to create session: ${error}`)
    console.error(`\n❌ Failed to create session: ${error}\n`)
  }
}
