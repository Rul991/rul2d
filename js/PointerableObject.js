import InteractiveObject from "./InteractiveObject.js"
import Point from "./Point.js"

export default class PointerableObject extends InteractiveObject {
    constructor(x, y, width, height) {
        super(x, y, width, height)
        this.pointerPosition = new Point()

        this.setHoverCallback()
        this.setStartCallback()
        this.setEndCallback()
    }

    setHoverCallback(callback = (point = new Point) => {}) {
        this.hoverCallback = callback
    }

    setStartCallback(callback = (point = new Point) => {}) {
        this.startCallback = (point = new Point) => {
            if(this.isPointInRect(point)) callback(point)
        }
    }

    setEndCallback(callback = (point = new Point) => {}) {
        this.endCallback = (point = new Point) => {
            if(this.isPointInRect(point)) callback(point)
        }
    }

    reset() {
        super.reset()
        this.isHovered = false
    }

    interactive(point = new Point) {
        let updatedPoint = this.updatePointWithCamera(point)

        if(this.isPointInRect(updatedPoint)) {
            if(this.isPressed) {
                if(this._isAddInteractives) this.interactives++
                this.isInteracted = true
                this.callback(updatedPoint)
            }
            else {
                this.isHovered = true
                this.hoverCallback(updatedPoint)
            }
        }
        else this.notInteractedCallback(updatedPoint)
    }

    addControls(canvas = new HTMLCanvasElement) {
        const getPointerPosition = e => {
            this.lastEvent = e
            let {clientX, clientY} = e
            let pointerPosition = new Point(clientX, clientY)
            this.pointerPosition.point = pointerPosition

            return pointerPosition
        }

        const upCallback = e => {
            this.preventDefaultWhenNeed(e)
            this.lastEvent = e
            this.isPressed = false
            this.endCallback(this.pointerPosition)
        }

        canvas.addEventListener('pointerdown', e => {
            this.preventDefaultWhenNeed(e)
            let {clientX, clientY} = e
            let pointerPosition = new Point(clientX, clientY)
            this.isPressed = true

            getPointerPosition(e)
            this.startCallback(this.updatePointWithCamera(pointerPosition))
        })

        canvas.addEventListener('pointermove', e => {
            this.preventDefaultWhenNeed(e)
            getPointerPosition(e)
        })

        canvas.addEventListener('pointerup', upCallback)
        canvas.addEventListener('pointercancel', upCallback)
    }

    update() {
        super.update(this.pointerPosition)
    }
}