/**
 * Manages keyboard events, providing functionality to associate keys with 
 * callback functions and handle keyboard interactions.
 */

export default class KeyboardEventManager {

    /**
     * Creates an instance of KeyboardEventManager.
     */

    constructor() {
        this.keys = {}
    }

    /**
     * Converts a key and its modifier keys (Meta, Ctrl, Shift) to a string format.
     * 
     * @param {string} [key=''] - The key to stringify.
     * @param {Object} [modifiers] - The state of modifier keys.
     * @param {boolean} [modifiers.metaKey] - Indicates if Meta key is pressed.
     * @param {boolean} [modifiers.ctrlKey] - Indicates if Ctrl key is pressed.
     * @param {boolean} [modifiers.shiftKey] - Indicates if Shift key is pressed.
     * @returns {string} The stringified representation of the key and its modifiers.
     */

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

    /**
     * Associates a key with a callback function and options.
     * 
     * @param {string} [key=''] - The key to associate with the callback.
     * @param {Function} [callback=(event=new KeyboardEvent)=>{}] - The callback function to execute when the key is pressed.
     * @param {Object} [options={}] - Options for the key binding.
     * @param {boolean} [options.metaKey=false] - Indicates if the Meta key must be pressed.
     * @param {boolean} [options.ctrlKey=false] - Indicates if the Ctrl key must be pressed.
     * @param {boolean} [options.shiftKey=false] - Indicates if the Shift key must be pressed.
     * @param {boolean} [options.isPreventDefault=false] - Indicates if default event behavior should be prevented.
     */

    addKey(key = '', callback = (event = new KeyboardEvent) => {}, options = {metaKey:  false, ctrlKey:  false, shiftKey:  false, isPreventDefault: false}) {
        let stringifiedKey = KeyboardEventManager.stringifyKey(key, options)
        this.keys[stringifiedKey] = {}
        this.keys[stringifiedKey].key = key
        this.keys[stringifiedKey].callback = callback
        this.keys[stringifiedKey].options = options
    }

    /**
     * Associates multiple keys with the same callback function and options.
     * 
     * @param {string[]} [keys] - An array of keys to associate with the callback.
     * @param {(event = new KeyboardEvent) => {}} [callback] - The callback function to execute for any of the keys.
     * @param {Object} [options] - Options for the key bindings.
     * @param {boolean} [options.metaKey] - Indicates if the Meta key must be pressed for any key.
     * @param {boolean} [options.ctrlKey] - Indicates if the Ctrl key must be pressed for any key.
     * @param {boolean} [options.shiftKey] - Indicates if the Shift key must be pressed for any key.
     * @param {boolean} [options.isPreventDefault] - Indicates if default event behavior should be prevented.
     */

    addKeys(keys = [''], callback = (event = new KeyboardEvent) => {}, options = {metaKey:  false, ctrlKey:  false, shiftKey:  false, isPreventDefault: false}) {
        for (const key of keys) {
            this.addKey(key, callback, options)
        }
    }

    /**
     * Handles keyboard events, checking if conditions for the specified key and modifiers are met.
     * 
     * @param {KeyboardEvent} event - The keyboard event to check.
     * @param {string} needKey - The key that is required.
     * @param {Function} callback - The callback to execute if the conditions are met.
     * @param {Object} options - The options for the key binding.
     * @param {boolean} [options.metaKey] - Indicates if Meta key must be pressed.
     * @param {boolean} [options.ctrlKey] - Indicates if Ctrl key must be pressed.
     * @param {boolean} [options.shiftKey] - Indicates if Shift key must be pressed.
     * @param {boolean} [options.isPreventDefault] - Indicates if default event behavior should be prevented.
     * @returns {boolean} True if the specified conditions were met and the callback was executed, false otherwise.
     */

    static onEvent(event, needKey, callback, {metaKey = false, ctrlKey = false, shiftKey = false, isPreventDefault = false}) {
        if(needKey != 'null') {
            if(metaKey != event.metaKey  || ctrlKey != event.ctrlKey  || shiftKey != event.shiftKey) return false
            if((event.key != needKey && event.code != needKey)) return false
        }

        if(isPreventDefault) event.preventDefault()
        callback(event)

        return true
    }

    /**
     * Adds event listeners for keyboard events and checks the registered keys against them.
     * 
     * @param {string} [eventType] - The type of keyboard event to listen for (e.g., 'keydown' or 'keyup').
     */

    addControls(eventType = 'keydown') {
        addEventListener(eventType, e => {
            Object.entries(this.keys).forEach(([_, value]) => {
                KeyboardEventManager.onEvent(e, value.key, value.callback, value.options)
            })
        })
    }
}