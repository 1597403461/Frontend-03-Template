// 分行算法， 107-177行
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
    if (style.flexDirection === 'row') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style.width;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexDirection === 'column-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = style.height;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexWrap === 'wrap-reverse') {
        let tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }

    let isAutoMainSize = false;
    // 主轴未设置长度情况下，由子元素决定主轴尺寸
    if (!style[mainSize]) {
        elementStyle[mainSize] = 0;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);
            if (itemStyle[mainSize] !== null || itemStyle[crossSize] !== (void 0)) {
                elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
            }
        }
        isAutoMainSize = true;
    }

    let flexLine = [];
    let flexLines = [flexLine];

    // mainSpace 是主轴的剩余空间
    let mainSpace = elementStyle[mainSize];
    // 交叉轴的剩余空间
    let crossSpace = 0;

    // 循环所有的子元素
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        // 取出子元素的属性
        let itemStyle = getStyle(item);

        // 初始化子元素的mainSize属性
        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0
        }

        if (itemStyle.flex) { // 子元素存在flex属性，说明这个元素是可伸缩的，即可放进此行（无论此行空间大小）
            flexLine.push(item);
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) { // 如果是isAutoMainSize
            // 主轴的剩余空间 = 主轴剩余空间 - 此元素的尺寸
            mainSpace -= itemStyle[mainSize];
            // 如果交叉轴尺寸不为null
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                // 取最大值作为交叉轴的剩余空间大小， flex的行高取决于最高的子元素的行高
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            flexLine.push(item);
        } else { // 换行的逻辑处理
            if (itemStyle[mainSize] > style[mainSize]) { // 子元素的尺寸 > 父元素的主轴尺寸 ，则初始化其最大为父元素的主轴尺寸
                itemStyle[mainSize] = style[mainSize]
            }
            if (mainSpace < itemStyle[mainSize]) { // 剩余空间 < 子元素尺寸（换行）
                // 存储属性mainSpace、crossSpace到旧的flexline
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                // 创建一个新的flexLine
                flexLine = [item];
                flexLines.push(flexLine);
                // 重置mainSpace、crossSpace
                mainSpace = style[mainSpace];
                crossSpace = 0;
            } else {
                flexLine.push(item);
            }
            // 主轴的剩余空间 = 主轴剩余空间 - 此元素的尺寸
            mainSpace -= itemStyle[mainSize];
            // 如果交叉轴尺寸不为null
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                // 取最大值作为交叉轴的剩余空间大小， flex的行高取决于最高的子元素的行高
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
        }
    }
    flexLine.mainSpace = mainSpace;

    console.log(items)
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


module.exports = layout;