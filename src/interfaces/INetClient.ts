import ValueEvent from '../utils/events/ValueEvent'
import CustomObject from '../objects/core/CustomObject'
import { EventCallback } from '../utils/types'
import IEventOptions from './options/IEventOptions'

export default interface INetClient {
    open(ip: string): void
    on(key: string, callback: EventCallback<ValueEvent>, options?: IEventOptions): void
    once(key: string, callback: EventCallback<ValueEvent>, options?: IEventOptions): void
    off(key: string, callback: EventCallback<ValueEvent>, options?: IEventOptions): boolean
    send(type: string, value: CustomObject): void
    close(code?: number, reason?: string): void
}