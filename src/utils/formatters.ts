/**
 * Formatting Utilities
 * Helper functions for formatting data in the TUI
 */

/**
 * Format a timestamp to relative time (e.g., "2m ago", "yesterday")
 */
export function formatRelativeTime(timestamp: number | string): string {
  const date = typeof timestamp === "number" ? new Date(timestamp * 1000) : new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return "yesterday"
  if (days < 7) return `${days}d ago`

  // Format as date for older messages
  return date.toLocaleDateString()
}

/**
 * Format a timestamp to time (e.g., "14:30")
 */
export function formatTime(timestamp: number | string): string {
  const date = typeof timestamp === "number" ? new Date(timestamp * 1000) : new Date(timestamp)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + "..."
}

/**
 * Format phone number (e.g., "1234567890@c.us" -> "+1 234 567 890")
 */
export function formatPhoneNumber(chatId: string): string {
  // Extract number from chatId
  const number = chatId.replace(/@.*$/, "")

  // Simple formatting - can be enhanced
  if (number.length > 10) {
    return `+${number.slice(0, -10)} ${number.slice(-10, -7)} ${number.slice(-7, -4)} ${number.slice(-4)}`
  }

  return number
}

/**
 * Get status icon for message
 */
export function getMessageStatusIcon(status?: string): string {
  switch (status) {
    case "pending":
      return "⏱"
    case "sent":
      return "✓"
    case "delivered":
      return "✓✓"
    case "read":
      return "✓✓" // In blue in reality
    case "failed":
      return "✗"
    default:
      return ""
  }
}

/**
 * Get connection status icon
 */
export function getConnectionStatusIcon(status: string): string {
  switch (status) {
    case "WORKING":
      return "🟢"
    case "STARTING":
    case "SCAN_QR_CODE":
      return "🟡"
    case "FAILED":
    case "STOPPED":
      return "🔴"
    default:
      return "⚪"
  }
}
