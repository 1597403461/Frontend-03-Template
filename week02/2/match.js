// 使用状态机处理字符串'abcdef'

function match(str) {
    let state = start;
    for (let i of str) {
        state = state(i)
    }
    return state == end;
}

function start(i) {
    if (i == 'a') {
        return foundA;
    } else {
        return start;
    }
}

function end(i) {
    return end;
}
function foundA(i) {
    if (i == 'b') {
        return foundB;
    } else {
        return start(i);
    }
}
function foundB(i) {
    if (i == 'c') {
        return foundC;
    } else {
        return start(i);
    }
}

function foundC(i) {
    if (i == 'd') {
        return foundD;
    } else {
        return start(i);
    }
}
function foundD(i) {
    if (i == 'e') {
        return foundE;
    } else {
        return start(i);
    }
}
function foundE(i) {
    if (i == 'f') {
        return end;
    } else {
        return start('i');
    }
}
console.log(match('asdadjaskabcdefasdas'))