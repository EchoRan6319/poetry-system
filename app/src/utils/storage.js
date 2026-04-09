const ADMIN_STORAGE_KEY = 'poetry-competition-admin-state'
const SCREEN_STORAGE_KEY = 'poetry-competition-screen-state'

const defaultTeams = [
  { id: 'team1', name: '队伍1', score: 0 },
  { id: 'team2', name: '队伍2', score: 0 },
  { id: 'team3', name: '队伍3', score: 0 }
]

const defaultState = {
  currentQuestion: null,
  currentQuestionIndex: -1,
  syncedQuestionId: null,
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
  syncedQuestionId: typeof state.syncedQuestionId === 'string' ? state.syncedQuestionId : null,
  teams: normalizeTeams(state.teams),
  timer: normalizeTimer(state.timer)
})

const saveByKey = (key, state) => {
  try {
    const data = {
      ...normalizeState(state),
      lastUpdate: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error(`[Storage] save failed for ${key}:`, error)
    return false
  }
}

const loadByKey = (key) => {
  try {
    const data = localStorage.getItem(key)
    if (!data) {
      return clone(defaultState)
    }

    return normalizeState(JSON.parse(data))
  } catch (error) {
    console.error(`[Storage] load failed for ${key}:`, error)
    return clone(defaultState)
  }
}

const clearByKey = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`[Storage] clear failed for ${key}:`, error)
    return false
  }
}

export const storage = {
  ADMIN_STORAGE_KEY,
  SCREEN_STORAGE_KEY,

  saveAdmin(state) {
    return saveByKey(ADMIN_STORAGE_KEY, state)
  },

  loadAdmin() {
    return loadByKey(ADMIN_STORAGE_KEY)
  },

  clearAdmin() {
    return clearByKey(ADMIN_STORAGE_KEY)
  },

  saveScreen(state) {
    return saveByKey(SCREEN_STORAGE_KEY, state)
  },

  loadScreen() {
    return loadByKey(SCREEN_STORAGE_KEY)
  },

  clearScreen() {
    return clearByKey(SCREEN_STORAGE_KEY)
  },

  clear() {
    const adminCleared = clearByKey(ADMIN_STORAGE_KEY)
    const screenCleared = clearByKey(SCREEN_STORAGE_KEY)
    return adminCleared && screenCleared
  },

  getDefaultState() {
    return clone(defaultState)
  },

  getDefaultTeams() {
    return clone(defaultTeams)
  }
}

export default storage
