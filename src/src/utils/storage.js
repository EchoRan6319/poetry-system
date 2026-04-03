/**
 * LocalStorage 容灾存储
 * 确保现场断电重启或误刷页面后进度 100% 恢复
 */

const STORAGE_KEY = 'poetry-competition-state'

// 默认队伍配置（11个学院，按拼音首字母排序）
const defaultTeams = [
  { id: 'team1', name: '财经与金融管理学院', score: 0 },   // C
  { id: 'team2', name: '电子商务学院', score: 0 },         // D
  { id: 'team3', name: '轨道交通工程学院', score: 0 },     // G
  { id: 'team4', name: '建筑与环境工程学院', score: 0 },   // J
  { id: 'team5', name: '生命健康学院', score: 0 },         // S
  { id: 'team6', name: '文化创意学院', score: 0 },         // W
  { id: 'team7', name: '新材料工程学院', score: 0 },       // X
  { id: 'team8', name: '新能源汽车学院', score: 0 },       // X
  { id: 'team9', name: '信息工程与大数据学院', score: 0 }, // X
  { id: 'team10', name: '智能制造学院', score: 0 },        // Z
  { id: 'team11', name: '自动化与物联网学院', score: 0 }   // Z
]

// 默认状态
const defaultState = {
  currentQuestion: null,
  currentStage: '',
  teams: defaultTeams,
  timer: {
    isRunning: false,
    remaining: 0,
    total: 0
  },
  isAnswerRevealed: false,
  lastUpdate: null
}

export const storage = {
  // 保存状态
  save(state) {
    try {
      const data = {
        ...state,
        lastUpdate: Date.now()
      }
      console.log('[Storage] 保存状态, teams数量:', state.teams?.length)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('[Storage] 保存状态失败:', error)
      return false
    }
  },

  // 读取状态
  load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        const parsed = JSON.parse(data)
        console.log('[Storage] 读取状态, teams数量:', parsed.teams?.length)
        // 确保 teams 存在且格式正确
        if (!parsed.teams || !Array.isArray(parsed.teams)) {
          parsed.teams = defaultTeams
        }
        // 如果队伍数量与默认配置不匹配，更新为默认配置（保留分数）
        if (parsed.teams.length !== defaultTeams.length) {
          console.log('[Storage] 队伍数量不匹配，重置为默认配置')
          const scoreMap = {}
          parsed.teams.forEach(t => { scoreMap[t.name] = t.score })
          parsed.teams = defaultTeams.map(t => ({
            ...t,
            score: scoreMap[t.name] || 0
          }))
        }
        return { ...defaultState, ...parsed }
      }
    } catch (error) {
      console.error('[Storage] 读取状态失败:', error)
    }
    return { ...defaultState }
  },

  // 清除状态
  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY)
      return true
    } catch (error) {
      console.error('[Storage] 清除状态失败:', error)
      return false
    }
  },

  // 更新特定字段
  update(key, value) {
    const state = this.load()
    state[key] = value
    return this.save(state)
  },

  // 获取默认状态
  getDefaultState() {
    return { ...defaultState }
  },

  // 获取默认队伍配置
  getDefaultTeams() {
    return JSON.parse(JSON.stringify(defaultTeams))
  }
}

export default storage
