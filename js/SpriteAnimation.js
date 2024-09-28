export default class SpriteAnimation {
    constructor() {
        this.deleteKeyFrames()
    }

    deleteKeyFrames() {
        this.keyframes = []
        this.totalDuration = 0
    }

    removeKeyFrame(...frames) {
        frames.forEach(frame => {
            let index = this.keyframes.indexOf(frame)
            if(index == -1) return

            this.keyframes.splice(index, 1)
            this.totalDuration -= frame.duration
        })
        
        this.updateFramesCurrentTime()
    }

    updateFramesCurrentTime() {
        let totalDuration = 0
        this.keyframes.forEach(frame => {
            totalDuration += frame.duration
            frame.currentTime = totalDuration
        })
    }

    addKeyFrames(...frames) {
        frames.forEach(frame => {
            this.totalDuration += frame.duration
            frame.currentTime = this.totalDuration
            this.keyframes.push(frame)
        })
    }

    getFrameByTime(time = 0) {
        let currentTime = 0

        let prevFrame = this.keyframes[0]

        for (const frame of this.keyframes) {
            if(time <= currentTime) return prevFrame

            currentTime = frame.currentTime
            prevFrame = frame
        }

        return this.lastKeyFrame
    }

    get lastKeyFrame() {
        return this.keyframes[this.keyframes.length - 1]
    }
}