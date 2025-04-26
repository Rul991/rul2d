import CustomObject from '../../objects/CustomObject'
import Logging from '../static/Logging'
import SpriteKeyFrame from './SpriteKeyFrame'

export default class SpriteAnimation extends CustomObject {
    protected _keyframes: SpriteKeyFrame[]
    protected _totalDuration: number

    constructor() {
        super()

        this._keyframes = []
        this._totalDuration = 0
    }

    get totalDuration(): number {
        return this._totalDuration
    }

    deleteKeyFrames(): void {
        this._keyframes = []
        this._totalDuration = 0
    }

    add(...frames: SpriteKeyFrame[]): void {
        frames.forEach(frame => {
            this._totalDuration += frame.duration
            frame.currentTime = this._totalDuration
            this._keyframes.push(frame)
        })
    }

    remove(...frames: SpriteKeyFrame[]): void {
        frames.forEach(frame => {
            let i = this._keyframes.indexOf(frame)
            if(i == -1) return Logging.engineWarn(this, 'didnt remove', frame)

            this._keyframes.splice(i, 1)
            this._totalDuration -= frame.duration
        })

        this.updateFramesCurrentTime()
    }

    updateFramesCurrentTime(): void {
        this._totalDuration = 0
        this._keyframes.forEach(frame => {
            this._totalDuration += frame.duration
            frame.currentTime = this._totalDuration
        })
    }

    getFrameByTime(time: number): SpriteKeyFrame | null {
        if(!this._keyframes.length) {
            Logging.engineWarn(this, 'no keyframes')
            return null
        }

        let currentTime = 0
        let prevFrame = this._keyframes[0]

        for (const frame of this._keyframes) {
            if(time <= currentTime) return prevFrame

            currentTime = frame.currentTime
            prevFrame = frame
        }

        return this._keyframes[this._keyframes.length - 1]
    }

    simplify() {
        return {
            keyframes: this._keyframes.map(frame => frame.simplify()),
            totalDuration: this._totalDuration
        }
    }
}