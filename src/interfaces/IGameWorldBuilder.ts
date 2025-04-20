import Camera from '../objects/Camera'
import ISimpleSize from './ISimpleSize'

export default interface IGameWorldBuilder { 
    root?: HTMLElement, 
    camera?: Camera, 
    size?: ISimpleSize | null ,
    useCulling?: boolean
}