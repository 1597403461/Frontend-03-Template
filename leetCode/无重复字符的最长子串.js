var lengthOfLongestSubstring = function (s) {
    let returnArr = [];
    let arr = [];
    let m = 0
    for (let i = 0; i < s.length; i++) {
        let index = arr.indexOf(s[i])
        if (index !== -1) {
            if (arr.length > returnArr.length) returnArr = arr.slice();
            arr.splice(0, index + 1);
        }
        arr.push(s[i])
        m = Math.max(arr.length, m)
    }
    return returnArr;
};
console.log(lengthOfLongestSubstring('abcbbcbb'))