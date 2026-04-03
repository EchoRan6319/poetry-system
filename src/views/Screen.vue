<template>
  <div class="min-h-screen bg-zinc-900 grid-bg overflow-hidden">
    <!-- 顶部状态栏 -->
    <header class="fixed top-0 left-0 right-0 z-50 px-12 py-6">
      <div class="flex items-center justify-between">
        <!-- 左侧：标题 -->
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <span class="text-3xl">📜</span>
          </div>
          <div>
            <h1 class="text-4xl font-bold text-gold-gradient text-shadow-lg">传承经典</h1>
            <p class="text-cyan-400 text-lg tracking-widest">诗词大赛</p>
          </div>
        </div>

        <!-- 中间：当前阶段 -->
        <div class="glass-card px-12 py-4">
          <span class="text-2xl font-semibold text-cyan-300">{{ currentStage || '准备就绪' }}</span>
        </div>

        <!-- 右侧：倒计时 -->
        <div class="glass-card px-8 py-4 min-w-[200px] text-center">
          <div class="text-sm text-zinc-400 mb-1">剩余时间</div>
          <div 
            class="text-5xl font-mono font-bold transition-colors"
            :class="timerClass"
          >
            {{ formatTime(timer.remaining) }}
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="pt-40 pb-32 px-12 min-h-screen flex flex-col justify-center">
      <!-- 题目展示区 -->
      <div class="flex-1 flex items-center justify-center">
        <div v-if="!currentQuestion" class="text-center">
          <div class="text-8xl mb-8">🏆</div>
          <h2 class="text-5xl font-bold text-zinc-300 mb-4">等待比赛开始</h2>
          <p class="text-2xl text-zinc-500">请使用导播控制台同步题目</p>
        </div>

        <div v-else class="w-full max-w-6xl">
          <!-- 规则说明 -->
          <div class="text-center mb-12">
            <span class="inline-block glass-card px-8 py-3 text-xl text-cyan-300">
              {{ currentQuestion.rule }}
            </span>
          </div>

          <!-- 题目内容 - 根据题型渲染 -->
          <div class="glass-card p-16 mb-12">
            <!-- Emoji猜诗 -->
            <div v-if="currentQuestion.stage === 'Emoji猜诗'" class="text-center">
              <div class="text-[120px] leading-tight font-emoji tracking-wider">
                {{ currentQuestion.question }}
              </div>
            </div>

            <!-- 宫格寻诗 -->
            <div v-else-if="currentQuestion.stage === '宫格寻诗'" class="text-center">
              <div class="grid grid-cols-6 gap-4 max-w-5xl mx-auto">
                <div 
                  v-for="(char, index) in gridChars" 
                  :key="index"
                  class="w-20 h-20 glass-card flex items-center justify-center text-5xl font-serif-sc text-zinc-200 border-2 border-cyan-500/30 hover:border-cyan-400/60 transition-colors"
                >
                  {{ char }}
                </div>
              </div>
            </div>

            <!-- 易错找茬 -->
            <div v-else-if="currentQuestion.stage === '易错找茬'" class="text-center">
              <div class="text-6xl font-serif-sc text-zinc-200 leading-relaxed">
                {{ currentQuestion.question }}
              </div>
              <div class="mt-8 text-2xl text-cyan-400">
                请找出其中的错别字
              </div>
            </div>

            <!-- 中原风华 -->
            <div v-else-if="currentQuestion.stage === '中原风华'" class="text-center">
              <div class="text-5xl font-serif-sc text-zinc-200 leading-relaxed">
                {{ currentQuestion.question }}
              </div>
            </div>

            <!-- 经典填词 -->
            <div v-else-if="currentQuestion.stage === '经典填词'" class="text-center">
              <div class="text-6xl font-serif-sc text-zinc-200 leading-relaxed tracking-widest">
                {{ currentQuestion.question }}
              </div>
            </div>

            <!-- 主题飞花令 -->
            <div v-else-if="currentQuestion.stage === '主题飞花令'" class="text-center">
              <div class="text-4xl text-cyan-400 mb-8">主题</div>
              <div class="text-8xl font-bold text-gold-gradient">
                {{ currentQuestion.question }}
              </div>
            </div>

            <!-- 默认显示 -->
            <div v-else class="text-center">
              <div class="text-6xl font-serif-sc text-zinc-200 leading-relaxed">
                {{ currentQuestion.question }}
              </div>
            </div>
          </div>

          <!-- 答案区 -->
          <div 
            v-if="isAnswerRevealed" 
            class="glass-card p-8 border-yellow-500/30 bg-yellow-500/5"
          >
            <div class="text-center">
              <div class="text-sm text-yellow-500 mb-2">正确答案</div>
              <div class="text-5xl font-serif-sc text-gold-gradient">
                {{ currentQuestion.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部战队计分板 -->
    <footer class="fixed bottom-0 left-0 right-0 px-4 py-3">
      <div class="glass-card py-3 px-4">
        <div class="flex justify-between items-center gap-2 overflow-x-auto">
          <div 
            v-for="team in teams" 
            :key="team.id"
            class="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/50 min-w-fit"
          >
            <div class="text-sm text-zinc-400 whitespace-nowrap">{{ team.name }}</div>
            <div class="text-2xl font-bold text-cyan-400">{{ team.score }}</div>
          </div>
        </div>
      </div>
    </footer>

    <!-- 右下角水印 -->
    <div class="fixed bottom-4 right-4 text-sm text-zinc-600 z-50">
      Powered by College of Information Engineering and Big Data
    </div>

    <!-- 连接状态指示器 -->
    <div class="fixed top-6 right-6 z-50">
      <div 
        class="w-3 h-3 rounded-full"
        :class="isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { poetryChannel, COMMANDS } from '../utils/channel.js'
import { storage } from '../utils/storage.js'

// 状态
const isConnected = ref(false)
const currentQuestion = ref(null)
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
  const q = currentQuestion.value.question
  // 如果有空格，按空格分割；否则按单个字符分割
  let chars = []
  if (q.includes(' ')) {
    chars = q.split(' ').filter(c => c.trim())
  } else {
    chars = q.split('')
  }
  // 随机打乱字符顺序
  return chars.sort(() => Math.random() - 0.5)
})

