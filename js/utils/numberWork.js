/**
 * Floor number
 * @param {number} number 
 * @param {number} numbersAfterDot 
 * @returns {number}
 */
export const floor = (number, numbersAfterDot = 0) => Math.floor(number * (10 ** numbersAfterDot)) / (10 ** numbersAfterDot)

/**
 * Return random generated number in the range from min to max
 * @param {number} min 
 * @param {number} max 
 * @param {number} numbersAfterDot 
 * @returns {number}
 */
export const randomRange = (min, max, numbersAfterDot = 0) =>  floor(Math.random() * (max - min) + min, numbersAfterDot)

/**
 * Returns boolean
 * @param {number} chance 
 * @param {number} maxChance 
 * @returns {boolean}
 */
export const randomChance = (chance, maxChance) => randomRange(0, maxChance) < chance

/**
 * Returns random element of array
 * 
 * if length of array equal 0, returns *null*
 * @param {Array} arr 
 * @returns {number|null}
 */
export const chooseFromArray = arr => {
    if(!arr.length) return null

    return arr[randomRange(0, arr.length)]
}

/**
 * Returns sign of number
 * @param {number} num 
 * @returns {number}
 */

export const getNumberSign = num => {
    if(num < 0) return -1
    else if(num > 0) return 1

    return 0
}

/**
 * Returns precents of value
 * @param {number} value 
 * @param {{min: number, max: number}} param1
 * @returns {number}
 */
export const percents = (value, {min = 0, max = 100} = {}) => (value - min) / (max - min)

/**
 * Return
 * @param {string} char 
 * @returns {boolean}
 */
export const isDigit = char => !isNaN(parseInt(char))

const lastIndex = arr => arr.length - 1


/**
 * Return numbers from string in array
 * @param {string} string 
 * @returns {number[]}
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
 * Converts degrees to radians
 * @param {number} degrees 
 * @returns {number} radians
 */
export const deg2rad = (degrees) => degrees / 180 * Math.PI

/**
 * Converts radians to degrees
 * @param {number} radians 
 * @returns {number} degrees
 */
export const rad2deg = (radians) => radians / Math.PI * 180