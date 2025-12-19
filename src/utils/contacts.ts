/**
 * Contacts Utilities
 * Load and cache all contacts for search
 */

import { getClient } from "../client"
import { debugLog } from "./debug"

/**
 * Load all contacts from WAHA API
 * This populates a full contact list for search (not just contacts with chats)
 */
export async function loadAllContacts(session: string): Promise<Map<string, string>> {
  debugLog("Contacts", `Loading all contacts for session: ${session}`)

  try {
    const client = getClient()
    // The API returns an array of contact objects
    const response = await client.contacts.contactsControllerGetAll({
      session,
      limit: 10000, // Get all contacts
      sortBy: "name",
    })

    // The actual API response format is different than the Contact interface
    // It returns objects with { id, name, pushname, ... }
    const contacts = response.data as unknown as Array<{
      id: string
      name?: string
      pushname?: string
      shortName?: string
    }>

    const contactMap = new Map<string, string>()

    for (const contact of contacts) {
      // Use name, fallback to pushname, then shortName
      const contactName = contact.name || contact.pushname || contact.shortName

      if (contact.id && contactName) {
        contactMap.set(contact.id, contactName)
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
