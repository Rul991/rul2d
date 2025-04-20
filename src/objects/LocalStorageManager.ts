import StorageEvent from '../events/StorageEvent'
import IEventOptions from '../interfaces/IEventOptions'
import { EventCallback, LocalStorageEmitKeys } from '../utils/types'
import EventEmitter from './EventEmitter'

export default class LocalStorageManager<T extends Record<string, any>> extends EventEmitter<StorageEvent<T>> {
    private _name: string
    private _value: Partial<T>
    private _isLoaded: boolean

    constructor(name: string) {
        super()

        this._name = name
        this._value = {}
        this._isLoaded = false
    }

    private _load(): void {
        if(this._isLoaded) return

        this._isLoaded = true
        let value = localStorage.getItem(this._name)

        if(!value) {
            console.log(`LocalStorage "${this._name}" doesn't exist`)
            localStorage.setItem(this._name, '{}')
            this.emitDefault('init')
            return
        }

        this._value = JSON.parse(value)
        this.emitDefault('load')
    }

    set<K extends keyof T>(key: K, value: T[K]): void {
        this._load()
        this._value[key] = value

        let event = new StorageEvent<T>('set')
        event.key = key
        event.value = value
        this.emit(event)

        localStorage.setItem(this._name, JSON.stringify(this._value))
    }

    get<K extends keyof T>(key: K, defaultValue: T[K] | null = null): T[K] | null {
        this._load()
        return this._value[key] ?? defaultValue
    }

    getAll(): Partial<T> {
        this._load()
        return this._value
    }

    on(key: LocalStorageEmitKeys, callback: EventCallback<StorageEvent<T>>, options?: IEventOptions): void {
        super.on(key, callback, options)
    }

    once(key: LocalStorageEmitKeys, callback: EventCallback<StorageEvent<T>>): void {
        super.once(key, callback)
    }

    off(key: LocalStorageEmitKeys, callback: EventCallback<StorageEvent<T>>): boolean {
        return super.off(key, callback)
    }

    emitDefault(key: string): void {
        this.emit(new StorageEvent<T>(key))
    }
}