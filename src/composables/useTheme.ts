import { ref, computed, watch } from 'vue'

// Theme management
const isDarkMode = ref(false)

// Load theme preference from localStorage
const savedTheme = localStorage.getItem('theme')
if (savedTheme) {
  isDarkMode.value = savedTheme === 'dark'
}

// Apply theme to document
const applyTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Watch for theme changes and persist
watch(isDarkMode, (newValue) => {
  applyTheme()
  localStorage.setItem('theme', newValue ? 'dark' : 'light')
})

// Apply theme on initial load
applyTheme()

export const useTheme = () => {
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
  }

  return {
    isDarkMode: computed(() => isDarkMode.value),
    toggleTheme
  }
}

// Settings management
interface TimerSettings {
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
}

const defaultSettings: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15
}

const settings = ref<TimerSettings>({ ...defaultSettings })

// Load settings from localStorage
const savedSettings = localStorage.getItem('timerSettings')
if (savedSettings) {
  try {
    const parsed = JSON.parse(savedSettings)
    settings.value = { ...defaultSettings, ...parsed }
  } catch (e) {
    console.warn('Failed to parse saved settings, using defaults')
  }
}

// Watch for settings changes and persist
watch(settings, (newSettings) => {
  localStorage.setItem('timerSettings', JSON.stringify(newSettings))
}, { deep: true })

export const useSettings = () => {
  const updateSettings = (newSettings: Partial<TimerSettings>) => {
    settings.value = { ...settings.value, ...newSettings }
  }

  const resetSettings = () => {
    settings.value = { ...defaultSettings }
  }

  return {
    settings: computed(() => settings.value),
    updateSettings,
    resetSettings
  }
}
