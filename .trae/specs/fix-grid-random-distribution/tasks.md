# Tasks - 修复宫格寻诗答案随机分布

- [ ] Task 1: 修改 Screen.vue 中 gridChars 计算逻辑
  - [ ] SubTask 1.1: 分析当前随机算法的问题
  - [ ] SubTask 1.2: 实现均匀分布算法：先随机打乱，然后将答案字均匀插入到 15 个位置中
  - [ ] SubTask 1.3: 确保干扰字填充剩余位置
- [ ] Task 2: 验证修改后的分布效果
  - [ ] SubTask 2.1: 运行测试确认答案字均匀分布
  - [ ] SubTask 2.2: 确认无空白宫格

# Task Dependencies

- Task 2 依赖于 Task 1
