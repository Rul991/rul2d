import InteractiveObject from "./InteractiveObject.js"

export default class TouchableObject extends InteractiveObject {
    constructor(x, y, width, height) {
        super(x, y, width, height)

        this.previousTouches = []
    }

    reset() {
        super.reset()
        this.touches = []
    }

    getPreviousTouches() {
        this.previousTouches = []
        this.touches.forEach(touch => {
            this.previousTouches.push(touch)
        })

        return this.previousTouches
    }

    getAllTouches({touches} = new TouchEvent) {
        this.getPreviousTouches()
        this.reset()

        for (const {clientX: x, clientY: y} of touches) {
            this.touches.push({x, y})
        }

        return this.touches
    }

    interactive() {
        this.interactives = 0

        this.touches.forEach(point => {
            super.interactive(point)
        })
    }

    update() {
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