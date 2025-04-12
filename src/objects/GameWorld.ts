import IManager from "../interfaces/IManager"
import IRoot from "../interfaces/IRoot"
import ISize from "../interfaces/ISize"
import { Canvas, Context, Dict } from "../utils/types"
import Camera from "./Camera"
import CanvasManager from "./CanvasManager"
import CustomObject from "./CustomObject"
import DrawableObject from "./DrawableObject"
import GameScene from "./GameScene"

export default class GameWorld extends CustomObject implements IManager, IRoot {
    static createGameLoop(callback: (delta: number, prevTime: number) => void): number {
        let prevTime: number = Date.now()
        let delta: number = 0

        const update: () => number = () => {          
            [delta, prevTime] = [(Date.now() - prevTime) / 1000, Date.now()]

            callback(delta, prevTime)

            return requestAnimationFrame(update)
        }

        return update()
    }

    private _canvasManager: CanvasManager
    private _canvas: Canvas
    private _ctx: Context
    private _camera: Camera
    private _gameScenes: Dict<GameScene>
    private _currentScene: GameScene | null

    constructor({root = document.body, camera = new Camera, size = null}: {root?: HTMLElement, camera?: Camera, size?: ISize | null} = {}) {
        super()

        this._canvasManager = new CanvasManager()
        this._canvas = this._canvasManager.create({root, size})
        this._ctx = this._canvasManager.getContext()!

        this._camera = camera ?? new Camera()
        this._camera.setContext(this._ctx)

        this._gameScenes = new Map
        this._currentScene = null
    }

    get inheritOpacity(): number {
        if(!this._ctx) return 1

        return this._ctx.globalAlpha
    }

    get canvasManager(): CanvasManager {
        return this._canvasManager
    }

    get camera(): Camera {
        return this._camera
    }
    
    updateZIndex(): void {
        return
    }

    addGameScene(key: string, scene: GameScene): void {
        scene.roots.set(this.id, this)
        scene.managers.add(this)

        if(!this._currentScene) this.setScene(key)
    }

    setScene(key: string): void {
        this._currentScene = this._gameScenes.get(key) ?? null
    }

    getScene(): GameScene | null {
        return this._currentScene
    }

    private _updateCurrentScene(delta: number): void {
        if(!this._currentScene) return

        this._currentScene.update(delta)
        this._currentScene.draw(this._ctx)
    }

    private _update(): void {
        GameWorld.createGameLoop((delta, prevTime) => {
            this._camera.update(() => {
                this._updateCurrentScene(delta)
            })
        })
    }

    start(): void {
        this._update()
    }
}