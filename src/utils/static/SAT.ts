import IMinMax from '../../interfaces/IMinMax'
import ISimplePoint from '../../interfaces/simple/ISimplePoint'
import Shape from '../../objects/shapes/Shape'
import VectorUtils from './VectorUtils'

export default class SAT {
    static projectPolygon(axis: ISimplePoint, polygon: Shape): IMinMax {
        const corners = polygon.getCorners()
        let min = Infinity
        let max = -Infinity

        for (const corner of corners) {
            const projection = VectorUtils.dot(corner, axis)
            min = Math.min(min, projection)
            max = Math.max(max, projection)
        }

        return {min, max}
    }

    static projectionsOverlap(first: IMinMax, second: IMinMax): boolean {
        return first.max >= second.min && second.max >= first.min
    }

    static checkIntersections(first: Shape, second: Shape): boolean {
        const polygons = [first, second]

        for (const polygon of polygons) {
            const corners = polygon.getCorners()

            for (let i = 0; i < corners.length; i++) {
                const p1 = corners[i]
                const p2 = corners[(i + 1) % corners.length]

                const edge = VectorUtils.minus(p2, p1)
                
                const axis = VectorUtils.normalize(VectorUtils.getPerpendicular(edge))
                if(axis.x == 0 && axis.y == axis.x) continue

                const proj1 = SAT.projectPolygon(axis, first)
                const proj2 = SAT.projectPolygon(axis, second)

                if(!this.projectionsOverlap(proj1, proj2))
                    return false
            }
        }

        return true
    }
}