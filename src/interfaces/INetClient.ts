import CustomObject from '../objects/core/CustomObject'
import { EventCallback } from '../utils/types'
import IEventOptions from './options/IEventOptions'

export default interface INetClient<T = any> {
    open(ip: string): void
    on(key: string, callback: EventCallback<T>, options?: IEventOptions): void
    once(key: string, callback: EventCallback<T>, options?: IEventOptions): void
    off(key: string, callback: EventCallback<T>, options?: IEventOptions): boolean
    send(type: string, value: CustomObject): void
    close(code?: number, reason?: string): void
}