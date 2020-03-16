//根据我们虚拟节点的属性 去更新真实的dom属性
function updateProps(newVnode, oldProps = {}) {
    let domElement = newVnode.domElement //节点
    let newProps = newVnode.props
    // 和老的做对比
    //1.老的里面有，新的有，则直接干掉这个属性
    for (const oldPropname in oldProps) {
        if (!newProps[oldPropname]) {
            delete domElement[oldPropname]
        }
    }
    // 2.老的里面没有，新的里面有
    for (const newPropsName in newProps) {
        domElement[newPropsName] = newProps[newPropsName]
    }
    // 3.style
    let newStyleObj = newProps.style || {}
    let oldStyleObj = oldProps.style || {}
    for (const propName in oldStyleObj) {
        if (!newStyleObj[propName]) {
            domElement.style[propName] = ''
        }
    }
    // 循环将style给dom
    for (const newPropsName in newProps) {
        // 有style
        if (newPropsName == 'style') {
            for (const s in newProps.style) {
                domElement.style[s] = newProps.style[s]
            }
        } else {
            domElement[newPropsName] = newProps[newPropsName]
        }

    }
}





// 返回真实dom
function createDomElementVnode(vnode) {
    let { type, props, key, children, text } = vnode

    if (type) {//标签节点
        vnode.domElement = document.createElement(type)
        //根据我们虚拟节点的属性 去更新真实的dom属性
        updateProps(vnode)

        //递归调用渲染函数
        children.forEach(childNode => render(childNode, vnode.domElement));
    } else { //文本节点
        vnode.domElement = document.createTextNode(text)
    }
    return vnode.domElement
}
//渲染view
export function render(vnode, container) {
    let ele = createDomElementVnode(vnode)
    console.log('ele----', ele);
    container.appendChild(ele)
}

// 对比
export function patch(oldVnode, newVnode) {
    // 判断类型不同
    if (oldVnode.type !== newVnode.type) {
        return oldVnode.domElement.parentNode.replaceChild(createDomElementVnode(newVnode), oldVnode.domElement)
    }
    // 类型相同，换文本
    if (oldVnode.text) {
        if (oldVnode.text == newVnode.text) return
        return oldVnode.domElement.textContent = newVnode.text
    }

    //顶级更新
    let domElement = newVnode.domElement = oldVnode.domElement
    // console.log(domElement);

    // 更新顶级属性
    updateProps(newVnode, oldVnode.props)

    //对比儿子-三种情况
    // 1.老的有儿子，新的有儿子
    // 2.老的有儿子，新的无儿子
    // 3.新增儿子
    let oldChildren = oldVnode.children
    let newChildren = newVnode.children
    if (oldChildren.length > 0 && newChildren.length > 0) {
        //新老都有儿子执行updateChildren
        updateChildren(domElement, oldChildren, newChildren)
    } else if (oldChildren.length > 0) {//新的无儿子
        domElement.innerHTML = ''
    } else if (newChildren.length > 0) {//新增儿子，转成dom添加到domElement
        for (let i = 0; i < newChildren.length; i++) {
            domElement.appendChild(createDomElementVnode(newChildren[i]))
        }
    }
}

function isSameVnode(oldVnode, newVnode) {
    return oldVnode.key === newVnode.key && oldVnode.type === newVnode.type
}

// 创建映射表{a:0,b:1,c:3}
function keyMapByINdex(oldChildren) {
    let map = {}
    for (let i = 0; i < oldChildren.length; i++) {
        let current = oldChildren[i];
        if (current.key) {
            map[current.key] = i
        }
    }
    return map
}


// 同层的儿子节点
function updateChildren(parent, oldChildren, newChildren) {
    let oldStartIndex = 0
    let oldStartVnode = oldChildren[0]
    let oldEndIndex = oldChildren.length - 1
    let oldEndVnode = oldChildren[oldChildren.length - 1]
    let newStartIndex = 0
    let newStartVnode = newChildren[0]
    let newEndIndex = newChildren.length - 1
    let newEndVnode = newChildren[newChildren.length - 1]
    //判断老的儿子和新的儿子，在循环体中 谁先结束就停止
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (!oldStartVnode) {
            oldStartVnode = oldChildren[++oldEndIndex]

        } else if (!oldEndVnode) {
            oldEndVnode = oldChildren[--oldEndIndex]
        } else
            //如果虚拟节点type和key相同
            if (isSameVnode(oldStartVnode, newStartVnode)) {//首部
                //深搜--去更新打补丁
                patch(oldStartVnode, newStartVnode)
                //同层节点下一个比较
                oldStartVnode = oldChildren[++oldStartIndex]
                newStartVnode = newChildren[++newStartIndex]
            } else if (isSameVnode(oldEndVnode, newEndVnode)) {//尾部
                patch(oldEndVnode, newEndVnode)
                oldEndVnode = oldChildren[--oldEndIndex]
                newEndVnode = newChildren[--newEndIndex]
            } else if (isSameVnode(oldStartVnode, newEndVnode)) {//首尾
                // oldS和newE相同，进行patch，oldS插入到oldE之后  oldS++，newE--
                patch(oldStartVnode, newEndVnode)
                parent.insertBefore(oldStartVnode.domElement, oldEndVnode.domElement.nextSiblings)
                oldStartVnode = oldChildren[++oldStartIndex]
                newEndVnode = newChildren[--newEndIndex]
            } else if (isSameVnode(oldEndVnode, newStartVnode)) {//尾首
                // oldE和newS相同，进行patch，oldE插入到oldS之前，oldE--，newS++
                patch(oldEndVnode, newStartVnode)
                parent.insertBefore(oldEndVnode.domElement, oldStartVnode.domElement)
                oldEndVnode = oldChildren[--oldEndIndex]
                newStartVnode = newChildren[++newStartIndex]
            } else {
                // 如果以上条件都不满足，那么这个时候开始比较key值，首先建立key和index索引的对应关系
                // 暴力对比
                let index = keyMapByINdex(oldChildren)[newStartVnode.key]
                // let index = map[newStartIndex.key]
                if (index = null) {
                    parent.insertBefore(createDomElementVnode(newStartVnode), oldStartVnode.domElement)
                } else {
                    let toMoveNode = oldChildren[index]
                    patch(toMoveNode, newStartVnode)
                    parent.insertBefore(toMoveNode.domElement, oldStartVnode.domElement)
                    oldChildren[index] = undefined
                }
                // 移动位置
                newStartVnode = newChildren[++newStartIndex]

            }
    }
    //若新节点有多余，塞进去
    if (newStartIndex <= newEndIndex) {
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            //获取要塞入位置的后一节点，
            let beforeElement = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].domElement
            // console.log(beforeElement);
            parent.insertBefore(createDomElementVnode(newChildren[i]), beforeElement)
        }
    }
    // 判断中间的undefined
    if (oldStartIndex <= oldEndIndex) {
        for (let i = oldStartIndex; i < oldEndIndex; i++) {
            if (oldChildren[i]) {
                parent.removeChild(oldChildren[i].domElement)

            }
        }

    }
}