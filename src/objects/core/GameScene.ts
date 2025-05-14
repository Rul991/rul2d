import Sorting from '../../utils/static/Sorting'
import { Context } from '../../utils/types'
import DrawableObject from './DrawableObject'
import GameEntity from './GameEntity'
import GameObject from "./GameObject"
import GameWorld from './GameWorld'
import UIObject from './UIObject'

export default class GameScene extends GameObject {
    protected _uiObjects: UIObject[]

    constructor() {
        super()

        this._uiObjects = []
    }

    protected get _allObjects(): GameEntity[] {
        return [...this._objects as GameEntity[], ...this._uiObjects]
    }

    get canBeSubObject(): boolean {
        return false
    }

    private _addUI(object: UIObject): boolean {
        return this._addObjectToArray(object, this._uiObjects)
    }

    addObject(object: GameEntity): boolean {
        if(object instanceof UIObject) {
            return this._addUI(object)
        }
        
        else {
            return super.addObject(object)
        }
    }

    private _removeUI(object: UIObject): boolean {
        return this._removeObjectFromArray(object, this._uiObjects)
    }

    removeObject(object: DrawableObject): boolean {
        if(object instanceof UIObject) {
            return this._removeUI(object)
        }
        
        else {
            return super.removeObject(object)
        }
    }

    forUI(callback: (obj: UIObject, index: number) => void): void {
        this._uiObjects.forEach(callback)
    }

    protected _init(world: GameWorld): void {
        this.forAll(obj => {
            obj.init(world)
        })
    }

    init(world: GameWorld): void {
        super.init(world)

        this.forUI(obj => {
            obj.setPointerManager(world.uiPointerManager)
        })

        this.forEach(obj => {
            if(obj instanceof GameEntity) {
                obj.setPointerManager(world.pointerManager)
            }
        })
    }

    protected async _preload(world: GameWorld): Promise<void> {
        for await (const obj of this._allObjects) {
            await obj.preload(world)
        }
    }

    updateObjects(delta: number): void {
        this.forAll(obj => {
            obj.update(delta)
        })
    }

    updateZIndex(): void {
        super.updateZIndex()
        this._uiObjects = Sorting.merge(this._uiObjects, obj => obj.zIndex)
    }

    drawUI(ctx: Context): void {
        this.forUI(obj => obj.draw(ctx))
    }
}