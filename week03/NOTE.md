# 学习笔记

## HTML parser

## #第二步总结

1. 用FSM实现HTML分析
2. 在HTML标准里，已经规定好了HTML状态

### 第三步总结

1. 主要的标签有：开始标签、结束标签和自封闭标签
2. 暂时忽略属性

### 第四步总结（加入业务逻辑）

1. 在状态机中，除了状态迁移，我们还会要加入业务逻辑，（创建token，把字符加到token上，最后emit（token））
2. 我们在标签结束状态提交标签token

### 第五步总结（处理属性）

1. 属性值分为单引号、双引号、无引号三种方式，因此需要较多状态处理
2. 处理属性的方式根标签类似
3. 属性结束时，我们把属性加到标签token上

### 第六步总结（用token构建DOM树）

1. 从标签构建DOM树的基本技巧是使用栈
2. 遇到开始标签时创建元素并且入栈，遇到结束标签时出栈
3. 自封闭标签入栈后立刻出栈
4. 任何元素的父元素是它入栈前的栈顶

### 第七步总结（添加文本节点）

1. 文本节点与自封闭标签处理类似
2. 多个文本节点需要合并处理

## CSS computing

### 第一步(收集CSS规则)

1. 遇到CSS标签时，我们把CSS规则保存起来
2. 这里我们调用 CSS Parser 来分析CSS规则
3. 这里我们必须仔细研究此库分析CSS规则格式

### 第二步（在合适的时机，将CSS规则应用上）

1. 当我们创建元素时，立即计算CSS
2. 理论上，当我们分析一个元素时，所有的CSS规则已经收集完毕

### 获取父元素序列

1. 在computing CSS函数中，我们必须知道元素的所有父元素才能判断元素与规则是否匹配
2. 我们可以从stack获取本元素的所有父元素
3. 因为我们首先获取的是 当前元素 ，所有我们获取和计算父元素匹配的顺序是从内向外

### 第四步总结

复杂选择器 `div div .name` 是由空格分割的一系列复合选择器(这里认为是简单选择器) `div` or `.name`

1. 选择器也要从当前元素向外排列
2. 复杂选择器拆成针对单个儿元素的选择器，用循环匹配父元素队列

### 第五步总结(计算选择器与元素皮皮额)

1. 根据选择器类型和元素属性，计算是否与当前元素匹配
2. 此处只实现3种基本选择器

### 第六步总结

1. 一旦选择器匹配上，就应用选择器到元素上，形成 computedStyle

### 第七步总结（此处还未真正理解）

1. CSS规则根据specificity和后来的优先规则覆盖
2. specificity是个四元组，越左权重越高
3. 一个CSS规则的specificity根据包含的选择器相加而成
