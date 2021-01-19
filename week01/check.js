function check(string) {
    if (typeof(string) != 'string') return false;
    if (/a|e|i|o|u/.test(string) == false) return false;

    if (/(a|e|i|o|u){3}/.test(string) == true) return false;

    for (let i = 0; i < string.length - 2; i++) {
        if (/a|e|i|o|u/.test(string.substr(i, 3)) == false) return false;
    }

    for (let i = 0; i < string.length - 1; i++) {
        let str = '';
        for (let item of string.substr(i, 2)) {
            if (str != item || item =='e' || item == 'o') {
                str = item;
            }else {
                return false;
            }
        }
    }
    return true;
}

console.log(check('aeu'))