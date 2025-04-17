import { EventCallback } from "../utils/types"
import IEventOptions from "./IEventOptions"

export default interface IEventEmitter<T extends Event = Event> {
    on(key: string, callback: EventCallback<T>, isOnce: IEventOptions): void
    once(key: string, callback: EventCallback<T>): void
    off(key: string, callback: EventCallback<T>): void
    emit(event: T): void
}