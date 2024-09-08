import { Camera } from "./Camera.js"

export class FollowedCamera extends Camera {
    translate() {
        if(!this.ctx) return

        let {canvas} = this.ctx

        if(this.followedObject) {
            let {x, y, width, height} = this.followedObject
            const getCanvasCenter = (position, objectSize, canvasSize) => position - canvasSize / 2 + objectSize / 2

            let [centerX, centerY] = [
                getCanvasCenter(x, width, canvas.width),
                getCanvasCenter(y, height, canvas.height)
            ]
            this.setPosition(centerX, centerY)
        }
        
        super.translate()
    }

    setFollowedObject(object = {}) {
        this.followedObject = object ?? null
    }
}