# 学习笔记

## Box(盒)

HTML代码中可以书写开始__标签_，结束__标签__ ，和自封闭_标签___ 。

一对起止__标签__ ，表示一个__元素__ 。

DOM树中存储的是_ 元素___和其它类型的节点（Node）。

CSS选择器选中的是__元素__ 。

CSS选择器选中的__元素__ ，在排版时可能产生多个__盒__ 。

排版和渲染的基本单位是__盒__ 。

### BFC

从上到下排列的上下文（块级格式化上下文）它是一个独立的渲染区域，只有Block-level box参与， 它规定了内部的Block-level Box如何布局，并且与这个区域外部毫不相干。

创建BFC

1. float的值不是none。
2. position的值不是static或者relative。
3. display的值是inline-block、table-cell、flex、table-caption或者inline-flex
4. overflow的值不是visible
5. body 根元素


BFC的作用

1. 利用BFC避免margin重叠。
2. 自适应两栏布局
3. 清除浮动

### IFC

从左到右排列的上下文
