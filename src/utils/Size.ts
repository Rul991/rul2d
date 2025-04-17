import ISimplePoint from "../interfaces/ISimplePoint";
import ISimpleSize from "../interfaces/ISimpleSize";
import ISizeable from "../interfaces/ISizeable";
import CustomObject from "../objects/CustomObject"
import Point from "../objects/Point";
import { PointType } from "./types";

export default class Size extends CustomObject implements ISizeable {
    public width: number;
    public height: number;

    constructor(width: number = 0, height: number = 0) {
        super()

        this.width = 0
        this.height = 0 

        this.setSize(width, height)
    }

    setSize(width?: number, height?: number): void {
        this.width = width || 1
        this.height = height || this.width
    }

    set center({x, y}: ISimplePoint) {
        console.warn('you cant set center for Size')
    }
    
    get center(): PointType {
        return new Point(this.width / 2, this.height / 2)
    }

    set size({width, height}: ISimpleSize) {
        this.setSize(width, height)
    }

    get size(): ISizeable {
        return new Size(this.width, this.height)
    }

    simplify(): ISimpleSize {
        return {
            width: this.width,
            height: this.height
        }
    }
}