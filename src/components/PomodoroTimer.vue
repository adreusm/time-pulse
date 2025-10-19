<template>
  <div class="pomodoro-timer">
    <div class="timer-container">
      <div class="timer-display">
        <div class="time-circle">
          <svg class="progress-ring" width="300" height="300">
            <circle
              class="progress-ring-circle"
              stroke="#e0e0e0"
              stroke-width="8"
              fill="transparent"
              r="140"
              cx="150"
              cy="150"
            />
            <circle
              class="progress-ring-circle progress-ring-fill"
              stroke="#ff6b6b"
              stroke-width="8"
              fill="transparent"
              r="140"
              cx="150"
              cy="150"
              :style="{ strokeDasharray: circumference, strokeDashoffset: strokeDashoffset }"
            />
          </svg>
          <div class="time-text">
            <div class="time">{{ formattedTime }}</div>
            <div class="session-type">{{ currentSessionType }}</div>
          </div>
        </div>
      </div>

      <div class="controls">
        <button @click="toggleTimer" :class="['timer-btn', { active: isRunning }]">
          {{ isRunning ? 'Pause' : 'Start' }}
        </button>
        <button @click="resetTimer" class="reset-btn">Reset</button>
      </div>

      <div class="session-controls">
        <button 
          @click="setSessionType('work')" 
          :class="['session-btn', { active: sessionType === 'work' }]"
        >
          Work ({{ settings.workDuration }}m)
        </button>
        <button 
          @click="setSessionType('shortBreak')" 
          :class="['session-btn', { active: sessionType === 'shortBreak' }]"
        >
          Short Break ({{ settings.shortBreakDuration }}m)
        </button>
        <button 
          @click="setSessionType('longBreak')" 
          :class="['session-btn', { active: sessionType === 'longBreak' }]"
        >
          Long Break ({{ settings.longBreakDuration }}m)
        </button>
      </div>
    </div>

    <div class="sound-controls">
      <h3>Background Sounds</h3>
      <div class="sound-buttons">
        <button 
          @click="toggleSound('rain')" 
          :class="['sound-btn', { active: activeSound === 'rain' }]"
        >
          🌧️ Rain
        </button>
        <button 
          @click="toggleSound('campfire')" 
          :class="['sound-btn', { active: activeSound === 'campfire' }]"
        >
          🔥 Campfire
        </button>
        <button 
          @click="stopAllSounds" 
          :class="['sound-btn', { active: activeSound === null }]"
        >
          🔇 None
        </button>
      </div>
      <div class="volume-control">
        <label for="volume">Volume: {{ Math.round(volume * 100) }}%</label>
        <input 
          id="volume"
          type="range" 
          min="0" 
          max="1" 
          step="0.1" 
          v-model="volume"
          @input="updateVolume"
        />
      </div>
    </div>

    <div class="stats">
      <div class="stat">
        <span class="stat-label">Completed Sessions:</span>
        <span class="stat-value">{{ completedSessions }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Total Time:</span>
        <span class="stat-value">{{ formatTotalTime(totalTime) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSettings } from '../composables/useTheme'
import rainSound from '@/assets/sound_rain.mp3'
import campfireSound from '@/assets/sound_campfire.mp3'

const { settings } = useSettings()

// Timer state
const timeLeft = ref(25 * 60) // 25 minutes in seconds
const isRunning = ref(false)
const sessionType = ref<'work' | 'shortBreak' | 'longBreak'>('work')
const completedSessions = ref(0)
const totalTime = ref(0)

// Sound state
const activeSound = ref<string | null>(null)
const volume = ref(0.5)
const rainAudio = ref<HTMLAudioElement | null>(null)
const campfireAudio = ref<HTMLAudioElement | null>(null)

// Computed properties
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const currentSessionType = computed(() => {
  switch (sessionType.value) {
    case 'work': return 'Focus Time'
    case 'shortBreak': return 'Short Break'
    case 'longBreak': return 'Long Break'
    default: return 'Focus Time'
  }
})

// Progress circle calculations
const radius = 140
const circumference = 2 * Math.PI * radius
const strokeDashoffset = computed(() => {
  const totalTime = getTotalTimeForSession()
  const progress = (totalTime - timeLeft.value) / totalTime
  return circumference - (progress * circumference)
})

// Timer functions
let timerInterval: number | null = null

const startTimer = () => {
  isRunning.value = true
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
      totalTime.value++
    } else {
      completeSession()
    }
  }, 1000)
}

