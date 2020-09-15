# 学习笔记

## DOM API 操作

### 修改操作

appendChild
insertBefore
removeChild
replaceChild

### 高级操作

compareDocumentPosition 比较两个节点间的关系

contains 检查一个节点是否包含另一个节点

isEqualNode 检查两个节点是否完全相同

isSameNode 检查两个节点是否是同一个节点（完全可以用`===`代替）

cloneNode 复制一个节点，如果传入参数true，则会连同子元素做深拷贝

## 事件API

target.addEventListener(type, listener, options)

鼠标事件都是由捕获 --> 冒泡

冒泡更符合人类的直觉， 默认行为是冒泡

## Range API

## CSSOM

document.styleSheets：访问页面样式表的API，是一个类似数组的对象，里面每个属性都是一个样式表，可以是style标签或者link标签，包括@import规则的样式也会收进其中而不是另外创建样式表对象

CSS Rules:

1. 查看：`document.styleSheets[0].cssRules[*]`
2. 增加：`document.styleSheets[0].insertRule("p { color:pink; }", 0)`
3. 移除：`document.styleSheets[0].removeRule(0)`
4. 修改property和value：`document.styleSheets[0].cssRules[0].style.color = 'red'`
5. 修改选择器：`document.styleSheets[0].cssRules[0].selectorText = '*'`

## 获取CSS属性的计算值

`window.getComputedStyle(element, [pseudoElt])`

## window

API

`let opened = window.open("about:blank", "_blank" ,"width=100,height=100,left=100,right=100" )`

新窗口API

moveTo(x, y)
moveBy(x, y)
resizeTo(x, y)
resizeBy(x, y)

## scroll

element scroll

1. scrollTop
2. scrollLeft
3. scrollWidth   --> 可滚动宽度
4. scrollHeight  --> 可滚动高度
5. scrollTo(x,y) --> 滚动到特定位置
6. scrollBy(x,y) --> 滚动差值
7. scrollIntoView() --> 滚动到可见区域

window scroll（顶层窗口）

1. scrollX
2. scrollY
3. scrollTo(x,y)
4. scrollBy(x,y)
