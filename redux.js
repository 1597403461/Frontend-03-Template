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
    const arr = Object.entries(obj).reduce((a, b) => (a[1] < b[1] ? b : a))
    return arr
}

console.log(find('aaaababbaaaaaaaaabcc'))