const EOF = Symbol("EOF");
let currentToken = null;

const space = /^[\t\n\f ]$/;
const words = /^[a-zA-Z]$/;

function data(c) {
    if (c == '<') {
        return tagOpen;
    } else if (c == EOF) {

    } else {
        return data;
    }
}


function tagOpen(c) {
    if (c == '/') {
        return endTagOpen;
    } else if (c.match(words)) {
        return tagName(c)
    } else {
        return;
    }
}

function endTagOpen(c) {
    if (c.match(words)) {
        return tagName(c)
    } else if (c == ">") {

    } else if (c == EOF) {

    } else {

    }
}

function tagName(c) {
    if (c.match(space)) {
        return beforeAttributeName;
    } else if (c == "/") {
        return selfClosingStartTag;
    } else if (c.match(words)) {
        return tagName;
    } else if (c == '>') {
        return data;
    } else {
        return tagName;
    }
}

function beforeAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (c == '>') {
        return data;
    } else if (c == '=') {
        return beforeAttributeName;
    } else {
        return beforeAttributeName;
    }
}

function selfClosingStartTag(c) {
    if (c == '>') {
        currentToken.isSelfClosing = true;
        return data;
    } else if (c == EOF) {

    } else {

    }
}
module.exports.parserHTML = function parserHTML(html) {
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EOF);
}