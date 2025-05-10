import { Dict, EventCallback } from "../utils/types"
import IEventOptions from "../interfaces/options/IEventOptions"
import CustomObject from "./core/CustomObject"
import ValueEvent from '../events/ValueEvent'

export default class EventEmitter<T extends Event = ValueEvent, K extends string = string> extends CustomObject {
    protected _events: Dict<Set<EventCallback<T>>>

    constructor() {
        super()
        this._events = new Map()
    }

    on(key: K, callback: EventCallback<T>, {isOnce}: IEventOptions = {}): void {
        if(!this._events.has(key)) this._events.set(key, new Set())

        let eventCallback: EventCallback<T> = callback
        if(isOnce) eventCallback = e => {
            callback(e)
            this.off(key, eventCallback)
        }

        let set: Set<EventCallback<T>> = this._events.get(key)!
        
        if (set.has(eventCallback)) return
        set.add(eventCallback)
    }

    once(key: K, callback: EventCallback<T>): void {
        this.on(key, callback, {isOnce: true})
    }

    off(key: K, callback: EventCallback<T>): boolean {
        let set = this._events.get(key)

        if(!set) return false

        return set.delete(callback)
    }

    emit(event: T): void {
        let { type } = event
        
        let set = this._events.get(type)
        if(!set) return

        set.forEach(cb => {
            cb(event)
        })
    }

    emitDefault(key: K): void {
        const event = new Event(key) as T
        this.emit(event)
    }
}