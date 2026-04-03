const STORAGE_KEY = 'poetry-competition-state'

const defaultTeams = [
  { id: 'team1', name: '财经与金融管理学院', score: 0 },
  { id: 'team2', name: '电子商务学院', score: 0 },
  { id: 'team3', name: '轨道交通工程学院', score: 0 },
  { id: 'team4', name: '建筑与环境工程学院', score: 0 },
  { id: 'team5', name: '生命健康学院', score: 0 },
  { id: 'team6', name: '文化创意学院', score: 0 },
  { id: 'team7', name: '新材料工程学院', score: 0 },
  { id: 'team8', name: '新能源汽车学院', score: 0 },
  { id: 'team9', name: '信息工程与大数据学院', score: 0 },
  { id: 'team10', name: '智能制造学院', score: 0 },
  { id: 'team11', name: '自动化与物联网学院', score: 0 }
]

const defaultState = {
  currentQuestion: null,
  currentQuestionIndex: -1,
  currentStage: '',
  teams: defaultTeams,
  timer: {
    isRunning: false,
    remaining: 0,
    total: 0,
    endAt: null
  },
  isAnswerRevealed: false,
  lastUpdate: null
}

const clone = (value) => JSON.parse(JSON.stringify(value))

const normalizeTeams = (teams) => {
  if (!Array.isArray(teams) || teams.length === 0) {
    return clone(defaultTeams)
  }

  return teams.map((team, index) => ({
    id: team?.id || `team${index + 1}`,
    name: team?.name || `队伍${index + 1}`,
    score: Math.max(0, Number(team?.score) || 0)
  }))
}

const normalizeTimer = (timer) => {
  const total = Math.max(0, Number(timer?.total) || 0)
  const rawRemaining = Math.max(0, Number(timer?.remaining) || 0)
  const rawEndAt = Number(timer?.endAt)
  const hasEndAt = Number.isFinite(rawEndAt) && rawEndAt > 0
  const isRunning = Boolean(timer?.isRunning && hasEndAt && rawEndAt > Date.now())
  const remaining = isRunning
    ? Math.max(0, Math.ceil((rawEndAt - Date.now()) / 1000))
    : rawRemaining

  return {
    isRunning,
    remaining,
    total: total || remaining,
    endAt: isRunning ? rawEndAt : null
  }
}

const normalizeState = (state = {}) => ({
  ...clone(defaultState),
  ...state,
  currentQuestionIndex: Number.isInteger(state.currentQuestionIndex) ? state.currentQuestionIndex : -1,
  teams: normalizeTeams(state.teams),
  timer: normalizeTimer(state.timer)
})

export const storage = {
  save(state) {
    try {
      const data = {
        ...normalizeState(state),
        lastUpdate: Date.now()
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('[Storage] save failed:', error)
      return false
    }
  },

  load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (!data) {
        return clone(defaultState)
      }

      return normalizeState(JSON.parse(data))
    } catch (error) {
      console.error('[Storage] load failed:', error)
      return clone(defaultState)
    }
  },

  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY)
      return true
    } catch (error) {
      console.error('[Storage] clear failed:', error)
      return false
    }
  },

  getDefaultState() {
    return clone(defaultState)
  },

  getDefaultTeams() {
    return clone(defaultTeams)
  }
}

export default storage
