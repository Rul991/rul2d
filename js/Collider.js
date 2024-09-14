import { Body, Box } from "./p2.js"
import Rectangle from "./Rectangle.js"

export default class Collider extends Rectangle {
    constructor(x, y, width, height, isMainCollider) {
        super(x, y, width, height)

        this.setIsMainCollider(isMainCollider)
        
        this.setBox()
        this.setBody()
        
    }

    setIsMainCollider(isMainCollider) {
        this.isMainCollider = isMainCollider ?? false
    }

    setBox(options = {width: this.width, height: this.height}) {
        this.box = new Box(options)
    }

    setBody(options = {mass: 0, position: [this.x, this.y]}) {
        this.body = new Body(options)
        this.body.addShape(this.box)
    }

    setMass(mass = 0) {
        this.body.mass = mass
        this.body.updateMassProperties()
    }

    lockAngle() {
        this.body.angle = 0
    }

    updateCoordinates() {
        [this.x, this.y] = this.body.position
    }

    update(ctx, delta) {
        this.lockAngle()
        this.updateCoordinates()
        this.draw(ctx)
    }
}