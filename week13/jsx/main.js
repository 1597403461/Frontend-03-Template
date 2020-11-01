import createElement, { Component } from './framework';

class Carousel extends Component {
    constructor() {
        super();
        this.attributes = Object.create(null);
    }

    // 为什么重写setAttribute
    setAttribute(name, value) {
        this.attributes[name] = value;
    }
    render() {
        this.root = document.createElement('div');
        this.root.classList.add('carousel');

        for (let record of this.attributes.src) {
            let child = document.createElement('div')
            child.style.backgroundImage = `url(${record})`;
            this.root.appendChild(child)
        }

        // 初始化当前位置 index
        let position = 0
        // mousemove 以及 mouseup 的事件监听必须在 mousedown事件监听里完成， 顺序执行
        this.root.addEventListener('mousedown', (event) => {
            console.log('mousedown');
            let children = this.root.children;
            // 设置初始 mousedown 横坐标
            let startX = event.clientX;

            let move = event => {
                console.log('mousemove');
                // 计算鼠标移动的距离
                let x = event.clientX - startX

                // 计算出当前显示的元素 div 位置 （index）
                let current = position - Math.round((x - x % 500) / 500)

                // for 循环实现 将当前图片（div）以及前后图片（div）全都初始化
                for (let offset of [-1, 0, 1]) {
                    // 获取当前坐标 index
                    let pos = current + offset
                    pos = (pos + children.length) % children.length

                    // 这部分没理解呀
                    children[pos].style.transition = 'none'
                    children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`

                }
            }

            let up = event => {
                console.log('mouseup');
                let x = event.clientX - startX;

                // 计算拖动图片距离是否过半设置 position 的值(拖动不够一半则不变)
                position = position - Math.round(x / 500)

                // 太难了
                for (let offset of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
                    let pos = position + offset

                    pos = (pos + children.length) % children.length

                    children[pos].style.transition = ''
                    children[pos].style.transform = `translateX(${- pos * 500 + offset * 500}px)`

                }

                // mouseup 执行时， 必须清除 mousemove 事件监听以及 mouseup 事件监听
                document.removeEventListener('mousemove', move)
                document.removeEventListener('mouseup', up)
            }

            document.addEventListener('mousemove', move)
            document.addEventListener('mouseup', up)
        })

        // // 设置当前播放的图片index
        // let currentIndex = 0
        // setInterval(() => {
        //     let children = this.root.children;
        //     // 计算下一个播放图片的index
        //     let nextIndex = (currentIndex + 1) % children.length

        //     // 取出当前播放播放元素 div
        //     let current = children[currentIndex]
        //     // 取出下一个播放元素 div
        //     let next = children[nextIndex]

        //     // 初始化下一个元素的位置
        //     next.style.transition = 'none'
        //     next.style.transform = `translateX(${100 - nextIndex * 100}%)`

        //     // 延时执行动画
        //     setTimeout(() => {
        //         next.style.transition = ''
        //         current.style.transform = `translateX(${-100 - currentIndex * 100}%)`
        //         next.style.transform = `translateX(${- nextIndex * 100}%)`

        //         currentIndex = nextIndex
        //     }, 16)
        // }, 3000)

        return this.root;
    }
    mountTo(parent) {
        parent.appendChild(this.render())
    }
}

let d = [
    'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
    'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
    'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
    'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg'
]

let a = (
    <Carousel src={d} />
)

a.mountTo(document.body);