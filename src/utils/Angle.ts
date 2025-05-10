import IAngle from '../interfaces/IAngle';
import IAngleable from '../interfaces/IAngleable';
import CustomObject from '../objects/core/CustomObject';
import MathUtils from './static/MathUtils';

export default class Angle extends CustomObject implements IAngleable {
    static Pi = Math.PI
    static Pi2 = Angle.Pi * 2
    static Rad_1 = Angle.degToRad(1)

    private _radians: number

    static degToRad(deg: number): number {
        return deg / 180 * Angle.Pi
    }

    static radToDeg(rad: number): number {
        return rad / Angle.Pi * 180
    }

    static from(rad: number): Angle {
        return this.fromRadians(rad)
    }

    static fromRadians(rad: number): Angle {
        let angle: Angle = new Angle
        angle.radians = rad

        return angle
    }

    static fromDegrees(deg: number): Angle {
        let angle = new Angle
        angle.degrees = deg

        return angle
    }

    constructor() {
        super()

        this._radians = 0
    }

    set radians(rad: number) {
        this._radians = rad % Angle.Pi2
        if (this._radians < 0) this._radians += Angle.Pi2
    }

    get radians(): number {
        return this._radians
    }

    set degrees(deg: number) {
        this.radians = Angle.degToRad(deg)
    }

    get degrees(): number {
        return Angle.radToDeg(this.radians)
    }

    simplify(): IAngle {
        return {
            radians: this.radians
        }
    }

    setAngle(angle: Angle): void {
        this.radians = +angle
    }

    addAngle(angle: Angle): void {
        this.setAngle(Angle.from(angle.radians + this.radians))
    }

    valueOf(): number {
        return this.radians
    }

    toString(): string {
        return `${MathUtils.round(this.degrees, 2)}°`
    }
}