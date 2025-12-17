# WAHA TUI

A beautiful Terminal User Interface for WhatsApp using [WAHA (WhatsApp HTTP API)](https://github.com/devlikeapro/waha).

Manage your WhatsApp sessions, chats, and messages directly from your terminal with an intuitive TUI powered by [OpenTUI](https://opentui.app).

## Features

- 📱 **Session Management** - Create, view, and manage WAHA sessions
- 💬 **Chat Interface** - Browse chats and conversations
- ✉️ **Messaging** - Send and receive messages
- 🎨 **Beautiful UI** - Clean, modern terminal interface
- ⚡ **Fast & Lightweight** - Built with Bun for blazing-fast performance
- 🔒 **Secure** - All configuration stored locally in `~/.waha-tui/`

## Prerequisites

- [Bun](https://bun.sh) >= 1.0
- A running [WAHA server](https://github.com/devlikeapro/waha)

## Installation

### From Source

```bash
git clone https://github.com/muhammedaksam/waha-tui.git
cd waha-tui
bun install
bun dev
```

### From NPM (Coming Soon)

```bash
bun add -g @muhammedaksam/waha-tui
waha-tui
```

## Configuration

On first run, WAHA TUI will prompt you for configuration. Alternatively, you can:

### Option 1: Environment Variables

Create a `.env` file in the project directory:

```env
WAHA_URL=http://localhost:3000
WAHA_API_KEY=your-api-key-here
```

### Option 2: Config File

Configuration is automatically saved to `~/.waha-tui/config.json`:

```json
{
  "version": "0.1.0",
  "wahaUrl": "http://localhost:3000",
  "wahaApiKey": "your-api-key-here",
  "createdAt": "2025-12-17T16:00:00.000Z",
  "updatedAt": "2025-12-17T16:00:00.000Z"
}
```

## Usage

### Starting the TUI

```bash
bun dev
```

### Keyboard Shortcuts

- `q` - Quit the application
- `r` - Refresh current view
- `n` - Create new session (in Sessions view)
- `1` - Go to Sessions view
- `2` - Go to Chats view
- `Ctrl+C` - Exit immediately

### Debug Logging

Enable debug logging to troubleshoot issues:

```bash
# Via environment variable
WAHA_TUI_DEBUG=1 bun dev

# Via command-line flag
bun dev --debug
```

Debug logs are saved to `~/.waha-tui/debug.log` with automatic sanitization of sensitive data (API keys, passwords, tokens).

### Managing Sessions

1. Press `1` to go to Sessions view
2. Press `n` to create a new session
3. Scan the QR code with WhatsApp
4. Press `r` to refresh and see connection status

### Sending Messages

1. Press `2` to go to Chats view
2. Navigate to a chat
3. Type your message
4. Press `Enter` to send

## Development

### Project Structure

```
waha-tui/
├── src/
│   ├── config/          # Configuration management
│   │   ├── schema.ts    # Config types and validation
│   │   └── manager.ts   # File operations
│   ├── components/      # Reusable UI components
│   │   └── StatusBar.ts # Status bar component
│   ├── views/           # Main application views
│   │   └── SessionsView.ts
│   ├── state/           # Global state management
│   │   └── AppState.ts
│   ├── utils/           # Utility functions
│   │   └── formatters.ts
│   ├── client.ts        # WAHA API client
│   └── index.ts         # Main entry point
└── package.json
```

### Available Scripts

```bash
bun dev              # Start in watch mode
bun start            # Start without watch
bun build            # Build for production
bun typecheck        # Run TypeScript checks
bun lint             # Run ESLint
bun format           # Format code with Prettier
bun check            # Run all checks (typecheck + lint + format)
```

## Roadmap

- [x] Configuration management with `~/.waha-tui/`
- [x] Session listing and status display
- [ ] QR code display for authentication
- [ ] Chat list with search
- [ ] Conversation view with message history
- [ ] Send text messages
- [ ] Send media (images, documents, voice)
- [ ] Group management
- [ ] Contact management
- [ ] Real-time message updates via webhooks
- [ ] Settings panel
- [ ] Multiple session support

## Technologies

- **Runtime**: [Bun](https://bun.sh)
- **UI Framework**: [OpenTUI](https://opentui.app)
- **WAHA SDK**: [@muhammedaksam/waha-node](https://www.npmjs.com/package/@muhammedaksam/waha-node)
- **TypeScript**: Type-safe development

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Muhammed Mustafa AKŞAM

## Links

- [WAHA HTTP API](https://github.com/devlikeapro/waha)
- [WAHA Node SDK](https://github.com/muhammedaksam/waha-node)
- [OpenTUI Framework](https://opentui.app)
