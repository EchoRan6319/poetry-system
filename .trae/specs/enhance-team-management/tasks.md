# Tasks - 增强队伍管理功能

- [ ] Task 1: 添加队伍改名功能
  - [ ] SubTask 1.1: 在 Admin.vue 队伍管理区域，将队名显示改为可点击编辑
  - [ ] SubTask 1.2: 实现 renameTeam 函数，支持修改任意队伍名称
  - [ ] SubTask 1.3: 修改后同步到 screenState、poetryChannel 和本地存储
- [ ] Task 2: 添加队伍排序功能
  - [ ] SubTask 2.1: 添加 sortMode 状态（default / score-desc / score-asc / name）
  - [ ] SubTask 2.2: 添加排序控件 UI（下拉选择或按钮组）
  - [ ] SubTask 2.3: 实现排序逻辑，确保队名与分数绑定
  - [ ] SubTask 2.4: 排序后同步到 screenState、poetryChannel 和本地存储
- [ ] Task 3: 验证功能
  - [ ] SubTask 3.1: 验证预设队伍可改名
  - [ ] SubTask 3.2: 验证排序时队名与分数不错位
  - [ ] SubTask 3.3: 验证排序后大屏显示同步更新

# Task Dependencies

- Task 2 依赖于 Task 1（排序需要基于完整的队伍对象）
- Task 3 依赖于 Task 1 和 Task 2
