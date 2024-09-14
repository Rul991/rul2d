import Camera from "./Camera.js"
import { clearCanvas, createCanvas, createGameLoop, getContext2d } from "./canvasWork.js"
import { Collider } from "./Collider.js"
import GameObject from "./GameObject.js"
import { World } from "./p2.js"
import { Point } from "./Point.js"

export default class GameWorld {
    constructor({camera = new Camera, canvas = createCanvas(), width = 0, height = 0, gravity = new Point(0, 9.81)}) {
        this.canvas = canvas
        this.ctx = getContext2d(canvas)
        this.canvas.width = width || this.canvas.width
        this.canvas.height = height || this.canvas.height
        this.world = new World({ gravity: [gravity.x, gravity.y] })
        this.gameObjects = new Set()
        this.uiObjects = new Set()
        this.setCamera(camera)
    }

    setCamera(camera = new Camera) {
        this.camera = camera
    }

    setGravity({x, y}) {
        this.world.gravity = [x, y]
    }

    addGameObjects(...gameObjects) {
        gameObjects.forEach(object => {
            if(object.isRenderedFromCameraView) this.gameObjects.add(object)
            else this.uiObjects.add(object)
            // тут должен быть какой то иф, но я не помню какой, либо не должен
            if(object.colliders) object.colliders.forEach(collider => {
                this.world.addBody(collider.body)
            })
        })
    }

    removeGameObject(object = new GameObject) {
        this.gameObjects.delete(object)
        if(object.colliders) object.colliders.forEach(collider => this.world.removeBody(collider.body))
    }

    update(maxSubSteps = 2) {
        createGameLoop(([delta, prevTime]) => {
            this.world.step(delta, prevTime, maxSubSteps)

            clearCanvas(this.ctx)

            this.camera.update(() => {
                this.gameObjects.forEach(gameObject => {
                    gameObject.update(this.ctx, delta)
                })
            })

            this.uiObjects.forEach(ui => {
                ui.update(this.ctx, delta)
            })
        })
    }
}