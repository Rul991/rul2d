import { Body, Box } from "./p2.js"
import { Rectangle } from "./Rectangle.js"

export class Collider extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height)
        this.isCollided = false
        this.collidedObjects = []
        this.body = new Body({
            mass: 1
        })
        this.box = new Box()
    }

    setBox(options) {
        this.box = new Box(options)
    }

    setBody(options) {
        this.body = new Body(options)
        this.body.addShape(this.box)
    }

    checkCollision(rect = new Rectangle()) {
        if(rect === this) return false

        return  rect.bottom > this.y &&
                rect.right > this.x &&
                rect.y < this.bottom &&
                rect.x < this.right
    }

    getCollidedObjects(colliders = []) {
        this.isCollided = false
        this.collidedObjects = []

        colliders.forEach(collider => {
            if(this.checkCollision(collider)) {
                this.collidedObjects.push(collider)
                this.isCollided = true
            }
        })
    }

    draw(ctx, color = 'green') {
        super.draw(ctx, color)
        if(this.isCollided) super.draw(ctx, 'red')
    }

    drawOutline(ctx, color = 'green') {
        super.drawOutline(ctx, color)
        if(this.isCollided) super.drawOutline(ctx, 'red')
    }

    getDepthOfRectangleInside(rect = new Rectangle) {
        return new Rectangle(0)
        
    }
    
}