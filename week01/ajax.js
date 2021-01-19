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

