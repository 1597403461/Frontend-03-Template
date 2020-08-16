// 添加specificity 并且修改131-155行
const CSS = require('css');
const EOF = Symbol("EOF");
let currentToken = null;
let currentAttribute = null;
let words = /^[a-zA-Z]$/;
let spaceCharReg = /^[\t\n\f ]$/;
let currentTextNode = null;

let stack = [{ type: 'document', children: [] }];

let cssRules = [];

// 加入一个新的函数， addCssRules， 这里把CSS规则暂存到一个数组里
function addCssRules(text) {
    let ast = CSS.parse(text);
    // console.log(JSON.stringify(ast, null, "    "));
    cssRules.push(...ast.stylesheet.rules);
}

function specificity(selector) {
    let p = [0, 0, 0, 0];
    let selectorParts = selector.split(' ');
    for (let part of selectorParts) {
        //✅复合选择器 div.text#id1
        let d = part.match(bothStyleReg);
        //如果是复合选择器则拆分判断，简单选择器和复杂选择器会被拆分到下面的else部分
        if (d && d.length > 1) {
            Array.from(d).forEach(singleSelector => {
                let firstChar = singleSelector.charAt(0);
                if (firstChar === '#') {
                    p[1] += 1;
                }
                else if (firstChar === '.') {
                    p[2] += 1;
                }
                else {
                    p[3] += 1;
                }
            });
        }
        else {
            let firstChar = part.charAt(0);
            if (firstChar === '#') {
                p[1] += 1;
            }
            else if (firstChar === '.') {
                p[2] += 1;
            }
            else {
                p[3] += 1;
            }
        }
    }
    return p;
}


// 简单选择器（class选择器、id选择器、tagName选择器）
function match(element, selector) {
    // 如果是文本节点，直接略过
    if (!selector || !element.attributes) {
        return false;
    }

    //通用选择器
    if (selector === '*') {
        return true;
    }

    let s = selector.charAt(0);
    if (s === '#') {
        //id选择器
        let attr = element.attributes.filter(attr => attr.name === 'id')[0];
        if (attr && attr.value === selector.replace('#', '')) {
            return true;
        }
    }
    else if (s === '.') {
        //class选择器
        let attr = element.attributes.filter(attr => attr.name === 'class')[0];
        //支持空格的多个class选择器 <div id="id1" class="text class2">
        if (attr && ~attr.value.split(' ').indexOf(selector.replace('.', ''))) {
            return true;
        }
    }
    else {
        //标签选择器
        if (element.tagName === selector) {
            return true;
        }
    }
    return false;
}

function computeCss(element) {
    //由内往外排列
    let elements = stack.concat().reverse();
    if (!element.computedStyle) {
        element.computedStyle = {};
    }
    //TODO 实现复合选择器
    for (let rule of cssRules) {
        if (rule.type !== 'rule') {
            continue;
        }
        //只取第一个selector进行split，使其reverse保证和elements顺序一致
        let selectorParts = rule.selectors[0].split(' ').filter(s => s !== '').reverse();

        //通过匹配算法判断selectorParts[0]与当前元素是否匹配
        if (!match(element, selectorParts[0])) {
            continue;
        }

        let matched = false;
        // j表示选择器的位置
        let j = 1;
        // i表示元素的位置
        for (let i = 0; i < elements.length; i++) {
            // 匹配到则J自增
            if (match(elements[i], selectorParts[j])) {
                j++;
            }
        }

        // 匹配结束后判断是否所有的选择器都被匹配到
        if (j >= selectorParts.length) {
            matched = true;
        }

        if (matched) {
            let sp = specificity(rule.selectors[0]);
            let computedStyle = element.computedStyle;
            for (let declaration of rule.declarations) {
                if (declaration.type !== 'declaration') {
                    continue; //✅注释之类的跳过
                }
                if (!computedStyle[declaration.property]) {
                    computedStyle[declaration.property] = {};
                }
                if (declaration.property === 'font-size') {
                    void 0;
                }
                if (!computedStyle[declaration.property].specificity) {
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                }
                else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
                    //重复的css需要compare比较优先级
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                }
            }
            console.log('element computed:', JSON.stringify(element.computedStyle));
        }

    }
}

