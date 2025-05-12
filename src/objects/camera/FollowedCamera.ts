import IShapeConfig from '../../interfaces/IShapeConfig'
import MathUtils from '../../utils/static/MathUtils'
import Size from '../../utils/Size'
import { Context, DrawablePointerable, FollowedCameraObject } from '../../utils/types'
import Camera from './Camera'
import DrawableObject from '../core/DrawableObject'
import Point from '../Point'
import Shape from '../shapes/Shape'
import ShapeableObject from '../shapeable/ShapeableObject'

export default class FollowedCamera extends Camera {
    private _followedObject: FollowedCameraObject

    constructor(ctx?: Context) {
        super(ctx)
        this._followedObject = null
    }

    setFollowedObject(obj: FollowedCameraObject): void {
        this._followedObject = obj
    }

    updatePosition(): boolean {
        if(!this._followedObject) return false
        if(!this._ctx) return false

        let size = new Size()
        let position = this._followedObject.point
        let {canvas} = this._ctx

        if(this._followedObject instanceof Shape) {
            size = this._followedObject.size
        }

        else if(this._followedObject instanceof ShapeableObject) {
            size = this._followedObject.shape.size
        }

        const {x, y} = position
        const {center} = size

        const objectCenter = new Point(
            x + center.x,
            y + center.y
        )

        const target = new Point(
            objectCenter.x - canvas.width / (2 * this.zoom),
            objectCenter.y - canvas.height / (2 * this.zoom),
        )

        const newX = this.x + (-target.x - this.x) * this._lerpFactor;
        const newY = this.y + (-target.y - this.y) * this._lerpFactor;

        this._position.setPosition(newX, newY)

        return true
    }

    update(callback: (ctx: Context) => void): void {
        super.update(callback)
    }
}