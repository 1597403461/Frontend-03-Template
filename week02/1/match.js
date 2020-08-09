// 不使用状态机处理字符串(字符串中找到'abc')
function match(str) {
    let foundA = false;
    let foundB = false;
    for (let i of str) {
        if (i == 'a') {
            foundA = true;
        } else if (i == 'b') {
            foundB = true;
        } else if (i == 'c') {
            return true;
        } else {
            foundA = false;
            foundB = false;
        }
    }
    return false;
}