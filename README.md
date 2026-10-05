# AR-Core — React + Ollama AI Assistant

A professional, responsive AI assistant dashboard built with React, Vite, Express and Ollama.

## Features
- Login / Sign-up UI
- Browser demo authentication using localStorage
- Professional responsive dashboard
- Robot AI assistant UI
- Chat interface with loading/error states
- Express API proxy for Ollama
- Conversation context sent to Ollama
- Configurable Ollama model and URL
- Dashboard, history and settings pages

## Requirements
- Node.js 18+ recommended
- Ollama installed and running locally
- An Ollama model available locally

## Setup

1. Extract the project and open a terminal in `AR-Core`.
2. Install packages:
   `npm install`
3. Create `.env` in the project root from `.env.example`.
4. Set your model, for example:
   `OLLAMA_MODEL=llama3.2`
5. Start the project:
   `npm start`

Frontend: http://localhost:5173
Backend: http://localhost:5000

If you prefer separate terminals:
- `npm run server`
- `npm run dev`

## Mobile app

The React app can be packaged for Android and iOS with Capacitor. Install Android Studio (and its Android SDK) for Android builds, or Xcode on macOS for iOS builds.

1. Set `VITE_API_URL` to an API address the phone can reach. `localhost` on a phone means the phone itself, not this computer. For local testing, use your computer's LAN address, for example `VITE_API_URL=http://192.168.1.25:5000`, and allow port 5000 through the firewall. For production, use an HTTPS deployed API URL.
2. Build and sync the web app: `npm run mobile:sync`
3. Create the Android project once: `npx cap add android`
4. Open it in Android Studio: `npm run mobile:android`
5. Run on a connected device or emulator: `npm run mobile:run:android`

The phone still needs the Express API and Ollama to be running. Ollama stays on the backend computer; the mobile app should never connect directly to Ollama.

## Ollama
The backend calls the local Ollama chat API at:
`http://127.0.0.1:11434/api/chat`

Change `OLLAMA_URL` and `OLLAMA_MODEL` in `.env` if your setup is different.

## Important production note
The included authentication is intentionally a front-end demo. It stores only the signed-in user's name/email in localStorage and does not store passwords. For production, use a backend authentication system, password hashing, secure sessions/JWT strategy, validation, rate limiting, HTTPS and a database.

## Project structure
src/
  components/
  services/
  App.jsx
  main.jsx
  styles.css
server/
  index.js
