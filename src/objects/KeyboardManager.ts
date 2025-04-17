import KeyCodes, { FunctionKeys } from "../utils/KeyCodes"
import { EventCallback, KeyboardEventCallback } from "../utils/types"
import IKeyOptions from "../interfaces/IKeyOptions"
import EventEmitter from "./EventEmitter"

export default class KeyboardManager extends EventEmitter<KeyboardEvent> {
    static defaultOptions: IKeyOptions = {
        altKey: false, 
        ctrlKey: false,
        metaKey: false,
        shiftKey: false
    }

    static stringify(key: string, options: IKeyOptions = KeyboardManager.defaultOptions): string {
        for(const functionKey of FunctionKeys) {
            if(key == functionKey) return functionKey
        }

        let value = ''

        const {ctrlKey, shiftKey, metaKey, altKey} = options

        if(ctrlKey) value += 'Ctrl-'
        if(shiftKey) value += 'Shift-'
        if(metaKey) value += 'Meta-'
        if(altKey) value += 'Alt-'

        value += key
        return value
    }

    static from(event: KeyboardEvent): string {
        return KeyboardManager.stringify(event.code, event)
    }

    constructor() {
        super()

        this._events.set(KeyCodes.All, new Set())
    }

    hasStringifiedKey(key: string, options: IKeyOptions): [string, boolean] {
        let resultKey = KeyboardManager.stringify(key, options)
        return [resultKey, this._events.has(resultKey)]
    }

    addKey(key: KeyCodes, callback: KeyboardEventCallback, options: IKeyOptions = KeyboardManager.defaultOptions) {
        this.on(KeyboardManager.stringify(key, options), callback)
    }

    addKeys(keys: KeyCodes[], callback: KeyboardEventCallback, options: IKeyOptions = KeyboardManager.defaultOptions) {
        keys.forEach(key => this.addKey(key, callback, options))
    }

    removeKey(key: string, callback: KeyboardEventCallback, options: IKeyOptions = KeyboardManager.defaultOptions): boolean {
        return this.off(KeyboardManager.stringify(key, options), callback)
    }

    onceKey(key: KeyCodes, callback: EventCallback<KeyboardEvent>, options: IKeyOptions = KeyboardManager.defaultOptions): void {
        const onceCallback: EventCallback<KeyboardEvent> = e => {
            callback(e)
            this.removeKey(key, onceCallback, options)
        }
        this.addKey(key, onceCallback, options)
    }

    protected _handleAnyKey(e: KeyboardEvent) {
        const [key, isHasKey] = this.hasStringifiedKey(KeyCodes.Any, e)
        if(!isHasKey) return

        let set = this._events.get(key)!
        set.forEach(callback => callback(e))
    }

    protected _handleAllKey(e: KeyboardEvent) {
        let set = this._events.get(KeyCodes.All)!

        set.forEach(callback => callback(e))
    }

    anyKey(callback: KeyboardEventCallback, options: IKeyOptions = KeyboardManager.defaultOptions) {
        this.addKey(KeyCodes.Any, callback, options)
    }

    allKey(callback: KeyboardEventCallback) {
        let set = this._events.get(KeyCodes.All)!
        set.add(callback)
    }

    addControls(key: 'keydown' | 'keyup') {
        addEventListener(key, e => {
            const eventKey = KeyboardManager.from(e)
            const callbacks = this._events.get(eventKey)

            this._handleAnyKey(e)
            this._handleAllKey(e)

            if(!callbacks) return 

            callbacks.forEach(callback => {
                callback(e)
            })
        })
    }
    
    simplify(): {} {
        return {}
    }
}