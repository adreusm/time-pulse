# 🍅 Time Pulse - Pomodoro Timer App

A modern, feature-rich Pomodoro timer application built with Vue 3, TypeScript, and Vite. Focus with the power of customizable timers, background sounds, and beautiful dark/light themes.

![Time Pulse](https://img.shields.io/badge/Vue-3.x-4FC08D?style=for-the-badge&logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite)

## ✨ Features

### 🎯 Core Timer Functionality
- **Customizable Durations**: Set your own work, short break, and long break times
- **Smart Session Management**: Automatic progression through work/break cycles
- **Visual Progress Ring**: Beautiful circular progress indicator
- **Session Statistics**: Track completed sessions and total time
- **Browser Notifications**: Get notified when sessions complete
- **Audio Completion Sound**: Hear when your focus time is up

### 🎵 Background Sounds
- **Rain Sounds**: Relaxing rain ambiance for deep focus
- **Campfire Sounds**: Warm crackling fire for cozy productivity
- **Volume Control**: Adjustable audio levels
- **Easy Sound Switching**: Toggle between sounds or silence

### 🎨 Themes & Customization
- **Dark/Light Theme**: Toggle between beautiful themes
- **Persistent Preferences**: Your settings and theme are saved
- **Responsive Design**: Works perfectly on desktop and mobile
- **Modern UI**: Clean, professional interface with smooth animations

### ⚙️ Advanced Settings
- **Preset Configurations**: Quick setup with popular Pomodoro timings
- **Custom Durations**: Fine-tune your productivity rhythm
- **Settings Persistence**: All preferences saved to local storage
- **Reset Options**: Restore defaults anytime

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd time-pulse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 📱 Usage Guide

### Timer Page (`/`)
The main timer interface where you'll spend most of your time:

1. **Start/Pause**: Click the main timer button to start or pause your session
2. **Reset**: Reset the current session to its full duration
3. **Session Types**: Switch between Work, Short Break, and Long Break
4. **Background Sounds**: Choose rain, campfire, or no sound
5. **Volume**: Adjust the background sound volume
6. **Theme Toggle**: Switch between dark and light themes

### Settings Page (`/settings`)
Customize your pomodoro experience:

1. **Timer Durations**: Adjust work and break session lengths
2. **Presets**: Choose from popular configurations:
   - **Classic**: 25m work, 5m short, 15m long
   - **Intense Focus**: 45m work, 10m short, 20m long  
   - **Light Sessions**: 15m work, 3m short, 10m long
   - **Marathon**: 60m work, 15m short, 30m long
3. **Save Settings**: Persist your customizations
4. **Reset**: Restore default settings

## 🎯 Pomodoro Technique

Time Pulse implements the classic Pomodoro Technique:

1. **Work Session**: Focus intensely for your set duration (default: 25 minutes)
2. **Short Break**: Take a brief rest (default: 5 minutes)
3. **Repeat**: Complete 4 work sessions
4. **Long Break**: Take a longer rest (default: 15 minutes)
5. **Cycle**: Repeat the entire process

## 🛠️ Technical Details

### Tech Stack
- **Frontend**: Vue 3 with Composition API
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: Vue Router 4
- **Styling**: CSS with CSS Variables for theming
- **Audio**: Web Audio API for background sounds

### Project Structure
```
src/
├── components/          # Reusable Vue components
│   └── PomodoroTimer.vue
├── views/              # Page-level components
│   ├── TimerView.vue
│   └── SettingsView.vue
├── composables/        # Vue composables for state management
│   └── useTheme.ts
├── router/             # Vue Router configuration
│   └── index.ts
├── assets/            # Static assets
│   ├── sound_rain.mp3
│   └── sound_campfire.mp3
├── App.vue            # Root component
├── main.ts            # Application entry point
└── style.css          # Global styles
```

### Key Features Implementation

#### Theme Management
- CSS custom properties for consistent theming
- Local storage persistence
- Smooth transitions between themes
- System preference detection

#### Settings Persistence
- Local storage for user preferences
- Reactive settings updates
- Default fallback values
- Settings validation

#### Audio Management
- Web Audio API for background sounds
- Volume control with real-time updates
- Audio loop management
- Browser compatibility handling

## 🎨 Customization

### Adding New Background Sounds
1. Add your audio file to `src/assets/`
2. Update the `playSound` function in `PomodoroTimer.vue`
3. Add a new sound button in the template
4. Update the sound state management

### Creating New Presets
1. Add your preset to the `presets` object in `SettingsView.vue`
2. Create a new preset button in the template
3. Update the `applyPreset` function

### Styling Customization
- Modify CSS custom properties in `style.css`
- Update component-specific styles
- Add new theme variants

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

## 🌟 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vue 3](https://vuejs.org/)
- Powered by [Vite](https://vitejs.dev/)
- Styled with modern CSS
- Audio files from [Freesound](https://freesound.org/)

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/adreusm/time-pulse/issues) page
2. Create a new issue with detailed information
3. Include browser console logs if applicable

---

**Happy Focusing! 🍅✨**

*Time Pulse helps you maintain focus and productivity through the proven Pomodoro Technique. Start your first session today!*