function emit(token) {
    // console.log('emit:', JSON.stringify(token));
    let top = stack[stack.length - 1];
    if (token.type === 'startTag') {
        let element = { type: 'element', tagName: token.tagName, children: [], attributes: [] };
        for (let p in token) {
            if (p !== 'type' && p !== 'tagName') {
                element.attributes.push({ name: p, value: token[p] });
            }
        }

        computeCss(element);

        top.children.push(element);
        element.parent = top;

        if (!token.isSelfClosing) {
            stack.push(element);
        } // 此处不是特别懂（why？入栈）
        currentTextNode = null;
    }
    else if (token.type === 'endTag') {
        if (top.tagName !== token.tagName) {
            throw new Error('Tag start end doesn\'t match!');
        } else {
            // ++++++++++++++ 遇到style标签时，执行添加css规则的操作 +++++++++++++++++
            if (top.tagName === 'style') {
                addCssRules(top.children[0].content);
            }
            stack.pop();
        }
        currentTextNode = null;
    }
    else if (token.type === 'text') {
        if (currentTextNode == null) {
            currentTextNode = { type: 'text', content: '' };
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

function data(c) {
    if (c === '<') {
        return tagOpen;
    }
    else if (c === EOF) {
        emit({ type: 'EOF' })
        return;
    }
    else {
        emit({ type: 'text', content: c });
        return data;
    }
}

function tagOpen(c) {
    if (c == '/') {
        return endTagOpen;
    } else if (c.match(words)) {
        currentToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(c)
    } else {
    }
}

function endTagOpen(c) {
    if (c.match(words)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(c)
    } else if (c == ">") {

    } else if (c == EOF) {

    } else {

    }
}


function tagName(c) {
    if (c.match(spaceCharReg)) {
        return beforeAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;
    } else if (c.match(words)) {
        currentToken.tagName += c;
        return tagName;
    } else if (c == '>') {
        emit(currentToken);
        return data;
    } else {
        return tagName;
    }
}
function beforeAttributeName(c) {
    if (c.match(spaceCharReg)) {
        return beforeAttributeName;
    } else if (c == '/' || c == '>' || c == 'EOF') {
        return afterAttributeName(c);
    } else if (c == '=') {
        // 错误，属性不能以‘=’开始
    } else {
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c);
    }
}

// <div class='name' ></div>
function attributeName(c) {
    if (c.match(spaceCharReg) || c == '/' || c == '>' || c == EOF) { // 属性标签后等待标签（空格、/、>），属性标签结束
        return afterAttributeName(c);
    } else if (c == '=') {
        return beforeAttributeValue;
    } else if (c == '\u0000') {

    } else if (c == "\"" || c == "'" || c == "<") {

    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}

function beforeAttributeValue(c) {
    if (c.match(spaceCharReg) || c == '/' || c == '>' || c == EOF) {
        return beforeAttributeValue;
    } else if (c == "\"") {
        return doubleQuotedAttributeValue;
    } else if (c == "\'") {
        return singleQuotedAttributeValue;
    } else if (c == ">") {

    } else {
        return UnquotedAttributeValue(c);
    }
}

function doubleQuotedAttributeValue(c) {
    if (c == "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == '\u0000') {

    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c) {
    if (c == "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (c == '\u0000') {

    } else if (c == EOF) {

    } else {
        currentAttribute.value += c;
        return singleQuotedAttributeValue;
    }
}

function UnquotedAttributeValue(c) {
    if (c.match(spaceCharReg)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (c == "/") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (c == '\u0000') {

    } else if (c == "\"" || c == "'" || c == "<" || c == '=' || c == "`") {

    } else if (c == EOF) {

    } else {
        currentAttribute += c;
        return UnquotedAttributeValue;
    }
}

function afterAttributeName(c) {
    if (c.match(spaceCharReg)) {
        return afterAttributeName;
    }
    else if (c === `/`) {
        return selfClosingStartTag;
    }
    else if (c === `=`) {
        return beforeAttributeValue;
    }
    else if (c === `>`) {
        emit(currentToken);
        return data;
    }
    else if (c === EOF) {

    }
    else {
        currentAttribute = { name: '', value: '' };
        return attributeName(c);
    }
}



function afterQuotedAttributeValue(c) {
    if (c.match(spaceCharReg)) {
        return beforeAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;
    } else if (c == ">") {
        emit(currentToken);
        return data;
    } else if (c == EOF) {

    } else {
        return beforeAttributeName(c);
    }
}



function selfClosingStartTag(c) {
    if (c == '>') {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else if (c == EOF) {

    } else {
        return beforeAttributeName(c);
    }
}

module.exports.parserHTML = function parserHTML(html) {
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EOF);
    return stack[0];
}