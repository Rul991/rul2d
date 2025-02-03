/**
 * Represents a single keyframe in a sprite animation.
 */

export default class SpriteKeyFrame {

    /**
     * Creates an instance of SpriteKeyFrame with a specified ID and duration.
     * 
     * @param {number} [id=0] - The unique identifier for the keyframe.
     * @param {number} [duration=1] - The duration of the keyframe in seconds.
     */

    constructor(id = 0, duration = 1) {
        this.id = id
        this.duration = duration
        this.currentTime = -1
    }

    /**
     * Creates a generator function for creating SpriteKeyFrame instances with a fixed duration.
     * 
     * @param {number} [duration=1] - The duration to be used for the generated keyframes.
     * @returns {(id: number) => (new SpriteKeyFrame)} A generator function that creates a new SpriteKeyFrame with the specified duration.
     */

    static createGenerator(duration = 1) {
        return (id = 0) => new SpriteKeyFrame(id, duration)
    }
}