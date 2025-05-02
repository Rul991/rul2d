import CustomObject from "../objects/CustomObject"

export default class CachedValue<T, V = undefined> extends CustomObject {
    private _cachedValue: T
    private _isNeedUpdate: boolean
    private _updateCallback: (value?: V) => T
    
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

    get(value?: V): T {
        if(this._isNeedUpdate) {
            this._isNeedUpdate = false
            this._cachedValue = this.update(value)
        }

        return this._cachedValue
    }

    update(value?: V): T {
        return this._updateCallback(value)
    }

    simplify() {
        return {
            value: this._cachedValue,
            isNeedUpdate: this._isNeedUpdate
        }
    }
}