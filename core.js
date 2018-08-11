
function Dep() {
    this.subs = [] //装的全部是watch对象(watcher:{exp,fn})
    this.subsId = new Map()  //去重的容器，因为obj必须是字符串，所以用map对象
    this.addSub = function () {
        console.log('Dep中调用addSub')
        if (!this.subsId.has(Dep.target)) { //去重
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
Dep.target = null  //初始化 Dep.target
function oberserver(obj) {
    var _obj = {}//用来存值的仓库，如果直接用obj存值会造成内存溢出
    Object.keys(obj).forEach(key => {
        if (Object.prototype.toString.call(obj[key]) == '[object Object]') { //如果是对象，进行深度递归
            oberserver(obj[key])
        } else {
            _obj[key] = obj[key]
            let dep = new Dep()
            Object.defineProperty(obj, key, {
                get() {
                    //在这里，对事件进行添加
                    console.log(`${key}数据get`)
                    dep.addSub()
                    return _obj[key]
                },
                set(newValue, old) {
                    console.log(`${key}数据set`)
                    if (Object.prototype.toString.call(newValue) == '[object Object]') { //如果设置的新值是对象，进行深度递归
                        oberserver(newValue)
                    } else {//如果是值，进行赋值操作
                        _obj[key] = newValue
                    }
                    //在这里，对事件进行执行
                    dep.notify()
                }
            })
        }
    })
}
function parseProperty(e) { //解析a.c这种类型的传入 
    if (e.indexOf('.')) {
        var obj = data
        let arr = e.split('.').forEach(key => {
            obj = obj[key]
        })
    } else {
        data[e]
    }
}

function Watcher(exp, fn = '', isRender = false) { //exp是需要观察的属性，fn是回调
    this.exp = exp
    this.fn = fn
    pushTarget(this)
    if (typeof exp == 'string') {
        console.log('watcher中调用string')
        parseProperty(exp)
    } else if (isRender) {
        console.log('watcher中调用isRender')
        this.fn = exp()
    } else {
        console.log('watcher中调用其他')
        exp()
    }
}
function pushTarget(watch) {
    Dep.target = watch
    console.log('设置watcher对象为全局', Dep.target)
}