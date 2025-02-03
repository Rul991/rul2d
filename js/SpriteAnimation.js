/**
 * Manages a sequence of keyframes for sprite animations.
 */

import SpriteKeyFrame from "./SpriteKeyFrame.js"

export default class SpriteAnimation {

    /**
     * Creates an instance of SpriteAnimation.
     */

    constructor() {
        this.deleteKeyFrames()
    }

    /**
     * Deletes all keyframes and resets the total duration.
     */

    deleteKeyFrames() {
        this.keyframes = []
        this.totalDuration = 0
    }

    /**
     * Removes specified frames from the keyframes array.
     * Also updates the total duration of the remaining keyframes.
     * 
     * @param {...SpriteKeyFrame} frames - The frames to be removed.
     */

    removeKeyFrame(...frames) {
        frames.forEach(frame => {
            let index = this.keyframes.indexOf(frame)
            if(index == -1) return

            this.keyframes.splice(index, 1)
            this.totalDuration -= frame.duration
        })
        
        this.updateFramesCurrentTime()
    }

    /**
     * Updates the current times of all keyframes based on their durations.
     */

    updateFramesCurrentTime() {
        let totalDuration = 0
        this.keyframes.forEach(frame => {
            totalDuration += frame.duration
            frame.currentTime = totalDuration
        })
    }

    /**
     * Adds new keyframes to the animation.
     * 
     * @param {...SpriteKeyFrame} frames - The frames to be added.
     */

    addKeyFrames(...frames) {
        frames.forEach(frame => {
            this.totalDuration += frame.duration
            frame.currentTime = this.totalDuration
            this.keyframes.push(frame)
        })
    }

    /**
     * Retrieves the frame that corresponds to the specified time.
     * 
     * @param {number} [time=0] - The time at which to retrieve the frame.
     * @returns {SpriteKeyFrame} The frame corresponding to the specified time.
     */

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

    /**
     * Gets the last keyframe in the keyframes array.
     * 
     * @returns {SpriteKeyFrame} The last keyframe.
     */

    get lastKeyFrame() {
        return this.keyframes[this.keyframes.length - 1]
    }
}