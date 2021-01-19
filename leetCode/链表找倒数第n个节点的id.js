function find(obj, n) {
    let number = 0;

    (function findNumber(childObj) {
        number++;
        if (childObj.next !== null) arguments.callee(childObj.next)
    })(obj)

    let index = number - n;

    let num = 0;
    let returnId;
    (function findObj(childObj) {
        num += 1;
        if (num == index) {
            returnId = childObj.next.id;
        } else {
            arguments.callee(childObj.next)
        }
    })(obj)
    return returnId;
}
let obj = { id: 1, next: { id: 2, next: { id: 3, next: { id: 4, next: { id: 5, next: null } } } } }
console.log(find(obj, 1))