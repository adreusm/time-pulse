<script setup lang="ts">
import PomodoroTimer from '../components/PomodoroTimer.vue'
import { useTheme } from '../composables/useTheme'

const { isDarkMode, toggleTheme } = useTheme()
</script>

<template>
  <div class="timer-view">
    <div class="header">
      <h1>Time Pulse</h1>
      <p class="subtitle">Focus with the power of Pomodoro</p>
      <div class="header-controls">
        <button @click="toggleTheme" class="theme-toggle">
          {{ isDarkMode ? '☀️' : '🌙' }}
        </button>
        <router-link to="/settings" class="settings-link">
          ⚙️ Settings
        </router-link>
      </div>
    </div>
    <PomodoroTimer />
  </div>
</template>

<style scoped>
.timer-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

h1 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 2.5rem;
  font-weight: 700;
}

.subtitle {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
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

.settings-link {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.settings-link:hover {
  background: var(--bg-hover);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .timer-view {
    padding: 1rem;
  }
  
  h1 {
    font-size: 2rem;
  }
  
}
</style>
