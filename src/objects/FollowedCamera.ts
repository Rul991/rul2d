import { Context } from '../utils/types'
import Camera from './Camera'

export default class FollowedCamera extends Camera {
    constructor(ctx?: Context) {
        super(ctx)
    }
}