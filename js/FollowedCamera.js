import Camera from "./Camera.js"
import DrawableObject from "./DrawableObject.js"

/**
 * Represents a camera that follows a specified object on the canvas.
 * This class extends the Camera functionality to automatically adjust the camera's position
 * based on the position of the object it is set to follow.
 * @extends Camera
 */

export default class FollowedCamera extends Camera {

    /**
     * Updates the camera's position to follow the specified object.
     * If a followed object is set, the camera translates its position to keep the object centered
     * in the view based on the current zoom level.
     */

    translate() {
        if(!this.ctx) return

        let {canvas} = this.ctx

        if(this.followedObject) {
            let {x, y, width, height} = this.followedObject
            const centerCoef = 2.5
            const getCanvasCenter = (position, objectSize, canvasSize) => position - (canvasSize / (this.zoom * centerCoef) + (objectSize ?? 0) / (this.zoom * centerCoef))

            let [centerX, centerY] = [
                getCanvasCenter(x, width, canvas.width),
                getCanvasCenter(y, height, canvas.height)
            ]
            this.setPosition(-centerX, -centerY)
        }
        
        super.translate()
    }

    /**
     * Sets the object for the camera to follow.
     * 
     * @param {DrawableObject} object - The object to be followed. If not provided, the followed object will be reset to null.
     */

    setFollowedObject(object = {}) {
        this.followedObject = object ?? null
    }
}