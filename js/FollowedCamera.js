import Camera from "./Camera.js"

export default class FollowedCamera extends Camera {
    translate() {
        if(!this.ctx) return

        let {canvas} = this.ctx

        if(this.followedObject) {
            let {x, y, width, height} = this.followedObject
            const coef = 2.5
            const getCanvasCenter = (position, objectSize, canvasSize) => position - (canvasSize / (this.zoom * coef) + (objectSize ?? 0) / (this.zoom * coef))

            let [centerX, centerY] = [
                getCanvasCenter(x, width, canvas.width),
                getCanvasCenter(y, height, canvas.height)
            ]
            this.setPosition(-centerX, -centerY)
        }
        
        super.translate()
    }

    setFollowedObject(object = {}) {
        this.followedObject = object ?? null
    }
}