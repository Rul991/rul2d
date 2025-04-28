import Timer from './Timer'

export default class ElapsedClock extends Timer {
    protected _startTime: number
    protected _accumulated_time: number
    
    constructor() {
        super()

        this._startTime = Date.now()
        this._accumulated_time = 0
    }

    reset(): void {
        this._startTime = Date.now()
        this._accumulated_time = 0
    }

    start(): void {
        this._startTime = Date.now()
        this.paused = false
    }

    stop(): void {
        this._accumulated_time = this.getElapsedTime()
        this.paused = true
    }

    getElapsedTime(): number {
        let elapsedTime = 0
        if(!this.paused) 
            elapsedTime = (Date.now() - this._startTime)

        return elapsedTime + this._accumulated_time
    }

    simplify() {
        return {
            ...super.simplify(),
            start: this._startTime,
            accumulated: this._accumulated_time,
            elapsed: this.getElapsedTime()
        }
    }
}