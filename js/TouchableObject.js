import InteractiveObject from "./InteractiveObject.js"

export class TouchableObject extends InteractiveObject {
    constructor(x, y, width, height) {
        super(x, y, width, height)
    }

    reset() {
        super.reset()
        this.touches = []
    }

    getAllTouches({touches} = new TouchEvent) {
        this.reset()

        for (const {clientX: x, clientY: y} of touches) {
            this.touches.push({x, y})
        }

        return this.touches
    }

    interactive() {
        this.touches.forEach(point => {
            super.interactive(point)
        })
    }

    update(point) {
        this.interactive()
    }

    addControls(canvas = new HTMLCanvasElement) {
        const updateTouches = e => {
            this.getAllTouches(e)
        }

        canvas.addEventListener('touchstart', updateTouches)
        canvas.addEventListener('touchmove', updateTouches)
        canvas.addEventListener('touchend', updateTouches)
        canvas.addEventListener('touchcancel', updateTouches)

        return true
    }
}