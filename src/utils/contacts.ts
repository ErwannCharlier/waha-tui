/**
 * Contacts Utilities
 * Load and cache all contacts for search
 */

import { getClient } from "../client"
import { debugLog } from "./debug"
import type { Contact } from "@muhammedaksam/waha-node"

/**
 * Load all contacts from WAHA API
 * This populates a full contact list for search (not just contacts with chats)
 */
export async function loadAllContacts(session: string): Promise<Map<string, string>> {
  debugLog("Contacts", `Loading all contacts for session: ${session}`)

  try {
    const client = getClient()
    // The API returns Contact[] but types show void, so we'll cast it
    const response = await client.contacts.contactsControllerGetAll({
      session,
      limit: 10000, // Get all contacts
      sortBy: "name",
    })

    const contacts = response.data as unknown as Contact[]
    const contactMap = new Map<string, string>()

    for (const contact of contacts) {
      // Map whatsappId to fullName
      if (contact.whatsappId && contact.fullName) {
        // Normalize the whatsappId to include @c.us if not present
        const normalizedId = contact.whatsappId.includes("@")
          ? contact.whatsappId
          : `${contact.whatsappId}@c.us`

        contactMap.set(normalizedId, contact.fullName)
      }
    }

    debugLog("Contacts", `Loaded ${contactMap.size} contacts`)
    return contactMap
  } catch (error) {
    debugLog("Contacts", `Error loading contacts: ${error}`)
    // Return empty map on error
    return new Map()
  }
}
