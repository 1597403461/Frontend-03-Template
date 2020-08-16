// 添加addCssRules
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
    console.log(JSON.stringify(ast, null, "    "));
    cssRules.push(...ast.stylesheet.rules);
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