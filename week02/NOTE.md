# 学习笔记

## 浏览器的工作原理

URL（HTTP）--> HTML(parse) -->css(computing) --> DOM with css(layout) --> DOM with position(render) --> bitmap

## 有限状态机

1. 每一个状态都是一个机器
    在每一个机器里，我们都可以做计算、存储、输出...
    所有的机器接受的输入都是一致的
    状态机的每一个机器本身是没有状态的，如果我们用函数表示的话，他应该是纯函数（无副作用）
2. 每一个机器知道下一个状态
    每个机器都有确定的下一个状态
    每个机器根据输入决定下一个状态

## 七层网络模型

物理层、数据链路层、网络层、传输层、会话层、表示层、应用层

1. 物理层、数据链路层 --> 4G/5G/WI-FI
2. 网络层 --> internet
3. 传输层 --> TCP  (`require('net')`)
4. 会话层、表示层、应用层 --> HTTP(`require('http')`)

## HTTP REQUEST

1. request line
    POST/HTTP/1.1
2. headers(以空行结束)
    HOST:127.0.0.1
    Content-Type: application/x-www-form-urlencoded
3. body(key-->value)
    a=1&b=2&c=3

## HTTP RESPONSE

1. status line
    HTTP/1.1 200 OK(三部分分别书协议、http状态码、http状态文本)
2. headers(以空行结束)
    Content-Type: text/html
    Data:Mon,23 Dec 2019 06:29:39 GMT
    connection:keep-alive
    Transfer-Encoding:chunked
3. body
    `<html><head></head><body>hello world</body></html>`

## HTTP请求总结

1. 设计一个http请求类
2. Content-Type是必要字段，要有默认值
3. body是kv格式
4. 不同的Content-Type影响body的格式
5. Content-Length字段必须是body的length，否则是非法的请求

## send 函数总结

1. 在request的构造器中收集必要的信息
2. 设计一个send函数，把请求真实发送到服务器
3. send函数应该是异步的，所以返回Promise

## 发送请求

1. 设计支持已有的connection或者自己新建connection
2. 收到数据给parser
3. 根据parser的状态resolve Promise

## ResponseParser总结

1. response必须分段构造，所以我们要用ResponseParser来装配
2. ResponseParser分段处理responseText，我们用状态机来分析文本结构

## BodyParser总结

1. response的body可能根据Contetnt-Type有不同的结构，因此我们会采用Parser的结构来解决
2. 以TrunkBodyParser为例，我们同样用状态机来处理Body格式
