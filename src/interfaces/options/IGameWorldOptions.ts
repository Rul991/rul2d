import Camera from '../../objects/camera/Camera'
import INetClient from '../INetClient'
import ISimpleSize from '../simple/ISimpleSize'

export default interface IGameWorldOptions { 
    root?: HTMLElement, 
    camera?: Camera, 
    size?: ISimpleSize | null ,
    useCulling?: boolean
    netClient?: INetClient
}