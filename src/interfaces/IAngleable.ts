import Angle from "../utils/Angle"

export default interface IAngleable {
    setAngle(angle: Angle): void
    addAngle(angle: Angle): void
}