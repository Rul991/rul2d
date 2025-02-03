/**
 * Selects the first element that matches the specified CSS selector within the given root.
 * 
 * @param {string} id - The CSS selector to match.
 * @param {Document|Element} [root=document] - The root element to search within (default is the entire document).
 * @returns {Element|null} The first matching element, or null if no matches are found.
 */

export const $ = (id, root = document) => root.querySelector(id)

/**
 * Selects all elements that match the specified CSS selector within the given root.
 * 
 * @param {string} id - The CSS selector to match.
 * @param {Document|Element} [root=document] - The root element to search within (default is the entire document).
 * @returns {NodeList} A NodeList of all matching elements.
 */

export const all$ = (id, root = document) => root.querySelectorAll(id)

/**
 * Sets the default display property for an element based on its computed styles.
 * 
 * @param {Element} element - The element whose default display property is to be set.
 */

export const setDefaultDisplay = element => element.defaultDisplay = getComputedStyle(element).getPropertyValue('display')

/**
 * Displays the specified element by setting its display property to the default value.
 * 
 * @param {Element} element - The element to show.
 */

export const showElement = element => {
    if(element.defaultDisplay === undefined) setDefaultDisplay(element)
    element.style.display = element.defaultDisplay
}

/**
 * Hides the specified element by setting its display property to 'none'.
 * 
 * @param {Element} element - The element to hide.
 */

export const hideElement = element => {
    if(element.defaultDisplay === undefined) setDefaultDisplay(element)
    element.style.display = 'none'
}