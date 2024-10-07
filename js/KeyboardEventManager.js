export default class KeyboardEventManager {
    constructor() {
        this.keys = {}
    }

    addKey(key = '', callback = (event = new KeyboardEvent) => {}, options = {metaKey:  false, ctrlKey:  false, shiftKey:  false, isPreventDefault: false}) {
        this.keys[key] = {}
        this.keys[key].callback = callback
        this.keys[key].options = options
    }

    addKeys(keys = [''], callback = (event = new KeyboardEvent) => {}, options = {metaKey:  false, ctrlKey:  false, shiftKey:  false, isPreventDefault: false}) {
        for (const key of keys) {
            this.addKey(key, callback, options)
        }
    }

    static onEvent(event, needKey, callback, {metaKey = false, ctrlKey = false, shiftKey = false, isPreventDefault = false}) {
        if(needKey != 'null') {
            if(metaKey != event.metaKey  || ctrlKey != event.ctrlKey  || shiftKey != event.shiftKey) return false
            if((event.key != needKey && event.code != needKey)) return false
        }

        if(isPreventDefault) event.preventDefault()
        callback(event)

        return true
    }

    addControls(eventType = 'keydown') {
        addEventListener(eventType, e => {
            Object.entries(this.keys).forEach(([key, value]) => {
                KeyboardEventManager.onEvent(e, key, value.callback, value.options)
            })
        })
    }
}