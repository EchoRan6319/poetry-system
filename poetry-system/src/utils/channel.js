/**
 * BroadcastChannel 通讯类
 * 用于实现导播控制台与大屏端的纯前端本地通讯
 */

export const CHANNEL_NAME = 'poetry-competition-channel'

// 标准交互指令集
export const COMMANDS = {
  // 同步题目
  SYNC_QUESTION: 'SYNC_QUESTION',
  // 开始倒计时
  START_TIMER: 'START_TIMER',
  // 停止倒计时
  STOP_TIMER: 'STOP_TIMER',
  // 更新分数
  UPDATE_SCORE: 'UPDATE_SCORE',
  // 揭晓答案
  REVEAL_ANSWER: 'REVEAL_ANSWER',
  // 切换阶段
  CHANGE_STAGE: 'CHANGE_STAGE',
  // 重置比赛
  RESET_GAME: 'RESET_GAME',
  // 心跳检测
  HEARTBEAT: 'HEARTBEAT',
  // 更新队伍配置
  UPDATE_TEAMS: 'UPDATE_TEAMS'
}

class PoetryChannel {
  constructor() {
    this.channel = null
    this.listeners = new Map()
    this.isConnected = false
  }

  // 初始化频道
  init() {
    try {
      this.channel = new BroadcastChannel(CHANNEL_NAME)
      this.isConnected = true
      
      this.channel.onmessage = (event) => {
        const { command, data, timestamp } = event.data
        this.handleMessage(command, data, timestamp)
      }
      
      console.log('[PoetryChannel] 频道连接成功')
      return true
    } catch (error) {
      console.error('[PoetryChannel] 频道连接失败:', error)
      this.isConnected = false
      return false
    }
  }

  // 发送消息
  send(command, data = {}) {
    if (!this.channel || !this.isConnected) {
      console.warn('[PoetryChannel] 频道未连接')
      return false
    }

    const message = {
      command,
      data,
      timestamp: Date.now()
    }

    console.log('[PoetryChannel] 发送消息:', command, data)
    this.channel.postMessage(message)
    return true
  }

  // 处理接收到的消息
  handleMessage(command, data, timestamp) {
    console.log('[PoetryChannel] 收到消息:', command, data)
    const callbacks = this.listeners.get(command)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data, timestamp)
        } catch (error) {
          console.error(`[PoetryChannel] 执行监听器出错 [${command}]:`, error)
        }
      })
    }
  }

  // 订阅消息
  on(command, callback) {
    if (!this.listeners.has(command)) {
      this.listeners.set(command, [])
    }
    this.listeners.get(command).push(callback)

    // 返回取消订阅函数
    return () => {
      const callbacks = this.listeners.get(command)
      if (callbacks) {
        const index = callbacks.indexOf(callback)
        if (index > -1) {
          callbacks.splice(index, 1)
        }
      }
    }
  }

  // 取消所有订阅
  off(command) {
    if (command) {
      this.listeners.delete(command)
    } else {
      this.listeners.clear()
    }
  }

  // 关闭频道
  close() {
    if (this.channel) {
      this.channel.close()
      this.channel = null
      this.isConnected = false
      this.listeners.clear()
      console.log('[PoetryChannel] 频道已关闭')
    }
  }

  // 快捷方法：同步题目
  syncQuestion(questionData) {
    return this.send(COMMANDS.SYNC_QUESTION, questionData)
  }

  // 快捷方法：开始倒计时
  startTimer(seconds) {
    return this.send(COMMANDS.START_TIMER, { seconds })
  }

  // 快捷方法：停止倒计时
  stopTimer() {
    return this.send(COMMANDS.STOP_TIMER)
  }

  // 快捷方法：更新分数
  updateScore(teamId, score) {
    return this.send(COMMANDS.UPDATE_SCORE, { teamId, score })
  }

  // 快捷方法：揭晓答案
  revealAnswer() {
    return this.send(COMMANDS.REVEAL_ANSWER)
  }

  // 快捷方法：切换阶段
  changeStage(stage) {
    return this.send(COMMANDS.CHANGE_STAGE, { stage })
  }

  // 快捷方法：重置比赛
  resetGame() {
    return this.send(COMMANDS.RESET_GAME)
  }

  // 快捷方法：更新队伍配置
  updateTeams(teams) {
    return this.send(COMMANDS.UPDATE_TEAMS, { teams })
  }
}

// 单例模式导出
export const poetryChannel = new PoetryChannel()

export default PoetryChannel
