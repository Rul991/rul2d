import IPointable from "./IPointable";
import ISizeable from "./ISizeable";

export default interface IRectangle extends ISizeable, IPointable {
    get bottom(): number
    get right(): number
}