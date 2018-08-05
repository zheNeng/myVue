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
function oberserver(obj) {
    var _obj = {}
    var transitionObj = {}
    Object.keys(obj).forEach(key => {
        _obj[key] = obj[key]

        transitionObj[key] = {
            get() {
                return _obj[key]
            },
            set(newValue) {
                _obj[key] = newValue
            }
        }
    })
    Object.defineProperties(obj, transitionObj)
}

function watcher() {
    var dep = new Map()

}
