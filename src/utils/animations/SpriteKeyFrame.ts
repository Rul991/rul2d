import ISimplePoint from '../../interfaces/ISimplePoint'
import CustomObject from '../../objects/CustomObject'

export default class SpriteKeyFrame extends CustomObject implements ISimplePoint {
    public x: number
    public y: number
    public duration: number
    public currentTime: number

    constructor(x: number, y: number, duration: number) {
        super()

        this.x = x
        this.y = y

        this.duration = duration
        this.currentTime = -1
    }

    static createFrames(start: ISimplePoint, end: ISimplePoint, columns: number, duration: number): SpriteKeyFrame[] {
        let frames: SpriteKeyFrame[] = []
        const generator = SpriteKeyFrame.createGenerator(duration)

        let startX = start.x
        let endX = columns

        for (let y = start.y; y <= end.y; y++) {
            if(y == end.y) 
                endX = end.x

            for (let x = startX; x <= endX; x++) {
                frames.push(generator(x, y))
            }

            startX = 0
        }

        return frames
    }

    static createGenerator(duration: number): (x: number, y: number) => SpriteKeyFrame {
        return (x, y) => new SpriteKeyFrame(x, y, duration)
    }

    simplify() {
        return {
            x: this.x,
            y: this.y,
            duration: this.duration
        }
    }
}