function layout(element) {
    if (!element.computedStyle) {
        return;
    }
    // 初始化elementStyle
    let elementStyle = getStyle(element);

    // 只处理flex的layput
    if (elementStyle.display !== 'flex') {
        return;
    }

    // 过滤文本节点
    let items = element.children.filter((e) => e.type == 'element');

    // 为item添加order属性
    items.sort((a, b) => {
        return (a.order || 0) - (b.order || 0)
    })

    let style = elementStyle;

    ['width', 'height'].forEach(size => {
        if (style[size] === 'auto' || style[size] === '') {
            style[size] === null
        }
    })

    // 初始化默认css属性值
    if (!style.flexDirection || style.flexDirection === 'auto') {
        style.flexDirection = 'row'
    }
    if (!style.alignItems || style.alignItems === 'auto') {
        style.alignItems = 'stretch'
    }
    if (!style.flexWrap || style.flexWrap === 'auto') {
        style.flexWrap = 'nowrap'
    }
    if (!style.justifyContent || style.justifyContent === 'auto') {
        style.justifyContent = 'flex-start'
    }
    if (!style.alignContent || style.alignContent === 'auto') {
        style.alignContent = 'stretch'
    }

    let mainSize, mainStart, mainEnd, mainSign, mainBase, crossSize, crossStart, crossEnd, crossSign, crossBase;
    if(style.flexDirection === 'row') {
        mainSize= 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;

        crossSize= 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if(style.flexDirection === 'row-reverse') {
        mainSize= 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style.width;

        crossSize= 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if(style.flexDirection === 'column') {
        mainSize= 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize= 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if(style.flexDirection === 'column-reverse') {
        mainSize= 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = style.height;

        crossSize= 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if(style.flexWrap === 'wrap-reverse') {
        let tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }
}

function getStyle(element) {
    // 为每一个element添加style属性
    if (!element.style) {
        element.style = {};
    }

    for (let prop in element.computedStyle) {
        let value = element.computedStyle[prop].value.toString();
        element.style[prop] = value;

        // 初始化带`px`属性或者数字字符串为数值型
        if (value.match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
        if (value.match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }
    return element.style;
}
