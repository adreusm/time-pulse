<template>
  <div class="settings-view">
    <div class="header">
      <h1>Settings</h1>
      <div class="header-controls">
        <button @click="toggleTheme" class="theme-toggle">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>
        <router-link to="/" class="back-link">
          ← Back to Timer
        </router-link>
      </div>
    </div>

    <div class="settings-container">
      <div class="settings-section">
        <h2>Timer Durations</h2>
        <p class="section-description">Customize your work and break session lengths</p>
        
        <div class="duration-controls">
          <div class="duration-item">
            <label for="work-duration">Work Duration (minutes)</label>
            <div class="input-group">
              <button @click="decreaseWorkDuration" class="duration-btn">-</button>
              <input 
                id="work-duration"
                type="number" 
                v-model.number="localSettings.workDuration"
                min="1"
                max="60"
                class="duration-input"
              />
              <button @click="increaseWorkDuration" class="duration-btn">+</button>
            </div>
          </div>

          <div class="duration-item">
            <label for="short-break">Short Break Duration (minutes)</label>
            <div class="input-group">
              <button @click="decreaseShortBreak" class="duration-btn">-</button>
              <input 
                id="short-break"
                type="number" 
                v-model.number="localSettings.shortBreakDuration"
                min="1"
                max="30"
                class="duration-input"
              />
              <button @click="increaseShortBreak" class="duration-btn">+</button>
            </div>
          </div>

          <div class="duration-item">
            <label for="long-break">Long Break Duration (minutes)</label>
            <div class="input-group">
              <button @click="decreaseLongBreak" class="duration-btn">-</button>
              <input 
                id="long-break"
                type="number" 
                v-model.number="localSettings.longBreakDuration"
                min="1"
                max="60"
                class="duration-input"
              />
              <button @click="increaseLongBreak" class="duration-btn">+</button>
            </div>
          </div>
        </div>
      </div>

      <div class="settings-section">
        <h2>Presets</h2>
        <p class="section-description">Quick setup with popular Pomodoro configurations</p>
        
        <div class="preset-buttons">
          <button @click="applyPreset('classic')" class="preset-btn">
            <div class="preset-name">Classic</div>
            <div class="preset-details">25m work, 5m short, 15m long</div>
          </button>
          
          <button @click="applyPreset('intense')" class="preset-btn">
            <div class="preset-name">Intense Focus</div>
            <div class="preset-details">45m work, 10m short, 20m long</div>
          </button>
          
          <button @click="applyPreset('light')" class="preset-btn">
            <div class="preset-name">Light Sessions</div>
            <div class="preset-details">15m work, 3m short, 10m long</div>
          </button>
          
          <button @click="applyPreset('marathon')" class="preset-btn">
            <div class="preset-name">Marathon</div>
            <div class="preset-details">60m work, 15m short, 30m long</div>
          </button>
        </div>
      </div>

      <div class="settings-section">
        <h2>Actions</h2>
        <div class="action-buttons">
          <button @click="saveSettings" class="save-btn">
            💾 Save Settings
          </button>
          <button @click="resetToDefaults" class="reset-btn">
            🔄 Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useSettings, useTheme } from '../composables/useTheme'

const { settings, updateSettings, resetSettings } = useSettings()
const { isDarkMode, toggleTheme } = useTheme()

// Local settings for editing
const localSettings = reactive({
  workDuration: settings.value.workDuration,
  shortBreakDuration: settings.value.shortBreakDuration,
  longBreakDuration: settings.value.longBreakDuration
})

// Watch for external settings changes
watch(settings, (newSettings) => {
  localSettings.workDuration = newSettings.workDuration
  localSettings.shortBreakDuration = newSettings.shortBreakDuration
  localSettings.longBreakDuration = newSettings.longBreakDuration
}, { deep: true })

// Duration adjustment functions
const adjustDuration = (type: keyof typeof localSettings, delta: number, min: number, max: number) => {
  const current = localSettings[type]
  const newValue = Math.max(min, Math.min(max, current + delta))
  localSettings[type] = newValue
}

const decreaseWorkDuration = () => adjustDuration('workDuration', -1, 1, 60)
const increaseWorkDuration = () => adjustDuration('workDuration', 1, 1, 60)
const decreaseShortBreak = () => adjustDuration('shortBreakDuration', -1, 1, 30)
const increaseShortBreak = () => adjustDuration('shortBreakDuration', 1, 1, 30)
const decreaseLongBreak = () => adjustDuration('longBreakDuration', -1, 1, 60)
const increaseLongBreak = () => adjustDuration('longBreakDuration', 1, 1, 60)

// Preset configurations
const presets = {
  classic: { workDuration: 25, shortBreakDuration: 5, longBreakDuration: 15 },
  intense: { workDuration: 45, shortBreakDuration: 10, longBreakDuration: 20 },
  light: { workDuration: 15, shortBreakDuration: 3, longBreakDuration: 10 },
  marathon: { workDuration: 60, shortBreakDuration: 15, longBreakDuration: 30 }
}

const applyPreset = (presetName: keyof typeof presets) => {
  const preset = presets[presetName]
  localSettings.workDuration = preset.workDuration
  localSettings.shortBreakDuration = preset.shortBreakDuration
  localSettings.longBreakDuration = preset.longBreakDuration
}

const saveSettings = () => {
  updateSettings(localSettings)
  // Show success feedback
  const saveBtn = document.querySelector('.save-btn') as HTMLButtonElement
  if (saveBtn) {
    const originalText = saveBtn.innerHTML
    saveBtn.innerHTML = '✅ Saved!'
    saveBtn.style.background = '#4CAF50'
    setTimeout(() => {
      saveBtn.innerHTML = originalText
      saveBtn.style.background = ''
    }, 2000)
  }
}

const resetToDefaults = () => {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    resetSettings()
    localSettings.workDuration = settings.value.workDuration
    localSettings.shortBreakDuration = settings.value.shortBreakDuration
    localSettings.longBreakDuration = settings.value.longBreakDuration
  }
}
</script>

<style scoped>
.settings-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 2.5rem;
  font-weight: 700;
}

.header-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;
}

.theme-toggle {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  padding: 0.8rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  background: var(--bg-hover);
  transform: scale(1.1);
}

.back-link {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
}

.back-link:hover {
  background: var(--bg-hover);
  transform: translateY(-2px);
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  background: var(--bg-secondary);
  border-radius: 15px;
  padding: 2rem;
  border: 1px solid var(--border-color);
}

h2 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.section-description {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.duration-controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.duration-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.duration-item label {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 1rem;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.duration-btn {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  padding: 0.8rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  font-weight: bold;
  min-width: 50px;
}

.duration-btn:hover {
  background: var(--bg-hover);
  transform: scale(1.05);
}

.duration-input {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  padding: 0.8rem 1rem;
  border-radius: 8px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  width: 100px;
}

.duration-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.preset-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.preset-btn {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  padding: 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.preset-btn:hover {
  background: var(--bg-hover);
  border-color: var(--accent-color);
  transform: translateY(-2px);
}

.preset-name {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.preset-details {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.save-btn, .reset-btn {
  padding: 1rem 2rem;
  border-radius: 25px;
  border: 2px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 1rem;
}

.save-btn {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.save-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
}

.reset-btn {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.reset-btn:hover {
  background: var(--bg-hover);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .settings-view {
    padding: 1rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .settings-section {
    padding: 1.5rem;
  }
  
  .preset-buttons {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .header-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
