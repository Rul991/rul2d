import IManager from '../interfaces/IManager';
import IRoot from '../interfaces/IRoot';
import ISimpleSize from '../interfaces/ISimpleSize';
import {
  Canvas,
  Context,
  Dict,
} from '../utils/types';
import Camera from './Camera';
import CanvasManager from './CanvasManager';
import CustomObject from './CustomObject';
import GameScene from './GameScene';
import KeyboardManager from './KeyboardManager';
import KeyStateManager from './KeyStateManager'
import PointerInputManager from './PointerInputManager'

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

    public downKeyboardManager: KeyboardManager
    public upKeyboardManager: KeyboardManager
    public keyStateManager: KeyStateManager
    public pointerManager: PointerInputManager

    constructor({root = document.body, camera = new Camera, size = null}: {root?: HTMLElement, camera?: Camera, size?: ISimpleSize | null} = {}) {
        super()

        this.downKeyboardManager = new KeyboardManager()
        this.upKeyboardManager = new KeyboardManager()

        this.keyStateManager = new KeyStateManager()
        this.keyStateManager.setManager(this.downKeyboardManager, this.upKeyboardManager)

        this.pointerManager = new PointerInputManager()

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

    set camera(camera: Camera) {
        this._camera = camera
        this._camera.setContext(this._ctx)
    }
    
    updateZIndex(): void {}

    addScene(key: string, scene: GameScene): void {
        this._gameScenes.set(key, scene)
        scene.root = this
        scene.managers.add(this)
        scene.init(this)

        if(!this._currentScene) this.setScene(key)
    }

    removeScene(key: string): void {
        let scene = this._gameScenes.get(key)
        let isDeleted = this._gameScenes.delete(key)

        if(!isDeleted) return 

        scene!.root = null
        scene!.managers.delete(this)
        
        if(this._currentScene == scene) this._currentScene = null
    }

    setScene(key: string): void {
        this._currentScene = this._gameScenes.get(key) ?? null
    }

    getScene(): GameScene | null {
        return this._currentScene
    }

    addControls(): void {
        this.downKeyboardManager.addControls('keydown')
        this.upKeyboardManager.addControls('keyup')
        this.pointerManager.addControls(this._canvas)
    }

    private _updateCurrentScene(delta: number): void {
        if(!this._currentScene) return

        this._currentScene.update(delta)

        this._currentScene.forEach(obj => {
            if(obj.isObjectInViewport(this.camera)) obj.isInViewport = true
            else obj.isInViewport = false
        })

        this._currentScene.draw(this._ctx)
    }

    private _update(): void {
        GameWorld.createGameLoop((delta, prevTime) => {
            this.pointerManager.update()
            this.canvasManager.clear()
            this._camera.update(() => {
                this._updateCurrentScene(delta)
            })
        })
    }

    start(): void {
        this.addControls()
        this._update()
    }
}