// 根据队伍数量动态调整网格布局
const teamsGridClass = computed(() => {
  const count = teams.value.length
  if (count <= 2) return 'grid-cols-2'
  if (count === 3) return 'grid-cols-3'
  if (count === 4) return 'grid-cols-4'
  if (count <= 6) return 'grid-cols-3'
  if (count <= 9) return 'grid-cols-3'
  return 'grid-cols-4'
})

// 格式化时间
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// 开始倒计时
const startCountdown = (seconds) => {
  stopCountdown()
  timer.value = {
    isRunning: true,
    remaining: seconds,
    total: seconds
  }
  
  timerInterval = setInterval(() => {
    if (timer.value.remaining > 0) {
      timer.value.remaining--
    } else {
      stopCountdown()
    }
  }, 1000)
}

// 停止倒计时
const stopCountdown = () => {
  timer.value.isRunning = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// 保存状态
const saveState = () => {
  storage.save({
    currentQuestion: currentQuestion.value,
    currentStage: currentStage.value,
    teams: teams.value,
    timer: timer.value,
    isAnswerRevealed: isAnswerRevealed.value
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
    
    // 如果倒计时正在运行，恢复它
    if (timer.value.isRunning && timer.value.remaining > 0) {
      startCountdown(timer.value.remaining)
    }
  }
}

// 生命周期
onMounted(() => {
  // 初始化通讯频道
  isConnected.value = poetryChannel.init()
  
  // 恢复状态
  restoreState()
  
  // 订阅各种消息
  unsubscribeList.push(
    // 同步题目
    poetryChannel.on(COMMANDS.SYNC_QUESTION, (data) => {
      currentQuestion.value = data
      isAnswerRevealed.value = false
      stopCountdown()
      timer.value = {
        isRunning: false,
        remaining: data.time_limit,
        total: data.time_limit
      }
      saveState()
    }),
    
    // 开始倒计时
    poetryChannel.on(COMMANDS.START_TIMER, (data) => {
      startCountdown(data.seconds)
      saveState()
    }),
    
    // 停止倒计时
    poetryChannel.on(COMMANDS.STOP_TIMER, () => {
      stopCountdown()
      saveState()
    }),
    
    // 揭晓答案
    poetryChannel.on(COMMANDS.REVEAL_ANSWER, () => {
      isAnswerRevealed.value = true
      saveState()
    }),
    
    // 切换阶段
    poetryChannel.on(COMMANDS.CHANGE_STAGE, (data) => {
      currentStage.value = data.stage
      saveState()
    }),
    
    // 更新分数
    poetryChannel.on(COMMANDS.UPDATE_SCORE, (data) => {
      const team = teams.value.find(t => t.id === data.teamId)
      if (team) {
        team.score = data.score
        saveState()
      }
    }),
    
    // 更新队伍配置
    poetryChannel.on(COMMANDS.UPDATE_TEAMS, (data) => {
      console.log('[Screen] 收到 UPDATE_TEAMS:', data.teams)
      teams.value = [...data.teams]
      console.log('[Screen] 更新后 teams:', teams.value)
      saveState()
    }),
    
    // 重置游戏
    poetryChannel.on(COMMANDS.RESET_GAME, () => {
      currentQuestion.value = null
      currentStage.value = ''
      isAnswerRevealed.value = false
      stopCountdown()
      teams.value.forEach(team => {
        team.score = 0
      })
      timer.value = {
        isRunning: false,
        remaining: 0,
        total: 0
      }
      saveState()
    })
  )
  
  // 发送心跳
  setInterval(() => {
    poetryChannel.send(COMMANDS.HEARTBEAT)
  }, 5000)
  
  // 监听 LocalStorage 变化（作为 BroadcastChannel 的备用）
  window.addEventListener('storage', (e) => {
    if (e.key === 'poetry-competition-state') {
      console.log('[Screen] 通过 LocalStorage 收到更新')
      const state = storage.load()
      if (state.teams && state.teams.length > 0) {
        teams.value = [...state.teams]
        console.log('[Screen] LocalStorage 更新后 teams:', teams.value)
      }
    }
  })
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
})
</script>

<style scoped>
/* 大屏端特定样式 */
.font-emoji {
  font-family: 'Noto Color Emoji', sans-serif;
}
</style>
