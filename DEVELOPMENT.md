# Development Guide

## Quick Start

```bash
# Install dependencies
bun install

# Run in development mode
bun dev

# Run with debug logging
bun dev:debug
```

## Scripts

| Command          | Description                         |
| ---------------- | ----------------------------------- |
| `bun dev`        | Run with hot reload                 |
| `bun dev:debug`  | Run with debug logging enabled      |
| `bun start`      | Run production build                |
| `bun test`       | Run all tests                       |
| `bun test:watch` | Run tests in watch mode             |
| `bun check`      | Run typecheck + lint + format check |
| `bun fix`        | Auto-fix lint and formatting issues |

## Project Structure

```bash
waha-tui/
├── src/
│   ├── client/                     # WAHA API client (domain-split modules)
│   │   ├── core.ts                 # Client initialization & utilities
│   │   ├── chatActions.ts          # Chat operations (archive, delete, etc.)
│   │   ├── messageActions.ts       # Message operations (send, star, react)
│   │   ├── sessionActions.ts       # Session & contact management
│   │   ├── presenceActions.ts      # Presence & activity management
│   │   └── index.ts                # Barrel exports
│   ├── components/                 # Reusable UI components
│   ├── config/                     # Configuration management
│   ├── handlers/                   # Action handlers
│   │   ├── keyboardHandler.ts      # Centralized keyboard handling
│   │   ├── ContextMenuActions.ts   # Context menu action execution
│   │   └── index.ts                # Barrel exports
│   ├── services/                   # Background services
│   │   ├── ErrorService.ts         # Centralized error handling
│   │   ├── RetryService.ts         # Retry with exponential backoff
│   │   ├── WebSocketService.ts     # Real-time WebSocket updates
│   ├── state/                      # Global state management
│   ├── types/                      # TypeScript type definitions
│   ├── utils/                      # Utility functions
│   ├── views/                      # Main application views
│   │   ├── conversation/           # Conversation view modules
│   │   │   ├── MessageHelpers.ts   # Sender colors, date formatting
│   │   │   ├── MessageRenderer.ts  # Message bubble rendering
│   │   │   ├── ReplyContext.ts     # Reply/quote rendering
│   │   │   └── index.ts
│   │   └── ...
│   └── index.ts                    # Main entry point
├── .github/
│   ├── workflows/                  # CI/CD workflows
│   └── actions/                    # Reusable actions
└── package.json
```

## Testing

Tests are written using Bun's built-in test runner.

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Run tests with coverage
bun test:coverage

# Run specific test file
bun test src/utils/formatters.test.ts
```

### Test Files

| File                            | Coverage             |
| ------------------------------- | -------------------- |
| `utils/formatters.test.ts`      | Formatting utilities |
| `utils/filterChats.test.ts`     | Chat filtering logic |
| `services/ErrorService.test.ts` | Error classification |
| `services/RetryService.test.ts` | Retry logic          |

## Error Handling

The application uses a centralized error handling service:

```typescript
import { errorService } from "./services/ErrorService"

try {
  await someApiCall()
} catch (error) {
  const appError = errorService.handle(error, {
    log: true,
    notify: true,
    context: { action: "someAction" },
  })

  // Get user-friendly message
  const message = errorService.getUserMessage(appError)
}
```

### Retry API Calls

```typescript
import { RetryPresets, withRetry } from "./services/RetryService"

// With defaults (3 retries, exponential backoff)
const result = await withRetry(() => apiCall())

// With preset configuration
const result = await withRetry(() => apiCall(), RetryPresets.aggressive)
```

## Code Quality

Pre-commit hooks run automatically:

- ESLint for code quality
- Prettier for formatting

Manual checks:

```bash
bun typecheck  # TypeScript type checking
bun lint       # ESLint
bun format     # Prettier formatting
```

## Debug Mode

Enable debug logging with the `--debug` flag:

```bash
bun dev --debug
```

Debug logs are written to `~/.config/waha-tui/debug.log`.

## Configuration

Configuration is stored in XDG-compliant locations:

- **Config**: `~/.config/waha-tui/config.json`
- **Env**: `~/.config/waha-tui/.env`
- **Logs**: `~/.config/waha-tui/debug.log`
