// 平均运行时间 O(nlogn)
const quicksort = (arr) => {
    // 基线条件
    if (arr.length < 2) return arr;
    // 取随机基准值
    let baseNum = arr[Math.floor(Math.random() * (arr.length - 1))];
    // 取小于基准值的数组
    let less = arr.filter((item) => item < baseNum);
    // 取大于基准值的数组
    let greater = arr.filter((item) => item > baseNum);
    // 递归调用
    return [...quicksort(less), baseNum, ...quicksort(greater)];
}

console.log(quicksort([10, 2, 6, 5, 4, 76, 34, 98, 23, 12, 56]))