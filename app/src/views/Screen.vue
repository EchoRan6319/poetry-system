<template>
  <div class="min-h-screen overflow-hidden bg-paper grid-bg">
    <header class="fixed left-0 right-0 top-0 z-50 px-12 py-6">
      <div class="flex items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="brand-seal flex h-16 w-16 items-center justify-center rounded-full">
            <span class="text-3xl">诗</span>
          </div>
          <div>
            <h1 class="text-4xl font-bold text-gold-gradient text-shadow-lg">传承经典</h1>
            <p class="text-lg tracking-widest text-cyan-gradient">诗词大赛</p>
          </div>
        </div>



        <div class="glass-card min-w-[220px] px-8 py-4 text-center">
          <div class="mb-1 text-sm text-ink-soft">剩余时间</div>
          <div class="data-number text-5xl font-bold transition-colors" :class="timerClass">
            {{ formatTime(timer.remaining) }}
          </div>
        </div>
      </div>
    </header>

    <main class="flex min-h-screen flex-col justify-center px-4 pb-24 pt-28">
      <div class="flex flex-1 items-center justify-center">
        <div v-if="!currentQuestion" class="text-center">
          <div class="mb-8 text-8xl text-gold">待命</div>
          <h2 class="mb-4 text-5xl font-bold text-ink-strong">等待比赛开始</h2>
          <p class="text-2xl text-ink-soft">请使用导播控制台同步题目</p>
        </div>

        <div v-else class="w-full max-w-[90vw]">
          <div class="mb-6 text-center">
            <div class="glass-card inline-flex flex-col items-center gap-1 px-6 py-3">
              <span class="text-xl font-semibold text-green">{{ currentStage || '准备就绪' }}</span>
              <span class="text-base text-ink-soft">{{ currentQuestion.rule }}</span>
            </div>
          </div>

          <div class="glass-card mb-6 p-6 md:p-10">
            <div v-if="currentQuestion.stage === 'Emoji 猜诗'" class="text-center">
              <div class="font-emoji text-[clamp(3rem,10vw,8rem)] leading-tight tracking-wider">
                {{ currentQuestion.question }}
              </div>
            </div>

            <div v-else-if="currentQuestion.stage === '宫格寻诗'" class="text-center">
              <div class="mx-auto grid w-fit grid-cols-5 gap-3 md:gap-4">
                <div
                  v-for="(char, index) in gridChars"
                  :key="`${char}-${index}`"
                  class="glass-card flex h-16 w-16 md:h-20 md:w-20 items-center justify-center border-2 border-gold/25 text-4xl md:text-5xl text-ink-strong transition-colors hover:border-green/40"
                >
                  {{ char }}
                </div>
              </div>
            </div>

            <div v-else-if="currentQuestion.stage === '易错找茬'" class="text-center">
              <div class="text-[clamp(2rem,5vw,4rem)] leading-relaxed text-ink-strong">
                {{ currentQuestion.question }}
              </div>
              <div class="mt-8 text-2xl text-green">请找出其中的错别字</div>
            </div>

            <div v-else-if="currentQuestion.stage === '中原风华'" class="text-center">
              <div class="text-[clamp(1.5rem,4vw,3rem)] leading-relaxed text-ink-strong">
                {{ currentQuestion.question }}
              </div>
            </div>

            <div v-else-if="currentQuestion.stage === '经典填词'" class="text-center">
              <div class="text-[clamp(2rem,5vw,4rem)] leading-relaxed tracking-widest text-ink-strong">
                {{ currentQuestion.question }}
              </div>
            </div>

            <div v-else-if="currentQuestion.stage === '主题飞花令'" class="text-center">
              <div class="mb-8 text-4xl text-green">主题</div>
              <div class="text-[clamp(4rem,12vw,8rem)] font-bold text-gold-gradient">
                {{ currentQuestion.question }}
              </div>
            </div>

            <div v-else class="text-center">
              <div class="text-[clamp(2rem,5vw,4rem)] leading-relaxed text-ink-strong">
                {{ currentQuestion.question }}
              </div>
            </div>
          </div>

          <div v-if="isAnswerRevealed" class="glass-card border-gold/30 bg-gold/10 p-6">
            <div class="text-center">
              <div class="mb-2 text-sm text-gold">正确答案</div>
              <div class="text-[clamp(2rem,5vw,3rem)] text-gold-gradient">
                {{ currentQuestion.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="fixed bottom-0 left-0 right-0 px-4 py-3">
      <div class="glass-card px-4 py-3">
        <div
          ref="teamScrollRef"
          class="no-scrollbar flex items-center justify-between gap-2 overflow-x-auto"
          @wheel.prevent="handleTeamScroll"
        >
          <div
            v-for="team in teams"
            :key="team.id"
            class="min-w-fit rounded-lg bg-paper-soft/70 px-3 py-2"
          >
            <div class="flex items-center gap-2">
              <div class="whitespace-nowrap text-sm text-ink-soft">{{ team.name }}</div>
              <div class="data-number text-2xl font-bold text-green">{{ team.score }}</div>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- 隐蔽的版权声明：右侧边缘垂直排版，极低透明度，悬浮显示 -->
    <div 
      class="fixed right-3 top-1/2 -translate-y-1/2 z-0 select-none cursor-default font-serif text-[11px] tracking-[0.4em] text-ink-soft/15 transition-all duration-1000 hover:text-ink-soft/80"
      style="writing-mode: vertical-rl; text-orientation: mixed;"
    >
      Copyright © 2026 申浩然 保留所有权利
    </div>

    <div class="fixed right-6 top-6 z-50">
      <div class="h-3 w-3 rounded-full" :class="isConnected ? 'bg-green animate-breathe' : 'bg-gold'"></div>
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
const teamScrollRef = ref(null)
const isAtBottom = ref(false)
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

const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = document.documentElement.clientHeight
  isAtBottom.value = scrollTop + clientHeight >= scrollHeight - 10
}

const getDefaultTimer = (seconds = 0) => ({
  isRunning: false,
  remaining: seconds,
  total: seconds,
  endAt: null
})

const timerClass = computed(() => {
  if (!timer.value.isRunning) return 'text-ink-soft'
  if (timer.value.remaining <= 5) return 'text-red animate-breathe'
  if (timer.value.remaining <= 10) return 'text-gold'
  return 'text-green'
})

const gridChars = computed(() => {
  if (!currentQuestion.value || currentQuestion.value.stage !== '宫格寻诗') {
    return []
  }

  const text = currentQuestion.value.question || ''
  const chars = text.includes(' ')
    ? text.split(' ').filter((item) => item.trim())
    : text.split('')

  const answerText = currentQuestion.value.answer || ''
  const answerChars = answerText.replace(/[，。\/]/g, '').replace(/\s/g, '').split('')

  const fixedGridSize = 15
  const allChars = chars.slice(0, fixedGridSize)

  // Separate answer chars and distractor chars
  const answerSet = new Set(answerChars)
  const answerPool = allChars.filter((c) => answerSet.has(c))
  const distractorPool = allChars.filter((c) => !answerSet.has(c))

  // Shuffle both pools
  const shuffledAnswers = [...answerPool].sort(() => Math.random() - 0.5)
  const shuffledDistractors = [...distractorPool].sort(() => Math.random() - 0.5)

  // Distribute answer chars evenly across 15 positions
  const result = Array(fixedGridSize).fill(null)
  const answerPositions = []

  // Calculate evenly spaced positions for answer chars
  const total = fixedGridSize
  const count = shuffledAnswers.length
  for (let i = 0; i < count; i++) {
    const pos = Math.round((i * (total - 1)) / (count - 1))
    answerPositions.push(pos)
  }

  // Fill answer chars at calculated positions
  for (let i = 0; i < shuffledAnswers.length; i++) {
    result[answerPositions[i]] = shuffledAnswers[i]
  }

  // Fill distractor chars in remaining positions
  let distractorIndex = 0
  for (let i = 0; i < fixedGridSize; i++) {
    if (result[i] === null && distractorIndex < shuffledDistractors.length) {
      result[i] = shuffledDistractors[distractorIndex++]
    }
  }

  return result
})

const formatTime = (seconds) => {
  const safeSeconds = Math.max(0, Number(seconds) || 0)
  const mins = Math.floor(safeSeconds / 60)
  const secs = safeSeconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const handleTeamScroll = (event) => {
  if (!teamScrollRef.value) {
    return
  }

  const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX
  teamScrollRef.value.scrollLeft += delta
}

const saveState = () => {
  storage.saveScreen({
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
  applyState(storage.loadScreen())
}

const handleStorageSync = (event) => {
  if (event.key !== storage.SCREEN_STORAGE_KEY) {
    return
  }

  applyState(storage.loadScreen())
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
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  stopLocalTimer()
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval)
  }
  unsubscribeList.forEach((unsubscribe) => unsubscribe())
  poetryChannel.close()
  window.removeEventListener('storage', handleStorageSync)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.font-emoji {
  font-family: "Noto Color Emoji", sans-serif;
}
</style>
