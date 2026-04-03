<template>
  <div class="min-h-screen bg-zinc-900 grid-bg p-6">
    <header class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gold-gradient">传承经典 · 导播控制台</h1>
          <p class="mt-1 text-zinc-400">诗词大赛双屏互动系统 - 管理端</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="glass-card flex items-center gap-2 px-4 py-2">
            <div class="h-2 w-2 rounded-full" :class="isConnected ? 'bg-green-500' : 'bg-yellow-500'"></div>
            <span class="text-sm text-zinc-300">{{ isConnected ? 'BroadcastChannel 正常' : '已切换本地兜底同步' }}</span>
          </div>
          <button @click="openScreenWindow" class="btn-primary text-sm">
            打开大屏端
          </button>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-4 space-y-4">
        <div class="glass-card p-4">
          <h2 class="mb-4 text-lg font-semibold text-cyan-400">题目列表</h2>
          <div class="max-h-[400px] space-y-2 overflow-y-auto">
            <div
              v-for="(question, index) in questions"
              :key="question.id"
              class="cursor-pointer rounded-lg p-3 transition-all"
              :class="currentQuestion?.id === question.id ? 'border border-cyan-500/50 bg-cyan-500/20' : 'bg-zinc-800/50 hover:bg-zinc-800'"
              @click="selectQuestion(question)"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-zinc-200">{{ index + 1 }}. {{ question.stage }}</span>
                <span class="text-xs text-zinc-500">{{ question.time_limit }}s</span>
              </div>
              <p class="mt-1 truncate text-xs text-zinc-400">{{ question.question }}</p>
            </div>
          </div>
        </div>

        <div v-if="currentQuestion" class="glass-card p-4">
          <h2 class="mb-4 text-lg font-semibold text-cyan-400">当前题目</h2>
          <div class="space-y-3">
            <div>
              <label class="text-xs text-zinc-500">题型</label>
              <p class="text-sm text-zinc-200">{{ currentQuestion.stage }}</p>
            </div>
            <div>
              <label class="text-xs text-zinc-500">规则说明</label>
              <p class="text-sm text-zinc-200">{{ currentQuestion.rule }}</p>
            </div>
            <div>
              <label class="text-xs text-zinc-500">题目内容</label>
              <p class="font-emoji text-sm text-zinc-200">{{ currentQuestion.question }}</p>
            </div>
            <div>
              <label class="text-xs text-zinc-500">标准答案</label>
              <p class="text-sm text-gold-gradient">{{ currentQuestion.answer }}</p>
            </div>
            <div class="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
              <label class="text-xs text-yellow-500">主持人提示</label>
              <p class="text-sm text-yellow-200">{{ currentQuestion.key_point }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-5 space-y-4">
        <div class="glass-card p-6">
          <h2 class="mb-6 text-lg font-semibold text-cyan-400">控制面板</h2>

          <div class="mb-6">
            <h3 class="mb-3 text-sm font-medium text-zinc-400">题目控制</h3>
            <div class="flex gap-3">
              <button
                @click="syncToScreen"
                :disabled="!currentQuestion"
                class="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                同步到大屏
              </button>
              <button
                @click="nextQuestion"
                :disabled="!canNextQuestion"
                class="btn-gold flex-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                下一题
              </button>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="mb-3 text-sm font-medium text-zinc-400">倒计时控制</h3>
            <div class="mb-3 flex gap-3">
              <button
                @click="startTimer"
                :disabled="timer.isRunning || !currentQuestion"
                class="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                开始倒计时
              </button>
              <button
                @click="stopTimer"
                :disabled="!timer.isRunning"
                class="btn-danger flex-1 disabled:cursor-not-allowed disabled:opacity-50"
              >
                停止
              </button>
            </div>
            <div class="glass-card p-4 text-center">
              <span class="font-mono text-4xl font-bold" :class="timer.isRunning ? 'text-cyan-400' : 'text-zinc-500'">
                {{ formatTime(timer.remaining) }}
              </span>
            </div>
          </div>

          <div class="mb-6">
            <h3 class="mb-3 text-sm font-medium text-zinc-400">答案控制</h3>
            <button
              @click="revealAnswer"
              :disabled="!currentQuestion || isAnswerRevealed"
              class="btn-gold w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              揭晓答案
            </button>
          </div>

          <div>
            <h3 class="mb-3 text-sm font-medium text-zinc-400">系统控制</h3>
            <div class="flex gap-3">
              <button @click="resetScores" class="flex-1 rounded-lg bg-zinc-700 px-4 py-2 text-sm transition-colors hover:bg-zinc-600">
                重置分数
              </button>
              <button @click="resetGame" class="flex-1 rounded-lg bg-red-900/70 px-4 py-2 text-sm transition-colors hover:bg-red-800">
                重置比赛
              </button>
              <button @click="clearStorage" class="flex-1 rounded-lg bg-zinc-700 px-4 py-2 text-sm transition-colors hover:bg-zinc-600">
                清除缓存
              </button>
            </div>
          </div>
        </div>

        <div class="glass-card p-6">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-cyan-400">队伍管理</h2>
            <div class="flex gap-2">
              <button
                @click="addTeam"
                :disabled="teams.length >= 12"
                class="rounded bg-green-600 px-3 py-1 text-sm transition-colors hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                + 添加
              </button>
              <button
                @click="removeTeam"
                :disabled="teams.length <= 2"
                class="rounded bg-red-600 px-3 py-1 text-sm transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                - 减少
              </button>
            </div>
          </div>

          <div class="max-h-[400px] space-y-3 overflow-y-auto">
            <div v-for="(team, index) in teams" :key="team.id" class="glass-card p-3">
              <div class="flex items-center gap-3">
                <span class="w-8 text-zinc-500">{{ index + 1 }}.</span>
                <span class="flex-1 text-sm text-zinc-200">{{ team.name }}</span>
                <div class="flex gap-2">
                  <button
                    @click="updateScore(team.id, -10)"
                    class="h-8 w-10 rounded bg-red-500/20 text-red-400 transition-colors hover:bg-red-500/30"
                  >
                    -10
                  </button>
                  <span class="w-12 text-center text-xl font-bold text-gold-gradient">{{ team.score }}</span>
                  <button
                    @click="updateScore(team.id, 10)"
                    class="h-8 w-10 rounded bg-green-500/20 text-green-400 transition-colors hover:bg-green-500/30"
                  >
                    +10
                  </button>
                  <button
                    @click="updateScore(team.id, 20)"
                    class="h-8 w-10 rounded bg-yellow-500/20 text-yellow-400 transition-colors hover:bg-yellow-500/30"
                  >
                    +20
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-3 space-y-4">
        <div class="glass-card p-4">
          <h2 class="mb-4 text-lg font-semibold text-cyan-400">实时计分</h2>
          <div class="max-h-[300px] space-y-3 overflow-y-auto">
            <div v-for="team in teams" :key="team.id" class="glass-card p-3">
              <div class="flex items-center justify-between">
                <span class="font-medium text-zinc-200">{{ team.name }}</span>
                <span class="text-2xl font-bold text-gold-gradient">{{ team.score }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-card p-4">
          <h2 class="mb-4 text-lg font-semibold text-cyan-400">状态信息</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-zinc-500">当前阶段</span>
              <span class="text-zinc-200">{{ currentStage || '未开始' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-zinc-500">题目进度</span>
              <span class="text-zinc-200">{{ displayQuestionProgress }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-zinc-500">答案状态</span>
              <span :class="isAnswerRevealed ? 'text-green-400' : 'text-yellow-400'">
                {{ isAnswerRevealed ? '已揭晓' : '未揭晓' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-zinc-500">队伍数量</span>
              <span class="text-zinc-200">{{ teams.length }} 支</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="fixed bottom-4 right-4 text-xs text-zinc-600">
      Powered by College of Information Engineering and Big Data
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { COMMANDS, poetryChannel } from '../utils/channel.js'
import { storage } from '../utils/storage.js'

const isConnected = ref(false)
const questions = ref([])
const currentQuestion = ref(null)
const currentQuestionIndex = ref(-1)
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
let unsubscribeList = []

const getDefaultTimer = (seconds = 0) => ({
  isRunning: false,
  remaining: seconds,
  total: seconds,
  endAt: null
})

const canNextQuestion = computed(() => {
  return isAnswerRevealed.value && currentQuestionIndex.value < questions.value.length - 1
})

const displayQuestionProgress = computed(() => {
  if (currentQuestionIndex.value < 0) {
    return `0 / ${questions.value.length}`
  }

  return `${currentQuestionIndex.value + 1} / ${questions.value.length}`
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
    currentQuestionIndex: currentQuestionIndex.value,
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
  if (!timer.value.endAt) return
  timer.value.remaining = Math.max(0, Math.ceil((timer.value.endAt - Date.now()) / 1000))
}

const startLocalTimer = () => {
  stopLocalTimer()

  if (!timer.value.isRunning || !timer.value.endAt) {
    return
  }

  syncTimerFromEndAt()

  timerInterval = setInterval(() => {
    syncTimerFromEndAt()
    if (timer.value.remaining <= 0) {
      stopTimer(false)
      return
    }
    saveState()
  }, 1000)
}

const applyState = (state) => {
  currentQuestion.value = state.currentQuestion || null
  currentQuestionIndex.value = Number.isInteger(state.currentQuestionIndex) ? state.currentQuestionIndex : -1
  currentStage.value = state.currentStage || ''
  teams.value = state.teams && state.teams.length > 0 ? state.teams : storage.getDefaultTeams()
  timer.value = state.timer || getDefaultTimer()
  isAnswerRevealed.value = Boolean(state.isAnswerRevealed)
  startLocalTimer()
}

const loadQuestions = async () => {
  const response = await fetch('/questions.json')
  if (!response.ok) {
    throw new Error(`Failed to load questions: ${response.status}`)
  }

  const data = await response.json()
  if (!Array.isArray(data)) {
    throw new Error('Question data must be an array')
  }

  questions.value = data.filter((item) => item && item.id && item.stage && item.question && item.answer)
}

const selectQuestion = (question) => {
  currentQuestion.value = question
  currentQuestionIndex.value = questions.value.findIndex((item) => item.id === question.id)
  currentStage.value = question.stage
  isAnswerRevealed.value = false
  timer.value = getDefaultTimer(Number(question.time_limit) || 0)
  saveState()
}

const syncToScreen = () => {
  if (!currentQuestion.value) return

  poetryChannel.syncQuestion({
    ...currentQuestion.value,
    index: currentQuestionIndex.value
  })
  poetryChannel.changeStage(currentQuestion.value.stage)
  poetryChannel.updateTeams([...teams.value])
  saveState()
}

const startTimer = () => {
  if (!currentQuestion.value || timer.value.isRunning || timer.value.remaining <= 0) return

  timer.value.isRunning = true
  timer.value.endAt = Date.now() + timer.value.remaining * 1000
  poetryChannel.startTimer(timer.value.remaining, timer.value.endAt)
  startLocalTimer()
  saveState()
}

const stopTimer = (shouldBroadcast = true) => {
  if (timer.value.endAt) {
    syncTimerFromEndAt()
  }

  timer.value.isRunning = false
  timer.value.endAt = null
  stopLocalTimer()

  if (shouldBroadcast) {
    poetryChannel.stopTimer()
  }

  saveState()
}

const revealAnswer = () => {
  if (!currentQuestion.value) return
  isAnswerRevealed.value = true
  poetryChannel.revealAnswer()
  saveState()
}

const nextQuestion = () => {
  if (!canNextQuestion.value) return

  stopTimer()
  const next = questions.value[currentQuestionIndex.value + 1]
  if (!next) return

  selectQuestion(next)
  syncToScreen()
}

const updateScore = (teamId, delta) => {
  const team = teams.value.find((item) => item.id === teamId)
  if (!team) return

  team.score = Math.max(0, team.score + delta)
  poetryChannel.updateScore(teamId, team.score)
  saveState()
}

const addTeam = () => {
  if (teams.value.length >= 12) return

  const nextIndex = teams.value.length + 1
  teams.value.push({
    id: `team${nextIndex}`,
    name: `队伍${nextIndex}`,
    score: 0
  })

  poetryChannel.updateTeams([...teams.value])
  saveState()
}

const removeTeam = () => {
  if (teams.value.length <= 2) return
  teams.value.pop()
  poetryChannel.updateTeams([...teams.value])
  saveState()
}

const resetScores = () => {
  teams.value = teams.value.map((team) => ({
    ...team,
    score: 0
  }))
  poetryChannel.resetScores()
  saveState()
}

const resetGame = () => {
  stopTimer(false)
  currentQuestion.value = null
  currentQuestionIndex.value = -1
  currentStage.value = ''
  isAnswerRevealed.value = false
  timer.value = getDefaultTimer()
  teams.value = teams.value.map((team) => ({
    ...team,
    score: 0
  }))
  poetryChannel.resetGame()
  saveState()
}

const clearStorage = () => {
  storage.clear()
  location.reload()
}

const restoreState = () => {
  applyState(storage.load())
}

const openScreenWindow = () => {
  window.open('/screen', 'screen', 'width=1920,height=1080,fullscreen=yes')
}

const handleKeydown = (event) => {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    return
  }

  switch (event.key) {
    case ' ':
      event.preventDefault()
      if (timer.value.isRunning) {
        stopTimer()
      } else {
        startTimer()
      }
      break
    case 'Enter':
      if (!isAnswerRevealed.value && currentQuestion.value) {
        revealAnswer()
      }
      break
    case 'ArrowRight':
      if (canNextQuestion.value) {
        nextQuestion()
      }
      break
    case 's':
    case 'S':
      event.preventDefault()
      syncToScreen()
      break
    default:
      break
  }
}

onMounted(async () => {
  isConnected.value = poetryChannel.init()

  try {
    await loadQuestions()
  } catch (error) {
    console.error(error)
    questions.value = []
  }

  restoreState()

  unsubscribeList = [
    poetryChannel.on(COMMANDS.HEARTBEAT, () => {
      isConnected.value = true
    })
  ]

  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  stopLocalTimer()
  unsubscribeList.forEach((unsubscribe) => unsubscribe())
  poetryChannel.close()
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.font-emoji {
  font-family: 'Noto Color Emoji', sans-serif;
}
</style>
