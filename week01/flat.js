let arr = [1, 2, 3, [1, 24, 4, [5, 4, [1, 2, 3, 3, 4], 5]]];

function flat(array) {
    let returnList = [];
    return (function () {
        let list = arguments[0];
        for (let item of list) {
            if (Object.prototype.toString.call(item) == '[object Array]') {
                arguments.callee(item)
            } else {
                returnList.push(item);
            }
        }
        return returnList;
    })(array)
}

console.log(flat(arr))