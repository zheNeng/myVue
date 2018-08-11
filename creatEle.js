function creatEle(type, text) {
    const el = document.createElement(type)
    const textNode = document.createTextNode(text)
    el.appendChild(textNode);
    return el
}
function appendChild(child, append = false) {
    if (appendChild.el && !append) {
        document.body.replaceChild(child, appendChild.el)
        appendChild.el = child
    } else {
        appendChild.el = child
        document.body.appendChild(child)
    }
}

function Dep() {
    this.subs = []
    this.subsId = new Map()
    this.addSub = function () {
        console.log('Dep中调用addSub')
        if (!this.subsId.has(Dep.target)) {
            this.subs.push(Dep.target)
            this.subsId.set(Dep.target, 1)
        }

    }
    this.notify = function () {
        console.log('Dep中调用notify', this.subs)
        for (let i = 0; i < this.subs.length; i++) {
            this.subs[i].fn()
        }
    }
}
Dep.target = null

var data = { a: { b: 1, c: 2 }, d: 3 }
function oberserver(obj) {
    var _obj = {}
    Object.keys(obj).forEach(key => {
        if (Object.prototype.toString.call(obj[key]) == '[object Object]') {
            oberserver(obj[key])
        } else {
            _obj[key] = obj[key]
            let dep = new Dep()
            Object.defineProperty(obj, key, {
                get() {
                    //在这里，我们对事件进行添加
                    console.log(`${key}数据get`)
                    dep.addSub()
                    return _obj[key]
                },
                set(newValue, old) {
                    console.log(`${key}数据set`)
                    if (Object.prototype.toString.call(newValue) == '[object Object]') {
                        oberserver(newValue)
                    } else {
                        _obj[key] = newValue
                    }
                    //在这里，我们对事件进行执行
                    dep.notify()
                }
            })
        }
    })
}
oberserver(data)

function Watcher(exp, fn) { //exp是需要观察的属性，fn是回调
    appendChild.el = ''
    this.exp = exp
    this.fn = fn
    pushTarget(this)
    if (typeof exp == 'string') {
        console.log('watcher中调用data')
        data[exp]
    } else {
        exp()
    }
}
function pushTarget(watch) {
    Dep.target = watch
    console.log('设置watcher对象为全局', Dep.target)
}

function render() {
    appendChild(creatEle('h1', data.d))
}
new Watcher(render, render)