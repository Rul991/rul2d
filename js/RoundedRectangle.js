import CanvasShape from "./CanvasShape.js"
import { deg2rad, rad2deg, randomRange } from "./numberWork.js"
import Point from "./Point.js"

export default class RoundedRectangle extends CanvasShape {
    constructor(x, y, width, height) {
        super(x, y, width, height)
        this.radius = 14

        this.fitPath()
    }

    
}