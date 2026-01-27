# 🧩 Forkyz Crossword PWA

A Progressive Web App (PWA) for playing crossword puzzles, inspired by the Android Forkyz app. Built with React, TypeScript, and Vite.

## ✨ Features

- **Interactive Crossword Grid**: Click or tap cells to select, use keyboard to fill in answers
- **Smart Navigation**: Arrow keys, Tab to switch direction, automatic progression
- **Clue Display**: Side-by-side across/down clues with current clue highlighting
- **Game Controls**:
  - ⏱️ Timer with pause/resume
  - ✓ Check answers with visual feedback
  - 💡 Reveal current cell
  - 🗑️ Clear current word
  - ↻ Reset entire puzzle
- **Puzzle Management**:
  - Browse saved puzzles
  - Import puzzles (JSON format)
  - Sample puzzle included
  - Progress tracking
- **PWA Features**:
  - Install as standalone app
  - Offline support
  - Auto-save game state
  - IndexedDB storage

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎮 How to Play

1. **Start a Puzzle**:
   - Click "Try Sample Puzzle" to play the built-in 5x5 crossword
   - Or import your own puzzle in JSON format

2. **Navigate the Grid**:
   - Click/tap a cell to select it
   - Use arrow keys to move between cells
   - Press Tab or Space to switch between Across/Down
   - Type letters to fill in answers
   - Press Backspace to delete

3. **Use Clues**:
   - Current clue is displayed below the grid
   - Click any clue in the side panel to jump to it
   - Highlighted cells show the current word

4. **Game Controls**:
   - **Check**: Verify your answers (correct = green, incorrect = red)
   - **Reveal**: Show the correct letter for current cell
   - **Clear**: Erase all letters in current word
   - **Reset**: Start the puzzle over
   - **Pause**: Stop the timer

## 📁 Project Structure

```
/vercel/sandbox/
├── components/          # React components
│   ├── CrosswordGrid.tsx    # Main grid display
│   ├── ClueList.tsx         # Clue panel
│   ├── GameControls.tsx     # Timer and action buttons
│   └── PuzzleBrowser.tsx    # Puzzle selection screen
├── services/           # Business logic
│   ├── puzzleParser.ts      # Parse puzzle formats
│   └── puzzleStorage.ts     # IndexedDB storage
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component
├── index.tsx           # Entry point
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
└── package.json        # Dependencies
```

## 🎯 Supported Puzzle Formats

Currently supported:
- ✅ JSON format (custom format)
- ✅ Sample puzzles (built-in)

Coming soon:
- 🔜 .puz (Across Lite binary format)
- 🔜 .jpz (JPZ XML format)
- 🔜 .ipuz (IPuz JSON format)

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Click the install icon in the address bar
2. Or go to Menu → Install Forkyz Crossword

### Mobile (Android/iOS)
1. Open in browser
2. Tap "Add to Home Screen"
3. App will open in standalone mode

## 🔧 Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **IndexedDB (idb)** - Local puzzle storage
- **Vite PWA Plugin** - Progressive Web App features
- **Workbox** - Service worker and caching

## 🎨 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Arrow Keys | Navigate grid |
| Tab | Switch direction (Across ↔ Down) |
| Space | Toggle direction |
| A-Z | Enter letter |
| Backspace | Delete letter / move back |
| Ctrl+Z | Undo (coming soon) |

## 📝 Creating Custom Puzzles

Create a JSON file with this structure:

```json
{
  "title": "My Puzzle",
  "author": "Your Name",
  "width": 5,
  "height": 5,
  "grid": ["C","A","T","S",".","A",".","O",".","S","R","A","T","S","O","E",".","S",".","Y",".","D","O","G","S"],
  "clues": {
    "across": [
      "1. Feline pets",
      "5. Rodents",
      "7. Canine pets"
    ],
    "down": [
      "1. Concern",
      "2. Consumed",
      "3. Examination",
      "4. Distress signal"
    ]
  }
}
```

Then import via the "Import Puzzle" button.

## 🐛 Known Issues

- Icon placeholders need to be replaced with actual PNG images
- .puz binary format parser is simplified (full implementation pending)
- Settings panel is not yet implemented

## 🤝 Contributing

This is a conversion of the Android Forkyz app to a web-based PWA. Original Forkyz project: https://gitlab.com/Hague/forkyz

## 📄 License

GPL-3.0 (same as original Forkyz project)

## 🙏 Credits

- Original Forkyz Android app by the Forkyz contributors
- Inspired by Shortyz crossword app
- Built with modern web technologies

---

**Enjoy solving crosswords! 🧩✨**
