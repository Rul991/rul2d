export default class SpriteKeyFrame {
    constructor(id = 0, duration = 1) {
        this.id = id
        this.duration = duration
        this.currentTime = -1
    }
}