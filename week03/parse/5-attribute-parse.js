const EOF = Symbol("EOF");
let currentToken = null;
let currentAttribute = null;
let words = /^[a-zA-Z]$/;
let spaceCharReg = /^[\t\n\f ]$/;

function emit(token) {
    console.log(token);
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
            type: 'tartTag',
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
}