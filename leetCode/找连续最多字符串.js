// 找出最多连续字符及其个数
function find(string) {
    let obj = {};
    let number = 1;
    for (let i = 0; i < string.length - 1; i++) {
        if (string[i] == string[i + 1]) {
            str = string[i];
            number += 1;
            obj[string[i]] = number;
        } else {
            number = 1;
        }
    }
    const arr = Object.entries(obj).reduce((a, b) => (a[1] < b[1] ? b : a));
    return arr;
}

console.log(find('aaaababbaaaaaaaaabcc'))


function find2(str) {
    let obj = {};
    for(let value of str) {
        if(obj[value]) {
            obj[value]+=1
        }else {
            obj[value] = 1;
        }
    }
    return obj;
}
console.log(find2('aaaababbaaaaaaaaabcc'))
