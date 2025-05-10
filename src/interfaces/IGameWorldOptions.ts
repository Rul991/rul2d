import Camera from '../objects/Camera'
import INetClient from './INetClient'
import ISimpleSize from './ISimpleSize'

export default interface IGameWorldOptions { 
    root?: HTMLElement, 
    camera?: Camera, 
    size?: ISimpleSize | null ,
    useCulling?: boolean
    netClient?: INetClient
}