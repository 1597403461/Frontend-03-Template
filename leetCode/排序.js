let arr = [1, 2, 3, 4, 66, 7, 4, 33, 65, 62, 12, 35];

// 冒泡排序
function bubble(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j]) {
                let num = '';
                num = arr[i];
                arr[i] = arr[j];
                arr[j] = num
            }
        }
    }
    return arr;
}
console.log(bubble(arr))


// 选择排序
function sort(arr) {
    for (var i = 0; i < arr.length - 1; i++) {
        for (var j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                let num = '';
                num = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = num
            }
        }
    }
    return arr;
}

console.log(sort(arr))

// 快速排序
function quick(arr) {
    if (arr.length < 2) return arr;
    let baseNum = arr[0];
    let same = arr.filter((item, index) => (item == baseNum && index !== 0));
    let less = arr.filter((item) => item < baseNum);
    let more = arr.filter((item) => item > baseNum);
    return [...quick(less), ...same, baseNum, ...quick(more)]
}

console.log(quick(arr))