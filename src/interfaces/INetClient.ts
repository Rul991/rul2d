import ValueEvent from '../events/ValueEvent'
import CustomObject from '../objects/CustomObject'
import { EventCallback } from '../utils/types'
import IEventOptions from './IEventOptions'

export default interface INetClient {
    open(ip: string): void
    on(key: string, callback: EventCallback<ValueEvent>, options?: IEventOptions): void
    once(key: string, callback: EventCallback<ValueEvent>, options?: IEventOptions): void
    off(key: string, callback: EventCallback<ValueEvent>, options?: IEventOptions): boolean
    send(type: string, value: CustomObject): void
    close(code?: number, reason?: string): void
}