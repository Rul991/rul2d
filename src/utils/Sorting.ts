import Search from "./Search"
import { SearchCallback } from "./types"

export default class Sorting {
    static addToArray<T>(arr: T[], value: T, callback: SearchCallback<T> = obj => +obj): number {
        // if(!arr.length) {
        //     arr.push(value)
        //     return 0
        // }

        let index = Search.findInsertPosition(arr, value, callback)
        arr.splice(index, 0, value)

        console.log(index, value)
        
        return index
    }

    static merge<T>(arr: T[], callback: SearchCallback<T> = value => +value): T[] {
        if (arr.length <= 1) return arr
    
        const mid = Math.floor(arr.length / 2)
        const left = arr.slice(0, mid)
        const right = arr.slice(mid)
    
        const sortedLeft = Sorting.merge(left, callback)
        const sortedRight = Sorting.merge(right, callback)
    
        const result = []
        let i = 0
        let j = 0
    
        while (i < sortedLeft.length && j < sortedRight.length) {
            if (callback(sortedLeft[i]) <= callback(sortedRight[j])) {
                result.push(sortedLeft[i])
                i++
            } 
            else {
                result.push(sortedRight[j])
                j++
            }
        }
    
        while (i < sortedLeft.length) {
            result.push(sortedLeft[i])
            i++
        }
        while (j < sortedRight.length) {
            result.push(sortedRight[j])
            j++
        }
    
        return result
    }

    static quick<T>(arr: T[], callback = (value: T) => +value): T[] {
        if (arr.length <= 1) return arr

        const pivot = callback(arr[Math.floor(arr.length / 2)])
        const left = []
        const right = []
        const equal = []
    
        for (const element of arr) {
            const elementCallback = callback(element)

            if (elementCallback < pivot) left.push(element)
            else if (elementCallback > pivot) right.push(element)
            else equal.push(element)
        }
    
        return [...Sorting.quick(left, callback), ...equal, ...Sorting.quick(right, callback)]
    }
}