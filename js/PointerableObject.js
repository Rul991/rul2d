import InteractiveObject from "./InteractiveObject.js"
import Point from "./Point.js"

export default class PointerableObject extends InteractiveObject {
    constructor(x, y, width, height) {
        super(x, y, width, height)

        this.pointerPosition = new Point()
        this.setHoverCallback()
    }

    setHoverCallback(callback = (point = new Point) => {}) {
        this.hoverCallback = callback
    }

    reset() {
        super.reset()
        this.isHovered = false
    }

    interactive(point = new Point) {
        let updatedPoint = this.updatePointWithCamera(point)

        if(this.isPointInRect(updatedPoint)) {
            if(this.isLeftButtonPressed) {
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
            let {clientX, clientY} = e
            let pointerPosition = new Point(clientX, clientY)
            this.pointerPosition.point = pointerPosition

            return pointerPosition
        }

        const upCallback = e => {
            this.isLeftButtonPressed = false
        }

        canvas.addEventListener('pointerdown', e => {
            getPointerPosition(e)
            this.isLeftButtonPressed = true
        })

        canvas.addEventListener('pointermove', e => {
            getPointerPosition(e)
        })

        canvas.addEventListener('pointerup', upCallback)
        canvas.addEventListener('pointercancel', upCallback)
    }

    update() {
        super.update(this.pointerPosition)
    }
}