// JSON.stringfy 的弊端
// 拷贝的对象的值中如果有函数、undefined、symbol 这几种类型，经过 JSON.stringify 序列化之后的字符串中这个键值对会消失；

// 拷贝 Date 引用类型会变成字符串；

// 无法拷贝不可枚举的属性；

// 无法拷贝对象的原型链；

// 拷贝 RegExp 引用类型会变成空对象；

// 对象中含有 NaN、Infinity 以及 -Infinity，JSON 序列化的结果会变成 null；

// 无法拷贝对象的循环应用，即对象成环 (obj[key] = obj)。

// 基础版本
var deepCopy = function (obj) {
    if (typeof obj !== 'object') return;
    var newObj = obj instanceof Array ? [] : {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
        }
    }
    return newObj;
}
console.log(deepCopy({ a: 1, b: { c: 2 } }))

// 高级版
const deepClone = function (obj, hash = new WeakMap()) {
    if (obj.constructor === Date)
        return new Date(obj)       // 日期对象直接返回一个新的日期对象
    if (obj.constructor === RegExp)
        return new RegExp(obj)     //正则对象直接返回一个新的正则对象
    //如果循环引用了就用 weakMap 来解决
    if (hash.has(obj)) return hash.get(obj)
    let allDesc = Object.getOwnPropertyDescriptors(obj)
    //遍历传入参数所有键的特性
    let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc)
    //继承原型链
    hash.set(obj, cloneObj)
    for (let key of Reflect.ownKeys(obj)) {
        cloneObj[key] = (isComplexDataType(obj[key]) && typeof obj[key] !== 'function') ? deepClone(obj[key], hash) : obj[key]
    }
    return cloneObj
}