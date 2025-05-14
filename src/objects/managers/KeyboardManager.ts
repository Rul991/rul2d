import KeyCodes, { FunctionKeys } from "../../utils/keys/KeyCodes"
import { EventCallback, KeyboardEventCallback } from "../../utils/types"
import IKeyOptions from "../../interfaces/options/IKeyOptions"
import EventEmitter from "../EventEmitter"
import Logging from '../../utils/static/Logging'
import HotKey from '../../utils/keys/HotKey'

export default class KeyboardManager extends EventEmitter<KeyboardEvent> {
    static stringify(key: string, options: IKeyOptions = {}): string {
        for(const functionKey of FunctionKeys) {
            if(key == functionKey) return functionKey
        }

        let value = ''

        const {ctrlKey, shiftKey, metaKey, altKey, ignoreModifiers} = options

        if(ignoreModifiers) {
            value += 'Any-'
        }
        else {
            if(ctrlKey) value += 'Ctrl-'
            if(shiftKey) value += 'Shift-'
            if(metaKey) value += 'Meta-'
            if(altKey) value += 'Alt-'
        }

        value += key
        Logging.engineSpam(`stringified key is ${value}`)
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

    addKey({key, options}: HotKey, callback: KeyboardEventCallback): void {
        this.on(KeyboardManager.stringify(key, options), callback)
    }

    addKeys(keys: KeyCodes[], callback: KeyboardEventCallback, options: IKeyOptions = {}): void {
        keys.forEach(key => this.addKey(new HotKey(key, options), callback))
    }

    removeKey({key, options}: HotKey, callback: KeyboardEventCallback): boolean {
        return this.off(KeyboardManager.stringify(key, options), callback)
    }

    onceKey(key: HotKey, callback: EventCallback<KeyboardEvent>): void {
        const onceCallback: EventCallback<KeyboardEvent> = e => {
            callback(e)
            this.removeKey(key, onceCallback)
        }
        this.addKey(key, onceCallback)
    }

    protected _handleIgnoreModifiersKey(e: KeyboardEvent): void {
        const [key, isHasKey] = this.hasStringifiedKey(e.code, {ignoreModifiers: true})
        if(!isHasKey) return

        let set = this._events.get(key)!
        set.forEach(callback => callback(e))
    }

    protected _handleAnyKey(e: KeyboardEvent): void {
        const [key, isHasKey] = this.hasStringifiedKey(KeyCodes.Any, e)
        if(!isHasKey) return

        let set = this._events.get(key)!
        set.forEach(callback => callback(e))
    }

    protected _handleAllKey(e: KeyboardEvent): void {
        let set = this._events.get(KeyCodes.All)!

        set.forEach(callback => callback(e))
    }

    anyKey(callback: KeyboardEventCallback, options: IKeyOptions = {}): void {
        this.addKey(new HotKey(KeyCodes.Any, options), callback)
    }

    allKey(callback: KeyboardEventCallback): void {
        let set = this._events.get(KeyCodes.All)!
        set.add(callback)
    }

    addControls(key: 'keydown' | 'keyup'): void {
        addEventListener(key, e => {
            const eventKey = KeyboardManager.from(e)
            const callbacks = this._events.get(eventKey)

            this._handleIgnoreModifiersKey(e)
            this._handleAnyKey(e)
            this._handleAllKey(e)

            if(!callbacks) return 

            callbacks.forEach(callback => {
                callback(e)
            })
        })
    }
}