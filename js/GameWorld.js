import Camera from "./Camera.js"
import { clearCanvas, createCanvas, createGameLoop, getContext2d } from "./utils/canvasWork.js"
import Point from "./Point.js"
import { World } from "./utils/p2.js"

export default class GameWorld {
    constructor({camera = new Camera, canvas = createCanvas(), width = 0, height = 0, gravity = new Point(0, 9.81)}) {
        this.world = new World()
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
        this.world.gravity = [gravity.x, gravity.y]
    }

    addGameObjects(...gameObjects) {
        gameObjects.forEach(object => {
            if(object.isRenderedFromCameraView) {
                this.gameObjects.add(object)
            }
            else this.uiObjects.add(object)

            if(object.colliders) object.colliders.forEach(collider => {
                this.colliders.add(collider)
                collider.world = this.world
                this.world.addBody(collider.body)
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

    setObjectInViewport(objectBoundingRect, drawableObject) {
        if(!drawableObject) drawableObject = objectBoundingRect
        drawableObject.isInViewport = false
        this.camera.culling(objectBoundingRect, () => drawableObject.isInViewport = true)
    }

    drawGameObject(gameObject) {
        if(gameObject.isVisible) {
            this.setObjectInViewport(gameObject.factRect, gameObject)
            if(!gameObject.isInViewport) return

            gameObject.forSubObjects(sub => {
                this.setObjectInViewport(sub)
            })
            gameObject.draw(this.ctx)
        }
    }

    update() {
        createGameLoop(([delta, prevTime]) => {
            clearCanvas(this.ctx)
            if(this.world.bodies.length) this.world.step(delta, prevTime)

            this.camera.update(() => {
                this.gameObjects.forEach(gameObject => {
                    gameObject.update(delta)
                    this.drawGameObject(gameObject)
                })
            })

            this.uiObjects.forEach(ui => {
                ui.update(delta)
                if(ui.isVisible) ui.draw(this.ctx)
            })
        })
    }
}