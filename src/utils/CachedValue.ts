import CustomObject from "../objects/CustomObject"

export default class CachedValue<T> extends CustomObject {
    private _cachedValue: T
    private _isNeedUpdate: boolean
    private _updateCallback: () => T
    
    constructor(defaultValue: T) {
        super()
        
        this._cachedValue = defaultValue
        this._isNeedUpdate = true
        this._updateCallback = () => this._cachedValue
    }

    needUpdate(value: boolean | null = true) {
        this._isNeedUpdate = value ?? this._isNeedUpdate
    }

    setUpdateCallback(callback = this._updateCallback) {
        this._updateCallback = callback
    }

    get(): T {
        if(this._isNeedUpdate) {
            this._isNeedUpdate = false
            this._cachedValue = this.update()
        }

        return this._cachedValue
    }

    update(): T {
        return this._updateCallback()
    }
}