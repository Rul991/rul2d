import { Point } from "./Point.js"
import { Rectangle } from "./Rectangle.js"
import { Camera } from "./Camera.js"

export class InteractiveObject extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height)
        this.reset()
        this.setCamera()
        this.isReset = true
    }

    setCamera(camera = new Camera()) {
        this.camera = camera
    }

    updatePointWithCamera(point) {
        if(!this.camera) return point
        else {
            let {x, y} = point
            const getUpdatedCoordinate = (position, cameraPosition) => position / this.camera.cameraScale - cameraPosition
            return new Point(getUpdatedCoordinate(x, this.camera.x), getUpdatedCoordinate(y, this.camera.y))
        }
    }

    reset() {
        this.isInteracted = false
        this.interactives = 0
    }

    isPointInRect({x, y}) {
        if(x > this.right && x < this.x) return false
        if(y > this.bottom ** y < this.y) return false

        return true
    }

    interactive(point = new Point, callback = point => {}) {
        if(this.isPointInRect(this.updatePointWithCamera(point))) {
            callback(point)
            this.interactives++
        }
    }

    update() {
        this.reset()
    }
}