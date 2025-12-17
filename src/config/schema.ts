/**
 * Configuration Schema
 * Defines the structure and types for WAHA TUI configuration
 */

export interface WahaTuiConfig {
  version: string
  wahaUrl: string
  wahaApiKey: string
  dashboardUsername?: string
  dashboardPassword?: string
  swaggerUsername?: string
  swaggerPassword?: string
  defaultSession?: string
  createdAt: string
  updatedAt: string
}

export const DEFAULT_CONFIG: Partial<WahaTuiConfig> = {
  version: "0.1.0",
  wahaUrl: "http://localhost:3000",
  wahaApiKey: "",
}

export function validateConfig(config: Partial<WahaTuiConfig>): string[] {
  const errors: string[] = []

  if (!config.wahaUrl) {
    errors.push("WAHA URL is required")
  }

  if (!config.wahaApiKey) {
    errors.push("WAHA API Key is required")
  }

  // Validate URL format
  if (config.wahaUrl) {
    try {
      new URL(config.wahaUrl)
    } catch {
      errors.push("WAHA URL must be a valid URL")
    }
  }

  return errors
}
