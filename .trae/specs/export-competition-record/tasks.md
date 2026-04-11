# Tasks - 导出比赛记录功能（修改版）

- [x] Task 1: 添加 scoreHistory 状态用于记录每支队伍的加分历史
  - 在 Admin.vue 的 script setup 中添加 scoreHistory ref
  - 初始化为空对象 { teamId: [] }

- [x] Task 2: 修改 updateScore 函数记录加分时间和分值
  - 在每次加分时，记录 { time: 时间字符串, delta: 加分值 }
  - 格式：HH:mm:ss

- [x] Task 3: 修改 exportCompetitionRecord 函数
  - 添加导出时间显示
  - 生成包含加分历史的队伍得分内容
  - 删除题目记录部分

- [x] Task 4: 验证功能
  - 验证导出文件包含导出时间
  - 验证每支队伍的加分历史记录正确
  - 验证文件中无题目记录