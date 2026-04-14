# 诗词转Emoji功能（火山引擎版） - 实现计划

## [x] 任务1: 修改emojiConverterService.ts，只保留火山引擎支持
- **优先级**: P0
- **依赖**: 无
- **描述**: 
  - 修改 `src/services/emojiConverterService.ts` 文件
  - 移除OpenAI支持，只保留火山引擎AI服务
  - 设置默认Endpoint为 `https://ark.cn-beijing.volces.com/api/v3/chat/completions`
  - 设置默认Model为 `doubao-seed-1-8-251228`
  - 简化API调用逻辑
- **验收标准**: AC-1, AC-3
- **测试要求**:
  - `programmatic` TR-1.1: 服务能够正确调用火山引擎API
  - `programmatic` TR-1.2: 服务能够处理API错误
- **注意**: 确保默认配置正确

## [x] 任务2: 创建PoetryConverter组件
- **优先级**: P0
- **依赖**: 任务1
- **描述**: 
  - 创建 `src/components/PoetryConverter.tsx` 文件
  - 实现诗词输入、转换按钮和结果展示
  - 实现复制功能
  - 移除AI服务类型选择和火山引擎配置选项
- **验收标准**: AC-1, AC-2, AC-3, AC-4
- **测试要求**:
  - `programmatic` TR-2.1: 组件能够正确渲染
  - `human-judgment` TR-2.2: 界面美观，与现有应用风格一致
- **注意**: 确保组件响应式设计，适配不同屏幕尺寸

## [x] 任务3: 集成到主应用
- **优先级**: P0
- **依赖**: 任务2
- **描述**: 
  - 修改 `src/App.tsx` 文件
  - 将标签页从"成语诗词转Emoji"改为"诗词转Emoji"
  - 集成新的PoetryConverter组件
  - 移除旧的IdiomPoetryConverter组件引用
- **验收标准**: AC-1, AC-2, AC-3, AC-4
- **测试要求**:
  - `programmatic` TR-3.1: 应用能够正常运行
  - `human-judgment` TR-3.2: 标签页切换功能正常
- **注意**: 保持与现有应用风格的一致性

## [x] 任务4: 优化页面样式
- **优先级**: P1
- **依赖**: 任务3
- **描述**: 
  - 使用frontend-design技能优化页面样式
  - 改进PoetryConverter组件的视觉效果
  - 确保页面响应式设计
  - 优化用户交互体验
- **验收标准**: AC-4
- **测试要求**:
  - `human-judgment` TR-4.1: 页面显示美观，布局合理
  - `human-judgment` TR-4.2: 用户交互体验良好
- **注意**: 保持与现有应用风格的一致性