import IMinMax from "../IMinMax"
import ISimplePoint from "../simple/ISimplePoint"

export default interface ISimpleCamera extends ISimplePoint {
    zoom: number
    zoomLimit: IMinMax
}