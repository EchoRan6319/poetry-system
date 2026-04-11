# Tasks - 导出比赛记录功能

- [x] Task 1: 实现 exportCompetitionRecord 函数
  - 在 Admin.vue 中添加 `exportCompetitionRecord` 方法
  - 生成包含队伍得分和题目记录的 TXT 内容字符串
  - 使用 Blob 和 URL.createObjectURL 创建下载链接
  - 文件名格式：`诗词大赛记录_YYYYMMDD_HHmmss.txt`

- [x] Task 2: 在管理界面添加导出按钮
  - 在 Admin.vue 的「系统控制」区域添加「导出比赛记录」按钮
  - 按钮样式与其他系统控制按钮保持一致

- [x] Task 3: 验证功能
  - 测试点击导出按钮可正常下载 TXT 文件
  - 验证文件内容格式正确
  - 验证文件名为正确的日期时间格式