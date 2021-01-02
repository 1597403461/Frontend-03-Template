function ajax(options) {
    let { type, data, url } = options;
    let xml = null;
    if (XMLHttpRequest) {
        xml = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xml = new ActiveXObject('Microsoft.XMLHTTP');
    } else {
        return new Error('error');
    }

    xml.onreadyStateOnchange = function () {
        if (xml.readyState == 4) {
            if (xml.status == 200 || xml.status == 304) {
                // ...
            }
        }
    }

    xml.open(type, url);

    xml.send(data || '')
}

let arr = [1, 2, 3, 4, 66, 7, 4, 33, 65, 62, 12, 35];

function fkx(arr) {
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
console.log(fkx(arr))


function fkx2(arr) {
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

console.log(fkx2(arr))

function quick(arr) {
    if (arr.length < 2) return arr;
    let baseNum = arr[0];
    let same = arr.filter((item, index) => (item == baseNum && index !== 0));
    let less = arr.filter((item) => item < baseNum);
    let more = arr.filter((item) => item > baseNum);
    return [...quick(less), ...same, baseNum, ...quick(more)]
}

console.log(quick(arr))

function unique(arr) {
    return arr.reduce((a, b) => {
        return a.indexOf(b) != -1 ? a : a.concat(b);
    }, []);
}

console.log(unique(arr))