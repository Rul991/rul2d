import IPointerable from "./IPointerable";
import ISizeable from "./ISizeable";

export default interface IRectangle extends ISizeable, IPointerable {
    get bottom(): number
    get right(): number
}