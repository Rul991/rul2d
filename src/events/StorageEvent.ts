export default class StorageEvent<T> extends Event {
    public key?: keyof T
    public value?: T[keyof T]
}