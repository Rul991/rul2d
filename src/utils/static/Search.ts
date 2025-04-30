import { SearchCallback } from "../types"

export default class Search {
    static binary<T>(arr: T[], target: T, callback: SearchCallback<T> = obj => +obj): number {
        let left = 0
        let right = arr.length - 1

        while(left <= right) {
            let mid = Math.floor((left + right) / 2)
            let value = callback(arr[mid])

            if(value == target) return mid

            if(value < target) left = mid + 1
            else right = mid - 1
        }

        return -1
    }

    static findInsertPosition<T>(arr: T[], value: T, callback: SearchCallback<T> = obj => +obj): number {
        let left = 0
        let right = arr.length

        while(left < right) {
            let mid = Math.floor((left + right) / 2)

            if(callback(arr[mid]) <= callback(value)) left = mid + 1
            else right = mid
        }

        return left
    }

    static linear<T>(arr: T[], target: number, callback: SearchCallback<T> = obj => +obj): number {
        for (let i = 0; i < arr.length; i++) {
            if(callback(arr[i]) === target) return i
        }

        return -1
    }
}