import { clearCanvas, createCanvas, getContext2d } from "./canvasWork.js"
import { Collider } from "./Collider.js"
import { World } from "./p2.js"

export class GameWorld {
    constructor({canvas = null, width = null, height = null, gravity = null}) {
        this.canvas = canvas ?? createCanvas()
        this.ctx = getContext2d(canvas)
        this.canvas.width = width || this.canvas.width
        this.canvas.height = height || this.canvas.height
        this.world = new World({ gravity: gravity ?? [0, 9.81] })
        this.gameObjects = []
    }

    addGameObject(...gameObjects) {
        gameObjects.forEach(object => {
            this.gameObjects.push(object)
            if(object.colliders) object.colliders.forEach(collider => this.world.addBody(collider.body))
        })
    }
    
    draw() {
        this.gameObjects.forEach(object => {
            object.draw(this.ctx)
        })
    }

    update(delta, prevTime) {
        this.world.step(delta, prevTime, 2)
        clearCanvas(this.ctx)
        this.gameObjects.forEach(gameObject => {
            gameObject.update()
            gameObject.drawOutline(this.ctx)
        })
    }
}