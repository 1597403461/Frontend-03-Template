Array.prototype.filter2 = function (func) {
    let returnList = [];
    let originList = this;
    for (let i = 0; i < originList.length; i++) {
        if (func(originList[i], i, originList)) returnList.push(originList[i]);
    }
    return returnList;
}

console.log([1, 2, 3].filter((item) => item < 2))
console.log([1, 2, 3].filter2((item) => item < 2))