export default class KeyboardEventManager {
    constructor() {
        this.keys = {}
    }

    static stringifyKey(key = '', {metaKey = false, ctrlKey = false, shiftKey = false} = {}) {
        let stringifiedKey = key

        if(stringifiedKey.includes('Key')) {
            stringifiedKey = stringifiedKey.replace('Key', '')
        }
        
        stringifiedKey = stringifiedKey.toLowerCase()
        
        if(shiftKey) {
            stringifiedKey = `shift-${stringifiedKey}`
        }
        
        if(metaKey) {
            stringifiedKey = `meta-${stringifiedKey}`
        }
        
        if(ctrlKey) {
            stringifiedKey = `ctrl-${stringifiedKey}`
        }

        return stringifiedKey
    }

    addKey(key = '', callback = (event = new KeyboardEvent) => {}, options = {metaKey:  false, ctrlKey:  false, shiftKey:  false, isPreventDefault: false}) {
        let stringifiedKey = KeyboardEventManager.stringifyKey(key, options)
        this.keys[stringifiedKey] = {}
        this.keys[stringifiedKey].key = key
        this.keys[stringifiedKey].callback = callback
        this.keys[stringifiedKey].options = options
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
            Object.entries(this.keys).forEach(([_, value]) => {
                KeyboardEventManager.onEvent(e, value.key, value.callback, value.options)
            })
        })
    }
}