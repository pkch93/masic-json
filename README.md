# magic-json | Always JSON. Format it, see it, query it.

[한국어](README-ko.md) | English

**magic-json** is a desktop app for working with JSON data quickly and easily.

Built for developers, data analysts, QA engineers, and anyone who works with JSON regularly. Use it to inspect API responses, edit config files, explore data structures, and more.

Instantly format messy JSON, visualize it as a tree, or extract exactly what you need with JSONPath queries. The Command Palette (`Shift × 2`) gives you keyboard-only access to every feature without breaking your workflow.

## Features

| Feature | Description |
|---|---|
| **Format / Minify** | Pretty-print JSON with indentation, or compress it into a single line |
| **Tree View** | Visualize JSON as a collapsible, expandable tree |
| **JSONPath Query** | Extract specific values from nested JSON using JSONPath expressions |
| **Sort** | Sort all keys in a JSON object alphabetically |
| **Command Palette** | Access any feature instantly with `Shift × 2` |
| **History** | Save and reload previous Format / Minify operations |
| **Key Mapping** | Customize keyboard shortcuts to your liking |
| **Dark / Light Mode** | Switch between dark and light themes |

## Keyboard Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| Open Command Palette | `Shift × 2` | `Shift × 2` |
| Format JSON | `⇧F` | `Shift+F` |
| Minify JSON | `⇧M` | `Shift+M` |
| Clear Editor | `⇧C` | `Shift+C` |
| Find | `⌘F` | `Ctrl+F` |
| Focus Editor | `Enter` | `Enter` |
| Tree View | `F1` | `F1` |
| JSON Path | `F2` | `F2` |
| Sort | `F3` | `F3` |

Shortcuts can be changed in Settings → Key Mapping.

---

## Quick Start

### Download

Download the installer for your operating system from the [GitHub Releases](https://github.com/pkch93/magic-json/releases) page.

| OS | File |
|---|---|
| macOS | `.dmg` |
| Windows | `.exe` |
| Linux | `.AppImage` |

### Installation

**macOS**
1. Open the `.dmg` file and drag `magic-json` into your Applications folder.
2. On first launch, if you see an "unidentified developer" warning, go to System Settings → Privacy & Security and allow the app.

**Windows**
1. Run the `.exe` installer and follow the on-screen instructions.

**Linux**
1. Make the `.AppImage` file executable and run it.
   ```bash
   chmod +x magic-json-*.AppImage
   ./magic-json-*.AppImage
   ```

---

## For Developers

To run or build locally, you'll need [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/).

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

```bash
# Build for each platform
pnpm build:mac
pnpm build:win
pnpm build:linux
```

**Tech Stack**: Electron v39 · React v19 · TypeScript v5 · electron-vite · CodeMirror 6 · jsonpath-plus

## License

[MIT](LICENSE)
