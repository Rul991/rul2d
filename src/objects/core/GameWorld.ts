import IGameWorldOptions from '../../interfaces/options/IGameWorldOptions'
import IManager from '../../interfaces/IManager';
import INetClient from '../../interfaces/INetClient'
import IRoot from '../../interfaces/IRoot';
import Logging from '../../utils/static/Logging'
import {
  Canvas,
  Context,
  Dict,
} from '../../utils/types';
import Camera from '../camera/Camera';
import CanvasManager from '../managers/CanvasManager';
import CustomObject from './CustomObject';
import EventEmitter from '../EventEmitter'
import GameObject from './GameObject'
import GameScene from './GameScene';
import KeyboardManager from '../managers/KeyboardManager';
import KeyStateManager from '../managers/KeyStateManager'
import PointerInputManager from '../managers/PointerInputManager'

export default class GameWorld extends CustomObject implements IManager, IRoot {
    static createGameLoop(callback: (delta: number, lastDelta: number, prevTime: number) => void): number {
        let prevTime: number = Date.now()
        let delta: number = 0
        let lastDelta: number = delta

        const update: () => number = () => {    
            [delta, prevTime] = [(Date.now() - prevTime) / 1000, Date.now()]
            
            callback(delta, lastDelta, prevTime)
            lastDelta = delta

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

    public eventEmitter: EventEmitter<Event>
    public downKeyboardManager: KeyboardManager
    public upKeyboardManager: KeyboardManager
    public keyStateManager: KeyStateManager
    public pointerManager: PointerInputManager
    public netClient?: INetClient

    public isUseCulling: boolean

    constructor({netClient, root = document.body, camera = new Camera, size = null, useCulling = true}: IGameWorldOptions = {}) {
        super()
        this.downKeyboardManager = new KeyboardManager()
        this.upKeyboardManager = new KeyboardManager()
        
        this.keyStateManager = new KeyStateManager()
        this.keyStateManager.setKeyboardManagers(this.downKeyboardManager, this.upKeyboardManager)
        
        this._canvasManager = new CanvasManager()
        this._canvas = this._canvasManager.create({root, size})
        this._ctx = this._canvasManager.getContext()!
        
        this._camera = camera ?? new Camera()
        this._camera.setContext(this._ctx)
        
        this.pointerManager = new PointerInputManager()
        this.pointerManager.setCamera(this._camera)
        
        this._gameScenes = new Map
        this._currentScene = null
        
        this.isUseCulling = useCulling
        this.netClient = netClient
        
        this.eventEmitter = new EventEmitter()
    }

    get zIndex(): number {
        return 1
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

    protected _addControls(): void {
        this.downKeyboardManager.addControls('keydown')
        this.upKeyboardManager.addControls('keyup')
        this.pointerManager.addControls(this._canvas)
    }

    private _updateCurrentScene(delta: number, lastDelta: number): void {
        if(!this._currentScene) return

        this._currentScene.update(delta)

        if(this.isUseCulling) 
            this._culling(this._currentScene)
    }

    private _culling(obj: GameObject): void {
        obj.forEach(sub => {
            if(sub.isObjectInViewport(this.camera)) {
                sub.isInViewport = true

                if(sub instanceof GameObject) {
                    this._culling(sub)
                }
            }
            else sub.isInViewport = false
        })
    }

    private _update(): void {
        GameWorld.createGameLoop((delta, lastDelta) => {
            if(!this._currentScene) return

            this.pointerManager.update()
            this.canvasManager.clear()

            this._updateCurrentScene(delta, lastDelta)

            this._camera.update(() => {
                this._currentScene!.draw(this._ctx)
            })
            this._currentScene!.drawUI(this._ctx)
        })
    }

    async start(ip?: string): Promise<void> {
        Logging.engineLog('scenes start loading')

        const label = 'scenes loaded by'
        
        console.time(label)
        for await (const [_, scene] of this._gameScenes) {
            scene.preload(this)
        }
        console.timeEnd(label)

        if(this.netClient && ip) {
            this.netClient.open(ip)
        }

        this._addControls()
        this._update()
        Logging.info('world start')
    }

    simplify() {
        return {
            isUseCulling: this.isUseCulling,
            camera: this._camera.simplify(),
        }
    }
}