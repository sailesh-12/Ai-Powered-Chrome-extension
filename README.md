# 🚀 AI Summarizer - Chrome Extension

A sleek Chrome extension that uses **Google Gemini AI** to instantly summarize any webpage. Get brief, short, or detailed summaries with just one click.

![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Gemini%20AI-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Vite](https://img.shields.io/badge/Vite-5-646CFF)

## ✨ Features

- **🤖 AI-Powered Summaries** - Uses Google Gemini 2.5 Flash for intelligent summarization
- **📊 Three Summary Modes**:
  - ⚡ **Brief** - Quick overview of the page
  - 📝 **Short** - Concise summary with key points
  - 📚 **Detailed** - Comprehensive analysis
- **🎨 Premium Dark UI** - Beautiful glassmorphism design with smooth animations
- **📋 One-Click Copy** - Easily copy summaries to clipboard
- **🔐 Secure API Key Storage** - Your API key is stored locally in Chrome

## 📸 Screenshots

The extension features a modern dark theme with gradient accents and a clean, intuitive interface.

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- Google Gemini API Key ([Get one free](https://aistudio.google.com/apikey))

### Build from Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-summarizer-extension.git
   cd ai-summarizer-extension/chrome-extension
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the `dist` folder

## 🚀 Usage

1. Click the extension icon in your browser toolbar
2. Enter your Gemini API key (first time only)
3. Choose your summary length: **Brief**, **Short**, or **Detailed**
4. Click **"Summarize This Page"**
5. Copy the summary with one click!

## 🏗️ Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite 5
- **Styling**: Vanilla CSS with custom dark theme
- **AI**: Google Gemini 2.5 Flash API
- **Platform**: Chrome Extension (Manifest V3)

## 📁 Project Structure

```
chrome-extension/
├── public/
│   ├── manifest.json    # Chrome extension manifest
│   ├── content.js       # Content script for page extraction
│   └── icons/           # Extension icons
├── src/
│   ├── App.jsx          # Main React component
│   ├── App.css          # Styles
│   └── main.jsx         # Entry point
├── dist/                # Built extension (after npm run build)
└── package.json
```

## ⚙️ Configuration

### Manifest Permissions
- `activeTab` - Access current tab content
- `storage` - Store API key locally
- `scripting` - Execute content scripts

### API Configuration
The extension uses:
- **Model**: `gemini-2.5-flash`
- **Temperature**: 0.7
- **Endpoint**: Google Generative Language API

## 🔒 Privacy

- Your API key is stored **locally** in Chrome's storage
- Page content is sent directly to Google's Gemini API
- No data is collected or stored by the extension

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

MIT License - feel free to use and modify!

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for the powerful summarization
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [React](https://react.dev/) for the UI framework

---

**Made with ❤️ and AI**
