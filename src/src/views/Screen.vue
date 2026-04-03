<template>
  <div class="min-h-screen overflow-hidden bg-zinc-900 grid-bg">
    <header class="fixed left-0 right-0 top-0 z-50 px-12 py-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
            <span class="text-3xl">诗</span>
          </div>
          <div>
            <h1 class="text-4xl font-bold text-gold-gradient text-shadow-lg">传承经典</h1>
            <p class="text-lg tracking-widest text-cyan-400">诗词大赛</p>
          </div>
        </div>

        <div class="glass-card px-12 py-4">
          <span class="text-2xl font-semibold text-cyan-300">{{ currentStage || '准备就绪' }}</span>
        </div>

        <div class="glass-card min-w-[200px] px-8 py-4 text-center">
          <div class="mb-1 text-sm text-zinc-400">剩余时间</div>
          <div class="font-mono text-5xl font-bold transition-colors" :class="timerClass">
            {{ formatTime(timer.remaining) }}
          </div>
        </div>
      </div>
    </header>

    <main class="flex min-h-screen flex-col justify-center px-12 pb-32 pt-40">
      <div class="flex flex-1 items-center justify-center">
        <div v-if="!currentQuestion" class="text-center">
          <div class="mb-8 text-8xl">待命</div>
          <h2 class="mb-4 text-5xl font-bold text-zinc-300">等待比赛开始</h2>
          <p class="text-2xl text-zinc-500">请使用导播控制台同步题目</p>
        </div>

        <div v-else class="w-full max-w-6xl">
          <div class="mb-12 text-center">
            <span class="glass-card inline-block px-8 py-3 text-xl text-cyan-300">
              {{ currentQuestion.rule }}
            </span>
          </div>

          <div class="glass-card mb-12 p-16">
            <div v-if="currentQuestion.stage === 'Emoji 猜诗'" class="text-center">
              <div class="font-emoji text-[120px] leading-tight tracking-wider">
                {{ currentQuestion.question }}
              </div>
            </div>

            <div v-else-if="currentQuestion.stage === '宫格寻诗'" class="text-center">
              <div class="mx-auto grid max-w-5xl grid-cols-6 gap-4">
                <div
                  v-for="(char, index) in gridChars"
                  :key="`${char}-${index}`"
                  class="glass-card flex h-20 w-20 items-center justify-center border-2 border-cyan-500/30 text-5xl text-zinc-200 transition-colors hover:border-cyan-400/60"
                >
                  {{ char }}
                </div>
              </div>
            </div>

            <div v-else-if="currentQuestion.stage === '易错找茬'" class="text-center">
              <div class="text-6xl leading-relaxed text-zinc-200">
                {{ currentQuestion.question }}
              </div>
              <div class="mt-8 text-2xl text-cyan-400">请找出其中的错别字</div>
            </div>

            <div v-else-if="currentQuestion.stage === '中原风华'" class="text-center">
              <div class="text-5xl leading-relaxed text-zinc-200">
                {{ currentQuestion.question }}
              </div>
            </div>

            <div v-else-if="currentQuestion.stage === '经典填词'" class="text-center">
              <div class="text-6xl leading-relaxed tracking-widest text-zinc-200">
                {{ currentQuestion.question }}
              </div>
            </div>

            <div v-else-if="currentQuestion.stage === '主题飞花令'" class="text-center">
              <div class="mb-8 text-4xl text-cyan-400">主题</div>
              <div class="text-8xl font-bold text-gold-gradient">
                {{ currentQuestion.question }}
              </div>
            </div>

            <div v-else class="text-center">
              <div class="text-6xl leading-relaxed text-zinc-200">
                {{ currentQuestion.question }}
              </div>
            </div>
          </div>

          <div v-if="isAnswerRevealed" class="glass-card border-yellow-500/30 bg-yellow-500/5 p-8">
            <div class="text-center">
              <div class="mb-2 text-sm text-yellow-500">正确答案</div>
              <div class="text-5xl text-gold-gradient">
                {{ currentQuestion.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="fixed bottom-0 left-0 right-0 px-4 py-3">
      <div class="glass-card px-4 py-3">
        <div class="flex items-center justify-between gap-2 overflow-x-auto">
          <div
            v-for="team in teams"
            :key="team.id"
            class="min-w-fit rounded-lg bg-zinc-800/50 px-3 py-2"
          >
            <div class="flex items-center gap-2">
              <div class="whitespace-nowrap text-sm text-zinc-400">{{ team.name }}</div>
              <div class="text-2xl font-bold text-cyan-400">{{ team.score }}</div>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <div class="fixed bottom-4 right-4 z-50 text-sm text-zinc-600">
      Powered by College of Information Engineering and Big Data
    </div>

    <div class="fixed right-6 top-6 z-50">
      <div class="h-3 w-3 rounded-full" :class="isConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { COMMANDS, poetryChannel } from '../utils/channel.js'
import { storage } from '../utils/storage.js'

const isConnected = ref(false)
const currentQuestion = ref(null)
const currentStage = ref('')
const isAnswerRevealed = ref(false)
const timer = ref({
  isRunning: false,
  remaining: 0,
  total: 0,
  endAt: null
})
const teams = ref([])

let timerInterval = null
let heartbeatInterval = null
let unsubscribeList = []

const getDefaultTimer = (seconds = 0) => ({
  isRunning: false,
  remaining: seconds,
  total: seconds,
  endAt: null
})

const timerClass = computed(() => {
  if (!timer.value.isRunning) return 'text-zinc-500'
  if (timer.value.remaining <= 5) return 'text-red-500 animate-pulse'
  if (timer.value.remaining <= 10) return 'text-yellow-400'
  return 'text-cyan-400'
})

const gridChars = computed(() => {
  if (!currentQuestion.value || currentQuestion.value.stage !== '宫格寻诗') {
    return []
  }

  const text = currentQuestion.value.question || ''
  const chars = text.includes(' ')
    ? text.split(' ').filter((item) => item.trim())
    : text.split('')

  return [...chars].sort(() => Math.random() - 0.5)
})

const formatTime = (seconds) => {
  const safeSeconds = Math.max(0, Number(seconds) || 0)
  const mins = Math.floor(safeSeconds / 60)
  const secs = safeSeconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const saveState = () => {
  storage.save({
    currentQuestion: currentQuestion.value,
    currentStage: currentStage.value,
    teams: teams.value,
    timer: timer.value,
    isAnswerRevealed: isAnswerRevealed.value
  })
}

const stopLocalTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

const syncTimerFromEndAt = () => {
  if (!timer.value.endAt) {
    return
  }

  timer.value.remaining = Math.max(0, Math.ceil((timer.value.endAt - Date.now()) / 1000))
}

const startCountdown = (seconds, endAt = Date.now() + seconds * 1000) => {
  stopCountdown()

  timer.value = {
    isRunning: true,
    remaining: Math.max(0, Number(seconds) || 0),
    total: Math.max(0, Number(seconds) || 0),
    endAt
  }

  syncTimerFromEndAt()

  timerInterval = setInterval(() => {
    syncTimerFromEndAt()
    if (timer.value.remaining <= 0) {
      stopCountdown()
      saveState()
    }
  }, 1000)
}

const stopCountdown = () => {
  if (timer.value.endAt) {
    syncTimerFromEndAt()
  }

  timer.value.isRunning = false
  timer.value.endAt = null
  stopLocalTimer()
}

const applyState = (state) => {
  currentQuestion.value = state.currentQuestion || null
  currentStage.value = state.currentStage || ''
  isAnswerRevealed.value = Boolean(state.isAnswerRevealed)
  timer.value = state.timer || getDefaultTimer()
  teams.value = state.teams && state.teams.length > 0 ? [...state.teams] : storage.getDefaultTeams()

  stopLocalTimer()
  if (timer.value.isRunning && timer.value.remaining > 0 && timer.value.endAt) {
    startCountdown(timer.value.remaining, timer.value.endAt)
  }
}

const restoreState = () => {
  applyState(storage.load())
}

const handleStorageSync = (event) => {
  if (event.key !== 'poetry-competition-state') {
    return
  }

  applyState(storage.load())
}

onMounted(() => {
  isConnected.value = poetryChannel.init()
  restoreState()

  unsubscribeList = [
    poetryChannel.on(COMMANDS.SYNC_QUESTION, (data) => {
      currentQuestion.value = data
      currentStage.value = data.stage || currentStage.value
      isAnswerRevealed.value = false
      stopCountdown()
      timer.value = getDefaultTimer(Number(data.time_limit) || 0)
      saveState()
    }),
    poetryChannel.on(COMMANDS.START_TIMER, (data) => {
      const seconds = Number(data.seconds) || 0
      startCountdown(seconds, data.endAt || Date.now() + seconds * 1000)
      saveState()
    }),
    poetryChannel.on(COMMANDS.STOP_TIMER, () => {
      stopCountdown()
      saveState()
    }),
    poetryChannel.on(COMMANDS.REVEAL_ANSWER, () => {
      isAnswerRevealed.value = true
      saveState()
    }),
    poetryChannel.on(COMMANDS.CHANGE_STAGE, (data) => {
      currentStage.value = data.stage
      saveState()
    }),
    poetryChannel.on(COMMANDS.UPDATE_SCORE, (data) => {
      const team = teams.value.find((item) => item.id === data.teamId)
      if (!team) return
      team.score = data.score
      saveState()
    }),
    poetryChannel.on(COMMANDS.UPDATE_TEAMS, (data) => {
      teams.value = [...data.teams]
      saveState()
    }),
    poetryChannel.on(COMMANDS.RESET_SCORES, () => {
      teams.value = teams.value.map((team) => ({
        ...team,
        score: 0
      }))
      saveState()
    }),
    poetryChannel.on(COMMANDS.RESET_GAME, () => {
      currentQuestion.value = null
      currentStage.value = ''
      isAnswerRevealed.value = false
      stopCountdown()
      timer.value = getDefaultTimer()
      teams.value = teams.value.map((team) => ({
        ...team,
        score: 0
      }))
      saveState()
    })
  ]

  heartbeatInterval = setInterval(() => {
    poetryChannel.send(COMMANDS.HEARTBEAT)
  }, 5000)

  window.addEventListener('storage', handleStorageSync)
})

onUnmounted(() => {
  stopLocalTimer()
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval)
  }
  unsubscribeList.forEach((unsubscribe) => unsubscribe())
  poetryChannel.close()
  window.removeEventListener('storage', handleStorageSync)
})
</script>

<style scoped>
.font-emoji {
  font-family: 'Noto Color Emoji', sans-serif;
}
</style>
