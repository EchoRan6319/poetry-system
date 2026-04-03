<template>
  <div class="min-h-screen bg-zinc-900 grid-bg p-6">
    <!-- 顶部标题栏 -->
    <header class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gold-gradient">传承经典 · 导播控制台</h1>
          <p class="text-zinc-400 mt-1">诗词大赛双屏互动系统 - 管理端</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="glass-card px-4 py-2 flex items-center gap-2">
            <div class="w-2 h-2 rounded-full" :class="isConnected ? 'bg-green-500' : 'bg-red-500'"></div>
            <span class="text-sm text-zinc-300">{{ isConnected ? '通讯正常' : '未连接' }}</span>
          </div>
          <button @click="openScreenWindow" class="btn-primary text-sm">
            打开大屏端
          </button>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-12 gap-6">
      <!-- 左侧：题目列表 -->
      <div class="col-span-4 space-y-4">
        <div class="glass-card p-4">
          <h2 class="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <span>📋</span> 题目列表
          </h2>
          <div class="space-y-2 max-h-[400px] overflow-y-auto">
            <div
              v-for="(q, index) in questions"
              :key="q.id"
              @click="selectQuestion(q)"
              class="p-3 rounded-lg cursor-pointer transition-all"
              :class="currentQuestion?.id === q.id ? 'bg-cyan-500/20 border border-cyan-500/50' : 'bg-zinc-800/50 hover:bg-zinc-800'"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-zinc-200">{{ index + 1 }}. {{ q.stage }}</span>
                <span class="text-xs text-zinc-500">{{ q.time_limit }}s</span>
              </div>
              <p class="text-xs text-zinc-400 mt-1 truncate">{{ q.question }}</p>
            </div>
          </div>
        </div>

        <!-- 当前题目信息 -->
        <div class="glass-card p-4" v-if="currentQuestion">
          <h2 class="text-lg font-semibold text-cyan-400 mb-4">当前题目</h2>
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
              <p class="text-sm text-zinc-200 font-emoji">{{ currentQuestion.question }}</p>
            </div>
            <div>
              <label class="text-xs text-zinc-500">标准答案</label>
              <p class="text-sm text-gold-gradient">{{ currentQuestion.answer }}</p>
            </div>
            <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
              <label class="text-xs text-yellow-500">主持人提示</label>
              <p class="text-sm text-yellow-200">{{ currentQuestion.key_point }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 中间：控制面板 -->
      <div class="col-span-5 space-y-4">
        <div class="glass-card p-6">
          <h2 class="text-lg font-semibold text-cyan-400 mb-6 flex items-center gap-2">
            <span>🎮</span> 控制面板
          </h2>
          
          <!-- 题目控制 -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-zinc-400 mb-3">题目控制</h3>
            <div class="flex gap-3">
              <button
                @click="syncToScreen"
                :disabled="!currentQuestion"
                class="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                同步到大屏
              </button>
              <button
                @click="nextQuestion"
                :disabled="!canNextQuestion"
                class="flex-1 btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一题
              </button>
            </div>
          </div>

          <!-- 倒计时控制 -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-zinc-400 mb-3">倒计时控制</h3>
            <div class="flex gap-3 mb-3">
              <button
                @click="startTimer"
                :disabled="timer.isRunning || !currentQuestion"
                class="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                开始倒计时
              </button>
              <button
                @click="stopTimer"
                :disabled="!timer.isRunning"
                class="flex-1 btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
              >
                停止
              </button>
            </div>
            <div class="glass-card p-4 text-center">
              <span class="text-4xl font-mono font-bold" :class="timer.isRunning ? 'text-cyan-400' : 'text-zinc-500'">
                {{ formatTime(timer.remaining) }}
              </span>
            </div>
          </div>

          <!-- 答案控制 -->
          <div class="mb-6">
            <h3 class="text-sm font-medium text-zinc-400 mb-3">答案控制</h3>
            <button
              @click="revealAnswer"
              :disabled="!currentQuestion || isAnswerRevealed"
              class="w-full btn-gold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              揭晓答案
            </button>
          </div>

          <!-- 系统控制 -->
          <div>
            <h3 class="text-sm font-medium text-zinc-400 mb-3">系统控制</h3>
            <div class="flex gap-3">
              <button @click="resetScores" class="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm transition-colors">
                重置分数
              </button>
              <button @click="clearStorage" class="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm transition-colors">
                清除缓存
              </button>
            </div>
          </div>
        </div>

        <!-- 队伍管理 -->
        <div class="glass-card p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-cyan-400 flex items-center gap-2">
              <span>👥</span> 队伍管理
            </h2>
            <div class="flex gap-2">
              <button
                @click="addTeam"
                :disabled="teams.length >= 10"
                class="px-3 py-1 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm transition-colors"
              >
                + 添加
              </button>
              <button
                @click="removeTeam"
                :disabled="teams.length <= 2"
                class="px-3 py-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm transition-colors"
              >
                - 减少
              </button>
            </div>
          </div>
          
          <div class="space-y-3 max-h-[400px] overflow-y-auto">
            <div
              v-for="(team, index) in teams"
              :key="team.id"
              class="glass-card p-3"
            >
              <div class="flex items-center gap-3">
                <span class="text-zinc-500 w-8">{{ index + 1 }}.</span>
                <span class="flex-1 text-zinc-200 text-sm">{{ team.name }}</span>
                <div class="flex gap-2">
                  <button
                    @click="updateScore(team.id, -10)"
                    class="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors"
                  >
                    -10
                  </button>
                  <span class="w-12 text-center text-xl font-bold text-gold-gradient">{{ team.score }}</span>
                  <button
                    @click="updateScore(team.id, 10)"
                    class="w-8 h-8 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded transition-colors"
                  >
                    +10
                  </button>
                  <button
                    @click="updateScore(team.id, 20)"
                    class="w-8 h-8 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded transition-colors"
                  >
                    +20
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：状态信息 -->
      <div class="col-span-3 space-y-4">
        <!-- 分数面板 -->
        <div class="glass-card p-4">
          <h2 class="text-lg font-semibold text-cyan-400 mb-4 flex items-center gap-2">
            <span>🏆</span> 实时计分
          </h2>
          <div class="space-y-3 max-h-[300px] overflow-y-auto">
            <div
              v-for="team in teams"
              :key="team.id"
              class="glass-card p-3"
            >
              <div class="flex items-center justify-between">
                <span class="font-medium text-zinc-200">{{ team.name }}</span>
                <span class="text-2xl font-bold text-gold-gradient">{{ team.score }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 状态信息 -->
        <div class="glass-card p-4">
          <h2 class="text-lg font-semibold text-cyan-400 mb-4">状态信息</h2>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-zinc-500">当前阶段</span>
              <span class="text-zinc-200">{{ currentStage || '未开始' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-zinc-500">题目进度</span>
              <span class="text-zinc-200">{{ currentQuestionIndex + 1 }} / {{ questions.length }}</span>
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

        <!-- 快捷键说明 -->
        <div class="glass-card p-4">
          <h2 class="text-lg font-semibold text-cyan-400 mb-4">快捷键</h2>
          <div class="space-y-2 text-sm text-zinc-400">
            <div class="flex justify-between">
              <span>空格</span>
              <span class="text-zinc-500">开始/停止倒计时</span>
            </div>
            <div class="flex justify-between">
              <span>Enter</span>
              <span class="text-zinc-500">揭晓答案</span>
            </div>
            <div class="flex justify-between">
              <span>→</span>
              <span class="text-zinc-500">下一题</span>
            </div>
            <div class="flex justify-between">
              <span>S</span>
              <span class="text-zinc-500">同步到大屏</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部水印 -->
    <footer class="fixed bottom-4 right-4 text-xs text-zinc-600">
      Powered by College of Information Engineering and Big Data
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { poetryChannel, COMMANDS } from '../utils/channel.js'
import { storage } from '../utils/storage.js'

// 状态
const isConnected = ref(false)
const questions = ref([])
const currentQuestion = ref(null)
const currentQuestionIndex = ref(-1)
const currentStage = ref('')
const isAnswerRevealed = ref(false)
const timer = ref({
  isRunning: false,
  remaining: 0,
  total: 0
})
const teams = ref([])

let timerInterval = null
let unsubscribeList = []

// 计算属性
const canNextQuestion = computed(() => {
  return isAnswerRevealed.value && currentQuestionIndex.value < questions.value.length - 1
})

// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 加载题库
const loadQuestions = async () => {
  try {
    const response = await fetch('/题库.json')
    questions.value = await response.json()
  } catch (error) {
    console.error('加载题库失败:', error)
    // 使用默认测试数据
    questions.value = [
      {
        id: '1',
        stage: 'Emoji猜诗',
        rule: '根据Emoji表情猜出对应的诗句，限时8秒',
        question: '☀️🌙🚶🚶',
        answer: '两个黄鹂鸣翠柳',
        key_point: '注意"鹂"字的读音',
        time_limit: 8
      },
      {
        id: '2',
        stage: '宫格寻诗',
        rule: '从宫格中找出正确的诗句',
        question: '春|风|又|绿|江|南|岸|明|月',
        answer: '春风又绿江南岸',
        key_point: '王安石《泊船瓜洲》名句',
        time_limit: 10
      }
    ]
  }
}

// 选择题目
const selectQuestion = (question) => {
  currentQuestion.value = question
  currentQuestionIndex.value = questions.value.findIndex(q => q.id === question.id)
  isAnswerRevealed.value = false
  timer.value = {
    isRunning: false,
    remaining: question.time_limit,
    total: question.time_limit
  }
  saveState()
}

// 同步到大屏
const syncToScreen = () => {
  if (!currentQuestion.value) return
  
  poetryChannel.syncQuestion({
    ...currentQuestion.value,
    index: currentQuestionIndex.value
  })
  
  currentStage.value = currentQuestion.value.stage
  poetryChannel.changeStage(currentQuestion.value.stage)
  
  // 同步队伍信息
  poetryChannel.updateTeams([...teams.value])
  
  saveState()
}

// 开始倒计时
const startTimer = () => {
  if (!currentQuestion.value || timer.value.isRunning) return
  
  timer.value.isRunning = true
  poetryChannel.startTimer(timer.value.remaining)
  saveState()
  
  timerInterval = setInterval(() => {
    if (timer.value.remaining > 0) {
      timer.value.remaining--
      saveState()
    } else {
      stopTimer()
    }
  }, 1000)
}

// 停止倒计时
const stopTimer = () => {
  timer.value.isRunning = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  poetryChannel.stopTimer()
  saveState()
}

// 揭晓答案
const revealAnswer = () => {
  isAnswerRevealed.value = true
  poetryChannel.revealAnswer()
  saveState()
}

// 下一题
const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    stopTimer()
    selectQuestion(questions.value[currentQuestionIndex.value + 1])
    syncToScreen()
  }
}

// 更新分数
const updateScore = (teamId, delta) => {
  const team = teams.value.find(t => t.id === teamId)
  if (team) {
    team.score = Math.max(0, team.score + delta)
    poetryChannel.updateScore(teamId, team.score)
    saveState()
  }
}

// 添加队伍
const addTeam = () => {
  if (teams.value.length >= 10) return
  
  const newId = `team${teams.value.length + 1}`
  teams.value.push({
    id: newId,
    name: `战队${teams.value.length + 1}`,
    score: 0
  })
  
  console.log('[Admin] 发送 UPDATE_TEAMS:', teams.value)
  poetryChannel.updateTeams([...teams.value])
  saveState()
}

// 减少队伍
const removeTeam = () => {
  if (teams.value.length <= 2) return
  
  teams.value.pop()
  
  poetryChannel.updateTeams([...teams.value])
  saveState()
}

// 重置分数
const resetScores = () => {
  teams.value.forEach(team => {
    team.score = 0
  })
  poetryChannel.resetGame()
  saveState()
}

// 清除缓存
const clearStorage = () => {
  storage.clear()
  location.reload()
}

// 保存状态
const saveState = () => {
  storage.save({
    currentQuestion: currentQuestion.value,
    currentStage: currentStage.value,
    teams: teams.value,
    timer: timer.value,
    isAnswerRevealed: isAnswerRevealed.value,
    currentQuestionIndex: currentQuestionIndex.value
  })
}

// 恢复状态
const restoreState = () => {
  const state = storage.load()
  if (state.teams && state.teams.length > 0) {
    teams.value = state.teams
  } else {
    teams.value = storage.getDefaultTeams()
  }
  
  if (state.currentQuestion) {
    currentQuestion.value = state.currentQuestion
    currentStage.value = state.currentStage
    timer.value = state.timer
    isAnswerRevealed.value = state.isAnswerRevealed
    currentQuestionIndex.value = state.currentQuestionIndex
  }
}

// 打开大屏端窗口
const openScreenWindow = () => {
  window.open('/screen', 'screen', 'width=1920,height=1080,fullscreen=yes')
}

// 键盘快捷键
const handleKeydown = (e) => {
  // 如果正在输入框中，不处理快捷键
  if (e.target.tagName === 'INPUT') return
  
  switch (e.key) {
    case ' ':
      e.preventDefault()
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
      e.preventDefault()
      console.log('[Admin] S键按下, currentQuestion:', currentQuestion.value)
      if (currentQuestion.value) {
        syncToScreen()
      }
      break
  }
}

// 生命周期
onMounted(async () => {
  // 初始化通讯频道
  isConnected.value = poetryChannel.init()
  
  // 加载题库
  await loadQuestions()
  
  // 恢复状态
  restoreState()
  
  // 监听大屏端消息
  unsubscribeList.push(
    poetryChannel.on(COMMANDS.HEARTBEAT, () => {
      console.log('收到大屏端心跳')
    })
  )
  
  // 注册键盘事件
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  // 清理定时器
  if (timerInterval) {
    clearInterval(timerInterval)
  }
  
  // 取消订阅
  unsubscribeList.forEach(unsubscribe => unsubscribe())
  
  // 关闭频道
  poetryChannel.close()
  
  // 移除键盘事件
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* 组件特定样式 */
</style>
