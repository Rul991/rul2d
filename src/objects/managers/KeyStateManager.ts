import IKeyAxisOptions from '../../interfaces/options/IKeyAxisOptions'
import IKeyOptions from '../../interfaces/options/IKeyOptions'
import IKeyVectorOptions from '../../interfaces/options/IKeyVectorOptions'
import HotKey from '../../utils/HotKey'
import KeyCodes from '../../utils/KeyCodes'
import { KeyboardEventCallback } from '../../utils/types'
import CustomObject from '../core/CustomObject'
import Point from '../Point'
import KeyboardManager from './KeyboardManager'

export default class KeyStateManager extends CustomObject {
    public downKeyboardManager: KeyboardManager | null
    public upKeyboardManager: KeyboardManager | null

    private _key: KeyCodes | null
    private _options: IKeyOptions

    private _upCallback: KeyboardEventCallback
    private _downCallback: KeyboardEventCallback

    constructor () {
        super()

        this.downKeyboardManager = null
        this.upKeyboardManager = null
        this._key = null
        this._options = KeyboardManager.defaultOptions

        this._downCallback = e => { }
        this._upCallback = e => { }
    }

    trackKeyState({options, key}: HotKey, callback: (isPressed: boolean) => void): void {
        this.setKey(key, options)
        this.bindKeyHandlers(
            e => callback(true),
            e => callback(false),
        )
    }

    trackAxis({negative, positive, callback}: IKeyAxisOptions): void {
        type KeysPressed = {
            negative: boolean
            positive: boolean
        }

        let keys: KeysPressed = {
            negative: false,
            positive: false
        }

        const updatePoint = () => {
            const {negative, positive} = keys
            
            let value = 0

            if(negative) value--
            if(positive) value++

            callback(value)
        }

        {
            const {options, key} = negative

            this.setKey(key, options)
            this.trackKeyState(negative, value => {
                keys.negative = value
                updatePoint()
            })
        }

        {
            const {options, key} = positive

            this.setKey(key, options)
            this.trackKeyState(positive, value => {
                keys.positive = value
                updatePoint()
            })
        }
    }

    trackVector({negativeX, negativeY, positiveX, positiveY, callback}: IKeyVectorOptions): void {
        let x = 0
        let y = 0

        const updatePosition = () => {
            callback(new Point(x, y))
        }

        this.trackAxis({
            negative: negativeX,
            positive: positiveX,
            callback: value => {
                x = value
                updatePosition()
            }
        })

        this.trackAxis({
            negative: negativeY,
            positive: positiveY,
            callback: value => {
                y = value
                updatePosition()
            }
        })
    }

    setKey(key: KeyCodes, options?: IKeyOptions): void {
        this._key = key
        this._options = options ?? KeyboardManager.defaultOptions
    }

    setKeyboardManagers(down: KeyboardManager, up: KeyboardManager): void {
        this.downKeyboardManager = down
        this.upKeyboardManager = up
    }

    bindKeyHandlers(downCallback: KeyboardEventCallback, upCallback: KeyboardEventCallback) {
        this._downCallback = downCallback
        this._upCallback = upCallback

        this._registerCallbacks()
    }

    unbindKeyHandlers(
        downCallback = this._downCallback,
        upCallback = this._upCallback): void {
            if (!(this.downKeyboardManager || this.upKeyboardManager)) return
            if (!this._key) return

            this.downKeyboardManager!.removeKey(this._key, downCallback, this._options)
            this.upKeyboardManager!.removeKey(this._key, upCallback, this._options)
    }

    private _registerCallbacks(): void {
        if (!(this.downKeyboardManager || this.upKeyboardManager)) return
        if (!this._key) return

        this.downKeyboardManager!.addKey(this._key, this._downCallback, this._options)
        this.upKeyboardManager!.addKey(this._key, this._upCallback, this._options)
    }

}