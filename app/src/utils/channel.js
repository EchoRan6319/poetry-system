export const CHANNEL_NAME = 'poetry-competition-channel'

export const COMMANDS = {
  SYNC_QUESTION: 'SYNC_QUESTION',
  START_TIMER: 'START_TIMER',
  STOP_TIMER: 'STOP_TIMER',
  UPDATE_SCORE: 'UPDATE_SCORE',
  REVEAL_ANSWER: 'REVEAL_ANSWER',
  CHANGE_STAGE: 'CHANGE_STAGE',
  RESET_GAME: 'RESET_GAME',
  RESET_SCORES: 'RESET_SCORES',
  HEARTBEAT: 'HEARTBEAT',
  UPDATE_TEAMS: 'UPDATE_TEAMS'
}

class PoetryChannel {
  constructor() {
    this.channel = null
    this.listeners = new Map()
    this.isConnected = false
  }

  init() {
    try {
      this.channel = new BroadcastChannel(CHANNEL_NAME)
      this.isConnected = true
      this.channel.onmessage = (event) => {
        const { command, data, timestamp } = event.data
        this.handleMessage(command, data, timestamp)
      }
      return true
    } catch (error) {
      console.error('[PoetryChannel] init failed:', error)
      this.isConnected = false
      return false
    }
  }

  send(command, data = {}) {
    if (!this.channel || !this.isConnected) {
      return false
    }

    this.channel.postMessage({
      command,
      data,
      timestamp: Date.now()
    })

    return true
  }

  handleMessage(command, data, timestamp) {
    const callbacks = this.listeners.get(command)
    if (!callbacks) return

    callbacks.forEach((callback) => {
      try {
        callback(data, timestamp)
      } catch (error) {
        console.error(`[PoetryChannel] listener failed for ${command}:`, error)
      }
    })
  }

  on(command, callback) {
    if (!this.listeners.has(command)) {
      this.listeners.set(command, [])
    }

    this.listeners.get(command).push(callback)

    return () => {
      const callbacks = this.listeners.get(command)
      if (!callbacks) return

      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  close() {
    if (!this.channel) return

    this.channel.close()
    this.channel = null
    this.isConnected = false
    this.listeners.clear()
  }

  syncQuestion(questionData) {
    return this.send(COMMANDS.SYNC_QUESTION, questionData)
  }

  startTimer(seconds, endAt) {
    return this.send(COMMANDS.START_TIMER, { seconds, endAt })
  }

  stopTimer() {
    return this.send(COMMANDS.STOP_TIMER)
  }

  updateScore(teamId, score) {
    return this.send(COMMANDS.UPDATE_SCORE, { teamId, score })
  }

  revealAnswer() {
    return this.send(COMMANDS.REVEAL_ANSWER)
  }

  changeStage(stage) {
    return this.send(COMMANDS.CHANGE_STAGE, { stage })
  }

  resetGame() {
    return this.send(COMMANDS.RESET_GAME)
  }

  resetScores() {
    return this.send(COMMANDS.RESET_SCORES)
  }

  updateTeams(teams) {
    return this.send(COMMANDS.UPDATE_TEAMS, { teams })
  }
}

export const poetryChannel = new PoetryChannel()

export default PoetryChannel
