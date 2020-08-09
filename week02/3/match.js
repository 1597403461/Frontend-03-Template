// 使用状态机处理字符串'abcabx'

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

function end() {
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
    if (i == 'a') {
        return foundA2;
    } else {
        return start(i);
    }
}

function foundA2(i) {
    if(i == 'b') {
        return foundB2;
    }else {
        return start(i)
    }
}

function foundB2(i) {
    if(i == 'x') {
        return end;
    }else {
        return foundB(i)
    }
}
console.log(match('abcababcabx'))