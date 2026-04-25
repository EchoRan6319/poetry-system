# 修复宫格寻诗答案随机分布

## Why

当前 Screen.vue 中 `gridChars` 使用 `Math.random() - 0.5` 对 15 个汉字进行简单随机排序。由于答案字在 `question` 中通常排在前面（前 5-7 个），简单随机排序后答案字仍大概率集中在前两行（前 10 个位置），导致第三行很少出现答案字。从截图可以看到，答案"大漠孤烟直"的 5 个字全部出现在前两行，第三行全是干扰字，这让选手可以优先只看前两行，降低了难度。

## What Changes

- 修改 [Screen.vue](file:///d:/EchoRan/Documents/GitHub/poetry-system/app/src/views/Screen.vue#L186-L204) 中 `gridChars` 的计算逻辑
- 在随机打乱后，增加一个"均匀分布"步骤：确保答案字尽可能均匀分布在 5×3 的 15 个宫格中
- 或者采用更彻底的随机算法（如 Fisher-Yates 洗牌），确保每个位置出现答案字的概率均等

## Impact

- Affected specs: 宫格寻诗题型显示逻辑
- Affected code: app/src/views/Screen.vue

## ADDED Requirements

### Requirement: 宫格答案均匀分布
宫格寻诗的答案字 SHALL 在 5×3 宫格中均匀分布，不应集中在前两行。

#### Scenario: 均匀分布
- **WHEN** 系统显示宫格寻诗题目
- **THEN** 答案字（5 个或 7 个）应均匀分布在 15 个宫格中
- **AND** 不应出现答案字全部集中在前两行、第三行完全没有答案字的情况

## MODIFIED Requirements

无

## REMOVED Requirements

无
