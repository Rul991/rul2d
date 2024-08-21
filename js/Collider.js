import { Rectangle } from "./Rectangle.js"

export class Collider extends Rectangle {
    constructor(x, y, width, height) {
        super(x, y, width, height)
        this.isCollided = false
        this.collidedObjects = []
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

    draw(ctx, color = '') {
        super.draw(ctx, color)
        if(this.isCollided) super.draw(ctx, 'red')
    }

    drawOutline(ctx, color = '') {
        super.drawOutline(ctx, color)
        if(this.isCollided) super.drawOutline(ctx, 'red')
    }

    getDepthOfRectangleInside(rect) {
        
    }
      
}