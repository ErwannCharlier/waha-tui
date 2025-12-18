/**
 * Chat List Scroll Utilities
 * Handles scroll offset calculations for the chat list
 */

const ROW_HEIGHT = 5
const ESTIMATED_VIEWPORT_HEIGHT = 49
const MAX_VISIBLE_ITEMS = Math.floor(ESTIMATED_VIEWPORT_HEIGHT / ROW_HEIGHT)

/**
 * Calculate scroll offset with "lazy scroll + center jump" behavior:
 * - Don't scroll while the selection is visible in the viewport
 * - Only when selection goes OUTSIDE the visible area, jump to center it
 */
export function calculateChatListScrollOffset(
  selectedIndex: number,
  currentScrollOffset: number,
  totalItems: number
): number {
  const firstVisible = currentScrollOffset
  const lastVisible = currentScrollOffset + MAX_VISIBLE_ITEMS - 1

  // If selection is within visible range, keep current scroll
  if (selectedIndex >= firstVisible && selectedIndex <= lastVisible) {
    return currentScrollOffset
  }

  // Selection is outside visible range - center it
  const halfVisible = Math.floor(MAX_VISIBLE_ITEMS / 2)
  const maxScrollOffset = Math.max(0, totalItems - MAX_VISIBLE_ITEMS)
  const newScrollOffset = Math.max(0, Math.min(selectedIndex - halfVisible, maxScrollOffset))

  return newScrollOffset
}

export { ROW_HEIGHT, MAX_VISIBLE_ITEMS }
