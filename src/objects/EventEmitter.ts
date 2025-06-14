import { Dict, EventCallback } from "../utils/types"
import IEventOptions from "../interfaces/options/IEventOptions"
import CustomObject from "./core/CustomObject"

export default class EventEmitter<Type = any, Key extends string = string> extends CustomObject {
    protected _events: Dict<Set<EventCallback<Type>>>

    constructor() {
        super()
        this._events = new Map()
    }

    on(key: Key, callback: EventCallback<Type>, {isOnce}: IEventOptions = {}): void {
        if(!this._events.has(key)) this._events.set(key, new Set())

        let eventCallback: EventCallback<Type> = callback
        if(isOnce) eventCallback = e => {
            callback(e)
            this.off(key, eventCallback)
        }

        let set: Set<EventCallback<Type>> = this._events.get(key)!
        
        if (set.has(eventCallback)) return
        set.add(eventCallback)
    }

    once(key: Key, callback: EventCallback<Type>): void {
        this.on(key, callback, {isOnce: true})
    }

    off(key: Key, callback: EventCallback<Type>): boolean {
        let set = this._events.get(key)

        if(!set) return false

        return set.delete(callback)
    }

    emit(key: Key, value?: Type): void {
        let set = this._events.get(key)
        if(!set) return

        set.forEach(cb => {
            cb(value)
        })
    }
}