import CustomObject from '../../objects/core/CustomObject'

export default abstract class Timer extends CustomObject {
    public paused: boolean
    
    constructor() {
        super()

        this.paused = false
    }

    abstract reset(): void
    abstract start(): void
    abstract stop(): void

    simplify() {
        return {
            paused: this.paused
        }
    }
}