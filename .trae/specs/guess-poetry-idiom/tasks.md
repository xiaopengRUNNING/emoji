# 猜诗词和成语功能 - 实现计划

## [x] Task 1: 创建猜诗词和成语组件
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 创建一个新的React组件`PoetryIdiomGuesser.tsx`
  - 实现基本的UI结构，包括标题、Emoji显示区域、输入框和按钮
  - 保持与现有页面风格一致的设计
- **Acceptance Criteria Addressed**: AC-3, AC-4
- **Test Requirements**:
  - `human-judgment` TR-1.1: 组件UI与现有页面风格一致
  - `human-judgment` TR-1.2: 界面布局合理，操作流程直观
- **Notes**: 参考现有的`PoetryConverter.tsx`组件的设计风格

## [x] Task 2: 实现AI生成诗词和成语功能
- **Priority**: P0
- **Depends On**: Task 1
- **Description**:
  - 在`aiService.ts`中添加生成诗词和成语的函数
  - 实现通过AI API随机生成著名诗词和成语的逻辑
  - 确保生成的内容具有一定知名度
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `programmatic` TR-2.1: 调用AI服务成功生成诗词或成语
  - `programmatic` TR-2.2: 生成的内容符合著名诗词或成语的要求
- **Notes**: 使用现有的AI服务接口，构建合适的prompt

## [x] Task 3: 集成Emoji转换功能
- **Priority**: P0
- **Depends On**: Task 2
- **Description**:
  - 使用现有的`convertPoetryToEmoji`函数将生成的诗词或成语转换为Emoji
  - 确保转换结果正确显示
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `programmatic` TR-3.1: 生成的诗词或成语成功转换为Emoji
  - `programmatic` TR-3.2: Emoji转换结果符合预期
- **Notes**: 复用现有的Emoji转换服务

## [x] Task 4: 实现答案验证和反馈机制
- **Priority**: P0
- **Depends On**: Task 3
- **Description**:
  - 实现用户答案的输入和提交功能
  - 实现答案验证逻辑，判断用户输入是否正确
  - 实现反馈机制，显示正确或错误信息
  - 在错误时显示正确答案
- **Acceptance Criteria Addressed**: AC-5
- **Test Requirements**:
  - `programmatic` TR-4.1: 正确答案验证通过
  - `programmatic` TR-4.2: 错误答案验证失败并显示正确答案
  - `human-judgment` TR-4.3: 反馈信息清晰明确
- **Notes**: 考虑中文的不同表达方式，实现宽松的验证逻辑

## [x] Task 5: 实现重新生成功能
- **Priority**: P1
- **Depends On**: Task 4
- **Description**:
  - 实现"重新生成"按钮功能
  - 点击后生成新的诗词或成语并转换为Emoji
  - 重置输入框和反馈信息
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `programmatic` TR-5.1: 点击重新生成按钮后生成新的题目
  - `programmatic` TR-5.2: 界面状态正确重置
- **Notes**: 复用Task 2和Task 3的功能

## [x] Task 6: 集成到主应用
- **Priority**: P1
- **Depends On**: Task 5
- **Description**:
  - 在`App.tsx`中集成新的猜诗词和成语组件
  - 确保组件能够正确接收API密钥
  - 保持与其他组件的布局协调
- **Acceptance Criteria Addressed**: 所有
- **Test Requirements**:
  - `human-judgment` TR-6.1: 组件在主应用中显示正常
  - `programmatic` TR-6.2: 所有功能在主应用中正常工作
- **Notes**: 参考现有组件的集成方式

## [x] Task 7: 测试和优化
- **Priority**: P2
- **Depends On**: Task 6
- **Description**:
  - 测试所有功能的正常运行
  - 优化用户体验和界面细节
  - 确保响应时间符合要求
- **Acceptance Criteria Addressed**: 所有
- **Test Requirements**:
  - `programmatic` TR-7.1: 所有功能测试通过
  - `human-judgment` TR-7.2: 用户体验良好
  - `programmatic` TR-7.3: 响应时间在3秒内
- **Notes**: 测试不同的诗词和成语输入，确保转换和验证的准确性