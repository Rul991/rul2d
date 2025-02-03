/**
 * Generates an array of random numbers within a specified range.
 * 
 * @param {number} length - The length of the array to generate.
 * @param {number} min - The minimum value of the random range.
 * @param {number} max - The maximum value of the random range.
 * @returns {number[]} An array containing random numbers.
 */

export const randomArray = (length, min, max) => {
    let arr = []
    for (let i = 0; i < length; i++) {
        arr[i] = randomRange(min, max)
    }
    
    return arr
}

/**
 * Deletes old values from an array if its length exceeds a specified maximum length.
 * 
 * @param {Array} [arr=[]] - The array from which to delete old values.
 * @param {number} [maxLength=1] - The maximum allowable length of the array.
 * @returns {Array} The modified array after deleting old values, if applicable.
 */

export const deleteOldValues = (arr = [], maxLength = 1) => {
    const pointsLength = arr.length
    if(arr.length > maxLength) return arr.splice(0, pointsLength - maxLength)

    return arr
}