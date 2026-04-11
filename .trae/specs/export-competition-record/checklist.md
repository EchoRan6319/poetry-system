# Checklist - 导出比赛记录功能

- [x] Admin.vue 中存在 `exportCompetitionRecord` 方法
- [x] `exportCompetitionRecord` 方法生成包含队伍得分的 TXT 内容
- [x] `exportCompetitionRecord` 方法生成包含题目记录的 TXT 内容（题目内容、答案、状态）
- [x] 导出文件名格式为 `诗词大赛记录_YYYYMMDD_HHmmss.txt`
- [x] Admin.vue 「系统控制」区域存在「导出比赛记录」按钮
- [x] 点击导出按钮可触发 TXT 文件下载
- [x] 空数据情况下导出文件显示"暂无数据"