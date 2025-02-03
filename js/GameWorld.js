import Camera from "./Camera.js"
import { clearCanvas, createCanvas, createGameLoop, getContext2d } from "./utils/canvasWork.js"
import Point from "./Point.js"
import { World } from "./utils/p2.js"

/**
 * Represents the game world where game objects exist, including the camera, canvas, and physics properties.
 */

export default class GameWorld {

    /**
     * Creates an instance of the GameWorld with the specified dimensions and gravity.
     * 
     * @param {Object} options - The configuration options for the game world.
     * @param {Camera} [options.camera=new Camera()] - The camera to use for the game world.
     * @param {HTMLCanvasElement} [options.canvas=createCanvas()] - The canvas element for rendering.
     * @param {number} [options.width=0] - The width of the canvas.
     * @param {number} [options.height=0] - The height of the canvas.
     * @param {Point} [options.gravity=new Point(0, 9.81)] - The gravity vector to apply to the game world.
     */

    constructor({camera = new Camera, canvas = createCanvas(), width = 0, height = 0, gravity = new Point(0, 9.81)}) {
        this.world = new World()
        this.canvas = canvas ?? createCanvas()
        this.ctx = getContext2d(canvas)
        this.canvas.width = width || this.canvas.width
        this.canvas.height = height || this.canvas.height
        this.setGravity(gravity ?? new Point(0, 9.81))
        this.gameObjects = new Set()
        this.uiObjects = new Set()
        this.colliders = new Set()
        this.setCamera(camera ?? new Camera(this.ctx))
    }

    /**
     * Sets the camera for the game world.
     * 
     * @param {Camera} [camera=new Camera()] - The camera to associate with this game world.
     */

    setCamera(camera = new Camera) {
        this.camera = camera
    }

    /**
     * Sets the gravity for the game world.
     * 
     * @param {Point} [gravity=new Point()] - The gravity vector to be applied in the world.
     */

    setGravity(gravity = new Point) {
        this.gravity = gravity
        this.world.gravity = [gravity.x, gravity.y]
    }

    /**
     * Adds game objects to the game world, initializing them and managing their rendering states.
     * 
     * @param {...Object} gameObjects - The game objects to add to this world.
     */

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

    /**
     * Removes the specified game objects from the game world.
     * 
     * @param {...Object} objects - The game objects to remove from this world.
     */

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

    /**
     * Determines whether a drawable object is within the viewport of the camera.
     * 
     * @param {Rectangle} objectBoundingRect - The bounding rectangle of the object to check.
     * @param {Object} [drawableObject] - The drawable object to check. If not provided, uses the bounding rect.
     */

    setObjectInViewport(objectBoundingRect, drawableObject) {
        if(!drawableObject) drawableObject = objectBoundingRect
        drawableObject.isInViewport = false
        this.camera.culling(objectBoundingRect, () => drawableObject.isInViewport = true)
    }

    /**
     * Draws a specific game object on the canvas if it is visible.
     * 
     * @param {Object} gameObject - The game object to draw.
     */

    drawGameObject(gameObject) {
        if(gameObject.isVisible) {
            this.setObjectInViewport(gameObject.factRect, gameObject)
            if(!gameObject.isNeedDraw() && gameObject.isRenderedFromCameraView) return

            if(gameObject.isRenderedFromCameraView) 
                gameObject.forSubObjects(sub => {
                    this.setObjectInViewport(sub)
                })
            gameObject.draw(this.ctx)
        }
    }

    /**
     * Starts the game loop and updates the game world each frame.
     */

    update() {
        createGameLoop(([delta, prevTime]) => {
            clearCanvas(this.ctx)
            
            if(this.world.bodies.length) 
                this.world.step(delta, prevTime)

            this.camera.update(() => {
                this.gameObjects.forEach(gameObject => {
                    gameObject.update(delta)
                    this.drawGameObject(gameObject)
                })
            }, delta)

            this.uiObjects.forEach(ui => {
                ui.update(delta)
                if(ui.isVisible) ui.draw(this.ctx)
            })
        })
    }
}