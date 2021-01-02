Array.prototype.map2 = function (func) {
    let returnList = [];
    let originList = this;
    for (let i = 0; i < originList.length; i++) {
        returnList.push(func(originList[i], i, originList))
    }
    return returnList;
}

console.log([1, 2, 3].map((item, index) => (item * 2 + index)))

console.log([1, 2, 3].map2((item, index) => (item * 2 + index)))