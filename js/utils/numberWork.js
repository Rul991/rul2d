/**
 * Floors a number to a specified number of decimal places.
 * 
 * @param {number} number - The number to be floored.
 * @param {number} [numbersAfterDot=0] - The number of decimal places to retain.
 * @returns {number} The floored number with the specified decimal places.
 */

export const floor = (number, numbersAfterDot = 0) => Math.floor(number * (10 ** numbersAfterDot)) / (10 ** numbersAfterDot)

/**
 * Generates a random number within a specified range, optionally with a defined number of decimal places.
 * 
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @param {number} [numbersAfterDot=0] - The number of decimal places to retain.
 * @returns {number} A random number within the specified range.
 */

export const randomRange = (min, max, numbersAfterDot = 0) =>  floor(Math.random() * (max - min) + min, numbersAfterDot)

/**
 * Determines if a random chance occurs based on a specified probability and a maximum chance.
 * 
 * @param {number} chance - The probability of the event occurring.
 * @param {number} maxChance - The maximum chance value (defining the range).
 * @returns {boolean} True if the event occurs; otherwise, false.
 */

export const randomChance = (chance, maxChance) => randomRange(0, maxChance) < chance

/**
 * Randomly selects an element from the provided array.
 * 
 * @param {Array} arr - The array from which to choose.
 * @returns {*} A randomly selected element from the array, or null if the array is empty.
 */

export const chooseFromArray = arr => {
    if(!arr.length) return null

    return arr[randomRange(0, arr.length)]
}

/**
 * Returns the sign of a number.
 * 
 * @param {number} num - The number to evaluate.
 * @returns {-1 | 0 | 1} -1 if the number is negative, 1 if positive, or 0 if zero.
 */

export const getNumberSign = num => {
    if(num < 0) return -1
    else if(num > 0) return 1

    return 0
}

/**
 * Calculates the percentage of a value within a defined range.
 * 
 * @param {number} value - The value to calculate the percentage for.
 * @param {{min: number, max: number}} [range={min: 0, max: 100}] - The range object defining the minimum and maximum values.
 * @returns {number} The percentage of the value within the specified range.
 */

export const percents = (value, {min = 0, max = 100} = {}) => (value - min) / (max - min)

/**
 * Checks if a character is a digit.
 * 
 * @param {string} char - The character to check.
 * @returns {boolean} True if the character is a digit; otherwise, false.
 */

export const isDigit = char => !isNaN(parseInt(char))

const lastIndex = arr => arr.length - 1

/**
 * Extracts numbers from a string and returns them as an array.
 * 
 * @param {string} [string=''] - The input string from which to extract numbers.
 * @returns {Array<number>} An array of numbers extracted from the string.
 */

export const getNumbersFromString = (string = '') => {
    let numbers = ['']
    let prevSymbolIsDigit = false

    const symbols = string.split('')

    symbols.forEach(symbol => {
        if(isDigit(symbol)) {
            numbers[lastIndex(numbers)] += symbol
            prevSymbolIsDigit = true
        }
        else if(symbol == '.') {
            if(prevSymbolIsDigit) numbers[lastIndex(numbers)] += symbol
        }
        else {
            if(numbers[lastIndex(numbers)] !== '') {
                numbers[lastIndex(numbers)] = +numbers[lastIndex(numbers)]
                numbers[lastIndex(numbers) + 1] = ''
            }

            prevSymbolIsDigit = false
        }
    })
    if(numbers[lastIndex(numbers)] !== '') numbers[lastIndex(numbers)] = +numbers[lastIndex(numbers)]
    else numbers.splice(numbers[lastIndex(numbers)] - 1, 1)

    return numbers
}

/**
 * Converts degrees to radians.
 * 
 * @param {number} degrees - The angle in degrees to be converted.
 * @returns {number} The angle converted to radians.
 */

export const deg2rad = (degrees) => degrees / 180 * Math.PI

/**
 * Converts radians to degrees.
 * 
 * @param {number} radians - The angle in radians to be converted.
 * @returns {number} The angle converted to degrees.
 */

export const rad2deg = (radians) => radians / Math.PI * 180