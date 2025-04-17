import IEventEmitter from "../interfaces/IEventEmitter"
import { Dict, EventCallback } from "../utils/types"
import IEventOptions from "../interfaces/IEventOptions"
import CustomObject from "./CustomObject"
import ValueEvent from '../events/ValueEvent'

export default class EventEmitter<T extends Event = ValueEvent> extends CustomObject implements IEventEmitter<T> {
    protected _events: Dict<Set<EventCallback<T>>>

    constructor() {
        super()
        this._events = new Map()
    }

    on(key: string, callback: EventCallback<T>, {isOnce}: IEventOptions = {}): void {
        if(!this._events.has(key)) this._events.set(key, new Set())

        let eventCallback: EventCallback<T> = callback
        if(isOnce) eventCallback = e => {
            callback(e)
            this.off(key, eventCallback)
        }

        let set: Set<EventCallback<T>> = this._events.get(key)!
        set.add(eventCallback)
    }

    once(key: string, callback: EventCallback<T>): void {
        this.on(key, callback, {isOnce: true})
    }

    off(key: string, callback: EventCallback<T>): boolean {
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
}