const pauseTimer = () => {
  isRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const toggleTimer = () => {
  if (isRunning.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

const resetTimer = () => {
  pauseTimer()
  timeLeft.value = getTotalTimeForSession()
}

const getTotalTimeForSession = () => {
  switch (sessionType.value) {
    case 'work': return settings.value.workDuration * 60
    case 'shortBreak': return settings.value.shortBreakDuration * 60
    case 'longBreak': return settings.value.longBreakDuration * 60
    default: return settings.value.workDuration * 60
  }
}

const setSessionType = (type: 'work' | 'shortBreak' | 'longBreak') => {
  if (isRunning.value) {
    pauseTimer()
  }
  sessionType.value = type
  timeLeft.value = getTotalTimeForSession()
}

const completeSession = () => {
  pauseTimer()
  
  if (sessionType.value === 'work') {
    completedSessions.value++
    
    // Auto-switch to break after work session
    if (completedSessions.value % 4 === 0) {
      setSessionType('longBreak')
    } else {
      setSessionType('shortBreak')
    }
  } else {
    // Auto-switch back to work after break
    setSessionType('work')
  }
  
  // Show notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Time\'s up!', {
      body: `${currentSessionType.value} completed!`,
      icon: '/vite.svg'
    })
  }
  
  // Play completion sound
  playCompletionSound()
}

const playCompletionSound = () => {
  // Create a simple beep sound using Web Audio API
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  oscillator.frequency.value = 800
  oscillator.type = 'sine'
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.5)
}

// Sound functions
const toggleSound = (soundType: string) => {
  if (activeSound.value === soundType) {
    stopAllSounds()
  } else {
    stopAllSounds()
    playSound(soundType)
  }
}

const playSound = (soundType: string) => {
  const audioFile = soundType === 'rain' ? rainSound : campfireSound
  const audio = new Audio(audioFile)
  audio.loop = true
  audio.volume = volume.value
  
  if (soundType === 'rain') {
    rainAudio.value = audio
  } else {
    campfireAudio.value = audio
  }
  
  audio.play().catch(console.error)
  activeSound.value = soundType
}

const stopAllSounds = () => {
  if (rainAudio.value) {
    rainAudio.value.pause()
    rainAudio.value.currentTime = 0
  }
  if (campfireAudio.value) {
    campfireAudio.value.pause()
    campfireAudio.value.currentTime = 0
  }
  activeSound.value = null
}

const updateVolume = () => {
  if (rainAudio.value) {
    rainAudio.value.volume = volume.value
  }
  if (campfireAudio.value) {
    campfireAudio.value.volume = volume.value
  }
}

const formatTotalTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

// Lifecycle
onMounted(() => {
  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
  
  // Initialize timer
  timeLeft.value = getTotalTimeForSession()
})

onUnmounted(() => {
  pauseTimer()
  stopAllSounds()
})
</script>

<style scoped>
.pomodoro-timer {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.timer-container {
  background: linear-gradient(135deg, var(--accent-color) 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
}

.timer-display {
  margin-bottom: 2rem;
}

.time-circle {
  position: relative;
  display: inline-block;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-circle {
  transition: stroke-dashoffset 0.5s ease-in-out;
}

.progress-ring-fill {
  stroke-linecap: round;
}

.time-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
}

.time {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.session-type {
  font-size: 1.2rem;
  opacity: 0.9;
}

.controls {
  margin-bottom: 2rem;
}

.timer-btn, .reset-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 1rem 2rem;
  margin: 0 0.5rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.timer-btn:hover, .reset-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.timer-btn.active {
  background: #ff6b6b;
  border-color: #ff6b6b;
}

.session-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.session-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.session-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.session-btn.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.sound-controls {
  background: var(--bg-secondary);
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
}

.sound-controls h3 {
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.sound-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.sound-btn {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  padding: 1rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.sound-btn:hover {
  border-color: var(--accent-color);
  transform: translateY(-2px);
}

.sound-btn.active {
  background: var(--accent-color);
  color: white;
  border-color: var(--accent-color);
}

.volume-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.volume-control label {
  color: var(--text-primary);
  font-weight: 500;
}

.volume-control input[type="range"] {
  width: 200px;
  height: 6px;
  border-radius: 3px;
  background: var(--bg-hover);
  outline: none;
  -webkit-appearance: none;
}

.volume-control input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--accent-color);
  cursor: pointer;
}

.stats {
  display: flex;
  justify-content: space-around;
  background: var(--bg-secondary);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.stat {
  text-align: center;
}

.stat-label {
  display: block;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  display: block;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .pomodoro-timer {
    padding: 1rem;
  }
  
  .timer-container {
    padding: 1.5rem;
  }
  
  .time {
    font-size: 2.5rem;
  }
  
  .session-controls {
    flex-direction: column;
    align-items: center;
  }
  
  .sound-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .stats {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
