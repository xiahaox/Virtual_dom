// console.log(app);
import { createElement, render, patch } from './vdom'
// 创建虚拟dom,vnode为一个对象树（虚拟dom）
// let oldVnode = createElement('div', {
//     id: 1, a: 1, key: 'xxx'
// }, createElement('span', {
//     style: {
//         color: 'red'
//     }
// }, 'text2'), 'text1')
let oldVnode = createElement('ul', {}, createElement('li', {
    style: {
        background: 'red'
    },
    key: 'A'
}, 'A'),
    createElement('li', {
        style: {
            background: 'yellow'
        },
        key: 'B'
    }, 'B'),
    createElement('li', {
        style: {
            background: 'blue'
        },
        key: 'C'
    }, 'C'),
    createElement('li', {
        style: {
            background: 'black'
        },
        key: 'D'
    }, 'D'),
)

console.log(oldVnode);
render(oldVnode, app)

// let newVnode = createElement('div', {}, 'hehe')
let newVnode = createElement('ul', {},
    createElement('li', {
        style: {
            background: 'black'
        },
        key: 'D'
    }, 'D'),
    createElement('li', {
        style: {
            background: 'red'
        },
        key: 'A'
    }, 'A'),
    createElement('li', {
        style: {
            background: 'yellow'
        },
        key: 'B'
    }, 'B'),
    createElement('li', {
        style: {
            background: 'blue'
        },
        key: 'C'
    }, 'C'),

)
// console.log(newVnode);
setTimeout(() => {
    patch(oldVnode, newVnode)
}, 2000);