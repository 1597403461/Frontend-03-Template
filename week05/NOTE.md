# 学习笔记

## 选择器

1. type
2. *
3. #id
4. .class
5. [attribute] html属性
6. :before 伪类
7. ::after 伪元素
8. :not()

## 复合选择器

1. <简单选择器><简单选择器><简单选择器>
2. * 或者 div 必须写在最前面

## 复杂选择器

1. <复合选择器><复合选择器>
2. <复合选择器>">"<复合选择器>
3. <复合选择器>"~"<复合选择器>
4. <复合选择器>"+"<复合选择器>
5. <复合选择器>"||"<复合选择器>

## 优先级

[0,0,0,0] --> [inline,id,class,tag]

S = inline *N^3 + id* N^2 + class *N^1 + tag

N必须取足够大来计算S，否则可能会出现相等的情况

1. div div #id [0,1,0,2]
2. div .ls #id [0,1,1,1]

此时`2`的优先级 > `1`的优先级

## 伪类

1. :any-link
2. :link， :visited
3. :hover
4. :active
5. :focus
6. :target

## 伪元素

1. ::before
2. ::after
3. ::first-line
4. ::first-letter

## 为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢

first-letter: 指代第一个字符，有确切的位置及内容

first-line： 指代第一行，第一行所能确定的内容具有不确定性。而且屏幕都可大可小。渲染计算的话，极其复杂。也会影响渲染效率/
