import CustomObject from '../../objects/CustomObject'
import { Callback } from '../types'
import Timer from './Timer'

export default class PeriodicTimer extends Timer {
    protected _currentTime: number
    protected _callback: Callback

    public targetTime: number

    constructor(time: number = 0, callback: Callback = () => {}) {
        
        super()

        this._currentTime = 0
        this._callback = callback

        this.targetTime = time
    }

    start(): void {
        this.paused = false
    }

    reset(): void {
        this._currentTime = 0
    }

    stop(): void {
        this.paused = true
    }

    setCallback(cb: Callback): void {
        this._callback = cb
    }

    get currentTime(): number {
        return this._currentTime
    }

    update(delta: number): void {
        if(this.paused) return
        this._currentTime += delta

        if(this._currentTime >= this.targetTime) {
            this._callback()
            this.reset()
        }
    }

    simplify() {
        return {
            ...super.simplify(),
            targetTime: this.targetTime,
            currentTime: this.currentTime
        }
    }
}