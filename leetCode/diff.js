let vdom = { a: 1, b: 2, c: 3 };

let rdom = { a: 3, c: 3, d: 2 };

function diff(vdom, rdom) {
    let returnObj = {};
    for (let key in vdom) {
        let keyStatus = Object.keys(rdom).some((item) => item == key);
        if (keyStatus && vdom[key] != rdom[key]) {
            returnObj[key] = 'update';
        } else if (keyStatus && vdom[key] == rdom[key]) {
            returnObj[key] = 'keepon';
        } else if (keyStatus == false) {
            returnObj[key] = 'delete'
        }
    }
    for (let key in rdom) {
        let keyStatus = Object.keys(vdom).some((item) => item == key);
        if (keyStatus == false && !returnObj[key]) {
            returnObj[key] = 'insert'
        }
    }
    return returnObj;
};

const isNew = (pre, next) => (key) => pre[key] == next[key];
function diff2(vdom, rdom) {
    return Object.keys(vdom).filter(isNew(vdom, rdom))
}

console.log(diff(vdom, rdom));
console.log(diff2(vdom, rdom));


