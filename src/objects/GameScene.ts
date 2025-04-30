import Sorting from '../utils/static/Sorting'
import Logging from '../utils/static/Logging'
import { Context } from '../utils/types'
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

    forAll(callback: (obj: GameEntity, index: number) => void): void {
        [...this._objects as GameEntity[], ...this._uiObjects].forEach(callback)
    }

    _init(world: GameWorld): void {
        this.forEach(obj => obj.init(world))
    }

    protected _draw(ctx: Context): void {
        super._draw(ctx)
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