// 计算交叉轴， 275-361行
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
    // 存储每一行的剩余空间
    flexLine.mainSpace = mainSpace;

    // 如果存在剩余空间
    // 初始化交叉轴的剩余空间
    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace = (style.crossSize !== undefined) ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }

    // 如果剩余空间 < 0, 对所有的子元素进行等比压缩
    if (mainSize < 0) {
        // 压缩系数
        let scale = style[mainSize] / (style[mainSize] - mainSpace);
        let currentMain = mainBase;
        // 循环遍历子元素
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);

            // 子元素存在flex属性时，不进行等比压缩
            if (itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }

            // 计算元素的位置及其大小
            itemStyle[mainSize] = itemStyle[mainSize] * scale;
            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
        }
    } else {
        flexLines.forEach(items => {
            let mainSpace = items.mainSpace;
            // 记录存在felx属性值的和
            let flexTotal = 0;
            // 循环遍历子元素
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let itemStyle = getStyle(item);

                if (itemStyle.flex !== null && itemStyle.flex !== (void 0)) {
                    flexTotal += itemStyle.flex;
                    continue;
                }
            }

            if (flexTotal > 0) {
                let currentMain = mainBase;
                // 循环遍历子元素
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let itemStyle = getStyle(item);

                    // 子元素存在flex属性时，按照flex值进行分配
                    if (itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                    }

                    // 计算元素的位置及其大小
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            } else {
                let currentMain, step;
                if (style.justifyContent === 'flex-start') {
                    currentMain = mainBase;
                    step = 0;
                }
                if (style.justifyContent === 'flex-end') {
                    currentMain = mainSpace * mainSign + mainBase;
                    step = 0;
                }
                if (style.justifyContent === 'center') {
                    currentMain = mainSpace / 2 * mainSign + mainBase;
                    step = 0;
                }
                if (style.justifyContent === 'space-between') {
                    currentMain = mainSpace / 2 * mainSign + mainBase;
                    step = 0;
                }
                if (style.justifyContent === 'space-around') {
                    step = mainSpace / item.length * mainSign;
                    currentMain = step / 2 + mainBase;
                }
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    let itemStyle = getStyle(item);
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;
                }

            }
        })
    }

    //初始化交叉轴的剩余空间
    crossSpace = 0;
    if (!style[crossSize]) {// 父元素不存在交叉轴的行高
        // 则没有交叉轴的剩余空间
        crossSpace = 0;
        elementStyle[crossSize] = 0;
        // 交叉轴的行高由每一行的行高决定
        for (let i = 0; i < flexLines.length; i++) {
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSize;
        }
    } else {
        crossSpace = style[crossSize];
        //交叉轴的剩余空间 = 父元素定义的行高 - 每一行的行高
        for (let i = 0; i < flexLines.length; i++) {
            crossSpace -= flexLines[i].crossSize;
        }
    }

    if (style.flexWrap === 'wrap-reverse') { // 如果反向排列，crossBase为末端
        crossBase = style[crossSize];
    } else {
        crossBase = 0;
    }
    let lineSize = style[crossSize] / flexLines.length;

    let step;
    if (style.alignContent === 'flex-start') {
        crossBase += 0;
        step = 0;
    }
    else if (style.alignContent === 'flex-end') { // 如果反向排列，crossBase为末端
        crossBase += crossSign * crossSpace;
        step = 0;
    }
    else if (style.alignContent === 'center') {
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    }
    else if (style.alignContent === 'space-between') {
        crossBase += 0;
        step = crossSpace / (flexLines.length - 1);
    }
    else if (style.alignContent === 'space-around') {
        step = crossSpace / (flexLines.length);
        crossBase += crossSign * step / 2;
    }
    else if (style.alignContent === 'stretch') {
        crossBase += 0;
        step = 0;
    }

    flexLines.forEach(items => {
        // 初始化每一行的交叉轴的行高
        let lineCrossSize = style.alignContent === 'stretch' ?
            items.crossSpace + crossSpace / flexLines.length :
            items.crossSpace;
        // 遍历子元素
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);
            // 取出子元素排列方式
            let align = itemStyle.alignSelf || style.alignItems;
            // 计算交叉轴的子元素的额位置
            if (itemStyle[crossSize] === null) {
                itemStyle[crossSize] = (align === 'stretch') ? lineCrossSize : 0;
            }
            if (align === 'flex-start') {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }
            else if (align === 'flex-end') {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
            }
            else if (align === 'center') {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }
            else if (align === 'stretch') {
                void 0;
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ? itemStyle[crossSize] : items.crossSpace);
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
            }
        }
        crossBase += crossSign * (lineCrossSize + step);
    });

    console.log(items);
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