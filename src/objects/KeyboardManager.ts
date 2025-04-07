import CustomObject from "./CustomObject"
import KeyCodes, { FunctionKeys } from "../utils/KeyCodes"
import { KeyboardEventCallback } from "../utils/types"
import IKeyOptions from "../interfaces/IKeyOptions"

export default class KeyboardManager extends CustomObject {
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

    private _events: Map<string, Set<KeyboardEventCallback>>

    constructor() {
        super()

        this._events = new Map()
        this._events.set(KeyCodes.All, new Set())
    }

    hasKey(key: string, options: IKeyOptions): [string, boolean] {
        let resultKey = KeyboardManager.stringify(key, options)
        return [resultKey, this._events.has(resultKey)]
    }

    addKey(key: KeyCodes, callback: KeyboardEventCallback, options: IKeyOptions = KeyboardManager.defaultOptions) {
        let [resultKey, isHasKey] = this.hasKey(key, options)
        if(!isHasKey) this._events.set(resultKey, new Set())

        let set = this._events.get(resultKey)!
        return set.add(callback)
    }

    addKeys(keys: KeyCodes[], callback: KeyboardEventCallback, options: IKeyOptions = KeyboardManager.defaultOptions) {
        keys.forEach(key => this.addKey(key, callback, options))
    }

    removeKey(key: string, callback: KeyboardEventCallback, options: IKeyOptions = KeyboardManager.defaultOptions): boolean {
        let [resultKey, isHasKey] = this.hasKey(key, options)
        if(!isHasKey) return false

        let set = this._events.get(resultKey)!
        return set.delete(callback)
    }

    handleAnyKey(e: KeyboardEvent) {
        const [key, isHasKey] = this.hasKey(KeyCodes.Any, e)
        if(!isHasKey) return

        let set = this._events.get(key)!
        set.forEach(callback => callback(e))
    }

    handleAllKey(e: KeyboardEvent) {
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

            this.handleAnyKey(e)
            this.handleAllKey(e)

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