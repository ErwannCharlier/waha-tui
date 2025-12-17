/**
 * Configuration Manager
 * Handles reading and writing config to ~/.waha-tui/
 */

import { mkdir, readFile, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import type { WahaTuiConfig } from "./schema"
import { DEFAULT_CONFIG } from "./schema"
import { debugLog } from "../utils/debug"

const CONFIG_DIR_NAME = ".waha-tui"
const CONFIG_FILE_NAME = "config.json"

export function getConfigDir(): string {
  return join(homedir(), CONFIG_DIR_NAME)
}

export function getConfigPath(): string {
  return join(getConfigDir(), CONFIG_FILE_NAME)
}

export function getSessionsDir(): string {
  return join(getConfigDir(), "sessions")
}

export async function ensureConfigDir(): Promise<void> {
  const configDir = getConfigDir()
  const sessionsDir = getSessionsDir()

  if (!existsSync(configDir)) {
    await mkdir(configDir, { recursive: true })
  }

  if (!existsSync(sessionsDir)) {
    await mkdir(sessionsDir, { recursive: true })
  }
}

export async function configExists(): Promise<boolean> {
  return existsSync(getConfigPath())
}

export async function loadConfig(): Promise<WahaTuiConfig | null> {
  const configPath = getConfigPath()
  debugLog("Config", `Loading config from ${configPath}`)

  if (!existsSync(configPath)) {
    debugLog("Config", "Config file not found")
    return null
  }

  try {
    const content = await readFile(configPath, "utf-8")
    const config = JSON.parse(content) as WahaTuiConfig
    debugLog("Config", `Loaded config version ${config.version}`)
    return config
  } catch (error) {
    debugLog("Config", `Failed to load config: ${error}`)
    console.error("Failed to load config:", error)
    return null
  }
}

export async function saveConfig(config: WahaTuiConfig): Promise<void> {
  await ensureConfigDir()

  const configPath = getConfigPath()
  debugLog("Config", `Saving config to ${configPath}`)

  // Update timestamp
  config.updatedAt = new Date().toISOString()

  await writeFile(configPath, JSON.stringify(config, null, 2), "utf-8")
  debugLog("Config", "Config saved successfully")
}

export function createDefaultConfig(
  wahaUrl: string,
  wahaApiKey: string,
  options?: {
    dashboardUsername?: string
    dashboardPassword?: string
    swaggerUsername?: string
    swaggerPassword?: string
  }
): WahaTuiConfig {
  const now = new Date().toISOString()

  return {
    ...DEFAULT_CONFIG,
    wahaUrl,
    wahaApiKey,
    dashboardUsername: options?.dashboardUsername,
    dashboardPassword: options?.dashboardPassword,
    swaggerUsername: options?.swaggerUsername,
    swaggerPassword: options?.swaggerPassword,
    createdAt: now,
    updatedAt: now,
  } as WahaTuiConfig
}

/**
 * Load config from environment variables or .env file in project directory
 */
export async function loadConfigFromEnv(): Promise<Partial<WahaTuiConfig> | null> {
  // Try to load from project's .env file (for development)
  const projectEnvPath = join(process.cwd(), ".env")

  if (existsSync(projectEnvPath)) {
    try {
      const content = await readFile(projectEnvPath, "utf-8")
      const env: Record<string, string> = {}

      for (const line of content.split("\n")) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith("#")) continue

        const [key, ...valueParts] = trimmed.split("=")
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join("=").trim()
        }
      }

      return {
        wahaUrl: env.WAHA_URL,
        wahaApiKey: env.WAHA_API_KEY,
        dashboardUsername: env.WAHA_DASHBOARD_USERNAME,
        dashboardPassword: env.WAHA_DASHBOARD_PASSWORD,
        swaggerUsername: env.WHATSAPP_SWAGGER_USERNAME,
        swaggerPassword: env.WHATSAPP_SWAGGER_PASSWORD,
      }
    } catch {
      // Fall through to process.env
    }
  }

  // Fallback to process.env
  if (process.env.WAHA_URL || process.env.WAHA_API_KEY) {
    return {
      wahaUrl: process.env.WAHA_URL,
      wahaApiKey: process.env.WAHA_API_KEY,
      dashboardUsername: process.env.WAHA_DASHBOARD_USERNAME,
      dashboardPassword: process.env.WAHA_DASHBOARD_PASSWORD,
      swaggerUsername: process.env.WHATSAPP_SWAGGER_USERNAME,
      swaggerPassword: process.env.WHATSAPP_SWAGGER_PASSWORD,
    }
  }

  return null
}
