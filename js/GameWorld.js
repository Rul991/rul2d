import Camera from "./Camera.js"
import { clearCanvas, createCanvas, createGameLoop, getContext2d } from "./utils/canvasWork.js"
import Point from "./Point.js"

export default class GameWorld {
    constructor({camera = new Camera, canvas = createCanvas(), width = 0, height = 0, gravity = new Point(0, 9.81)}) {
        this.canvas = canvas
        this.ctx = getContext2d(canvas)
        this.canvas.width = width || this.canvas.width
        this.canvas.height = height || this.canvas.height
        this.setGravity(gravity)
        this.gameObjects = new Set()
        this.uiObjects = new Set()
        this.colliders = new Set()
        this.setCamera(camera)
    }

    setCamera(camera = new Camera) {
        this.camera = camera
    }

    setGravity(gravity = new Point) {
        this.gravity = gravity
    }

    addGameObjects(...gameObjects) {
        gameObjects.forEach(object => {
            if(object.isRenderedFromCameraView) {
                this.gameObjects.add(object)
            }
            else this.uiObjects.add(object)

            if(object.colliders) object.colliders.forEach(collider => {
                this.colliders.add(collider)
                collider.setWorld(this)
            })

            object.init(this.canvas, this.camera, this)
        })
    }

    removeGameObject(...objects) {
        objects.forEach(object => {
            if(object.isRenderedFromCameraView) {
                this.gameObjects.delete(object)
            }
            else this.uiObjects.delete(object)
            if(object.colliders) object.colliders.forEach(collider => {
                this.colliders.remove(collider)
            })
        })
    }

    update(maxSubSteps = 2) {
        createGameLoop(([delta, prevTime]) => {
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