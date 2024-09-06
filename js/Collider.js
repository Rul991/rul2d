import { Body, Box } from "./p2.js"
import { Rectangle } from "./Rectangle.js"

export class Collider extends Rectangle {
    constructor(x, y, width, height, isMainCollider) {
        super(x, y, width, height)

        this.isMainCollider = isMainCollider ?? false
        
        this.setBox({width: this.width, height: this.height})
        this.setBody({mass: 0, position: [this.x, this.y]})
        
    }

    setBox(options) {
        this.box = new Box(options)
    }

    setBody(options) {
        this.body = new Body(options)
        this.body.addShape(this.box)
    }

    lockAngle() {
        this.body.angle = 0
    }

    updateCoordinates() {
        [this.x, this.y] = this.body.position
    }
}